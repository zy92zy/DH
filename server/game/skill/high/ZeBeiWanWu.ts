import SkillBase from "../core/SkillBase";
import { ESkillType, EMagicType, EBuffType, EActionOn, ESkillQuality, EAttrTypeL1 } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";
import BattleRole from "@/game/battle/BattleRole";

// 隐身
export default class ZeBeiWanWu extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.ZeBeiWanWu;
		this.skill_name = '泽被万物';
		this.skill_type = EMagicType.Rrsume;
		this.buff_type = EBuffType.LOOP;
		this.act_on = EActionOn.SELF;
		this.quality = ESkillQuality.HIGH;
        this.kind = ESkillType.ZeBeiWanWu;
    }

    
    
	getEffect(params:any=null):any{

		let battleRole = params.battleRole;
		let level = params.level || 0;
		let profic = params.profic || 0;
		let zhiyu = (battleRole&&battleRole.getAttr(EAttrTypeL1.PHY_ZHIYU)) || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);

		ret.hp = Math.round(30 * level * (profic ** 0.35 * 3 / 100 + 1)) * (zhiyu/1000+1);
		ret.round = Math.floor(3 * (1 + profic ** 0.35 * 5 / 100));
		ret.cnt = Math.min(7, Math.floor(3 * (1 + profic ** 0.3 * 8 / 100)));

		if(battleRole.hasPassiveSkill(ESkillType.AnShiRuChang2) || battleRole.hasPassiveSkill(ESkillType.AnShiRuChang3)){
			this.wanGuChangCun(ret, battleRole);
		}
		if(battleRole.hasPassiveSkill(ESkillType.WanGuChangCun2) || battleRole.hasPassiveSkill(ESkillType.WanGuChangCun3)){
			this.anShiRuChang(ret, battleRole);
		}
		return ret;
	}

	wanGuChangCun(ret:any, battleRole: BattleRole){
		let tager = battleRole.getTager();
		if(!tager)
			return;
		let hp = battleRole.getAttr(EAttrTypeL1.HP_MAX);
		let add = 1.03;
		if(battleRole.hasPassiveSkill(ESkillType.AnShiRuChang3)){
			let bone = battleRole.getAttr(EAttrTypeL1.BONE);
			add += Math.floor(bone / 300) / 100;
		}
		ret.hp += hp * add;
	}
	anShiRuChang(ret:any, battleRole: BattleRole){
		let tager = battleRole.getTager();
		if(!tager)
			return;
		let mp = battleRole.getAttr(EAttrTypeL1.MP_MAX);
		let add = 1.03;
		if(battleRole.hasPassiveSkill(ESkillType.AnShiRuChang3)){
			let bone = battleRole.getAttr(EAttrTypeL1.BONE);
			add += Math.floor(bone / 300) / 100;
		}
		battleRole.subMP(mp * add);
	}

}