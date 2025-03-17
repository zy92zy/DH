import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EActionOn, EActionType, EMagicType, ESkillQuality, ESkillType } from "../../role/EEnum";

export default class MiaoShouHuiChun extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.MiaoShouHuiChun;
		this.skill_name = '妙手回春';
		this.skill_type = EMagicType.Rrsume;
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.MiaoShouHuiChun;
		this.quality = ESkillQuality.HIGH;
		this.limit_round = 5;
		this.limit_times = 1;
		this.act_on = EActionOn.SELF;
	}

	getEffect(params: any = null): any {
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hppre = 50;
		ret.mppre = 50;
		ret.cnt = 3;
		return ret;
	}
}
