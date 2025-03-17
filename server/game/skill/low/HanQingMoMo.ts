import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EBuffType, EActionOn, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 含情脉脉
export default class HanQingMoMo extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.HanQingMoMo;
		this.skill_name = "含情脉脉";
		this.skill_type = EMagicType.Defense;
		this.buff_type = EBuffType.ONCE;
		this.act_on = EActionOn.SELF;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.kongzhi = Math.round(0.9 * (profic ** 0.35 * 20 / 100 + 1));
		ret.fashang = Math.round(15 * (profic ** 0.35 * 2 / 100 + 1));
		ret.fangyu = Math.round(12 * (profic ** 0.35 * 2 / 100 + 1));
		ret.round = Math.floor(3 * (1 + profic ** 0.35 * 5 / 100));
		ret.cnt = Math.min(7, Math.floor(3 * (1 + profic ** 0.3 * 8 / 100)));
		return ret;
	}
}