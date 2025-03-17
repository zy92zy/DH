import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 兰质蕙心
export default class LanZhiHuiXin extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.LanZhiHuiXin;
        this.skill_name = "兰质蕙心";
        this.effectDesc = "[D]增加法力{0}%;[E]增加抗混乱{1}%;[E]增加抗遗忘{2}%;[E]增加忽视风、雷、水、火、鬼火{3}%";
        this.effectMap = {
            [EAttrTypeL1.MP_PERC]: { add: 1.15, index: 0 },
            [EAttrTypeL1.K_CONFUSION]: { add: 0.52, index: 1 },
            [EAttrTypeL1.K_FORGET]: { add: 0.8, index: 2 },
            [EAttrTypeL1.HK_WIND]: { add: 0.59, index: 3 },
            [EAttrTypeL1.HK_THUNDER]: { add: 0.59, index: 4 },
            [EAttrTypeL1.HK_WATER]: { add: 0.59, index: 5 },
            [EAttrTypeL1.HK_FIRE]: { add: 0.59, index: 6 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 0.59, index: 7 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
