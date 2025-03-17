import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 身如铁石
export default class ShenRuTieShi extends SkillBase{

	constructor() {
		super();
		this.skill_id = ESkillType.ShenRuTieShi;
		this.skill_name = "身如铁石";
        this.effectDesc = "[B]增加气血{0}%;[E]增加抗物理{1}%;[E]增加抗毒{2}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 0.6, index: 0 },
            [EAttrTypeL1.K_PHY_GET]: { add: 1.1, index: 1 },
            [EAttrTypeL1.K_POISON]: { add: 1.1, index: 2 }
        };
        this.action_type=EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
