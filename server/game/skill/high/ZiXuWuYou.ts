import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EActionType, EBuffType, ESkillQuality, EActionOn } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 子虚乌有
export default class ZiXuWuYou extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.ZiXuWuYou;
		this.skill_name = '子虚乌有';
		this.skill_type = EMagicType.YinShen;
		this.action_type = EActionType.INITIATIVE;
		this.buff_type = EBuffType.NONE;
		this.kind = ESkillType.ZiXuWuYou; // 技能类型
		this.quality = ESkillQuality.FINAL; //技能 品质
		this.cooldown = 5; // 技能冷却时间
		this.act_on = EActionOn.SELF;
	}

	getEffect(params: any = null): any {
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = 3;
		ret.cnt = 2;
		ret.yinshen = 1;
		return ret;
	}
}
