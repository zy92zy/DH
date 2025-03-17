import GameUtil from "../core/GameUtil";
import PlayerMgr from "./PlayerMgr";
import DB from "../../utils/DB";
import Launch from "../core/Launch";
import Player from "./Player";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import Equip from "./Equip";
import { forEachTrailingCommentRange } from "typescript";
import { EEquipPos, EEquipType } from "../role/EEnum";

export default class EquipMgr {
    static shared = new EquipMgr();
    maxEquipID: number;
    shenbingData: any;
    xianqiData: any;
    equipDBTimer: any;
    xinshouData: any;
    highData: any;
    highAttrData: any;
    lianhuaData: any;
    equipObjs: any;
    shopObjs: any;
    lianhuaArr: any;

    constructor() {
        this.maxEquipID = 0;
        this.shenbingData = null;
        this.xianqiData = null;
        this.equipDBTimer = null;
    }

    init() {
        this.shenbingData = GameUtil.require_ex('../../conf/prop_data/prop_shenbing');
        this.xianqiData = GameUtil.require_ex('../../conf/prop_data/prop_xianqi');
        let conf = GameUtil.game_conf.baldric;
        for (let key in conf) {
            this.xianqiData[key] = conf[key];
        }
        this.xinshouData = GameUtil.require_ex('../../conf/prop_data/prop_xinshou_equip');
        this.highData = GameUtil.require_ex('../../conf/prop_data/prop_high_equip');
        this.highAttrData = GameUtil.require_ex('../../conf/prop_data/prop_high_equip_attr');
        this.lianhuaData = GameUtil.require_ex('../../conf/prop_data/prop_lianhua');
        this.equipObjs = {};
        this.shopObjs = {};
        this.lianhuaArr = {};
        for (let index = 0; index < 10; index++) {
            this.lianhuaArr[index + 1] = [];
        }
        for (let key in this.lianhuaData) {
            if (this.lianhuaData.hasOwnProperty(key)) {
                let info = this.lianhuaData[key];
                for (let index = 0; index < 10; index++) {
                    if (info[`pos${index + 1}`].length > 0) {
                        info.key = key;
                        this.lianhuaArr[index + 1].push(info);
                    }
                }
            }
        }
        Launch.shared.complete("EquipMgr");
        /*this.equipDBTimer = setInterval(() => {
            DB.getEquipMaxId();
        }, 60 * 1000);*/
    }

    setMaxEquipID(equipid: any) {
        this.maxEquipID = equipid;
        if (this.equipDBTimer != null) {
            clearInterval(this.equipDBTimer);
            this.equipDBTimer = null;
            SKLogger.debug('装备模块加载完毕！');
            Launch.shared.complete("EquipMgr");
        }
    }

    addEquip(equip: any) {
        this.equipObjs[equip.EquipID] = equip;
    }

    delEquip(equipid: any) {
        delete this.equipObjs[equipid];
    }

    getEquipByID(equipid: any) {
        return this.equipObjs[equipid];
    }

    getXianQiBy(equipId: number) {
        return this.xianqiData[equipId];
    }

    sellEquip(equipid: any) {
        let equip = this.equipObjs[equipid];
        if (equip) {
            equip.state = 2;
            this.shopObjs[equip.EquipID] = equip;
            return true;
        }
        return false;
    }

    buyEquip(equipid: any) {
        let equip = this.shopObjs[equipid];
        if (equip) {
            equip.state = 1;
            delete this.shopObjs[equipid];
            return true;
        }
        return false;
    }

    getSellList(): any {
        let list = [];
        for (const key in this.shopObjs) {
            if (this.shopObjs.hasOwnProperty(key)) {
                const equip = this.shopObjs[key];
                list.push({
                    Shape: equip.Shape,
                    EquipID: equip.EquipID,
                    EIndex: equip.EIndex,
                    EName: equip.EName,
                    OwnerRoleId: equip.OwnerRoleId
                });
            }
        }
        return SKDataUtil.toJson(list);
    }

