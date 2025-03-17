import SkillBase  from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EActionOn, EBuffType, EMagicType, ESkillQuality, ESkillType } from "../../role/EEnum";

export default class MoShenFuShen extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.MoShenFuShen;
		this.skill_name = '魔神附身';
		this.skill_type = EMagicType.Attack;
		this.buff_type = EBuffType.ONCE;
		this.act_on = EActionOn.SELF;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.atk = Math.round(25 * (profic ** 0.35 * 3 / 100 + 1));
		ret.hit = 15;
		ret.round = Math.floor(3 * (1 + profic ** 0.35 * 5 / 100));
		ret.cnt = Math.min(7, Math.floor(3 * (1 + profic ** 0.3 * 8 / 100)));
		return ret;
	}
}