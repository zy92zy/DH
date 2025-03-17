import { ESkillType, EActionType, EAttrTypeL1, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class ZhangYinDongDu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.ZhangYinDongDu;
		this.skill_name = '帐饮东都';
		this.action_type = EActionType.PASSIVE;
		this.effectDesc = "[B]最大生命值加{0}";
		this.effectMap = {
			[EAttrTypeL1.HP_MAX]: { add: 23000 },
		}
		this.kind = ESkillType.ZhangYinDongDu;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret: any = {};
		ret.add = Math.floor(4500 * (relive * 0.5 + 1) * (level ** 0.5 / 10 + qinmi ** 0.17 * 10 / (100 + relive * 20)));
		return ret;
	}
}
