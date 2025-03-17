import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EActionType, ESkillQuality, EMagicType } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class YinShen extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.YinShen;
		this.skill_name = '隐身';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.YinShen;
		this.quality = ESkillQuality.HIGH;
		this.skill_type = EMagicType.YinShen;
	}

	getEffect(params:any=null):any{
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = 3;
		ret.yinshen = 1;
		return ret;
	}
}