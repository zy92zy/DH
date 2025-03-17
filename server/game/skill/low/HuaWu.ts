import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EActionType, EActionOn, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class HuaWu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.HuaWu;
		this.skill_name = '化无';
		this.action_type = EActionType.PASSIVE;
		this.act_on = EActionOn.ENEMY;
		this.kind = ESkillType.HuaWu;
		this.quality = ESkillQuality.FINAL;
	}

	getEffect(params:any=null):any{
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = 3;
		ret.cnt = 2;
		ret.yinshen = 1;
		return ret;
	}
}