    save() {
        for (let key in this.equipObjs) {
            if (this.equipObjs.hasOwnProperty(key)) {
                let equip = this.equipObjs[key];
                equip.save();
            }
        }
    }
    // 获得佩饰基础属性-4条
    getBaldricBaseAttr(pos: number, level: number): any[] {
        // 基础属性:戒指・右同戒指・左
        if (pos == 12) {
            pos = 10;
        }
        let attr = this.lianhuaArr[pos];
        let result: any[] = [];
        if (attr == null) {
            return result;
        }
        let factor = 0;
        if (level == 1) factor = 0.3;
        if (level == 2) factor = 0.5;
        for (let index = 0; index < 4; index++) {
            let info = attr[Math.floor(Math.random() * attr.length)];
            let valuearr = info[`pos${pos}`].split(',');
            let deltaValue = Number(valuearr[1]) - Number(valuearr[0]);
            let randValue = Math.random() * deltaValue * 0.5 + deltaValue * factor;
            let type = GameUtil.attrEquipTypeStr[info.key];
            let fvalue = Number(valuearr[0]) + randValue;
            let value = parseInt(String(fvalue));
            let item: any = {};
            item[type] = value;
            result.push(item);
        }
        return result;
    }

    getLianhuaData(pos: any, level: any) {
        let arr = this.lianhuaArr[pos];
        let cnt = Math.floor(Math.random() * 5) + 1;
        let lianhuaAttr = [];
        let lianhuaNum:any = {};
        let factor = 0;
        if (level == 1) factor = 0.3;
        if (level == 2) factor = 0.5;
        for (let index = 0; index < cnt; index++) {
            if (!arr) {
                SKLogger.warn(`$警告:${pos},${level}`);
                continue;
            }
            let info = arr[Math.floor(Math.random() * arr.length)];
            let valuearr = info[`pos${pos}`].split(',');
            let deltaValue = Number(valuearr[1]) - Number(valuearr[0]);
            let randValue = Math.random() * deltaValue * 0.5 + deltaValue * factor;
            let fvalue = Number(valuearr[0]) + randValue;
            let attrtype = GameUtil.attrEquipTypeStr[info.key];
            let oneinfo: any = {};
            oneinfo[attrtype] = parseInt(String(fvalue));
            lianhuaNum[attrtype] = lianhuaNum[attrtype] ? lianhuaNum[attrtype]+1 : 1;

            if(lianhuaNum[attrtype] <= 2){
                lianhuaAttr.push(oneinfo);
            }
        }
        return lianhuaAttr;
    }

    getBaldricRecast(equip: Equip): any {
        let data = this.xianqiData[equip.Type];
        if (data == null) {
            return null;
        }
        let result = this.getEquipArr(data, equip.EquipType);
        return result;
    }

    /**info
      * type  装备类型，0:新手装备，1:高级装备，2:神兵，3:仙器
      * resid 对应表里的Type，默认0
      * grade 等级，默认0
      * ower  装备角色
      * pos   装备位置
      */
    getRecastData(info: any) {
        let p = info.role;
        let dataAttr = null;
        if (info.type == 1) {
            dataAttr = this.highData;
        }
        else if (info.type == 3 || info.type == 5) {
            dataAttr = this.xianqiData;
        }
        else {
            return null;
        }
        let datalist = [];
        for (let key in dataAttr) {
            if (dataAttr.hasOwnProperty(key)) {
                let data = dataAttr[key];
                if (data.OwnerRoleId && data.OwnerRoleId > 0 && data.OwnerRoleId != p.resid) {
                    continue;
                }
                if ((data.Race == p.race || data.Race == 9) && (data.Sex == p.sex || data.Sex == 9) && (data.Index == info.pos || info.pos == 0) && data.Type != info.resid) {
                    if (info.grade != 0 && info.grade != data.Grade) {
                        continue;
                    }
                    datalist.push(data);
                }
            }
        }
        if (datalist.length == 0) {
            return null;
        }
        let recastdata = datalist[Math.floor(Math.random() * datalist.length)];
        let result = this.getEquipArr(recastdata, info.type);
        return result;
    }

