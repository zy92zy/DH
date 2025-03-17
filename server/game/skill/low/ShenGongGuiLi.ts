import { ESkillType, EActionType, EAttrTypeL1, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class ShenGongGuiLi extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.ShenGongGuiLi;
		this.skill_name = '神工鬼力';
		this.action_type = EActionType.PASSIVE;
		this.effectMap = {
			[EAttrTypeL1.ATK]: { add: 0 },
		}
		this.kind = ESkillType.ShenGongGuiLi;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret: any = {};
		ret.add = Math.floor(1875 * (relive * 0.5 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)))
		return ret;
	}

}