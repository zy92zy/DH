import GameUtil from "../../game/core/GameUtil";
import SKDataUtil from "../../gear/SKDataUtil";
import LotteryMgr from "./LotteryMgr";

export default class LotteryBox {
    nBoxID:any;     //批次
    nCreateTime:any;//时间
    vecItem:any;    //奖励表
    select:number = 0;  //抽中项


    constructor(nBoxID:any, nCreateTime:any, vecItem:any) {
        this.nBoxID = nBoxID
        this.nCreateTime = nCreateTime;
        this.vecItem = vecItem.slice(0);
    }

    //格式化当前出货表
    ToJson() {
        let mapValue:any = {};

        for (let i = 0; i < 15; i++) {
            mapValue[i] = { strItem: this.vecItem[i].strItem, nNum: this.vecItem[i].nNum, nRate: this.vecItem[i].nRate, };
        }

        let stData = { nBoxID: this.nBoxID, mapValue: mapValue };
        let strJson = SKDataUtil.toJson(stData);

        return strJson;
    }


    //获取总概率
    GetSumRate() {
        let nSum = 0;
        for (let it in this.vecItem) {
            nSum += Number(this.vecItem[it].nRate);
        }
        return nSum;

    }




    //获取抽中的奖项索引
    RandSelect(nLotterBox:any):number{

        let nRand = GameUtil.random(0, this.GetSumRate());//取随机值

        for (let i = 0; i < this.vecItem.length; i++) {
            nRand -= this.vecItem[i].nRate;
            if (nRand <= 0){
                this.select = i;
                return this.select;
            }
                
        }
        return 0;
    }
    //获取总时间
    GetSumTime(nLen:any) {
        let nSum = 0;

        if (nLen >= 8)
            nSum += (nLen - 8) * 100;

        for (let i = 7; i > 0; i--) {
            nSum += (8 - i) * 100;
        }

        return nSum;
    }
}