    /**info
     * type  装备类型，0:新手装备，1:高级装备，2:神兵，3:仙器, 4:翅膀 6：星卡
     * resid 对应表里的Type，默认0
     * index 装备位置，默认0
     * grade 等级，默认0
     */
    getEquipRes(info: any, resData: any, player: Player): any {
        if (info.resid && info.resid != 0) {
            let result = resData[info.resid];
            if (result) {
                return result;
            }
        }
        let datalist = [];
        for (let key in resData) {
            if (resData.hasOwnProperty(key)) {
                let data = resData[key];
                if (player) {
                    if (data.OwnerRoleId && data.OwnerRoleId > 0 && data.OwnerRoleId != player.resid) {
                        continue;
                    }
                    if ((data.Race == player.race || data.Race == 9) && (data.Sex == player.sex || data.Sex == 9) && (data.Index == info.index || info.index == 0)) {
                        if (info.grade != 0 && info.grade != data.Grade) {
                            continue;
                        }
                        datalist.push(data);
                    }
                }
            }
        }
        if (datalist.length > 0) {
            return datalist[Math.floor(Math.random() * datalist.length)];
        }
        else {
            return null;
        }
    }

    /**
     * 获取仙器列表
     * @param info 
     * @returns 
     */
    getXianQiList(player: Player): any {
        if (player == null) {
            return null;
        }
        let info = {
            type: 3,
            grade: 1,
            roleid: player.roleid,
            index: 0,
        };
        let list = [];
        for (let index = 0; index < 5; index++) {
            info.index = index + 1;
            list.push(this.getEquipData(info));
        }
        return list;
    }

    /**
     * 生成装备属性
     * @param equipInfo 
     * @returns 
     */
    makeEquipAttr(equipInfo: any) {
        //DB.getEquipMaxId();
        this.maxEquipID++;
        if (equipInfo.resid == null) {
            equipInfo.resid = 0;
        }
        if (equipInfo.grade == null) {
            equipInfo.grade = 1;
        }
        let equipAttr: any = this.getEquipData(equipInfo);
        if (!equipAttr) {
            SKLogger.warn(`装备属性生成失败:${equipInfo.resid}`);
            return null;
        }
        //equipAttr.EquipID = this.maxEquipID;
        return equipAttr;
    }

    getEquipData(info: any): any {
        let player = null;
        if (info.roleid != null) {
            player = PlayerMgr.shared.getPlayerByRoleId(info.roleid, false);
            if (player == null) {
                SKLogger.warn(`装备数据:玩家${info.roleid}不存在`);
                return null;
            }
        }
        let equipInfo = null;
        // 装备类型，0:新手装备，1:高级装备，2:神兵，3:仙器 4:翅膀  5：配饰 6：星卡
        if (info.type == EEquipType.XinShou) { //新手装备
            equipInfo = this.getEquipRes(info, this.xinshouData, player);
        } else if (info.type == EEquipType.HIGH) {//高级装备
            equipInfo = this.getEquipRes(info, this.highData, player);
        } else if (info.type == EEquipType.ShenBing) {//神兵
            equipInfo = this.getEquipRes(info, this.shenbingData, player);
        } else if (info.type == EEquipType.XianQi) {//仙器
            equipInfo = this.getEquipRes(info, this.xianqiData, player);
        } else if (info.type == EEquipType.WING) { // 翅膀
            equipInfo = this.getEquipRes(info, this.xianqiData, player);
        } else if (info.type == EEquipType.BALDRIC) { // 佩饰
            equipInfo = this.getEquipRes(info, this.xianqiData, player);
        } else if (info.type == EEquipType.STARCARD) { // 星卡
            equipInfo = this.getEquipRes(info, this.xianqiData, player);
        } else { 
            SKLogger.warn(`$警告:获得装备数据类型错误:${info.type}`);
        }
        if (!equipInfo) {
            return null;
        }
        let result = this.getEquipArr(equipInfo, info.type);
        return result;
    }

