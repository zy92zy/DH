import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EActionOn, EMagicType, ESkillQuality, ESkillType } from "../../role/EEnum";

// 普通攻击
export default class NormalAttack extends SkillBase {

	constructor() {
		super();
		this.skill_id = ESkillType.NormalAtkSkill;
		this.skill_name = '普通攻击';
		this.skill_type = EMagicType.PHYSICS;
		this.act_on = EActionOn.ALL;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let atk = params.atk || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurt = atk;
		return ret;
	}
}
