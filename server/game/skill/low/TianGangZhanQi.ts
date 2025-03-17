import { ESkillType, EActionType } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class TianGangZhanQi extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.TianGangZhanQi;
		this.skill_name = '天罡战气';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.TianGangZhanQi;
	}

	getEffect(params:any=null):any{
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret:any= {};
		ret.add = Math.round(0.1 + 13 * (relive * 0.5 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)))
		return ret;
	}
}