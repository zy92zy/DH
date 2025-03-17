import { ESkillType, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class QiangHuaXuanRen extends SkillBase {
	
	constructor() {
		super();
		this.skill_id = ESkillType.QiangHuaXuanRen;
		this.skill_name = '强化悬刃';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.QiangHuaXuanRen;
		this.quality = ESkillQuality.SHEN;
	}
}