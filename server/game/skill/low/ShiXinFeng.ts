import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EBuffType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class ShiXinFeng extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.ShiXinFeng;
		this.skill_name = '失心疯';
		this.skill_type = EMagicType.Forget;
		this.buff_type = EBuffType.ONCE;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params:any=null):any{
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = Math.floor(3 * (1 + profic ** 0.3 * 7 / 100));
		return ret;
	}
}