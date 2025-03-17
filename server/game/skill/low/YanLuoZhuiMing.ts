import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class YanLuoZhuiMing extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.YanLuoZhuiMing;
		this.skill_name = '阎罗追命';
		this.skill_type = EMagicType.Frighten;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurtpre = Math.round(25 * (profic ** 0.35 * 2 / 100 + 1));
		ret.cnt = Math.min(7, Math.floor(3 * (1 + profic ** 0.35 * 5 / 100)));
		ret.smppre = Math.round(37 * (profic ** 0.33 * 2 / 100 + 1));
		return ret;
	}
}