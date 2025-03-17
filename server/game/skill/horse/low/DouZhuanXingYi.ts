import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 斗转星移
export default class DouZhuanXingYi extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.DouZhuanXingYi;
        this.skill_name = "斗转星移";
        this.effectDesc = "[B]增加气血{0}%;[E]增加反震程度{1}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 1.27, index: 0 },
            [EAttrTypeL1.PHY_REBOUND]: { add: 2.05, index: 1 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
