import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EActionType, ESkillQuality, EAttrTypeL1 } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class RuRenYinShui extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.RuRenYinShui;
		this.skill_name = '如人饮水';
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.RuRenYinShui;
		this.quality = ESkillQuality.HIGH;
		this.cooldown = 5;
	}
	
	getEffect(params:any=null):any{
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = 3;
		ret.cnt = 10;
		ret.attrtype = EAttrTypeL1.WATER;
		ret.attrnum = 50;
		return ret;
	}
}