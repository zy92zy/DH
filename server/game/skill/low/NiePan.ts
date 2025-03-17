import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import { EActionType, ESkillQuality, ESkillType } from "../../role/EEnum";

export default class NiePan extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.NiePan;
		this.skill_name = '涅槃';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.NiePan;
		this.quality = ESkillQuality.SHEN;
	}
}
