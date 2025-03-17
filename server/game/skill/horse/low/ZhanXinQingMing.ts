import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 战心清明
export default class ZhanXinQingMing extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.ZhanXinQingMing;
        this.skill_name = "战心清明";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加抗混乱{1}%;[E]增加抗遗忘{2}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 0.88, index: 0 },
            [EAttrTypeL1.K_CONFUSION]: { add: 0.56, index: 1 },
            [EAttrTypeL1.K_FORGET]: { add: 0.88, index: 2 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
