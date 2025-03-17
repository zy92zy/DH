import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 兴风作浪
export default class XingFengZuoLang extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.XingFengZuoLang;
        this.skill_name = "兴风作浪";
        this.effectDesc = "[D]增加法力{0}%;[E]增加忽视抗风{1}%;[E]增加忽视抗水{2}%;[E]增加忽视鬼火{3}%";
        this.effectMap = {
            [EAttrTypeL1.MP_PERC]: { add: 0.44, index: 0 },
            [EAttrTypeL1.HK_WIND]: { add: 1.46, index: 1 },
            [EAttrTypeL1.HK_WATER]: { add: 1.46, index: 2 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 1.12, index: 3 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
