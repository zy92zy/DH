import { ESkillType, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class XuanRen extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.XuanRen;
		this.skill_name = '悬刃';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.XuanRen;
		this.quality = ESkillQuality.SHEN;
	}
}
