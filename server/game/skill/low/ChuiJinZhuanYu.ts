
import SkillBase from "../core/SkillBase";
import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { EActionType, EAttrTypeL1, ESkillQuality, ESkillType } from "../../role/EEnum";

// 炊金馔玉
export default class ChuiJinZhuanYu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.ChuiJinZhuanYu;
		this.skill_name = "炊金馔玉";
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.ChuiJinZhuanYu;
		this.quality = ESkillQuality.HIGH;
		this.cooldown = 5;
	}

	getEffect(params: any = null): any {
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = 3;
		ret.cnt = 10;
		ret.attrtype = EAttrTypeL1.GOLD;
		ret.attrnum = 50;
		return ret;
	}
}