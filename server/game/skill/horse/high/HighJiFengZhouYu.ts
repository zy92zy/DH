import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级疾风骤雨
export default class HighJiFengZhouYu extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighJiFengZhouYu;
        this.skill_name = "高级疾风骤雨";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加连击率{1}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 1.83, index: 0 },
            [EAttrTypeL1.PHY_REBOUND_PROB]: { add: 1.83, index: 0 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
