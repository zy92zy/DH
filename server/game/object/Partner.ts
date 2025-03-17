import GameUtil from "../core/GameUtil";
import BattleObj from "./BattleObj";
import PartnerConfigMgr from "./PartnerConfigMgr";
import ExpUtil from "../core/ExpUtil";
import { EAttrTypeL1 } from "../role/EEnum";

export default class Partner extends BattleObj {
    id: number;
    dingwei: any;
    race: any;
    mapZiZhi: any;
    owner: any;
    own_onlyid: number;
    nState: any;

    constructor(nID: any, nRelive: any, nLevel: any, nExp: any) {
        super();
        this.id = nID;
        this.relive = nRelive;
        this.level = GameUtil.changeNumToRange(nLevel, this.GetLevelRange(nRelive, true), this.GetLevelRange(nRelive, false));

        let stPartnerInfo = PartnerConfigMgr.shared.GetPartnerInfo(this.id);
        let stPower = PartnerConfigMgr.shared.GetPower(this.id, this.relive, this.level);
        if (stPower) {
            this.InitAttr(stPower);
        }

        this.dingwei = stPartnerInfo.dingwei;
        this.race = stPartnerInfo.race;


        this.name = stPartnerInfo.name;
        this.resid = stPartnerInfo.resid;

        this.exp = nExp;
        this.maxexp = ExpUtil.getPartnerUpgradeExp(this.relive, this.level);  //zzzErr     

        this.skill_list = stPartnerInfo.skills;
        this.mapZiZhi = GameUtil.getDefault(stPartnerInfo.zizhi, {});

        this.living_type = GameUtil.livingType.Partner;

        this.owner = null;
        this.own_onlyid = 0;
        //------------------------------------
    }

    InitAttr(stPower: any) {
        this.attr1 = stPower.attr;
        this.maxhp = this.getAttr1(EAttrTypeL1.HP_MAX);
        this.hp = this.maxhp;
        this.setAttr1(EAttrTypeL1.HP, this.hp);
        this.maxmp = this.getAttr1(EAttrTypeL1.MP_MAX);
        this.mp = this.maxmp;
        this.setAttr1(EAttrTypeL1.MP, this.mp);
        this.atk = this.getAttr1(EAttrTypeL1.ATK);
        this.spd = this.getAttr1(EAttrTypeL1.SPD);
    }

    setOwner(player: any) {
        this.owner = player;
    }

    GetLevelRange(relive:number, bMin: any): number {
        if (relive == 4) {
            return bMin ? 140 : 240;
        }
        if (relive == 3) {
            return bMin ? 120 : 180;
        }
        if (relive == 2) {
            return bMin ? 100 : 140;
        }
        if (relive == 1) {
            return bMin ? 80 : 120;
        }
        return bMin ? 0 : 100;
    }

    levelUp(issend: any) {
        let nextlevel = this.level + 1;
        if (this.relive == 0)
            nextlevel = Math.min(nextlevel, 100);
        if (this.relive == 1)
            nextlevel = Math.min(nextlevel, 120);
        if (this.relive == 2)
            nextlevel = Math.min(nextlevel, 140);
        if (this.relive == 3)
            nextlevel = Math.min(nextlevel, 180);
        if (this.relive == 4) {
            nextlevel = Math.min(nextlevel, 240);
        }
        this.setLevel(nextlevel, issend);
    }

    setLevel(level: any, issend: any) {
        this.level = level;
        if (this.owner) {
            //定义一个某转的最大等级值
            var maxLevel = 240;
            //根据玩家是几转设置最大等级
            if (this.owner.relive == 0) {
                maxLevel = 100;
            } else if (this.owner.relive == 1) {
                maxLevel = 120;
            } else if (this.owner.relive == 2) {
                maxLevel = 140;
            } else if (this.owner.relive == 3) {
                maxLevel = 180;
            } else if (this.owner.relive == 4) {
                maxLevel = 240;
            }
            this.level = Math.min(level, maxLevel);
        }
        this.maxexp = ExpUtil.getPartnerUpgradeExp(this.relive, this.level);
        let stPower = PartnerConfigMgr.shared.GetPower(this.id, this.relive, this.level);
        this.InitAttr(stPower);
        if (issend && this.owner) {
            let strJson = GameUtil.getPartnerJson(this);
            this.owner.send('s2c_partner_info', {
                strJson: strJson
            });
        }
    }

    GetNextLevel() {
        let nNext = this.level + 1;
        if (this.relive == 0)
            nNext = Math.min(nNext, 100);
        if (this.relive == 1)
            nNext = Math.min(nNext, 120);
        if (this.relive == 2)
            nNext = Math.min(nNext, 140);
        if (this.relive == 3)
            nNext = Math.min(nNext, 180);
        if (this.relive == 4)
            nNext = Math.min(nNext, 240);
        return nNext;
    }

    checkOwnerLevel() {
        if (this.owner == null) {
            return false;
        }
        //   玩家转               伙伴转
        if (this.owner.relive > this.relive) {
            return true;
        }
        if (this.owner.relive == this.relive && this.owner.level <= this.level) {
            return false;
        }
        return true;
    }
    //伙伴添加经验
    addExp(exp: number): number {
        if (this.GetNextLevel() != this.level) {
            let fexp = this.exp + exp;
            while (fexp >= this.maxexp) {
                if (this.checkOwnerLevel() == false) {
                    this.setLevel(this.level, true);
                    break;
                }
                fexp -= this.maxexp;
                this.levelUp(fexp < this.maxexp);
            }
            this.exp = fexp;
        }
        else {
            if (this.exp >= this.maxexp)
                return 1;

            this.exp = Math.min(this.exp + exp, this.maxexp);
        }
        if (this.owner) {
            let strJson = GameUtil.getPartnerJson(this);
            this.owner.send('s2c_partner_info', {
                strJson: strJson
            });
        }
        return 0;
    }
    //伙伴转生
    doRelive() {
        let success = false;
        if (this.relive >= 4)
            return '不能再转生了';

        if (this.checkOwnerLevel() == false) {
            return '伙伴等级无法超过人物等级';
        }
        if (this.relive == 0 && this.level == 100) {
            this.relive = 1;
            this.level = 80;
            success = true;
        }
        if (this.relive == 1 && this.level == 120) {
            this.relive = 2;
            this.level = 100;
            success = true;
        }
        if (this.relive == 2 && this.level == 140) {
            this.relive = 3;
            this.level = 120;
            success = true;
        }
        if (this.relive == 3 && this.level == 200) {
            this.relive = 4;
            this.level = 140;
            success = true;
        }
        if (success == false) {
            return '等级不够';
        }
        this.maxexp = ExpUtil.getPartnerUpgradeExp(this.relive, this.level);
        this.addExp(0);
        let stPower = PartnerConfigMgr.shared.GetPower(this.id, this.relive, this.level);
        this.InitAttr(stPower);
        return '';
    }

    toObj(): any {
        let obj: any = {};
        obj.relive = this.relive;
        obj.level = this.level;
        obj.resid = this.resid;
        obj.race = this.race;
        obj.livingtype = this.living_type;
        obj.id = this.id;
        obj.exp = this.exp;
        obj.nState = this.nState;
        obj.name = this.name;
        obj.dingwei = this.dingwei;
        obj.mapZiZhi = this.mapZiZhi;
        obj.skill_list = this.skill_list;
        return obj;
    }
}