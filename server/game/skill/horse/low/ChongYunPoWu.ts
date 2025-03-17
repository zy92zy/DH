import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 冲云破雾
export default class ChongYunPoWu extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.ChongYunPoWu;
        this.skill_name = "冲云破雾";
        this.effectDesc = "[E]增加破防概率{0}%;[E]增加破防程度{1}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 1.27, index: 0 },
            [EAttrTypeL1.PHY_REBOUND]: { add: 2.05, index: 1 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
