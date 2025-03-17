import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级心如止水
export default class HighXinRuZhiShui extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighXinRuZhiShui;
        this.skill_name = "高级心如止水";
        this.effectDesc = "[B]增加气血{0}%;[E]增加抗封印{1}%;[E]增加抗混乱{2}%;[E]增加抗遗忘{3}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 1.5, index: 0 },
            [EAttrTypeL1.K_SEAL]: { add: 1.11, index: 1 },
            [EAttrTypeL1.K_CONFUSION]: { add: 1.11, index: 2 },
            [EAttrTypeL1.K_FORGET]: { add: 1.11, index: 3 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
