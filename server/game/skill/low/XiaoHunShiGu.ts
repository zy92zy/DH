import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class XiaoHunShiGu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.XiaoHunShiGu;
		this.skill_name = '销魂蚀骨';
		this.skill_type = EMagicType.Frighten;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params:any=null):any{
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurtpre = Math.round(27 * (profic ** 0.35 * 2 / 100 + 1));
		ret.smppre = Math.round(38 * (profic ** 0.33 * 2 / 100 + 1));
		return ret;
	}
}