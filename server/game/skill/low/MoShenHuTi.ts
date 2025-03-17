import SkillBase  from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EActionOn, EBuffType, EMagicType, ESkillQuality, ESkillType } from "../../role/EEnum";

export default class MoShenHuTi extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.MoShenHuTi;
		this.skill_name = '魔神护体';
		this.skill_type = EMagicType.Defense;
		this.buff_type = EBuffType.ONCE;
		this.act_on = EActionOn.SELF;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let profic = params.profic || 0;

		/* Detail = "
			召唤鬼神依附到自己身上。
			控制抗性增加kongzhi % ，冰混睡忘
			伤法抗性增加fashang%，
			防御增加fangyu%。
			目标人数1人，持续Time个回合。"*/
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.kongzhi = Math.round(1.1 * (profic ** 0.35 * 20 / 100 + 1));
		ret.fashang = Math.round(18 * (profic ** 0.35 * 2 / 100 + 1));
		ret.fangyu = Math.round(15 * (profic ** 0.35 * 2 / 100 + 1));
		ret.round = Math.floor(3 * (1 + profic ** 0.35 * 5 / 100));
		return ret;
	}
}
