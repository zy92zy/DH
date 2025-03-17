import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级坚壁清野
export default class HighJianBiQingYe extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighJianBiQingYe;
        this.skill_name = "高级坚壁清野";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加反震程度{1}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 1.5, index: 0 },
            [EAttrTypeL1.PHY_REBOUND]: { add: 3.45, index: 1 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
