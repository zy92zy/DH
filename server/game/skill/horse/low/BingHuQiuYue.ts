import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 冰壶秋月
export default class BingHuQiuYue extends SkillBase{

	constructor() {
		super();
		this.skill_id = ESkillType.BingHuQiuYue;
		this.skill_name = "冰壶秋月";
        this.effectDesc = "[B]增加气血{0}%;[E]增加抗封印{1}%;[E]增加抗昏睡{2}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 0.8, index: 0 },
            [EAttrTypeL1.K_SEAL]: { add: 0.4, index: 1 },
            [EAttrTypeL1.K_SLEEP]: { add: 0.55, index: 2 }
        };
        this.action_type=EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
