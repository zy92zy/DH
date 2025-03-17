import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType , ESkillQuality, EAttrTypeL1} from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

// 隐身
export default class ZhenTianDongDi extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.ZhenTianDongDi;
		this.skill_name = '震天动地';
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.ZhenTianDongDi;
		this.quality = ESkillQuality.HIGH;
		this.skill_type = EMagicType.HengSao;
    }

    
    getEffect(params:any=null):any{
		let atk = params.atk || 0;
		let level = params.level || 0;
		let profic = params.profic || 0;
        let ret = SKDataUtil.clone(GameUtil.skillEffect);
		

		ret.cnt = Math.min(5, Math.floor(3 * (1 + profic ** 0.3 * 5 / 100)));
		ret.hurt = Math.floor((1 * atk) + (40 * level) *  (profic ** 0.4 * 2.8853998 / 100 + 1));


        return ret;
    }





	

}