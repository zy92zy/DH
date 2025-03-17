import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";

export default class LiSheDaChuan extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.LiSheDaChuan;
		this.skill_name = '利涉大川';
        this.skill_type = EMagicType.Rrsume;
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.LiSheDaChuan;
	}

	getEffect(params:any=null):any{
        let ret = SKDataUtil.clone(GameUtil.skillEffect);
        ret.mppre = 80;
        ret.round = 999;
		return ret;
	}
}