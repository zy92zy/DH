import { ESkillType, EActionType, ESkillQuality, EActionOn } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class HighFenLieGongJi extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.HighFenLieGongJi;
		this.skill_name = '高级分裂攻击';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.FenLieGongJi;
		this.quality = ESkillQuality.HIGH;
		this.act_on = EActionOn.ENEMY;// 技能作用于 0 all 1 敌人 2 自己人
	}

	getEffect(params: any = null): any {
		let pre = 30;
		return pre;
	}
}