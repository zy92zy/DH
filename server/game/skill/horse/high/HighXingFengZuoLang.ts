import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级兴风作浪
export default class HighXingFengZuoLang extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighXingFengZuoLang;
        this.skill_name = "高级兴风作浪";
        this.effectDesc = "[D]增加法力{0}%;[E]增加忽视抗风{1}%;[E]增加忽视抗水{2}%;[E]增加忽视鬼火{3}%";
        this.effectMap = {
            [EAttrTypeL1.MP_PERC]: { add: 0.77, index: 0 },
            [EAttrTypeL1.HK_WIND]: { add: 2.48, index: 1 },
            [EAttrTypeL1.HK_WATER]: { add: 2.48, index: 2 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 1.91, index: 3 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
