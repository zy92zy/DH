import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class XiuLiQianKun extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.XiuLiQianKun;
		this.skill_name = '袖里乾坤';
		this.skill_type = EMagicType.Wind;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params:any=null):any{
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.cnt = Math.min(5, Math.floor(3 * (1 + profic ** 0.3 * 5 / 100)));
		ret.hurt = Math.floor(60 * level * (profic ** 0.4 * 2.8853998 / 100 + 1));
		return ret;
	}
}
