import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 傲雪凌霜
export default class TcZhuShen extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.AoXueLingShuang;
        this.skill_name = "傲雪凌霜";
        this.effectDesc = "[B]增加气血{0}%;[E]增加抗混乱{1}%;[E]抗遗忘{2}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 0.8, index: 0 },
            [EAttrTypeL1.K_CONFUSION]: { add: 0.4, index: 1 },
            [EAttrTypeL1.K_FORGET]: { add: 0.55, index: 2 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
