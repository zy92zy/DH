import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EBuffType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";
// 普通防御
export default class NormalDefend extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.NormalDefSkill;
		this.skill_name = '防御';
		this.skill_type = EMagicType.PHYSICS;
		this.buff_type = EBuffType.ONCE;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params: any = null): any {
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.fangyu = 30;
		ret.round = 1;
		return ret;
	}
}