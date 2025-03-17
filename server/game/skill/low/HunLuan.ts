import GameUtil from "../../core/GameUtil";
import { ESkillType, EActionType, EMagicType, EBuffType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class HunLuan extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.HunLuan;
		this.kind = ESkillType.HunLuan;
		this.skill_name = '混乱';
		this.action_type = EActionType.PASSIVE;
		this.skill_type = EMagicType.Chaos;
		this.buff_type = EBuffType.ONCE;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let pre = Math.round(0.1 + 1.5 * (relive * 0.4 + 1) * (level ** 0.5 / 10 + qinmi ** 0.17 * 10 / (100 + relive * 20)))
		let rate = GameUtil.random(0, 10000);
		if (rate < pre * 100) {
			return ESkillType.JieDaoShaRen;
		}
		return null;
	}
}