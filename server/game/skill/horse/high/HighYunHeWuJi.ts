import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级云合雾集
export default class HighYunHeWuJi extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighYunHeWuJi;
        this.skill_name = "高级云合雾集";
        this.effectDesc = "[B]增加气血{0}%;[D]增加法力{1}%;[A]增加攻击力{2}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 1.76, index: 0 },
            [EAttrTypeL1.MP_PERC]: { add: 0.85, index: 1 },
            [EAttrTypeL1.ATK_PERC]: { add: 0.85, index: 2 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
