import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 凌波微步
export default class LingBoWeiBu extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.LingBoWeiBu;
        this.skill_name = "凌波微步";
        this.effectDesc = "[B]增加气血{0}%;[E]增加闪避率{1}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 1, index: 0 },
            [EAttrTypeL1.PHY_DODGE]: { add: 1.3, index: 1 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
