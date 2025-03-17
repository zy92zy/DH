import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";

export default class MuRuQingFeng extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.MuRuQingFeng;
		this.skill_name = '穆如清风';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.MuRuQingFeng;
	}

}