import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级折冲御晦
export default class HighSheChongYuHui extends SkillBase{

	constructor() {
		super();
		this.skill_id = ESkillType.HighSheChongYuHui;
		this.skill_name = "高级折冲御晦";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加抗风、抗雷、抗水、抗火{1}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 1.5, index: 0 },
            [EAttrTypeL1.K_WIND]: { add: 1.3, index: 1 },
            [EAttrTypeL1.K_THUNDER]: { add: 1.3, index: 2 },
            [EAttrTypeL1.K_WATER]: { add: 1.3, index: 3 },
            [EAttrTypeL1.K_FIRE]: { add: 1.3, index: 4 }
        };
        this.action_type=EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
