import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级暮霭沉沉
export default class HighMuAiChenChen extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighMuAiChenChen;
        this.skill_name = "高级暮霭沉沉";
        this.effectDesc = "[M]减少{0}%的速度(固定)，增加法力{1}%;[E]增加忽视风、雷、水、火、鬼火{2}%";
        this.effectMap = {
            [EAttrTypeL1.SPD_PERC]: { add: -20, grade: 0 },
            [EAttrTypeL1.MP_PERC]: { add: 4.19 },
            [EAttrTypeL1.HK_WIND]: { add: 0.99 },
            [EAttrTypeL1.HK_THUNDER]: { add: 0.99 },
            [EAttrTypeL1.HK_WATER]: { add: 0.99 },
            [EAttrTypeL1.HK_FIRE]: { add: 0.99 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 0.99 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
