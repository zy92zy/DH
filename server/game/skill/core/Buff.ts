import GameUtil from "../../core/GameUtil";
import { EAttrTypeL1, EMagicType } from "../../role/EEnum";
import SkillUtil from "./SkillUtil";

export default class Buff {
	buff_id: number;
	skill_id: any;
	effects: any;
	effecttype: any;
	buffActive: boolean;
	source: number;
	round: any;
	cur_round: number;
	probability: number;
	_data:any = {};
	data:any = {};

	constructor(skill: any, skilleffect: any = null, data:any = {}) {
		this.buff_id = GameUtil.getAutoBuffId();
		typeof skill != 'object' && (skill = SkillUtil.getSkill(skill));
		!skilleffect && (skilleffect = skill.getEffect());

		this.skill_id = skill.skill_id;
		this.effects = skilleffect;
		this.effecttype = skill.skill_type;
		this.buffActive = false;
		this.source = 0;
		this.round = skilleffect.round;
		this.cur_round = 0;
		this.probability = 10000;
		this.data = data;
	}

	// this.cnt = 1; // 人数
	// this.round = 1; // 回合
	// this.hurt = 0; //伤害
	// this.smp = 0; // 法力减少-
	// this.hit = 0; // 命中增加+
	// this.spd = 0; // 速度增加+
	// this.atk = 0; // 攻击增加+
	// this.kongzhi = 0; // 控制抗性+
	// this.fashang = 0; // 法伤抗性+
	// this.fangyu = 0; // 防御+
	// this.hp = 0; // 增加血量
	// this.skongzhi = 0; // 减少控制抗性
	// this.yinshen = 0; // 隐身
	getAttr(attrType: any): any {
		let num = 0;
		for (let effectkey in this.effects) {
			if (this.effects.hasOwnProperty(effectkey)) {
				let effect = this.effects[effectkey];
				if (effectkey == 'hit' && attrType == EAttrTypeL1.PHY_HIT) {
					num += effect;
				} else if (effectkey == 'spd' && attrType == EAttrTypeL1.SPD) {
					num += effect;
				} else if (effectkey == 'atk' && attrType == EAttrTypeL1.ATK) {
					num += effect;
				} else if (effectkey == 'kongzhi' && (attrType == EAttrTypeL1.K_SEAL
					|| attrType == EAttrTypeL1.K_SLEEP || attrType == EAttrTypeL1.K_CONFUSION)) {
					num += effect;
				} else if (effectkey == 'fashang' && (attrType == EAttrTypeL1.K_WIND ||
					attrType == EAttrTypeL1.K_THUNDER || attrType == EAttrTypeL1.K_WATER || attrType == EAttrTypeL1.K_FIRE ||
					attrType == EAttrTypeL1.K_POISON || attrType == EAttrTypeL1.K_WILDFIRE)) {
					num += effect;
				} else if (effectkey == 'fangyu' && attrType == EAttrTypeL1.K_PHY_GET) {
					num += effect;
				} else if (effectkey == 'skongzhi' && (attrType == EAttrTypeL1.K_SEAL ||
					attrType == EAttrTypeL1.K_SLEEP || attrType == EAttrTypeL1.K_CONFUSION)) {
					num += -effect;
				} else if (effectkey == 'attrtype' && attrType == effect) {
					num += this.effects['attrnum'];
				}
			}
		}
		return num;
	}

	active(brole: any): number {
		let addHP = 0;
		if (brole.hasBuff(EMagicType.Seal)) {
			return addHP;
		}
		for (let effectkey in this.effects) {
			if (this.effects.hasOwnProperty(effectkey)) {
				let effect = this.effects[effectkey];
				if (effectkey == 'hurt' && effect > 0) {
					if (brole.hasBuff(EMagicType.Sleep)) {
						brole.cleanBuff(EMagicType.Sleep);
					}
					brole.subHP(-effect);
					addHP += -effect;
				}
				if (effectkey == 'hp') {
					brole.subHP(effect);
					addHP += effect;
				}
			}
		}
		return addHP;
	}

	getData(key:any){
		return this.data[key]
	}

	addRound() {
		this.cur_round++;
	}

	checkEnd(): boolean {
		if (this.cur_round >= this.round) {
			return true;
		}
		return false;
	}
}
