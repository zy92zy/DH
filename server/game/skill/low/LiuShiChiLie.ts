import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";

export default class LiuShiChiLie extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.LiuShiChiLie;
		this.skill_name = '六识炽烈';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.LiuShiChiLie;
	}

	getEffect(params:any=null):any{
        let ret = SKDataUtil.clone(GameUtil.skillEffect);
        ret.hit = 1000;//暂时写死1000
        ret.round = 999;
		return ret;
	}
}