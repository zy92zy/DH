import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级金戈铁甲
export default class HighJinGeTieJia extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighJinGeTieJia;
        this.skill_name = "高级金戈铁甲";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加抗物理{1}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 1.5, index: 0 },
            [EAttrTypeL1.K_PHY_GET]: { add: 3.5, index: 1 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
