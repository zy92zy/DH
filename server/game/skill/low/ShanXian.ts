import { ESkillType, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class ShanXian extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.ShanXian;
		this.skill_name = '闪现';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.ShanXian;
		this.quality = ESkillQuality.LOW;
	}
	
	getEffect(params:any=null):any{
		return 25;
	}
}