import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EBuffType, EMagicType, ESkillQuality, ESkillType } from "../../role/EEnum";

export default class QianNvYouHun extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.QianNvYouHun;
		this.skill_name = '倩女幽魂';
		this.skill_type = EMagicType.SubDefense;
		this.buff_type = EBuffType.ONCE;
		this.quality = ESkillQuality.HIGH;
	}

	getEffect(params: any = null): any {
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.skongzhi = Math.round(1.3 * (profic ** 0.35 * 20 / 100 + 1));
		ret.round = Math.floor(3 * (1 + profic ** 0.35 * 5 / 100));
		ret.cnt = Math.min(7, Math.floor(3 * (1 + profic ** 0.3 * 8 / 100)));
		return ret;
	}
}
