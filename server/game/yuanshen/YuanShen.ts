import GameUtil from "../core/GameUtil";
import DB from "../../utils/DB";
import Launch from "../core/Launch";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import Player from "../object/Player";

export default class YuanShen {
    static shared = new YuanShen();

    yuanshenData: any;
    maxLevel :number = 0;

    

    init() {
        this.yuanshenData = GameUtil.require_ex('../../conf/prop_data/prop_yuanshen');
        for (const key in this.yuanshenData) {
            let level = this.yuanshenData[key].level;
            if(level > this.maxLevel){
                this.maxLevel = level
            }
        }
    }

    getAttr(player: Player){
        let baseInfo: any = {};
        for (let i = 1; i<=player.yuanshenlevel && i <= this.maxLevel; i++) {
            let _attr = this.getLevelAttr(i);
            for (const key in _attr) {
                baseInfo[key] ? baseInfo[key] += Number(_attr[key]) : baseInfo[key] = Number(_attr[key])
            }
        }
        return baseInfo
    }

    getLevelAttr(level: any){
        let conf = this.yuanshenData[level];
        let baseInfo: any = {};
        if(!conf)
            return baseInfo;
        let baseAttr = conf.attr.split(';');
        for (const item of baseAttr) {
            let itemAttr = item.split(':');
            if (itemAttr.length == 2 && GameUtil.attrEquipTypeStr[itemAttr[0]] != null) {
                baseInfo[GameUtil.attrEquipTypeStr[itemAttr[0]]] = Number(itemAttr[1]);
            }
        }
        return baseInfo;
    }


    levelUp(player: Player){
        if(player.yuanshenlevel >= this.maxLevel){
            player.send('s2c_notice', {
                strRichText: '已经升到满级'
            });
            return
        }
        let conf = this.yuanshenData[player.yuanshenlevel+1];
        for (const item of conf.cost) {
            if(item.itemid == 90004){
                if(player.jade < item.num){
                    player.send('s2c_notice', {
                        strRichText: '仙玉不足'
                    });
                    return
                }
            }else{
                if(player.getBagItemNum(item.itemid) < item.num){
                    player.send('s2c_notice', {
                        strRichText: `升级所需物品不足`
                    });
                    return
                }
            }
        }
        for (const item of conf.cost) {
            player.addItem(item.itemid, -item.num, false, '升级元神消耗');
        }

        if(conf.needlv && player.level < conf.needlv){
            player.send('s2c_notice', {
                strRichText: `角色等级到达${conf.needlv}后才可升级`
            });
            return
        }
        if(conf.needrelive && player.relive < conf.needrelive){
            player.send('s2c_notice', {
                strRichText: `角色转生到达${conf.needlv}转后才可升级`
            });
            return
        }
        player.yuanshenlevel++;
        let nextConf = this.yuanshenData[player.yuanshenlevel+1];
        player.send('s2c_yuanshen_info', {
            attr: SKDataUtil.toJson(this.getAttr(player)),
            need: nextConf && nextConf.cost,
            level: player.yuanshenlevel,
            name: conf.name,
            needlevel: nextConf && nextConf.needlevel,
            needrelive: nextConf && nextConf.needrelive,
            attrup : SKDataUtil.toJson(this.getLevelAttr(player.yuanshenlevel+1)),
            maxlevel: this.maxLevel,
        });
        player.calculateAttr();
    }


    getInfo(player: Player){
        let conf = this.yuanshenData[player.yuanshenlevel];
        let nextConf = this.yuanshenData[player.yuanshenlevel+1];
        player.send('s2c_yuanshen_info', {
            attr: SKDataUtil.toJson(this.getAttr(player)),
            need: nextConf && nextConf.cost,
            level: player.yuanshenlevel,
            name: conf.name,
            needlevel: nextConf && nextConf.needlevel,
            needrelive: nextConf && nextConf.needrelive,
            attrup : SKDataUtil.toJson(this.getLevelAttr(player.yuanshenlevel+1)),
            maxlevel: this.maxLevel,
        });
    }

    getNewData(){

        //this.send('s2c_player_data', this.getData());
    }

}