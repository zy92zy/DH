import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 身似菩提
export default class ShenSiPuTi extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.ShenSiPuTi;
        this.skill_name = "身似菩提";
        this.effectDesc = "[B]增加气血{0}%;[E]增加抗封印{1}%;[E]增加抗混乱{2}%;[E]增加抗昏睡{3}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 0.55, index: 0 },
            [EAttrTypeL1.K_SEAL]: { add: 0.4, index: 1 },
            [EAttrTypeL1.K_CONFUSION]: { add: 0.4, index: 2 },
            [EAttrTypeL1.K_SLEEP]: { add: 0.4, index: 3 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
