import GameUtil from "../../../game/core/GameUtil";
import { ESkillType, EMagicType, EActionType, EBuffType, ESkillQuality } from "../../../game/role/EEnum";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillBase from "../core/SkillBase";

// 幻影如风
export default class HuanYingRuFeng extends SkillBase {

	constructor() {
		super();
		this.skill_id = ESkillType.HuanYingRuFeng;
		this.skill_name = '幻影如风';
		this.skill_type = EMagicType.PHYSICS;
		this.action_type = EActionType.INITIATIVE;
		this.buff_type = EBuffType.ONCE;
		this.kind = ESkillType.HuanYingRuFeng;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.cnt = Math.min(4, Math.floor(3 * (1 + profic ** 0.3 * 5 / 100)));
		ret.hurt = params.atk * 2.5;
		return ret;
	}
}