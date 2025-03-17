import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EActionType, ESkillQuality, EActionOn } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class GeShanDaNiu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.GeShanDaNiu;
		this.skill_name = '隔山打牛';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.GeShanDaNiu;
		this.quality = ESkillQuality.LOW;
		this.act_on = EActionOn.ENEMY;// 技能作用于 0 all 1 敌人 2 自己人
	}

	getEffect(params:any=null):any{
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let atk = params.atk || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		let pre = Math.round(0.1 + 15 * (relive * 0.4 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)));
		ret.hurt = Math.round(atk * pre / 100);
		return pre;
	}
}