import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 追魂夺命 增加速度(少量）、命中率、连击率。
export default class ZhuiHunDuoMing extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.ZhuiHunDuoMing;
        this.skill_name = "追魂夺命";
        this.effectDesc = "[S]增加速度{0}%;[E]增加命中率{1}%;[E]增加连击率{2}%";
        this.effectMap = {
            [EAttrTypeL1.SPD_PERC]: { add: 0.28, index: 0 },
            [EAttrTypeL1.PHY_HIT]: { add: 0.72, index: 1 },
            [EAttrTypeL1.PHY_COMBO_PROB]: { add: 0.72, index: 2 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
