

import SKDataUtil from "../../gear/SKDataUtil";
import PlayerMgr from '../object/PlayerMgr';
import SKLogger from "../../gear/SKLogger";
import ItemUtil from "../core/ItemUtil";
import GameUtil from "../core/GameUtil";
import Player from "../object/Player";
import NoticeMgr from "../core/NoticeMgr";

export default class GiftBox {
    static shared = new GiftBox();
    type_rate_max: any = {};
    type_rate_key: any = {};
    config: any = {};
    notice_config: any = {};


    init(){
        this.config = GameUtil.require_ex('../../conf/prop_data/prop_giftbox_item.json');
        this.notice_config = GameUtil.require_ex('../../conf/prop_data/prop_giftbox_notice.json');
        let type_rate_key = {};

        for (const key in this.config) {
            let item = this.config[key];

            this.type_rate_max[item.type] || (this.type_rate_max[item.type] = 0);
            type_rate_key[item.type] || (type_rate_key[item.type] = {});

            this.type_rate_max[item.type] += item.rate;
            type_rate_key[item.type][item.id] = item.rate;
        }

        for (const key in type_rate_key) {
            let data = type_rate_key[key];
            this.type_rate_key[key] = Object.keys(data).sort(function(a,b){ return data[a] - data[b] });

        }
    }



    useBox(player:Player, itemData:any){
        let type = itemData.json.type;
        if(!this.type_rate_max[type]){
            SKLogger.warn(`不存在的宝箱类型type=${itemData.json.type}`);
            return false;
        }
        let rate = SKDataUtil.random(1, this.type_rate_max[type])
        let conf: any = null;
        for (const id of this.type_rate_key[type]) {
            conf = this.config[id];
            rate -= conf.rate;
            if(rate<=0){
                break;
            }
        }
        if(!conf){
            SKLogger.warn(`玩家抽奖失败type=${itemData.json.type}`);
            return false;
        }
        player.addItem(conf.itemid, conf.itemnum, true, `宝箱抽奖${itemData.json.type}`);
        this.notice(player, conf);
        return true;
    }


    notice(player:Player, data: any){
        if(!data.noticeid){
            return
        }
        let conf = this.notice_config[data.noticeid];
        if(!conf){
            SKLogger.warn(`不存在的宝箱公告id=${data.noticeid}`);
            return;
        }
        let info = ItemUtil.getItemData(data.itemid);
        let msg: string = conf.notice;
        msg = msg.replace('[NAME]', player.name);
        msg = msg.replace('[ITEM]', info.name);
        msg = msg.replace('[NUM]', data.itemnum);

        if(conf.type == 1){
            PlayerMgr.shared.broadcast('s2c_screen_msg', {
                strRichText: msg,
                bInsertFront: 0
            });
        }else if(conf.type == 2){
            NoticeMgr.shared.sendNotice({
                type: 2,
                text: msg,
            });
        }

    }

    






}