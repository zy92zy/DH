import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType, EBuffType ,EAttrTypeL1} from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";
import BattleRole from "@/game/battle/BattleRole";

// 隐身
export default class BaiLangTaoTian extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.BaiLangTaoTian;
		this.skill_name = '白浪滔天';
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.BaiLangTaoTian;
		this.buff_type = EBuffType.ONCE;
		this.skill_type = EMagicType.ZhenJi;
    }

    
    getEffect(params: any = null): any {
		let battleRole = params.battleRole;
		let atk = params.atk || 0;
		let level = params.level || 0;
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
        ret.round = 1;
        ret.hit = Math.floor(0.3 * level) * -1;
		ret.hurt = Math.floor((1 * atk) + (20 * level) *  (profic ** 0.4 * 2.8853998 / 100 + 1));

		if(battleRole.hasPassiveSkill(ESkillType.JingPiLiJie2) || battleRole.hasPassiveSkill(ESkillType.JingPiLiJie3)){
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