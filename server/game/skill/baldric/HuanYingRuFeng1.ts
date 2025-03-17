import { EActionType, EAttrTypeL1, ESkillQuality, ESkillType } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 幻影如风-把玩
export default class HuanYingRuFeng1 extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HuanYingRuFeng1;
        this.skill_name = "幻影如风-把玩";
        this.effectDesc = "增加自身{0}%的闪躲百分比";
        this.effectMap = {
            [EAttrTypeL1.PHY_DODGE]: { add: 30, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
