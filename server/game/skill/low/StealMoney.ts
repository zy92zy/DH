import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EActionType, ESkillQuality, EMagicType } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class StealMoney extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.StealMoney;
		this.skill_name = '飞龙探云手';
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.StealMoney;
		this.quality = ESkillQuality.LOW;
		this.skill_type = EMagicType.StealMoney;
	}

	getEffect(params:any=null):any{
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurt = 1;
		let random = GameUtil.random(0, 10000);
		if (random < 100) {
			ret.money = GameUtil.random(GameUtil.lingHouMinMoney, 1000000);
		} else if (random >= 100 && random < 1000) {
			ret.money = GameUtil.random(GameUtil.lingHouMinMoney, 500000);
		} else {
			ret.money = GameUtil.random(GameUtil.lingHouMinMoney, 50000);
		}
		return ret;
	}
}
