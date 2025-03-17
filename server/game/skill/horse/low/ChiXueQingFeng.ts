import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 赤血青锋
export default class ChiXueQingFeng extends SkillBase{

	constructor() {
		super();
		this.skill_id = ESkillType.ChiXueQingFeng;
		this.skill_name = "赤血青锋";
        this.effectDesc = "[B]增加气血{0}%;[E]增加狂暴率{1}%";
        this.effectMap = {
            [EAttrTypeL1.PHY_BREAK_PROB]: { add: 0.49, index: 0 },
            [EAttrTypeL1.PHY_BREAK]: { add: 2.84, index: 1 }
        };
        this.action_type=EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
