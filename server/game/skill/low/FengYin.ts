import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EBuffType, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class FengYin extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.FengYin;
		this.kind = ESkillType.FengYin;
		this.skill_name = "封印";
		this.skill_type = EMagicType.Seal;
		this.buff_type = EBuffType.ONCE;
		this.action_type = EActionType.PASSIVE;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let pre = Math.round(0.1 + 1.5 * (relive * 0.4 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)))
		let rate = GameUtil.random(0, 10000);
		pre = 100;
		if (rate < pre * 100) {
			return ESkillType.ZuoBiShangGuan;
		}
		return null;
	}
}