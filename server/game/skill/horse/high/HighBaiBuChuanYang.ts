import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级百步穿杨
export default class HighBaiBuChuanYang extends SkillBase{

	constructor() {
		super();
		this.skill_id = ESkillType.HighBaiBuChuanYang;
		this.skill_name = "高级百步穿杨";
        this.effectDesc = "[E]增加命中率{0}%";
        this.effectMap = {
            [EAttrTypeL1.PHY_HIT]: { add: 3.7, index: 0 }
        };
        this.action_type=EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
    
}
