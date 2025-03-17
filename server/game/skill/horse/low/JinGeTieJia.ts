import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 金戈铁甲
export default class JinGeTieJia extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.JinGeTieJia;
        this.skill_name = "金戈铁甲";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加抗物理{1}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 0.88, index: 0 },
            [EAttrTypeL1.K_PHY_GET]: { add: 2.06, index: 1 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
