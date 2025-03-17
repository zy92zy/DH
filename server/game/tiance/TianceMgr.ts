
import SKDataUtil from "../../gear/SKDataUtil";
import DB from "../../utils/DB";
import Battle from "../battle/Battle";
import BattleRole from "../battle/BattleRole";
import GameUtil from "../core/GameUtil";
import ItemUtil from "../core/ItemUtil";
import BattleObj from "../object/BattleObj";
import Player from "../object/Player";
import PlayerMgr from "../object/PlayerMgr";
import Buff from "../skill/core/Buff";
import SkillUtil from "../skill/core/SkillUtil";
import Tiance from "./Tiance";


export default  class TianceMgr {
    static shared = new TianceMgr();

    levelRate :any = {};
    item_config :any = {};
    config :any = {};
    maxRate = {
        1: {1: [0,0,0,0,0,0,0,0], 2:[0,0,0,0,0,0,0,0]},
        2: {1: [0,0,0,0,0,0,0,0], 2:[0,0,0,0,0,0,0,0]},
        3: {1: [0,0,0,0,0,0,0,0], 2:[0,0,0,0,0,0,0,0]},
        4: {1: [0,0,0,0,0,0,0,0], 2:[0,0,0,0,0,0,0,0]},
        5: {1: [0,0,0,0,0,0,0,0], 2:[0,0,0,0,0,0,0,0]},
    };
    rateKey: any;


    init(){
        let temp_config = GameUtil.require_ex('../../conf/prop_data/prop_tiance_item.json');
        this.config = GameUtil.require_ex('../../conf/prop_data/prop_tiance_base.json');

        for (const key in temp_config) {
            let item = temp_config[key];
            item.level_attr = {};
            for (let i = 1; i <= 10; i++) {
                let levelAttr = {};
                let attrStr = item[`level${i}`];
                if(attrStr){
                    for (const attr of attrStr.split(',')) {
                        let a = attr.split(':');
                        let attrid = GameUtil.attrEquipTypeStr[a[0]];
                        levelAttr[attrid] = Number(a[1]);
                    }
                }
                item.level_attr[i] = levelAttr;
            }
            for (let race = 1; race <= 5; race++) {
                for (let sex = 1; sex <= 2; sex++) {
                    if(item.race && race != item.race){
                        continue
                    }
                    if(item.sex && sex != item.sex){
                        continue
                    }
                    this.maxRate[race][sex][item.typeid] += item.rate || 0;
                }
            }
            this.item_config[key] = item;
        }
        let self = this;
        this.rateKey = Object.keys(this.item_config).sort(function(a,b){ return self.item_config[a]["rate"] - self.item_config[b]["rate"] });

        for (const key in this.config.base) {
            let _typeconf = this.config.base[key];
            this.levelRate[_typeconf.id] = {};
            for (const key in this.config[_typeconf.type]) {
                let level_conf = _typeconf['levelRate'].split(',');
                for (const item of level_conf) {
                    let a = item.split(':');
                    this.levelRate[_typeconf.id][a[0]] = Number(a[1]);
                }
            }
        }

    }


    getConfig(typeid:any){
        return this.item_config[typeid]
    }


    initPlayer(player:Player, list:any){
        if(list)
            for (const data of list) {
                player.tianceList[data.id] = new Tiance(data);
            }
    }

    share(player:Player){


    }


    drawTiance(player:Player, data:any){
        let typeconf = this.config.base[data.type];
        if(!typeconf){
            player.send('s2c_notice', {
                strRichText: `类型无效`
            });
            return;
        }

        if(player.getBagItemNum(typeconf.itemid) < typeconf.itemnum){
            let name = ItemUtil.getItemName(typeconf.itemid);
            player.send('s2c_notice', {
                strRichText: `缺少物品[${name}]`
            });
            return;
        }

        let rate = SKDataUtil.random(1, this.maxRate[player.race][player.sex][data.type]);
        let conf = null;
        for (const key of this.rateKey) {
            let _conf = this.item_config[key];
            if(_conf.typeid == data.type){
                if(_conf.race && player.race != _conf.race){
                    continue
                }
                if(_conf.sex && player.sex != _conf.sex){
                    continue
                }
                rate -= _conf.rate;
                if(rate <= 0){
                    conf = _conf;
                    break;
                }
            }
        }
        if(!conf){
            player.send('s2c_notice', {
                strRichText: `抽取天策符失败`
            });
            return;
        }
        let attr_level: number = 1;
        player.addItem(typeconf.itemid, -typeconf.itemnum, true, '抽取天策符');
        rate = SKDataUtil.random(1, 100);
        for (const key in this.levelRate[data.type]) {
            if(rate < this.levelRate[data.type][key]){
                attr_level = Number(key);
            }
        }
        let senddata:any = {
            typeid: conf.id,
            attrLevel: attr_level,
        };

        for (const key in player.tianceList) {
            let tiance = player.tianceList[key];
            if(tiance.typeid == conf.id){
                senddata.msg = `已有同类同等级符卡`;
                if(tiance.attr_level < attr_level){
                    senddata.msg = `已有同类符卡，自动替换高等级(${tiance.attr_level}→${attr_level})`;
                    tiance.attr_level = attr_level;
                    tiance.save();
                }
                if(conf.fenjie){
                    let name = ItemUtil.getItemName(conf.fenjie.itemid);
                    senddata.msg += `\n自动分解多余符卡获得${conf.fenjie.num}个[${name}]`;
                    player.addItem(conf.fenjie.itemid, conf.fenjie.num, true, '天策自动分解');
                }
                player.send('s2c_tiance_new', senddata);
                this.sendInfo(player);
                return;
            }
        }
        player.send('s2c_tiance_new', senddata);
        DB.addTiance({
            roleid: player.roleid,
            typeid: conf.id,
            attr_level: attr_level,
            state: 1,
        }, (data:any)=>{
            player.tianceList[data.id] = new Tiance(data);
            this.sendInfo(player);
        });
    }

