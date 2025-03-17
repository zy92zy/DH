import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class XueShaZhiGu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.XueShaZhiGu;
		this.skill_name = '血煞之蛊';
		this.skill_type = EMagicType.ThreeCorpse;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params:any=null):any{
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		let xianhurt = Math.floor(65 * level * (profic ** 0.4 * 2.8853998 / 100 + 1));
		let hurt = xianhurt / 3;
		ret.hurt = hurt;
		ret.aihp = ret.hurt * 3;
		return ret;
	}
}