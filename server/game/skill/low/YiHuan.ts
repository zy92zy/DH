import { ESkillType, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class YiHuan extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.YiHuan;
		this.skill_name = '遗患';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.YiHuan;
		this.quality = ESkillQuality.SHEN;
	}
}