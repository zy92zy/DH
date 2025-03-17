import SkillBase from "../core/SkillBase";
import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { EActionType, EAttrTypeL1, ESkillQuality, ESkillType } from "../../role/EEnum";

export default class BingLinChengXia extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.BingLinChengXia;
		this.skill_name = "兵临城下";
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.BingLinChengXia;
		this.quality = ESkillQuality.SHEN;
	}
	// 使用技能
	useSkill(brole: any): string {
		let curhp = brole.getAttr(EAttrTypeL1.HP) || 0;
		let maxhp = brole.getAttr(EAttrTypeL1.HP_MAX) || 0;
		let curmp = brole.getAttr(EAttrTypeL1.MP) || 0;
		let maxmp = brole.getAttr(EAttrTypeL1.MP_MAX) || 0;
		let subhp = maxhp / 2;
		if (curhp <= subhp+10) {
			return `[${this.skill_name}]气血不足，改为普攻!`;
		}
		let submp = maxmp / 4;
		if (curmp < submp) {
			return `[${this.skill_name}]法力不足，改为普攻!`;
		}
		brole.subHP(-subhp);
		brole.subMP(-submp);
		return "";
	}

	getEffect(params: any = null): any {
		let atk = params.atk || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurt = atk * 2.5;
		return ret;
	}
}
