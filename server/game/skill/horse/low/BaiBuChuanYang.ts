import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 百步穿杨
export default class BaiBuChuanYang extends SkillBase{

	constructor() {
		super();
		this.skill_id = ESkillType.BaiBuChuanYang;
		this.skill_name = "百步穿杨";
        this.effectDesc = "[E]增加命中率{0}%";
        this.effectMap = {
            [EAttrTypeL1.PHY_HIT]: { add: 2.21, index: 0 }
        };
        this.action_type=EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
    
}
