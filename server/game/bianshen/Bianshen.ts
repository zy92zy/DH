
import SKLogger from "../../gear/SKLogger";
import SKDataUtil from "../../gear/SKDataUtil";
import DB from "../../utils/DB";
import GameUtil from "../core/GameUtil";
import ItemUtil from "../core/ItemUtil";
import Player from "../object/Player";

export default  class Bianshen {
    static shared = new Bianshen();
    config: any;
    level_config: any;


    init(){
        this.config = GameUtil.require_ex('../../conf/prop_data/prop_bianshen_item.json');
        this.level_config = GameUtil.require_ex('../../conf/prop_data/prop_bianshen_level.json');
    }

    /**
     * player.bianshen = {
     *      a : 拥有数量
     *      b : {
     *          1 : {lv: 等级, exp: 经验}
     * }
     *      c : 当前使用
     * }
     */

    use(player:Player, id:any){
        let num = player.bianshen.a[id];
        if(!num || num < 1){
            player.send('s2c_notice', {
                strRichText: `缺少变身卡`
            });
            return;
        }
        let conf = this.config[id];
        if(!conf){
            player.send('s2c_notice', {
                strRichText: `未找到配置`
            });
            return;
        }
        player.bianshen.a[id] --;
        if(player.bianshen.c && player.bianshen.c[0] == id && player.bianshen.c[1] > GameUtil.gameTime){
            player.bianshen.c[1] += conf.time * 1000;
        }else{
            player.bianshen.c = [conf.id, conf.time * 1000 + GameUtil.gameTime]
        }

        player.calculateAttr();
        player.getPlayerData();
        player.send('s2c_notice', {
            strRichText: `使用变身卡成功`
        });
        player.send('s2c_bianshen_use', {
            id: id,
            time: player.bianshen.c[1],
        });
        this.getInfo(player);
    }


    getInfo(player:Player){
        player.send('s2c_bianshen_info', {info: SKDataUtil.toJson(player.bianshen)});
    }

    removeBuffByType(player:Player, typeid: Number, id: Number = null){
        let temp = [];
        for (const item of player.bianshen.b) {
            let conf = this.config[item[0]];
            if(conf && id != conf.id && (!conf.type && conf.type != typeid)){
                temp.push(SKDataUtil.clone(item));
            }
        }
        player.bianshen.b = temp;
    }

    getAttr(player: Player){
        let baseAttr = {};
        if(!player.bianshen.c || player.bianshen.c[1] < GameUtil.gameTime){
            return baseAttr
        }
        let conf = this.config[player.bianshen.c[0]];
        if(!conf){
            SKLogger.warn('[变身卡]配置异常' + SKDataUtil.toJson(player.bianshen))
            return baseAttr;
        }
        for (let attr of conf.attrList.split(',')){
            attr = attr.split(':');
            let id = GameUtil.attrEquipTypeStr[attr[0]];
            baseAttr[id] ? baseAttr[id] += Number(attr[1]) : baseAttr[id] = Number(attr[1]);
        }
        for (let attr of conf.wuxingAttr.split(',')){
            attr = attr.split(':');
            let id = GameUtil.attrEquipTypeStr[attr[0]];
            baseAttr[id] ? baseAttr[id] += Number(attr[1]) : baseAttr[id] = Number(attr[1]);
        }
        if(conf.wuxing){
            let pconf = player.bianshen.b[conf.wuxing];
            let lv = pconf ? pconf.lv : 1;
            let wx_conf = this.level_config[conf.wuxing][lv];
            if(wx_conf.attr){
                for (let attr of wx_conf.attr.split(',')){
                    attr = attr.split(':');
                    let id = GameUtil.attrEquipTypeStr[attr[0]];
                    baseAttr[id] ? baseAttr[id] += Number(attr[1]) : baseAttr[id] = Number(attr[1]);
                }
            }
        }
        return baseAttr;
    }
    addExp(player: Player, data: any){
        let type_conf = this.level_config[data.type];

        player.bianshen.b || (player.bianshen.b = {});
        player.bianshen.b[data.type] || (player.bianshen.b[data.type] = {lv: 1, exp:0});
        let pdata = player.bianshen.b[data.type];
        let conf = type_conf[pdata.lv];
        let next_conf = type_conf[Number(pdata.lv) + 1];

        let num =  player.getBagItemNum(conf.itemid);
        if(num < 1){
            let item_data = ItemUtil.getItemData(conf.itemid);
            player.send('s2c_notice', {
                strRichText: `缺少物品[${item_data.name}]1个`
            });
            return
        }
        pdata.exp += conf.itemexp;
        if(pdata.exp >= conf.exp){
            if(next_conf){
                pdata.exp -= conf.exp;
                pdata.lv++;

            }else{
                pdata.exp = conf.exp
            }
        }
        player.addItem(conf.itemid, -1, true, '变身卡五行升级');
        player.send('s2c_bianshen_exp', {info: SKDataUtil.toJson(player.bianshen.b)});
        player.save(true, '变身卡五行升级');
    }
    addItem(player: Player,id:number, count: number){
        player.bianshen.a[id] ? player.bianshen.a[id] += count : player.bianshen.a[id]=count;
        let conf = this.config[id];
        player.send('s2c_notice', {
            strRichText: `您获得了${count}个[${conf.name}]`
        });
    }






}