    getHighRndRange(rangestr: any) {
        if (rangestr == null) {
            return 1;
        }
        if (rangestr.endsWith(';')) {
            rangestr = rangestr.substr(0, rangestr.length - 1);
        }
        let rangelist = rangestr.split(';');
        let rndvalue = Math.random() * 100;//用来计算阶梯概率
        if (rangelist.length == 0) {
            return 1;
        }
        let rangevaluelist = [];//每条记录里存三个数，最小，最大，阶梯概率
        for (const valuestr of rangelist) {
            if (valuestr.split(',').length != 3) {
                return 1;
            }
            rangevaluelist.push(valuestr.split(','));
        }
        let minrndvalue = 1;//当前概率的最小值
        let maxrndvalue = 100;//当前概率的最大值
        let startvalue = 0;//阶梯概率初始位置
        for (let index = 0; index < rangevaluelist.length; index++) {
            let v = Number(rangevaluelist[index][2]);
            if (rndvalue >= startvalue && rndvalue <= startvalue + v) {
                minrndvalue = Number(rangevaluelist[index][0]);
                maxrndvalue = Number(rangevaluelist[index][1]);
                break;
            }
            startvalue += v;
        }
        return minrndvalue + Math.floor(Math.random() * (maxrndvalue - minrndvalue));
    }

