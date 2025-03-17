import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EBuffType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class ZuoBiShangGuan extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.ZuoBiShangGuan;
		this.skill_name = '作壁上观';
		this.skill_type = EMagicType.Seal;
		this.buff_type = EBuffType.ONCE;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = Math.floor(3 * (1 + profic ** 0.3 * 7 / 100));
		return ret;
	}
}
