import { ESkillType, EActionType, ESkillQuality, EActionOn } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 分裂攻击
export default class FenLieGongJi extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.FenLieGongJi;
		this.skill_name = "分裂攻击";
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.FenLieGongJi;
		this.quality = ESkillQuality.LOW;
		this.act_on = EActionOn.ENEMY;// 技能作用于 0 all 1 敌人 2 自己人
	}

	getEffect(params:any=null):any{
		let pre = 15;
		return pre;
	}
}