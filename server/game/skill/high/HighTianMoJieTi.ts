
import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EActionType, ESkillQuality, EActionOn, EAttrTypeL1 } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 用自己的气血 换 对方的气血
export default class HighTianMoJieTi extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.HighTianMoJieTi;
		this.kind = ESkillType.TianMoJieTi;
		this.skill_name = '高级天魔解体';
		this.skill_type = EMagicType.NONE;
		this.action_type = EActionType.INITIATIVE;
		this.quality = ESkillQuality.HIGH;
		this.act_on = EActionOn.ENEMY;// 技能作用于 0 all 1 敌人 2 自己人
	}

	useSkill(brole: any): any {
		let cur = brole.getAttr(EAttrTypeL1.HP) || 0;
		let max = brole.getAttr(EAttrTypeL1.HP_MAX) || 0;
		let sub = Math.ceil(max * 0.95);
		if (cur < sub) {
			return `[${this.skill_name}]气血不足，无法释放`;
		}
		brole.subHP(-sub);
		return "";
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurtpre = Math.round(22.1 + 4 * (relive * 0.5 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)));
		return ret;
	}
}
