import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EBuffType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 鹤顶红粉
export default class HeDingHongFen extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.HeDingHongFen;
		this.skill_name = "鹤顶红粉";
		this.skill_type = EMagicType.Toxin;
		this.buff_type = EBuffType.LOOP;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let profic = params.profic || 0;
		let xianhurt = Math.floor(65 * level * (profic ** 0.4 * 2.8853998 / 100 + 1));
		let hurt = xianhurt / 3;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurt = hurt;
		ret.round = Math.floor(2 * (1 + profic ** 0.34 * 4 / 100));
		return ret;
	}
}
