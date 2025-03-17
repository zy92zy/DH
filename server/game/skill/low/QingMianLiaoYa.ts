import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EActionOn, EActionType, EAttrTypeL1, ESkillQuality, ESkillType } from "../../role/EEnum";

// 用自己的法力 换 对方的气血
export default class QingMianLiaoYa extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.QingMianLiaoYa;
		this.kind = ESkillType.QingMianLiaoYa;
		this.skill_name = '青面獠牙';
		this.action_type = EActionType.INITIATIVE;
		this.quality = ESkillQuality.LOW;
		this.act_on = EActionOn.ENEMY;// 技能作用于 0 all 1 敌人 2 自己人
	}

	useSkill(brole: any): any {
		let cur = brole.getAttr(EAttrTypeL1.MP) || 0;
		let max = brole.getAttr(EAttrTypeL1.MP_MAX) || 0;
		let sub = Math.ceil(max * 0.95);
		if (cur < sub) {
			return `[${this.skill_name}]法力不足，无法释放`;
		}
		brole.subMP(-sub);
		return "";
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurtpre = Math.round(10.1 + 2 * (relive * 0.4 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)));
		return ret;
	}
}
