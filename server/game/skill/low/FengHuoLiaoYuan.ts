import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EActionType, EAttrTypeL1, ESkillQuality, ESkillType } from "../../role/EEnum";

// 烽火燎原
export default class FengHuoLiaoYuan extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.FengHuoLiaoYuan;
		this.skill_name = "烽火燎原";
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.FengHuoLiaoYuan;
		this.quality = ESkillQuality.HIGH;
		this.cooldown = 5;
	}

	getEffect(params: any = null): any {
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = 3;
		ret.cnt = 10;
		ret.attrtype = EAttrTypeL1.FIRE;
		ret.attrnum = 50;
		return ret;
	}
}