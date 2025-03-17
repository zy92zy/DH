import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EActionType, EMagicType, EBuffType } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class RuHuTianYi extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.RuHuTianYi;
		this.skill_name = '如虎添翼';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.RuHuTianYi;

		this.skill_type = EMagicType.Defense;
		this.buff_type = EBuffType.ONCE;
	}

	getEffect(params:any=null):any{
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.kongzhi = 5;
		ret.fashang = 15;
		ret.fangyu = 15;
		ret.round = 2;
		ret.cnt = 2;
		return ret;
	}
}