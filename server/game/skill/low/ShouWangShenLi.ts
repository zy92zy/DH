
import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EBuffType, EActionOn, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class ShouWangShenLi extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.ShouWangShenLi;
		this.skill_name = '兽王神力';
		this.skill_type = EMagicType.Attack;
		this.buff_type = EBuffType.ONCE;
		this.act_on = EActionOn.SELF;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params:any=null):any{
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.atk = Math.round(30 * (profic ** 0.35 * 3 / 100 + 1));
		ret.hit = 15;
		ret.round = Math.floor(3 * (1 + profic ** 0.35 * 5 / 100));
		return ret;
	}
}