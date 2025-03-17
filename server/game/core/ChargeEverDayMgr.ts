
import GameUtil from "./GameUtil";
import SKDataUtil from "../../gear/SKDataUtil";
import PlayerMgr from '../object/PlayerMgr';
import SKLogger from "../../gear/SKLogger";
//const schedule = require('node-schedule');


export default class ChargeEverDayMgr {
    static shared = new ChargeEverDayMgr();

    conf: any = [];     //充值奖项配置
    player: any = [];   //所有玩家充值配置信息

    constructor() {
        //定时每天凌晨重置充值数据
        /*schedule.scheduleJob('0 0 0 * * *',()=>{
            this.player = [];
        });*/
    }

    //初始化
    init(fresh: boolean = false){
        this.conf = GameUtil.require_ex('../../conf/prop_data/prop_everdata_charge',fresh);
    }

    getinfo(rid:number){
        let player = PlayerMgr.shared.getPlayerByRoleId(rid);
        if(!player)
            return;
        let nIds = player.dayMap[`nIds`] ? player.dayMap[`nIds`].split(',') : [];
        nIds = nIds.map((item: string) => {  
            return parseInt(item);
        });
        player.send("s2c_charge_everday_info",{
            money: player.dayMap[`daySum`] ? player.dayMap[`daySum`] : 0,
            nIds: nIds,
            reward: SKDataUtil.toJson(this.conf),
        });
    }
    //领取奖励
    receive(rid:number,nId:number){
        let reward = this.conf[nId];
        if(!reward)
            return;

        let player = PlayerMgr.shared.getPlayerByRoleId(rid);
        if(!player)
            return;
        
        let nIds = player.dayMap[`nIds`] ? player.dayMap[`nIds`].split(',') : [];
        if(nIds.indexOf(nId) != -1)
            return;

        if((player.dayMap[`daySum`] ? player.dayMap[`daySum`] : 0) < reward.money){
            player.send("s2c_notice",{
                strRichText: '您今日充值金额尚未达标，不能领取该奖励哦！'
            });
            return;
        }
        player.send("s2c_charge_everday_receive",{
            nId: nId
        });
        nIds.push(nId);
        player.dayMap[`nIds`] = nIds.join(',');

        for(let item of reward.item){
            player.addItem(item.gid,item.count,true,`每日充值达标奖励 money:${reward.money} nID:${nId}`);
        }
        player.saveAll((error)=>{
            //SKLogger.info(`[${player.name}]每日充值奖励领取 ${reward.money}`);
        });
    }
    //重置
    reset(rid:number){
        let player = PlayerMgr.shared.getPlayerByRoleId(rid);
        if(!player)
            return;
        
        let strErr = player.CostFee(1, 20000, '重置每日充值');
        if (strErr != '') {
            player.send('s2c_notice', {
                strRichText: strErr
            });
            return;
        }
        player.dayMap[`daySum`] = 0
        player.dayMap[`nIds`] = "";
        player.send("s2c_charge_everday_reset",{});
    }
    //充值
    playerCharge(rid:number,charge:number){
        /*let info = this.player[rid];
        if(!info){
            info = {money:0,nIds:[]};
        }
        info.money += charge;
        this.player[rid] = info;*/
    }

}