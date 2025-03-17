import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 天神护体
export default class TianShenHuTi extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.TianShenHuTi;
        this.skill_name = "天神护体";
        this.effectDesc = "[B]增加气血{0}%;[E]增加抗风、抗雷、抗水、抗火{1}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 0.7, index: 0 },
            [EAttrTypeL1.K_WIND]: { add: 0.7, index: 1 },
            [EAttrTypeL1.K_THUNDER]: { add: 0.7, index: 2 },
            [EAttrTypeL1.K_WATER]: { add: 0.7, index: 3 },
            [EAttrTypeL1.K_FIRE]: { add: 0.7, index: 4 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
