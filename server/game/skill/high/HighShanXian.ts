import { ESkillType, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 高级闪现
export default class HighShanXian extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.HighShanXian;
		this.skill_name = "高级闪现";
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.ShanXian;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		return 35;
	}
}