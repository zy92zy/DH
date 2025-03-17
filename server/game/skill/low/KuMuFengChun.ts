import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EActionType, ESkillQuality, EAttrTypeL1 } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class KuMuFengChun extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.KuMuFengChun;
		this.skill_name = '枯木逢春';
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.KuMuFengChun;
		this.quality = ESkillQuality.HIGH;
		this.cooldown = 5;
	}
	
	getEffect(params:any=null):any{
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.round = 3;
		ret.cnt = 10;
		ret.attrtype = EAttrTypeL1.WOOD;
		ret.attrnum = 50;
		return ret;
	}
}