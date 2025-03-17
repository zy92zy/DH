import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType, ESkillQuality, EAttrTypeL1} from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";
import BattleRole from "@/game/battle/BattleRole";

// 隐身
export default class FeiJuJiuTian extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.FeiJuJiuTian;
		this.skill_name = '飞举九天';
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.FeiJuJiuTian;
		this.quality = ESkillQuality.HIGH;
		this.skill_type = EMagicType.PoJia;
    }

    
    getEffect(params:any=null):any{
		let atk = params.atk || 0;
		let level = params.level || 0;
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.cnt = Math.min(5, Math.floor(3 * (1 + profic ** 0.3 * 5 / 100)));
        ret.round = 1;
        ret.fangyu = Math.floor(0.5 * level) * -1;
		ret.hurt = Math.floor((1 * atk) + (40 * level) *  (profic ** 0.4 * 2.8853998 / 100 + 1));

		if(params.battleRole.hasPassiveSkill(ESkillType.JingPiLiJie2) || params.battleRole.hasPassiveSkill(ESkillType.JingPiLiJie3)){
			//this.jingPiLiJie(battleRole);
		}
		return ret;
	}


	
	jingPiLiJie(battleRole: BattleRole=null){
		let eff = SKDataUtil.clone(SkillBase.skillEffect);
		eff.round = 1;
		let buff = new Buff(ESkillType.ZhenJiEff, eff);
		buff._data = 1.15;
		if(battleRole.hasPassiveSkill(ESkillType.JingPiLiJie3)){
			let bone = battleRole.getAttr(EAttrTypeL1.STRENGTH);
			buff._data += Math.floor(bone / 100) / 100 * 2;
		}
		battleRole.addBuff(buff);
	}

}