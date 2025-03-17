import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级傲雪凌霜
export default class HighAoXueLingShuang extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighAoXueLingShuang;
        this.skill_name = "高级傲雪凌霜";
        this.effectDesc = "[B]增加气血{0}%;[E]增加抗混乱{1}%;[E]抗遗忘{2}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 1.4, index: 0 },
            [EAttrTypeL1.K_CONFUSION]: { add: 0.6, index: 1 },
            [EAttrTypeL1.K_FORGET]: { add: 0.9, index: 2 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
