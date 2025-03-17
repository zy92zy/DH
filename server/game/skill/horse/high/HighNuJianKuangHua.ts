import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级怒剑狂花
export default class HighNuJianKuangHua extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighNuJianKuangHua;
        this.skill_name = "高级怒剑狂花";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加狂暴率{1}%;[E]增加连击率{2}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 1.18, index: 0 },
            [EAttrTypeL1.PHY_DEADLY]: { add: 1.5, index: 1 },
            [EAttrTypeL1.PHY_COMBO_PROB]: { add: 1.18, index: 2 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
