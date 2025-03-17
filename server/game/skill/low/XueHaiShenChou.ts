import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class XueHaiShenChou extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.XueHaiShenChou;
		this.skill_name = '血海深仇';
		this.skill_type = EMagicType.GhostFire;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params:any=null):any{
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let profic = params.profic || 0;
		let deadnum = params.deadnum || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		let hurt = Math.floor(60 * level * (profic ** 0.4 * 2.8853998 / 100 + 1));
		if (deadnum > 0) {
			hurt = hurt * (1 + deadnum * 0.2);
		}
		ret.hurt = hurt;
		ret.cnt = Math.min(5, Math.floor(3 * (1 + profic ** 0.3 * 5 / 100)));
		return ret;
	}
}
