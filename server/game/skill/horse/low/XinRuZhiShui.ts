import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 心如止水
export default class XinRuZhiShui extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.XinRuZhiShui;
        this.skill_name = "心如止水";
        this.effectDesc = "[B]增加气血{0}%;[E]增加抗封印{1}%;[E]增加抗混乱{2}%;[E]增加抗遗忘{3}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 0.88, index: 0 },
            [EAttrTypeL1.K_SEAL]: { add: 0.64, index: 1 },
            [EAttrTypeL1.K_CONFUSION]: { add: 0.64, index: 2 },
            [EAttrTypeL1.K_FORGET]: { add: 0.64, index: 3 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
