import GameUtil from "../core/GameUtil";
import PetPracticeMgr from "../object/PetPracticeMgr";
import PlayerMgr from "../object/PlayerMgr";
import World from "../object/World";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import Log from "../../utils/Log";
import Player from "../object/Player";
import Skin from "../role/Skin";
import GiftBox from "../gift/GiftBox";

export default class GoodsMgr {
    static shared = new GoodsMgr();

    petrate: any;
    petSkillItem: any;
    itemData: any;

    constructor() {
    }
    // 获得物品列表 type=-1 全部
    static getItemList(type: number = -1): any {
        let itemList = this.shared.itemData;
        if (!itemList) {
            this.shared.init();
            itemList = this.shared.itemData;
        }
        let result: any = [];
        for (let key in itemList) {
            let info = itemList[key];
            result.push({ id: info.id, name: info.name, type: info.type });
        }
        return result;
    }

    init() {
        let conf = GameUtil.game_conf;
        if (!conf) {
            console.error("必须先初始化配置");
            return;
        }
        let data = conf.item;
        this.petrate = {} // 宠物吃元气丹成长率 
        this.petSkillItem = [[], [], [], []]; // level 0 不被计算在内
        for (let itemid in data) {
            if (data.hasOwnProperty(itemid)) {
                let iteminfo = data[itemid];
                if (iteminfo.json != '' && iteminfo.json != null) {
                    iteminfo.json = SKDataUtil.jsonBy(iteminfo.json);
                    if (Math.floor(Number(itemid) / 100) == 105 && iteminfo.json.pet && iteminfo.json.rate) {
                        this.petrate[iteminfo.json.pet] = iteminfo.json.rate;
                    }
                }
                if (iteminfo.type == 10) {// 技能书
                    this.petSkillItem[iteminfo.level].push(itemid);
                }
            }
        }
        this.itemData = data;
    }
    // 使用物品
    useItem(data: any, player:Player) {
        if (player == null) {
            return false;
        }
        let itemData = this.getItemInfo(data.itemid);
        if (itemData == null) {
            return false;
        }
        Log.useItem(player.roleid, data.itemid);
        SKLogger.debug(`玩家[${player.name}(${player.roleid})]使用物品[${itemData.name}]`);
        if (GameUtil.isDataInVecter(data.itemid, [50001, 50002, 50003])) { //藏宝图类型
            let stData = itemData.json;
            if (stData.hasOwnProperty('money')) {
                player.addMoney(0, stData.money, '藏宝图');
            }
            if (stData.hasOwnProperty('item')) {
                player.addItem(stData.item, 1, true, '藏宝图');
            }
            if (stData.hasOwnProperty('monster')) {
                World.shared.worldMonsterMgr.ReliveWorldMonster(player.roleid, stData.monster);
                // DWorld.shared.worldMonsterMgr.ReliveWorldMonster(player.roleid, stData.monster);
            }
            let r = GameUtil.random(0, 10000);
            if (r < 5000) {
                // 藏宝图赠送一个神兽丹
                player.addItem(10114, 1, true, '藏宝图赠送');
            }
            return true;
        } else if (data.itemid == 50004) { //高级藏宝图
            return false;
        } else if (data.itemid == 80001) { //银两物品
            let iteminfo = this.itemData[data.itemid];
            player.addMoney(0, iteminfo.num, `使用物品[${iteminfo.name}]`);
            return true;
        } else if (GameUtil.isDataInVecter(data.itemid, [10301, 10302, 10303])) { //见闻录
            return false;
        } else if ([10101, 10102, 10103].indexOf(data.itemid) != -1) { // 技能书残卷
            let n = player.getBagItemNum(data.itemid);
            if (n < itemData.num) {
                return false;
            }
            let sitem = this.getRandomPetSkill(itemData.level);
            if (sitem) {
                // pPlayer.AddBagItem(data.itemid, -pItemInfo.num, false);
                data.count = itemData.num;
                player.addBagItem(sitem, 1, true);
                return true;
            }
            return false;
        } else if (data.itemid == 10202 || data.itemid == 10204) { //经验书
            return player.partnerMgr.addPartnerExp(data.operateid, this.itemData[data.itemid].num);
        } else if (data.itemid == 10203) { //超级星梦石
            player.resetPoint();
            return true;
        } else if (data.itemid == 10001 || data.itemid == 10004) { //引妖香
            return player.useIncense(this.itemData[data.itemid].num);
        } else if (data.itemid == 10110 || (data.itemid >= 10112 && data.itemid <= 10114)) {
            let pet = player.getPetByID(data.operateid);
            if (!pet) {
                return false;
            }
            return pet.addExp(this.itemData[data.itemid].num)
        } else if (data.itemid == 10116) {
            let pet = player.getPetByID(data.operateid);
            if (pet == null) {
                return false;
            }
            let maxxlevel = PetPracticeMgr.shared.GetMaxPriactiveLevel(pet.relive);
            let upexp = PetPracticeMgr.shared.GetUpdateHunPo(pet.xlevel);
            if (pet.xlevel >= maxxlevel && pet.xexp >= upexp) {
                return false;
            }
            pet.xexp += this.itemData[data.itemid].num;
            while (pet.xexp >= upexp) {
                pet.xexp -= upexp;
                pet.xlevel++;
                upexp = PetPracticeMgr.shared.GetUpdateHunPo(pet.xlevel);
            }
            if (pet.xlevel > maxxlevel) {
                pet.xlevel = maxxlevel;
                pet.xexp = PetPracticeMgr.shared.GetUpdateHunPo(pet.xlevel);
            }
            player.send('s2c_update_pet', {
                info: pet.toObj()
            });
            return true;
        } else if (data.itemid == 10117) { //龙之骨
            let pet = player.getPetByID(data.operateid);
            if (pet == null) {
                return false;
            }
            return pet.useLongGu();
        } else if (data.itemid == 90001) { //经验转魂魄
            let pet = player.getPetByID(data.operateid);
            if (pet == null) {
                return false;
            }
            let maxLevel = PetPracticeMgr.shared.GetMaxPriactiveLevel(pet.relive);
            let upexp = PetPracticeMgr.shared.GetUpdateHunPo(pet.xlevel);
            if (pet.xlevel >= maxLevel && pet.xexp >= upexp) {
                return false;
            }
            let count = this.itemData[data.itemid].num;
            pet.xexp += Math.floor(pet.exp / count);
            pet.exp = pet.exp % count;
            while (pet.xexp >= upexp) {
                pet.xexp -= upexp;
                pet.xlevel++;
                upexp = PetPracticeMgr.shared.GetUpdateHunPo(pet.xlevel);
            }
            if (pet.xlevel > maxLevel) {
                pet.exp += (pet.xlevel - maxLevel) * count; //返还剩余经验
                pet.xlevel = maxLevel;
                pet.xexp = PetPracticeMgr.shared.GetUpdateHunPo(pet.xlevel);
            }
            player.send('s2c_update_pet', {
                info: pet.toObj()
            });
            return true;
        } else if (Math.floor(data.itemid / 100) == 105 || data.itemid == 10610) { // 宠物元气丹 
            let pet = player.getPetByID(data.operateid);
            if(pet == null)
                return false;

            if (itemData.num != pet.dataid && data.itemid != 10610) {
                return false;
            }
            return pet.useYuanqi();
        } else if (data.itemid == 10111 || data.itemid == 10120 || data.itemid == 10206) { // 宠物亲密丹
            let pet = player.getPetByID(data.operateid);
            if (!pet) {
                return false;
            }
            if (typeof (itemData.num) == 'number' && itemData.num > 0) {
                return pet.addqinmi(itemData.num);
            }
            return false;
        }
        if (itemData.type == 10) { // 技能书
            if (Math.floor(itemData.id / 1000) == 60) { // 宠物技能书
                if (player.curPet == null) {
                    console.warn(`玩家[${player.roleid}:${player.name}]使用技能书[${itemData.name}]无参战宠物!`);
                    return false;
                }
                return player.curPet.learnSkill(itemData.num);
            }
        }else if(itemData.type == 21){
            return Skin.shared.useSkin(player, itemData);
        }else if(itemData.type == 13){//宝箱
            return GiftBox.shared.useBox(player, itemData);
        }

        return false;
    }

