import { EActionType, EAttrTypeL1, ESkillQuality, ESkillType } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 倍道兼行
export default class BeiDaoJianXing extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.BeiDaoJianXing;
		this.skill_name = "倍道兼行";
		this.action_type = EActionType.PASSIVE;
		this.effectDesc = "[S]速度加{0}";
		this.effectMap = {
			[EAttrTypeL1.SPD]: { add: 130 }
		}
		this.kind = ESkillType.BeiDaoJianXing;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret: any = {};
		ret.add = Math.floor(38 * (relive * 0.3 + 1) * (level ** 0.5 / 10 + qinmi ** 0.17 * 10 / (100 + relive * 20)))
		return ret;
	}
}