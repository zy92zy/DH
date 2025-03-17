import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, EActionType, ESkillQuality, EActionOn } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class JueJingFengSheng extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.JueJingFengSheng;
		this.skill_name = '绝境逢生';
		this.skill_type = EMagicType.Rrsume;
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.MiaoShouHuiChun;
		this.quality = ESkillQuality.FINAL;
		this.limit_round = 5;
		this.limit_times = 1;
		this.act_on = EActionOn.SELF;
	}

	getEffect(params:any=null):any{
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hppre = 60;
		ret.mppre = 60;
		ret.cnt = 10;
		return ret;
	}
}