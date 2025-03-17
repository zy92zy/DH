
import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EBuffType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class ShiXinKuangLuan extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.ShiXinKuangLuan;
		this.skill_name = '失心狂乱';
		this.skill_type = EMagicType.Chaos;
		this.buff_type = EBuffType.ONCE;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params:any=null):any{
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = Math.floor(3 * (1 + profic ** 0.3 * 5 / 100));
		ret.cnt = Math.min(5, Math.floor(3 * (1 + profic ** 0.35 * 3 / 100)));
		return ret;
	}
}
