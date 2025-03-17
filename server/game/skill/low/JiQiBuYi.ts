import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import { EActionType, ESkillQuality, ESkillType } from "../../role/EEnum";

export default class JiQiBuYi extends SkillBase {
	
	constructor() {
		super();
		this.skill_id = ESkillType.JiQiBuYi;
		this.kind = ESkillType.YinShen;
		this.skill_name = '击其不意';
		this.action_type = EActionType.PASSIVE;
		this.quality = ESkillQuality.HIGH;
	}
}