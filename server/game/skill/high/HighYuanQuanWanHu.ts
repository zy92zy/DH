import { ESkillType, EActionType, EAttrTypeL1, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 高级源泉万斛
export default class HighYuanQuanWanHu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.HighYuanQuanWanHu;
		this.skill_name = "高级源泉万斛";
		this.action_type = EActionType.PASSIVE;
		this.effectMap = {
			[EAttrTypeL1.MP_MAX]: { add: 0 },
		};
		this.kind = ESkillType.YuanQuanWanHu;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret: any = {}
		ret.add = Math.floor(6000 * (relive * 0.5 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)))
		return ret;
	}
}