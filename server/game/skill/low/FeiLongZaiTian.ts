import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import { EActionType, ESkillQuality, ESkillType } from "../../role/EEnum";

// 飞龙在天
export default class FeiLongZaiTian extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.FeiLongZaiTian;
		this.skill_name = "飞龙在天";
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.FeiLongZaiTian;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params:any=null):any{
		return {};
	}
}