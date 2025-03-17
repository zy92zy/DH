import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级破釜沉舟
export default class HighPoFuChenZhou extends SkillBase{

	constructor() {
		super();
		this.skill_id = ESkillType.HighPoFuChenZhou;
		this.skill_name = "高级破釜沉舟";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加狂暴率{1}%;[E]增加破防程度{2}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 1.24, index: 0 },
            [EAttrTypeL1.PHY_DEADLY]: { add: 1.1, index: 1 },
            [EAttrTypeL1.PHY_BREAK]: { add: 2.1, index: 2 },
        };
        this.action_type=EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
