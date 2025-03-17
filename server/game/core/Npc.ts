import BattleObj from "../object/BattleObj";
import NpcConfigMgr from "./NpcConfigMgr";
import GameUtil from "./GameUtil";
import MapMgr from "./MapMgr";
import PlayerMgr from "../object/PlayerMgr";
import SKLogger from "../../gear/SKLogger";

export enum NpcCreater {
    SYSTEM = 0, // 系统
    PLAYER = 1, // 玩家
    TEAM = 2 // 组队
}

export default class Npc extends BattleObj {
    roleid: number;
    accountid: number;
    configid: any;
    kind: any;
    talk: any;
    monster_group: any;
    mapButton: any;
    stCreater: { nID: number; nKind: any; };
    race: any;
    sex: any;
    weapon: number;
    state: number;
    aoi_model: string;
    aoi_obj_list: {};
    battle_id: number;

    constructor(nConfigID: any) {
        super();
        let config = NpcConfigMgr.shared.GetConfig(nConfigID);
        if (!config) {
            return;
        }
        this.roleid = 0;
        this.accountid = 2;
        this.configid = nConfigID;
        this.resid = config.resid;
        this.name = config.name;
        this.kind = config.kind;
        this.talk = config.talk;
        this.monster_group = config.monster_group;
        this.mapid = 0;
        this.mapButton = config.mapButton;
        this.stCreater = {
            nID: 0,
            nKind: GameUtil.ENpcCreater.ESystem
        };
        this.race = GameUtil.raceType.Unknow;
        this.sex = GameUtil.sexType.Unknow;
        this.weapon = 0;
        this.state = 0;
        this.living_type = GameUtil.livingType.NPC;
        this.aoi_model = "wm";
        this.aoi_obj_list = {};
        this.battle_id = 0;
    }

    destroy(callback?: any) {
        let map = MapMgr.shared.getMap(this);
        if (map) {
            map.exitMap(this);
        }
    }

    toObj() {
        let obj: any = super.toObj();
        obj.relive = this.relive;
        obj.level = this.level;
        obj.accountid = 0;
        obj.roleid = this.roleid;
        obj.resid = this.resid;
        obj.race = this.race;
        obj.sex = this.sex;
        obj.bangid = 0;
        obj.livingtype = this.living_type;
        obj.npcconfig = this.configid;
        obj.nFuBenID = 0;
        return obj;
    }

    getData() {
        let obj: any = {};
        obj.onlyid = this.onlyid;
        obj.hp = this.hp;
        obj.mp = this.mp;
        obj.maxhp = this.maxhp;
        obj.maxmp = this.maxmp;
        obj.atk = this.atk;
        obj.spd = this.spd;
        obj.qianneng = 0;
        obj.attr1 = '{}';
        obj.attr2 = '{}';
        obj.addattr1 = '{}';
        obj.addattr2 = '{}';
        obj.skill = '{}';
        return obj;
    }

    playerLogined() {
        PlayerMgr.shared.addPlayer(this);
    }

    aoi_enter(obj: any) {

    }

    aoi_update(obj: any) {

    }

    aoi_exit(obj: any) {

    }

    onEnterGame() {
        let map = MapMgr.shared.getMap(this);
        if (!map) {
            SKLogger.warn(`$警告:NPC[${this.name}]所在地图不存在!`);
            return;
        }
        map.enterMap(this, GameUtil.livingType.NPC);
    }
}