    getHighBaseArr(lib: any, factor: any) { //获得高级装备的基础属性
        let baseAttr: any = {};
        let libarr = lib.split(',');
        for (const lib of libarr) {
            if (this.highAttrData[lib] == null) {
                continue;
            }
            let basestr = this.highAttrData[lib].BaseAttr;
            if (!baseAttr) {
                continue;
            }
            if (basestr.endsWith(';')) {
                basestr = basestr.substr(0, basestr.length - 1);
            }
            let baselist = basestr.split(';');
            if (baselist.length == 0) {
                continue;
            }
            let curbase = baselist[Math.floor(Math.random() * baselist.length)];
            let curbasearr = curbase.split(',');
            if (curbasearr.length != 3) {
                continue;
            }
            let curkey = curbasearr[0];
            let curminvalue = Number(curbasearr[1]);
            let curmaxvalue = Number(curbasearr[2]);
            let rndrange = this.getHighRndRange(this.highAttrData[lib].RndRange);
            let curvalue = curminvalue + Math.floor(rndrange * (curmaxvalue - curminvalue) / 100);
            baseAttr[GameUtil.attrEquipTypeStr[curkey]] = Math.floor(curvalue * factor);
        }
        return baseAttr;
    }
    // 获得装备属性
    getEquipArr(equipInfo: any, type: number): any {
        let result: any = {};
        result['BaseAttr'] = '{}';
        result['Shuxingxuqiu'] = '{}';
        result['BaseScore'] = 0;
        result['EDesc'] = '';
        result['Detail'] = '';
        result['Dynamic'] = 0;
        result['Grade'] = 0;
        result['EIndex'] = 0;
        result['JiLv'] = 0;
        result['MaxEmbedGemCnt'] = 0;
        result['MaxEndure'] = 0;
        result['EName'] = '';
        result['NeedGrade'] = 0;
        result['NeedRei'] = 0;
        result['NextType'] = 0;
        result['Overlap'] = 0;
        result['Quan'] = '';
        result['Race'] = 0;
        result['Rarity'] = 0;
        result['RndRange'] = '';
        result['RndWeight'] = 0;
        result['Sex'] = 0;
        result['Shape'] = '';
        result['Type'] = 0;
        result['OwnerRoleId'] = 0;
        result['EquipType'] = type;
        if (type == EEquipType.HIGH) {
            if (equipInfo.AttrLib && equipInfo.AttrFactor) {
                result['BaseAttr'] = SKDataUtil.toJson(this.getHighBaseArr(equipInfo.AttrLib, equipInfo.AttrFactor));
            }
        } else if (type == EEquipType.BALDRIC) {
            result['BaseAttr'] = SKDataUtil.toJson(this.getBaldricBaseAttr(equipInfo.Index, equipInfo.Grade - 1));
        } else {
            if (equipInfo.BaseAttr) {
                let baseInfo: any = {};
                let baseAttr = equipInfo.BaseAttr.split(';');
                for (const item of baseAttr) {
                    let itemAttr = item.split(':');
                    if (itemAttr.length == 2 && GameUtil.attrEquipTypeStr[itemAttr[0]] != null) {
                        baseInfo[GameUtil.attrEquipTypeStr[itemAttr[0]]] = itemAttr[1];
                    }
                }
                result['BaseAttr'] = SKDataUtil.toJson(baseInfo);
            }
        }
        if (equipInfo.Shuxingxuqiu) {
            let xuqiuinfo: any = {};
            let xuqiuarr = equipInfo.Shuxingxuqiu.split(':');
            if (xuqiuarr.length == 2 && GameUtil.attrEquipTypeStr[xuqiuarr[0]] != null) {
                xuqiuinfo[GameUtil.attrEquipTypeStr[xuqiuarr[0]]] = xuqiuarr[1];
            }
            result['Shuxingxuqiu'] = SKDataUtil.toJson(xuqiuinfo);
        }
        if (equipInfo.NeedAttr) {
            let xuqiuinfo: any = {};
            let xuqiuarr = equipInfo.NeedAttr.split(':');
            if (xuqiuarr.length == 2 && GameUtil.attrEquipTypeStr[xuqiuarr[0]] != null) {
                xuqiuinfo[GameUtil.attrEquipTypeStr[xuqiuarr[0]]] = xuqiuarr[1];
            }
            result['Shuxingxuqiu'] = SKDataUtil.toJson(xuqiuinfo);
        }
        equipInfo.BaseScore && (result['BaseScore'] = equipInfo.BaseScore);
        equipInfo.Desc && (result['EDesc'] = equipInfo.Desc);
        equipInfo.Detail && (result['Detail'] = equipInfo.Detail);
        equipInfo.Dynamic && (result['Dynamic'] = equipInfo.Dynamic);
        equipInfo.Grade && (result['Grade'] = equipInfo.Grade);
        equipInfo.Index && (result['EIndex'] = equipInfo.Index);
        equipInfo.JiLv && (result['JiLv'] = equipInfo.JiLv);
        equipInfo.MaxEmbedGemCnt && (result['MaxEmbedGemCnt'] = equipInfo.MaxEmbedGemCnt);
        equipInfo.MaxEndure && (result['MaxEndure'] = equipInfo.MaxEndure);
        equipInfo.Name && (result['EName'] = equipInfo.Name);
        equipInfo.NeedGrade && (result['NeedGrade'] = equipInfo.NeedGrade);
        equipInfo.NeedRei && (result['NeedRei'] = equipInfo.NeedRei);
        equipInfo.NextType && (result['NextType'] = equipInfo.NextType);
        equipInfo.Overlap && (result['Overlap'] = equipInfo.Overlap);
        equipInfo.Quan && (result['Quan'] = equipInfo.Quan);
        equipInfo.Race && (result['Race'] = equipInfo.Race);
        equipInfo.Rarity && (result['Rarity'] = equipInfo.Rarity);
        equipInfo.RndRange && (result['RndRange'] = equipInfo.RndRange);
        equipInfo.RndWeight && (result['RndWeight'] = equipInfo.RndWeight);
        equipInfo.Sex && (result['Sex'] = equipInfo.Sex);
        equipInfo.Shape && (result['Shape'] = equipInfo.Shape);
        equipInfo.Type && (result['Type'] = equipInfo.Type);
        equipInfo.OwnerRoleId && (result['OwnerRoleId'] = equipInfo.OwnerRoleId);
        return result;
    }

    getInsertData(equipArr: any, roleid: any): any {
        if (!equipArr) {
            return null;
        }
        let fieldstr = 'EquipType, BaseAttr, Grade, EIndex, Shuxingxuqiu, Type, GemCnt, LianhuaAttr, RoleID, create_time, pos';
        let valuestr = `${equipArr.EquipType}, '${equipArr.BaseAttr}', ${equipArr.Grade}, ${equipArr.EIndex}, '${equipArr.Shuxingxuqiu}', ${equipArr.Type}, 0, '{}', ${roleid}, NOW(), ${EEquipPos.BAG}`;
        // let fieldstr = '';
        // let valuestr = '';
        // for (const field in equipArr) {
        //     if (equipArr.hasOwnProperty(field)) {
        //         fieldstr += field + ',';
        //         valuestr += `'${equipArr[field]}',`;
        //     }
        // }
        // fieldstr = fieldstr.substr(0, fieldstr.length - 1);
        // valuestr = valuestr.substr(0, valuestr.length - 1);
        let data: any = {};
        data.fieldstr = fieldstr;
        data.valuestr = valuestr;
        return data;
    }
}