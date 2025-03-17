import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";


// 怒剑狂花
export default class NuJianKuangHua extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.NuJianKuangHua;
        this.skill_name = "怒剑狂花";
        this.effectDesc = "[A]增加攻击力{0}%;[E]增加狂暴率{1}%;[E]增加连击率{2}%";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 0.68, index: 0 },
            [EAttrTypeL1.PHY_DEADLY]: { add: 0.88, index: 1 },
            [EAttrTypeL1.PHY_COMBO_PROB]: { add: 0.68, index: 2 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
