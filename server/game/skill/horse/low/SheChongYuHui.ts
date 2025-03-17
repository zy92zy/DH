import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 折冲御晦
export default class SheChongYuHui extends SkillBase{

	constructor() {
		super();
		this.skill_id = ESkillType.SheChongYuHui;
		this.skill_name = "折冲御晦";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加抗风、抗雷、抗水、抗火{1}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 0.88, index: 0 },
            [EAttrTypeL1.K_WIND]: { add: 0.75, index: 1 },
            [EAttrTypeL1.K_THUNDER]: { add: 0.75, index: 2 },
            [EAttrTypeL1.K_WATER]: { add: 0.75, index: 3 },
            [EAttrTypeL1.K_FIRE]: { add: 0.75, index: 4 }
        };
        this.action_type=EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
