import { ESkillType, EActionType, ESkillQuality, EActionOn } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 砍死一个 追击一个 最多追3个
export default class FenHuaFuLiu extends SkillBase {

	constructor() {
		super();
		this.skill_id = ESkillType.FenHuaFuLiu;
		this.skill_name = '分花拂柳';
		this.action_type = EActionType.PASSIVE;
		this.quality = ESkillQuality.HIGH;
		this.act_on = EActionOn.ENEMY;// 技能作用于 0 all 1 敌人 2 自己人
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let pre = Math.round(0.1 + 7 * (relive * 0.6 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)));
		return pre;
	}
}
