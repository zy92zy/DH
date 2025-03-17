import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EMagicType, ESkillQuality, ESkillType } from "../../role/EEnum";

export default class LuoRiRongJin extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.LuoRiRongJin;
		this.skill_name = '落日熔金';
		this.skill_type = EMagicType.GhostFire;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let profic = params.profic || 0;
		let deadnum = params.deadnum || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		let hurt = Math.floor(65 * level * (profic ** 0.4 * 2.8853998 / 100 + 1));
		if (deadnum > 0) {
			hurt = hurt * (1 + deadnum * 0.2);
		}
		ret.hurt = hurt;
		return ret;
	}
}