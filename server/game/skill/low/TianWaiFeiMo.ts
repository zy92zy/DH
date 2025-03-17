import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EBuffType, EActionOn, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class TianWaiFeiMo extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.TianWaiFeiMo;
		this.skill_name = '天外飞魔';
		this.skill_type = EMagicType.SPEED;
		this.buff_type = EBuffType.ONCE;
		this.act_on = EActionOn.SELF;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params:any=null):any{
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.spd = Math.round(15 + level / 5000);
		ret.round = Math.floor(3 * (1 + profic ** 0.35 * 5 / 100));
		return ret;
	}
}