import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 金身不坏
export default class JinShenBuHuai extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.JinShenBuHuai;
        this.skill_name = "金身不坏";
        this.effectDesc = "[B]增加气血{0}%;[E]增加抗震慑{1}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 1, index: 0 },
            [EAttrTypeL1.K_DETER]: { add: 1, index: 1 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
