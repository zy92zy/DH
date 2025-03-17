// 彩票管理器

import GameUtil from "../../game/core/GameUtil";
import LotteryBox from "./LotteryBox";

export default class LotteryMgr {
    static shared=new LotteryMgr();
    vecItem:any[];
    mapLotteryBox:any;
    nMaxID:number;

    constructor() {
        this.vecItem = [];
        this.mapLotteryBox = {};
        this.nMaxID = 0;
    }

    init(fresh: boolean = false) {
        this.vecItem = [];
        let mapData = GameUtil.require_ex('../../conf/prop_data/prop_lottery',fresh);

        // for (var it in mapData) {
        //     let stInfo = mapData[it];
        //     this.vecItem.push(stInfo);
        // }

        
        let keys = Object.keys(mapData).sort(function(a,b){
            return mapData[a]["nRate"] - mapData[b]["nRate"]; 
        });

        for (const k of keys) {
            this.vecItem.push(mapData[k]);
        }

    }


    //创建随机奖励表
    CreateLotteryBox() {
        this.nMaxID += 1;
        if(this.nMaxID > 3000){
            this.nMaxID = 0;
        }
        //随机一个奖励表
        this.mapLotteryBox[this.nMaxID] = new LotteryBox(this.nMaxID, GameUtil.getTime(), this.RandSubItemList());

        return this.mapLotteryBox[this.nMaxID].ToJson();
    }
    //创建随机奖励表 十连
    CreateLotteryBoxTen(offset: number = 0, reward: any = []) {
        for(let i = 0; i < 10 + offset; i++){
            this.nMaxID += 1;
            if(this.nMaxID > 3000){
                this.nMaxID = 0;
            }
            //随机一个奖励表
            this.mapLotteryBox[this.nMaxID] = new LotteryBox(this.nMaxID, GameUtil.getTime(), this.RandSubItemList());
            reward.push(this.nMaxID);
        }
        return reward;
    }

    //随机奖励表
    RandSubItemList() {
        //拷贝出货表
        let vecTmp = this.vecItem.slice(0);
        //返回表
        let vecSub = [];

        for (let i = 0; i < 15; i++) {
            if (vecTmp.length <= 0)
                break;
            //从出货表随机取出一个索引
            let nIndex = GameUtil.random(0, vecTmp.length - 1);
            //随机物品添加到返回表
            vecSub.push(vecTmp[nIndex]);
            //出货表删除已添加的物品
            vecTmp.splice(nIndex, 1);
        }

        return vecSub;
    }


    RandSubItemList2(){
        let nRand = GameUtil.random(0, 10000);//取随机值
        let tempData = [];
        let ids = [];
        let rate: number=10000;

        for (const index in this.vecItem) {
            let item = this.vecItem[index];
            if(!rate && item.nRate >= nRand){
                rate = item.nRate;
                tempData.push(item);
                ids.push(item.id);
            }else if(item.nRate >= nRand){
                tempData.push(item);
                ids.push(item.id);
            }
            if(item.nRate>rate && tempData.length>= 15)
                break;
        }

        if(tempData.length < 15){
            for(let i=this.vecItem.length-1;i>0;i++){
                let e = this.vecItem[i];
                if(ids.indexOf(e.id)==-1){
                    tempData.push(e);  
                }
            }
        }else if(tempData.length > 15){
            for (let i = 1; i < tempData.length; i++) {
                const random = Math.floor(Math.random() * (i + 1));
                [tempData[i], tempData[random]] = [tempData[random], tempData[i]];
            }
            return tempData.slice(0,15)
        }
        //let index = GameUtil.random(0, tempData.length-1);
        //return tempData[index];
        return tempData;
    }



    CheckAndDeleteLotteryBox() {
        let nCurTime = GameUtil.getTime();

        for (var it in this.mapLotteryBox) {
            if (nCurTime - this.mapLotteryBox[it].nCreateTime > 600) {
                delete this.mapLotteryBox[it];
            }
        }
    }

    update(dt:number){
        if(dt % (1000 * 10) == 0){
            this.CheckAndDeleteLotteryBox();
        }
    }
    //获取指定批次守将信息
    GetBox(nID:any) {
        if (this.mapLotteryBox.hasOwnProperty(nID) == false)
            return null;

        return this.mapLotteryBox[nID];
    }

    DeleteBox(nID:any) {
        delete this.mapLotteryBox[nID];
    }
}