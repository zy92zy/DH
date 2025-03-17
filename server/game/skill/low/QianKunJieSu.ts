import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EBuffType, EActionOn, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class QianKunJieSu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.QianKunJieSu;
		this.skill_name = '乾坤借速';
		this.skill_type = EMagicType.SPEED;
		this.buff_type = EBuffType.ONCE;
		this.act_on = EActionOn.SELF;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.spd = Math.round(12 + 8 * level / 25000);
		ret.cnt = Math.min(7, Math.floor(3 * (1 + profic ** 0.3 * 8 / 100)));
		ret.round = Math.floor(3 * (1 + profic ** 0.35 * 5 / 100));
		return ret;
	}
}
