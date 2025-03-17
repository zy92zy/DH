import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级花晨月夕
export default class HighHuaChenYueXi extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighHuaChenYueXi;
        this.skill_name = "高级花晨月夕";
        this.effectDesc = "[D]增加法力{0}%;[B]增加气血{1}%;[A]增加攻击力{2}%;[E]增加忽视风、雷、水、火、鬼火{3}%";
        this.effectMap = {
            [EAttrTypeL1.MP_PERC]: { add: 2.15, index: 0 },
            [EAttrTypeL1.HP_PERC]: { add: 0.85, index: 1 },
            [EAttrTypeL1.ATK_PERC]: { add: 0.85, index: 2 },
            [EAttrTypeL1.HK_WIND]: { add: 1.11, index: 3 },
            [EAttrTypeL1.HK_THUNDER]: { add: 1.11, index: 4 },
            [EAttrTypeL1.HK_WATER]: { add: 1.11, index: 5 },
            [EAttrTypeL1.HK_FIRE]: { add: 1.11, index: 6 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 1.11, index: 7 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
