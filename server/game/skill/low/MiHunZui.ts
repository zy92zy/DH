import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EBuffType, EMagicType, ESkillQuality, ESkillType } from "../../role/EEnum";

export default class MiHunZui extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.MiHunZui;
		this.skill_name = '迷魂醉';
		this.skill_type = EMagicType.Sleep;
		this.buff_type = EBuffType.ONCE;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = Math.floor(3 * (1 + profic ** 0.3 * 7 / 100));
		return ret;
	}
}