    getItemInfo(nConfigID: any) {
        if (this.itemData.hasOwnProperty(nConfigID) == false)
            return null;

        return this.itemData[nConfigID];
    }

    getItemInfoByName(itemname: any) {
        for (const itemid in this.itemData) {
            if (this.itemData.hasOwnProperty(itemid)) {
                const item = this.itemData[itemid];
                if (item.name == itemname) {
                    return item;
                }
            }
        }
        return null;
    }

    /*
     * 获取宠物吃元气丹成长的概率
     * @param petid 宠物id
     */
    getPetUseYuanqiRate(petid: any) {
        let rate = this.petrate[petid];
        if (rate == null) {
            //SKLogger.debug(`宠物元气丹[${petid}]成长概率未找到`);
            //找不到即默认超级元气丹 成长 + 0.1
            return 0.1;
        }
        return rate;
    }

    getMedicineEffect(itemid: any) {
        let retEffect = {
            addhp: 0,
            addmp: 0,
            mulhp: 0,
            mulmp: 0,
            huoyan: 0,
        };
        let medicine = this.getItemInfo(itemid);
        if (medicine == null) {
            return retEffect;
        }
        if (itemid == 40017) {
            retEffect.huoyan = 1;
            return retEffect;
        }

        let stData = medicine.json;
        if (stData == null || stData.hm == null) {
            return retEffect;
        }
        let hpc = stData.hm.indexOf('h');
        let mpc = stData.hm.indexOf('m');
        if (hpc != -1) {
            if (stData.jc == 'j') {
                retEffect.addhp = medicine.num;
            }
            if (stData.jc == 'c') {
                retEffect.mulhp = medicine.num;
            }
        }
        if (mpc != -1) {
            if (stData.jc == 'j') {
                retEffect.addmp = medicine.num;
            }
            if (stData.jc == 'c') {
                retEffect.mulmp = medicine.num;
            }
        }
        return retEffect;
    }

    getRandomPetSkill(skilllevel: any) {
        let list = this.petSkillItem[skilllevel];
        let r = Math.floor(Math.random() * list.length);
        return list[r];
    }
}