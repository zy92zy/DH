import SKLogger from "../../gear/SKLogger";
import GameUtil from "./GameUtil";
import SKDataUtil from "../../gear/SKDataUtil";

export default class NpcConfigMgr{

    static shared=new NpcConfigMgr();
    mapConfig:any;

    constructor() {
        this.mapConfig = {};
    }

    init() {
        let mapData = GameUtil.require_ex('../../conf/prop_data/prop_npc');
        for (let key in mapData) {
            let data = mapData[key];
            let npcObj:any = {};
            npcObj.resid = data.resid;
            npcObj.name = data.name;
            npcObj.id = data.id;
            npcObj.kind = data.kind;
            npcObj.talk = GameUtil.getAttribute(data, 'talk', '');
            npcObj.auto_create = this.GetCreateNpc(GameUtil.getDefault(data.auto_create, ''));
            npcObj.monster_group = GameUtil.getAttribute(data, 'monster_group', 0);
            let strMap = data.mapButton == "" ? '{}' : data.mapButton;
            npcObj.mapButton = SKDataUtil.jsonBy(strMap);
            this.mapConfig[key] = npcObj;
        }
    }

    GetConfig(key:any):any{
        if (this.mapConfig.hasOwnProperty(key) == false){
            SKLogger.warn(`找不到NPC配置[${key}]`);
            return null;
        }
        return this.mapConfig[key];
    }

    GetCreateNpc(strData:any):any{
        let vecTmp = strData.split(";");
        if (vecTmp.length != 4)
            return null;
        return { map: parseInt(vecTmp[0]), x: parseInt(vecTmp[1]), y: parseInt(vecTmp[2]), dir: parseInt(vecTmp[3]) };
    }

}