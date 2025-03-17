import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 烟江叠嶂
export default class YanJiangDieZhang extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.YanJiangDieZhang;
        this.skill_name = "烟江叠嶂";
        this.effectDesc = "[B]增加气血{0}%;[E]增加抗三尸{1}%;[E]增加抗鬼火{2}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 0.7, index: 0 },
            [EAttrTypeL1.K_BLOODRETURN]: { add: 1.1, index: 1 },
            [EAttrTypeL1.K_WILDFIRE]: { add: 0.55, index: 2 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
