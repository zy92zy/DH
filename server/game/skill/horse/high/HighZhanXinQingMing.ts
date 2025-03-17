import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级战心清明
export default class HighZhanXinQingMing extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighZhanXinQingMing;
        this.skill_name = "高级战心清明";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加抗混乱{1}%;[E]增加抗遗忘{2}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 1.5, index: 0 },
            [EAttrTypeL1.K_CONFUSION]: { add: 0.98, index: 1 },
            [EAttrTypeL1.K_FORGET]: { add: 1.5, index: 2 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
