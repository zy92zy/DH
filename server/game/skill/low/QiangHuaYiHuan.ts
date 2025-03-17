import { ESkillType, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class QiangHuaYiHuan extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.QiangHuaYiHuan;
		this.skill_name = '强化遗患';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.QiangHuaYiHuan;
		this.quality = ESkillQuality.SHEN;
	}
}
