import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级天雷怒火
export default class HighTianLeiNuHuo extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighTianLeiNuHuo;
        this.skill_name = "高级天雷怒火";
        this.effectDesc = "[D]增加法力{0}%;[E]增加忽视抗雷{1}%;[E]增加忽视抗火{2}%;[E]增加忽视鬼火{3]%";
        this.effectMap = {
            [EAttrTypeL1.MP_PERC]: { add: 0.76, index: 0 },
            [EAttrTypeL1.HK_THUNDER]: { add: 2.47, index: 1 },
            [EAttrTypeL1.HK_FIRE]: { add: 2.47, index: 2 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 1.9, index: 3 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
