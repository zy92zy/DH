import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级赤血青锋
export default class HighChiXueQingFeng extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighChiXueQingFeng;
        this.skill_name = "高级赤血青锋";
        this.effectDesc = "[B]增加气血{0}%;[E]增加狂暴率{1}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 1.5, index: 0 },
            [EAttrTypeL1.PHY_DEADLY]: { add: 2.16, index: 1 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
