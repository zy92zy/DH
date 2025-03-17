import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EActionType, ESkillQuality, EAttrTypeL1 } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class YouFengLaiYi_Mu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.YouFengLaiYi_Mu;
		this.skill_name = '高级枯木逢春';
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.YouFengLaiYi_Mu;
		this.quality = ESkillQuality.HIGH;
		this.cooldown = 5;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = 3;
		ret.cnt = 10;
		ret.attrtype = EAttrTypeL1.WOOD;
		ret.attrnum = Math.floor(50 + 4.6 * (relive * 0.5 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1666667 * 10 / (100 + relive * 20)));
		return ret;
	}
}
