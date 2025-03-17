import { ESkillType, EActionType, EAttrTypeL1, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class YuanQuanWanHu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.YuanQuanWanHu;
		this.skill_name = '源泉万斛';
		this.action_type = EActionType.PASSIVE;
		this.effectDesc="[B]最大生命值加{0}";
		this.effectMap = {
			[EAttrTypeL1.MP_MAX]:{add:15000}
		};
		this.kind = ESkillType.YuanQuanWanHu;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params:any=null):any{
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret:any= {};
		ret.add = Math.floor(4500 * (relive * 0.5 + 1) * (level ** 0.5 / 10 + qinmi ** 0.17 * 10 / (100 + relive * 20)))
		return ret;
	}
}
