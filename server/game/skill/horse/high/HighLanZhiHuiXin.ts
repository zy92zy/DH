import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级兰质蕙心
export default class HighLanZhiHuiXin extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighLanZhiHuiXin;
        this.skill_name = "高级兰质蕙心";
        this.effectDesc = "[D]增加法力{0}%;[E]增加抗混乱{1}%;[E]增加抗遗忘{2}%;[E]增加忽视风、雷、水、火、鬼火{3}%";
        this.effectMap = {
            [EAttrTypeL1.MP_PERC]: { add: 2.15, index: 0 },
            [EAttrTypeL1.K_CONFUSION]: { add: 0.98, index: 1 },
            [EAttrTypeL1.K_FORGET]: { add: 1.5, index: 2 },
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
