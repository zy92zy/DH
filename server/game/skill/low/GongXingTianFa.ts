import { ESkillType, EActionType, EAttrTypeL1, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 恭行天罚
export default class GongXingTianFa extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.GongXingTianFa;
		this.skill_name = "恭行天罚";
		this.action_type = EActionType.PASSIVE;
		this.effectMap = {
			[EAttrTypeL1.PHY_HIT]: { add: 0 },
			[EAttrTypeL1.PHY_DEADLY]: { add: 0 }
		};
		this.kind = ESkillType.GongXingTianFa;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret: any = {};
		ret.add = Math.round(0.1 + 4 * (relive * 0.4 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)));
		return ret;
	}
}
