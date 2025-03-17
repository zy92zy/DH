import { ESkillType, EActionType, EAttrTypeL1, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class HighShenGongGuiLi extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.HighShenGongGuiLi;
		this.skill_name = '高级神工鬼力';
		this.action_type = EActionType.PASSIVE;
		this.effectMap = {
			[EAttrTypeL1.ATK]: { add: 0 },
		};
		this.kind = ESkillType.ShenGongGuiLi;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret: any = {};
		ret.add = Math.floor(2500 * (relive * 0.5 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1866667 * 10 / (100 + relive * 20)))
		return ret;
	}

}