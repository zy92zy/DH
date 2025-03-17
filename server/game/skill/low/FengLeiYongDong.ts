import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EMagicType, ESkillQuality, ESkillType } from "../../role/EEnum";

// 风雷涌动
export default class FengLeiYongDong extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.FengLeiYongDong;
		this.skill_name = "风雷涌动";
		this.skill_type = EMagicType.Wind;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurt = Math.floor(65 * level * (profic ** 0.4 * 2.8853998 / 100 + 1));
		return ret;
	}
}