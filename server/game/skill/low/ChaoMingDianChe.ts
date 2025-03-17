import { EActionType, EAttrTypeL1, ESkillQuality, ESkillType } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 潮鸣电掣
export default class ChaoMingDianChe extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.ChaoMingDianChe;
		this.skill_name = '潮鸣电掣';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.ChaoMingDianChe;
		this.effectMap = {
			[EAttrTypeL1.SPD]: { add: 0 }
		};
		this.quality = ESkillQuality.SHEN;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret: any = {};
		ret.add = Math.floor(75 * (relive * 0.3 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)))
		return ret;
	}
}