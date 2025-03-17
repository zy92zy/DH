import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级蹑影追风
export default class HighNieYingZhuiFeng extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighNieYingZhuiFeng;
        this.skill_name = "高级蹑影追风";
        this.effectDesc = "[S]增加速度{0}%;[D]增加法力{1}%;[E]增加忽视风、雷、水、火、鬼火{2}%";
        this.effectMap = {
            [EAttrTypeL1.SPD_PERC]: { add: 0.95, index: 0 },
            [EAttrTypeL1.MP_PERC]: { add: 1, index: 1 },
            [EAttrTypeL1.HK_WIND]: { add: 1.77, index: 2 },
            [EAttrTypeL1.HK_THUNDER]: { add: 1.77, index: 3 },
            [EAttrTypeL1.HK_WATER]: { add: 1.77, index: 4 },
            [EAttrTypeL1.HK_FIRE]: { add: 1.77, index: 5 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 1.77, index: 6 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
