import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级神枢鬼藏
export default class HighShenShuGuiCang extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighShenShuGuiCang;
        this.skill_name = "高级神枢鬼藏";
        this.effectDesc = "[B]增加气血0.42%;[A]增加攻击力1.08%;[E]增加抗三尸1.41%;[E]增加抗鬼火0.75%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 0.74, index: 0 },
            [EAttrTypeL1.ATK_PERC]: { add: 1.83, index: 1 },
            [EAttrTypeL1.K_BLOODRETURN]: { add: 2.39, index: 2 },
            [EAttrTypeL1.K_WILDFIRE]: { add: 1.29, index: 3 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
