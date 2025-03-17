import SKDataUtil from "../../gear/SKDataUtil";
import GameUtil from "./GameUtil";
import ItemUtil from "./ItemUtil";
import Player from "../object/Player";
import * as schedule from "node-schedule";
import SKLogger from "../../gear/SKLogger";
import PlayerMgr from "../object/PlayerMgr";
import ChargeSum from "./ChargeSum";
import ChargeEverDayMgr from "./ChargeEverDayMgr";

export enum MallType {
    FRESH,
    MALL,
    DAY,
}

export default class MallMgr {
    static shared = new MallMgr();
    // 新鲜玩意
    freshList: any;
    // 强化材料
    mallList: any;
    // 兑换商城
    exchangeList: any;
    // 每日限购
    dayList: any;
    mapNpcShop: any;
    constructor() {
        this.mapNpcShop = {};
    }

    init(fresh: boolean = false) {
        // 新鲜玩意
        this.freshList = GameUtil.require_ex('../../conf/prop_data/prop_fresh',fresh);
        // 强化材料 
        this.mallList = GameUtil.require_ex('../../conf/prop_data/prop_mall',fresh);
        // 每日限购
        this.dayList = GameUtil.require_ex('../../conf/prop_data/prop_day_limit',fresh);
        // 每日限购
        this.exchangeList = GameUtil.require_ex('../../conf/prop_data/prop_exchange',fresh);
        // NPC商店
        let npcdata = GameUtil.require_ex('../../conf/prop_data/prop_npc_shop',fresh);
        for (let _ in npcdata) {
            const npcmall = npcdata[_];
            if (this.mapNpcShop[npcmall.npcid] == null) {
                this.mapNpcShop[npcmall.npcid] = { goods: [] }
            }
            let mtype = npcmall.type == '' ? null : npcmall.type;
            this.mapNpcShop[npcmall.npcid].goods.push({
                itemid: npcmall.itemid,
                moneykind: npcmall.kind,
                price: npcmall.price,
                type: mtype,
            })
        }
        // 每天0时0分0秒 清理所有玩家每日限购数
        schedule.scheduleJob("0 0 0 * * *", () => {
            PlayerMgr.shared.clearAllDayCount();
            ChargeEverDayMgr.shared.player = [];
        })
    }

    checkNpcData(npcid: any) {
        if (this.mapNpcShop.hasOwnProperty(npcid) == false)
            return false;
        return true;
    }

    getNpcShopData(npcId: any) {
        return this.mapNpcShop[npcId];
    }

    getMallData(type: number, mallid: any): any {
        if (type == 0) {
            return this.freshList[mallid];
        } else if (type == 1) {
            return this.mallList[mallid];
        } else if (type == 2) {
            return this.dayList[mallid];
        } else if (type == 3) {
            return this.exchangeList[mallid];
        }
        return null;
    }

    /*buyItem(player:Player,type:number,mallId:any, num:any) {
        if (player.getBagItemAllKindNum() >= GameUtil.limitBagKindNum) {
            player.send('s2c_notice', {
                strRichText: '背包已满，无法购买'
            });
            return;
        }
        let malldata = this.getMallData(type,mallId);
        if (!malldata){
            return;
        }
        if (num <= 0){
            return;
        }
        if(malldata.limit>0 && malldata.count>=malldata.limit){
            return;
        }
        let pItemInfo = ItemUtil.getItemData(malldata.itemid);
        if (!pItemInfo) {
            return;
        }
        let cost = malldata.price * num;
        let strErr = player.CostFee(1, cost, `从多宝购买${num}个${pItemInfo.name}`);
        if (strErr != '') {
            player.send('s2c_notice', {
                strRichText: strErr
            });
            return;
        }
        malldata.count++;
        player.addItem(malldata.itemid, num, true, '多宝购物');
    }*/
    buyItem(player: Player, type: number, mallId: any, num: any) {
        if (player.getBagItemAllKindNum() >= GameUtil.limitBagKindNum) {
            player.send('s2c_notice', {
                strRichText: '背包已满，无法购买'
            });
            return;
        }
        let mallData = this.getMallData(type, mallId);
        if (!mallData) {
            player.send('s2c_notice', {
                strRichText: `商品[${mallId}]不存在！`
            });
            return;
        }
        let itemData = ItemUtil.getItemData(mallData.itemid);
        if (!itemData) {
            player.send('s2c_notice', {
                strRichText: `商品[${mallId}]定义不存在！`
            });
            return;
        }
        if (num < 1) {
            player.send('s2c_notice', {
                strRichText: `商品[${itemData.name}]购买数量必须大于0个！`
            });
            return;
        }
        let current = player.getDayCount(mallId);
        if (mallData.limit > 0) {
            num = Math.min(num, mallData.limit - current);
            if (num < 1) {
                player.send('s2c_notice', {
                    strRichText: `[${itemData.name}]已购买${mallData.limit}个达到今日可购上限!`
                })
                return;
            }
        }
        let info = '';
        if(type == 3){
            let cost = mallData.needNum * num;
            if(player.getBagItemNum(mallData.needItem) < cost){
                let itemData = ItemUtil.getItemData(mallData.needItem);
                player.send('s2c_notice', {
                    strRichText: `[${itemData.name}]数量不足，需要${cost}个!`
                })
                return;
            }
            player.addItem(mallData.needItem, -cost, true, '多宝兑换');
        }else{
            let cost = mallData.price * num;
            info = player.CostFee(1, cost, `从多宝购买${num}个${itemData.name}`);
        }
        if (info != '') {
            player.send('s2c_notice', {
                strRichText: info
            });
            return;
        }
        player.addDayCount(mallId, num);
        player.addItem(mallData.itemid, num, true, '多宝购物');
        this.sendList(player);
    }


    // 发送商店列表
    sendList(player: Player) {
        if (player == null) {
            return;
        }
        let freshList = this.freshList;
        let mallList = this.mallList;
        let dayList = this.dayList;
        let exchangeList = this.exchangeList;
        for (let key in dayList) {
            let item = dayList[key];
            item.count = player.getDayCount(item.id);
        }
        player.send('s2c_mallitems', {
            info: SKDataUtil.toJson([freshList, mallList, dayList, exchangeList])
        });
    }
}