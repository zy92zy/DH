import { ESkillType, EActionType, EAttrTypeL1, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 高级蹒跚
export default class HighPanShan extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.HighPanShan;
		this.skill_name = "高级蹒跚";
		this.action_type = EActionType.PASSIVE;
		this.effectMap = {
			[EAttrTypeL1.SPD]: { add: 0 },
		};
		this.kind = ESkillType.PanShan;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret: any = {};
		ret.add = -Math.floor(50 * (relive * 0.3 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)))
		return ret;
	}
}