    use(player:Player, id: number){
        if(player.tiance.indexOf(id) > -1){
            this.unuse(player, id);
            this.sendInfo(player);
            return;
        }
        let tiance = player.tianceList[id];
        if(!tiance){
            player.send('s2c_notice', {
                strRichText: `不存在的天策符`
            });
            return;
        }
        let type_conf = this.config['type' + tiance.config.typeid];
        if(!type_conf){
            player.send('s2c_notice', {
                strRichText: `缺少配置1`
            });
            return;
        }
        let conf = type_conf[tiance.config.level];
        if(!conf){
            player.send('s2c_notice', {
                strRichText: `缺少配置2`
            });
            return;
        }
        if(conf.needLevel && player.level < conf.needLevel){
            player.send('s2c_notice', {
                strRichText: `需要到达${conf.needLevel}级`
            });
            return;
        }
        if(conf.needRelive && player.relive < conf.needRelive){
            player.send('s2c_notice', {
                strRichText: `需要到达${conf.needRelive}转`
            });
            return;
        }
        if(tiance.config.needLevel && player.level < tiance.config.needLevel){
            player.send('s2c_notice', {
                strRichText: `需要到达${tiance.config.needLevel}级`
            });
            return;
        }
        if(tiance.config.needRelive && player.relive < tiance.config.needRelive){
            player.send('s2c_notice', {
                strRichText: `需要到达${tiance.config.needRelive}转`
            });
            return;
        }
        let has_num = 0;
        for (const _id of player.tiance) {
            let _tiance = player.tianceList[_id];            
            if( tiance.config.typeid == _tiance.config.typeid && tiance.config.level == _tiance.config.level){
                has_num++;
            }
        }
        if(has_num > 1 || (has_num == 1 && !conf.is2)){
            player.send('s2c_notice', {
                strRichText: `超出最大佩戴上限`
            });
            return;
        }

        player.tiance.push(id);
        this.sendInfo(player);
        player.calculateAttr();
        player.getPlayerData();
    }

    unuse(player:Player, id:number){
        if(!id){
            return
        }
        let index = player.tiance.indexOf(id);
        if(index == -1){
            return;
        }
        player.tiance.splice(index, 1);
    }

    getInfo(player:Player){
        let data = [];
        for (const key in player.tianceList) {
            data.push(player.tianceList[key].toObj())
        }
        return {
            info: SKDataUtil.toJson(data), 
            roleid: player.roleid,
            use: player.tiance
        }
    }


    sendInfo(player:Player){
        player.send('s2c_tiance_list', this.getInfo(player));
    }

    getAttr(player:Player){
        let baseAttr = {};
        for (const id of player.tiance) {
            let tiance = player.tianceList[id];
            tiance && tiance.getAttr(baseAttr);
        }
        return baseAttr;
    }

    /**
     * {
     *      技能id: 等级
     * }
     */
    getSkillListByOnlyid(onlyid: number, skill_list: any={}){
        let player:Player = PlayerMgr.shared.getPlayerByOnlyId(onlyid)
        if(!player){
            return;
        }

        return skill_list;
    }
    getSkillList(obj: BattleObj, skill_list: any={}){
        
    }

    initPlayerBuff(){}

    initBattleBuff(battle:Battle){
        for (const onlyid in battle.plist) {
            let battleRole:BattleRole = battle.plist[onlyid];
            if(battleRole && battleRole.isPlayer()){
                let player:Player = PlayerMgr.shared.getPlayerByOnlyId(battleRole.onlyid);
                if(!player) continue;
                for (const id of player.tiance) {
                    let tiance = player.tianceList[id];
                    if(tiance.skill){
                        if(tiance.skillType==2){
                            let pet:BattleRole = battle.plist[battleRole.bindid];
                            pet&&pet.addBuff(new Buff(tiance.skill, null, {pet:true, onlyid: battleRole.onlyid}));
                        }else{
                            battleRole.addBuff(new Buff(tiance.skill, null, {pet:false, onlyid: battleRole.onlyid}));
                        }
                    }
                }
            }
        }
    }

}

