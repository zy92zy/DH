import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EActionType, EMagicType, ESkillQuality, ESkillType } from "../../role/EEnum";

// 飞龙在天-水
export default class FeiLongZaiTian_Shui extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.FeiLongZaiTian_Shui;
		this.skill_name = "飞龙在天-水";
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.FeiLongZaiTian;
		this.quality = ESkillQuality.HIGH;
		this.skill_type = EMagicType.Water;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let maxmp = params.maxmp || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurt = Math.floor(80 * level + maxmp / 100 * 6 * (relive * 0.6 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)));
		ret.cnt = 3;
		return ret;
	}
}