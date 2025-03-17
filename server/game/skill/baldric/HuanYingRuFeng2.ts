import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 幻影如风-珍藏
export default class HuanYingRuFeng2 extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HuanYingRuFeng2;
        this.skill_name = "幻影如风-珍藏";
        this.effectDesc = "增加自身{0}%的闪躲百分比";
        this.effectMap = {
            [EAttrTypeL1.PHY_DODGE]: { add: 40, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
