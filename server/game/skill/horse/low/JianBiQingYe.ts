import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 坚壁清野
export default class JianBiQingYe extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.JianBiQingYe;
        this.skill_name = "坚壁清野";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加反震程度{1}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 0.88, index: 0 },
            [EAttrTypeL1.PHY_REBOUND]: { add: 2.05, index: 1 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
