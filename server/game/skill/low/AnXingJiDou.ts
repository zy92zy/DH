import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

export default class AnXingJiDou extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.AnXingJiDou;
		this.skill_name = '安行疾斗';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.AnXingJiDou;
	}

    getEffect(params:any=null):any{
        let ret = SKDataUtil.clone(GameUtil.skillEffect);
        ret.round = 999;
        return ret;
    }

	active(brole: any){
        SKLogger.debug(`安行疾斗触发`);
        //检测添加BUFF
        if(!brole.hasBuff(ESkillType.AnXingJiDou)){
            let skill = SkillUtil.getSkill(ESkillType.AnXingJiDou);
            let buff = new Buff(ESkillType.AnXingJiDou,skill.getEffect());
            brole.addBuff(buff);
        }
        if(brole.hasBuff(EMagicType.Chaos)){
			brole.cleanBuff(EMagicType.Chaos);
			SKLogger.debug(`安行疾斗清除混乱`);
		}
        if(brole.hasBuff(EMagicType.Sleep)){
			brole.cleanBuff(EMagicType.Sleep);
			SKLogger.debug(`安行疾斗清除昏睡`);
		}
        if(brole.hasBuff(EMagicType.Seal)){
			brole.cleanBuff(EMagicType.Seal);
			SKLogger.debug(`安行疾斗清除封印`);
		}
	}
}