import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级追魂夺命
export default class HighZhuiHunDuoMing extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighZhuiHunDuoMing;
        this.skill_name = "高级追魂夺命";
        this.effectDesc = "[S]增加速度{0}%;[E]增加命中率{1}%;[E]增加连击率{2}%";
        this.effectMap = {
            [EAttrTypeL1.SPD_PERC]: { add: 0.5, index: 0 },
            [EAttrTypeL1.PHY_HIT]: { add: 1.24, index: 1 },
            [EAttrTypeL1.PHY_COMBO_PROB]: { add: 1.24, index: 2 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
