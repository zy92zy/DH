import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 万劫不复
export default class WanJieBuFu extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.WanJieBuFu;
        this.skill_name = "万劫不复";
        this.effectDesc = "[D]增加法力{0}%;[E]增加忽视风、雷、水、火、鬼火{1}%";
        this.effectMap = {
            [EAttrTypeL1.MP_PERC]: { add: 0.88, index: 0 },
            [EAttrTypeL1.HK_WIND]: { add: 1.27, index: 1 },
            [EAttrTypeL1.HK_THUNDER]: { add: 1.27, index: 2 },
            [EAttrTypeL1.HK_WATER]: { add: 1.27, index: 3 },
            [EAttrTypeL1.HK_FIRE]: { add: 1.27, index: 4 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 1.27, index: 5 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
