import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType ,EAttrTypeL1} from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

export default class FengLeiWanYun extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.FengLeiWanYun;
		this.skill_name = '风雷万钧';
		this.kind = ESkillType.FengLeiWanYun;
		this.skill_type = EMagicType.HengSao;
    }

    getEffect(params: any = null): any {
		let atk = params.atk || 0;
		let level = params.level || 0;
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		
		ret.hurt = Math.floor((1 * atk) + (20 * level) *  (profic ** 0.4 * 2.8853998 / 100 + 1));

		return ret;
	}

}