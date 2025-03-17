import { ESkillType, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class YouFengLaiYi extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.YouFengLaiYi;
		this.skill_name = '有凤来仪';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.YouFengLaiYi;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		return {};
	}
}