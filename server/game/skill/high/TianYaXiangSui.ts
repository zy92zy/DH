import { ESkillType, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 天涯相随
export default class TianYaXiangSui extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.TianYaXiangSui;
		this.skill_name = "天涯相随";
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.ShanXian;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		return 100;
	}
}