import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级冲云破雾
export default class HighChongYunPoWu extends SkillBase{

	constructor() {
		super();
		this.skill_id = ESkillType.HighChongYunPoWu;
		this.skill_name = "高级冲云破雾";
        this.effectDesc = "[E]增加破防概率{0}%;[E]增加破防程度{1}%";
        this.effectMap = {
            [EAttrTypeL1.PHY_BREAK_PROB]: { add: 0.85, index: 0 },
            [EAttrTypeL1.PHY_BREAK]: { add: 4.78, index: 1 }
        };
        this.action_type=EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
