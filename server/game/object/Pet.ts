import BattleObj from "./BattleObj";
import DB from "../../utils/DB";
import PetMgr from "../core/PetMgr";
import GoodsMgr from "../item/GoodsMgr";
import SkillUtil from "../skill/core/SkillUtil";
import SkillBase from "../skill/core/SkillBase";
import SKDataUtil from "../../gear/SKDataUtil";
import ExpUtil from "../core/ExpUtil";
import GameUtil from "../core/GameUtil";
import Player from "./Player";
import SKLogger from "../../gear/SKLogger";
import Horse from "../horse/Horse";
import { EActionType, EAttrTypeL1, EAttrTypeL2, MsgCode } from "../role/EEnum";
import SKTimeUtil from "../../gear/SKTimeUtil";

export default class Pet extends BattleObj {
	petid: number;
	dataid: number;
	owner: Player;
	resid: number;
	intro: string;
	name: string;
	relive: number;
	level: number;
	grade: number;
	qinmi: number;
	skill_list: any;
	rate: number;
	basehp: number;
	basemp: number;
	baseatk: number;
	basespd: number;
	ppoint: any;
	dpoint: any;
	wuxing: any;
	exp: number;
	xexp: number;
	xlevel: number;
	longgu: number;
	state: number;
	maxskillcnt: number;
	wash_property: any; // 洗练的属性
	color: number; // -1:未变色 0:变色未成功 >0:其他颜色
	fly: number; // %10飞升次数 /10飞升增加的属性 1hp 2mp 3atk 4spd
	shenskill: number;
	petinfo: any;
	dfengyin: any;
	dhunlun: any;
	dhunshui: any;
	dyiwang: any;
	dfeng: any;
	dshui: any;
	dhuo: any;
	ddu: any;
	dlei: any;
	dguihuo: any;
	dsanshi: any;
	dzhenshe: any;
	pxishou: any;
	pmingzhong: number;
	pshanbi: number;
	plianji: number;
	plianjilv: number;
	pkuangbao: number;
	ppofang: number;
	ppofanglv: number;
	pfanzhenlv: number;
	pfanzhen: number;
	// 坐骑管制位 0 未管制 1 坐骑1 2 坐骑2 3 坐骑3 4 坐骑4
	control: number;

	//已解锁格子
	lock: number;
	times: any;

	constructor(petid: any) {
		super();
		this.petid = 0;
		this.dataid = petid;
		this.owner = null;
		this.resid = 0; // 资源id
		this.intro = ''; // 介绍
		this.name = '';
		this.relive = 0;
		this.level = 0;
		this.grade = 0;
		this.qinmi = 0; // 亲密
		this.skill_list = {};
		this.rate = 0;
		this.basehp = 0; // 初始血
		this.basemp = 0;
		this.baseatk = 0;
		this.basespd = 0;
		this.ppoint = {};
		this.dpoint = {};
		this.wuxing = {};
		this.exp = 0;
		this.xexp = 0;
		this.xlevel = 0;
		this.longgu = 0;
		this.state = 1;
		this.maxskillcnt = 4;
		this.wash_property = null; // 洗练的属性
		this.color = -1; // -1:未变色 0:变色未成功 >0:其他颜色
		// this.yuanqi = 0;
		this.fly = 0; // %10飞升次数 /10飞升增加的属性 1hp 2mp 3atk 4spd
		this.shenskill = 0;
		this.living_type = GameUtil.livingType.Pet;
		this.control = 0;
		this.lock = 0;
		this.times = 0;
	}

	setOwner(player: any) {
		this.maxskillcnt = PetMgr.shared.getMaxSkillCnt(this.dataid);
		this.owner = player;
	}

	setDB(info: any) {
		this.petinfo = info;
		if (!this.petinfo) {
			return;
		}
		let data = PetMgr.shared.getPetData(this.dataid);
		if (!data) {
			SKLogger.debug(`召唤兽找不到${this.dataid}`);
			return;
		}
		/* TODO 修复宠物属性 */
		while (info.hp && info.hp > data.hp[1]) {
			info.hp -= 60;
		}
		while (info.mp && info.mp > data.mp[1]) {
			info.mp -= 60;
		}
		while (info.atk && info.atk > data.atk[1]) {
			info.atk -= 60;
		}
		while (info.spd && info.spd > data.spd[1]) {
			info.spd -= 60;
		}
		info.petid && (this.petid = info.petid);
		info.dataid && (this.dataid = info.dataid);
		info.resid && (this.resid = info.resid);
		info.intro && (this.intro = info.intro);
		info.name && (this.name = info.name);
		info.relive && (this.relive = info.relive);
		info.level && (this.level = info.level);
		info.grade && (this.grade = info.grade);
		info.locks && (this.lock = info.locks);
		info.shenskill && (this.shenskill = info.shenskill);

		let skillinfos = SKDataUtil.jsonBy(info.skill);
		this.initSkill(skillinfos);

		info.rate && (this.rate = info.rate);
		info.hp && (this.basehp = info.hp);
		info.mp && (this.basemp = info.mp);
		info.atk && (this.baseatk = info.atk);
		info.spd && (this.basespd = info.spd);
		info.ppoint && (this.ppoint = SKDataUtil.jsonBy(info.ppoint));
		info.dpoint && (this.dpoint = SKDataUtil.jsonBy(info.dpoint));
		info.wuxing && (this.wuxing = SKDataUtil.jsonBy(info.wuxing));
		info.exp && (this.exp = info.exp);
		info.xexp && (this.xexp = info.xexp);
		info.xlevel && (this.xlevel = info.xlevel);
		info.longgu && (this.longgu = info.longgu);
		info.maxskillcnt && (this.maxskillcnt = info.maxskillcnt);
		if (SKDataUtil.isNumber(info.color)) {
			this.color = this.petColorTransformCom(info.color);
		}
		// if (this.color != -1) {
		// 	this.yuanqi = goodsMgr.getPetUseYuanqiRate(this.dataid);
		// }
		info.qinmi && (this.qinmi = info.qinmi);
		if (typeof (info.fly) == 'number') {
			this.fly = info.fly;
		}
		this.maxskillcnt = PetMgr.shared.getMaxSkillCnt(this.dataid);
		if (info.control) {
			this.control = SKDataUtil.clamp(info.control, 0, 4);
		}
		this.calculateAttribute();
	}

	initSkill(skillinfos: any) {
		for (let skillId in skillinfos) {
			if (skillinfos.hasOwnProperty(skillId)) {
				const skillinfo = skillinfos[skillId];
				if (typeof skillinfo == 'object' && skillinfo) {
					this.skill_list[skillId] = skillinfo;
				}
				if (typeof skillinfo == 'number') {
					this.skill_list[skillId] = {
						idx: skillinfo,
						lck: 0
					};
				}
			}
		}
	}

	/*
	 * 宠物使用元气丹
	 */
	useYuanqi() {
		if (this.color == -1) { // 未吃过元气丹 
			this.color = 0;
			let max = this.getMaxRate();
			let cur = this.getCurRate();
			if(cur >= max)
				this.rate = max;
			else
				this.rate = cur;
			this.calculateAttribute();
		}

		this.color = this.changeColor();
		this.save(true,"宠物使用元气丹");
		if (this.owner) {
			this.owner.send('s2c_update_pet', {
				info: this.toObj()
			});
			return true;
		} else {
			return false;
		}
	}

	/*
	 * 宠物洗颜色
	 */
	changeColor() {
		let colors = PetMgr.shared.getPetColors(this.resid);
		let common_colors = colors.colorValue; // 普通颜色 
		let special_colors = colors.colorNice; // 特殊颜色 
		let random = Math.random();
		let rate = 0.8; // 普通颜色的概率 
		let tsrate = 0.4; // 特殊颜色的概率 
		let color = this.color;
		if (random <= tsrate){
			color = parseInt(special_colors[Math.floor(Math.random() * special_colors.length)]);
		}else if(random <= rate){
			color = parseInt(common_colors[Math.floor(Math.random() * common_colors.length)]);
		}
		return color;
	}

	calculateAttribute() {
		GameUtil.clearAllAttr(this.attr1);
		this.dpoint[EAttrTypeL2.GENGU] = this.dpoint[EAttrTypeL2.GENGU] || 0;
		this.dpoint[EAttrTypeL2.LINGXING] = this.dpoint[EAttrTypeL2.LINGXING] || 0;
		this.dpoint[EAttrTypeL2.LILIANG] = this.dpoint[EAttrTypeL2.LILIANG] || 0;
		this.dpoint[EAttrTypeL2.MINJIE] = this.dpoint[EAttrTypeL2.MINJIE] || 0;

		this.ppoint[EAttrTypeL2.GENGU] = this.ppoint[EAttrTypeL2.GENGU] || 0;
		this.ppoint[EAttrTypeL2.LINGXING] = this.ppoint[EAttrTypeL2.LINGXING] || 0;
		this.ppoint[EAttrTypeL2.LILIANG] = this.ppoint[EAttrTypeL2.LILIANG] || 0;
		this.ppoint[EAttrTypeL2.MINJIE] = this.ppoint[EAttrTypeL2.MINJIE] || 0;

		let cur_rate = this.getCurRate();
		let calhp = Math.round(this.level * cur_rate / 10000 * (this.level + this.ppoint[EAttrTypeL2.GENGU]) + 0.7 * this.getBaseProperty('hp') * this.level * cur_rate / 10000 + this.getBaseProperty('hp'));
		let calmp = Math.round(this.level * cur_rate / 10000 * (this.level + this.ppoint[EAttrTypeL2.LINGXING]) + 0.7 * this.getBaseProperty('mp') * this.level * cur_rate / 10000 + this.getBaseProperty('mp'));
		let calatk = Math.round(0.2 * this.level * cur_rate / 10000 * (this.level + this.ppoint[EAttrTypeL2.LILIANG]) + 0.2 * 0.7 * this.getBaseProperty('atk') * this.level * cur_rate / 10000 + this.getBaseProperty('atk'));
		let calspd = Math.round((this.getBaseProperty('spd') + (this.level + this.ppoint[EAttrTypeL2.MINJIE])) * cur_rate / 10000);

		this.setAttr1(EAttrTypeL1.HP, calhp);
		this.setAttr1(EAttrTypeL1.HP_MAX, calhp);
		this.setAttr1(EAttrTypeL1.MP, calmp);
		this.setAttr1(EAttrTypeL1.MP_MAX, calmp);
		this.setAttr1(EAttrTypeL1.ATK, calatk);
		this.setAttr1(EAttrTypeL1.SPD, calspd);

		this.dpoint[EAttrTypeL1.K_SEAL] = this.dpoint[EAttrTypeL1.K_SEAL] || 0;
		this.dpoint[EAttrTypeL1.K_CONFUSION] = this.dpoint[EAttrTypeL1.K_CONFUSION] || 0;
		this.dpoint[EAttrTypeL1.K_SLEEP] = this.dpoint[EAttrTypeL1.K_SLEEP] || 0;
		this.dpoint[EAttrTypeL1.K_FORGET] = this.dpoint[EAttrTypeL1.K_FORGET] || 0;
		this.dfengyin = this.dpoint[EAttrTypeL1.K_SEAL] * 4;
		this.dhunlun = this.dpoint[EAttrTypeL1.K_CONFUSION] * 4;
		this.dhunshui = this.dpoint[EAttrTypeL1.K_SLEEP] * 4;
		this.dyiwang = this.dpoint[EAttrTypeL1.K_FORGET] * 4;

		this.setAttr1(EAttrTypeL1.K_SEAL, this.dfengyin);
		this.setAttr1(EAttrTypeL1.K_CONFUSION, this.dhunlun);
		this.setAttr1(EAttrTypeL1.K_SLEEP, this.dhunshui);
		this.setAttr1(EAttrTypeL1.K_FORGET, this.dyiwang);

		this.dpoint[EAttrTypeL1.K_WIND] = this.dpoint[EAttrTypeL1.K_WIND] || 0;
		this.dpoint[EAttrTypeL1.K_WATER] = this.dpoint[EAttrTypeL1.K_WATER] || 0;
		this.dpoint[EAttrTypeL1.K_FIRE] = this.dpoint[EAttrTypeL1.K_FIRE] || 0;
		this.dpoint[EAttrTypeL1.K_POISON] = this.dpoint[EAttrTypeL1.K_POISON] || 0;
		this.dpoint[EAttrTypeL1.K_THUNDER] = this.dpoint[EAttrTypeL1.K_THUNDER] || 0;
		this.dpoint[EAttrTypeL1.K_WILDFIRE] = this.dpoint[EAttrTypeL1.K_WILDFIRE] || 0;
		this.dpoint[EAttrTypeL1.K_BLOODRETURN] = this.dpoint[EAttrTypeL1.K_BLOODRETURN] || 0;

		this.dfeng = this.dpoint[EAttrTypeL1.K_WIND] * 4;
		this.dshui = this.dpoint[EAttrTypeL1.K_WATER] * 4;
		this.dhuo = this.dpoint[EAttrTypeL1.K_FIRE] * 4;
		this.ddu = this.dpoint[EAttrTypeL1.K_POISON] * 4;
		this.dlei = this.dpoint[EAttrTypeL1.K_THUNDER] * 4;
		this.dguihuo = this.dpoint[EAttrTypeL1.K_WILDFIRE] * 4;
		this.dsanshi = this.dpoint[EAttrTypeL1.K_BLOODRETURN] * 4;
		this.dzhenshe = this.dpoint[EAttrTypeL1.K_DETER] * 4;

		this.setAttr1(EAttrTypeL1.K_WIND, this.dfeng);
		this.setAttr1(EAttrTypeL1.K_WATER, this.dshui);
		this.setAttr1(EAttrTypeL1.K_FIRE, this.dhuo);
		this.setAttr1(EAttrTypeL1.K_POISON, this.ddu);
		this.setAttr1(EAttrTypeL1.K_THUNDER, this.dlei);
		this.setAttr1(EAttrTypeL1.K_WILDFIRE, this.dguihuo);
		this.setAttr1(EAttrTypeL1.K_BLOODRETURN, this.dsanshi);
		this.setAttr1(EAttrTypeL1.K_DETER, this.dzhenshe);

		this.dpoint[EAttrTypeL1.PHY_GET] = this.dpoint[EAttrTypeL1.PHY_GET] || 0;
		this.dpoint[EAttrTypeL1.PHY_HIT] = this.dpoint[EAttrTypeL1.PHY_HIT] || 0;
		this.dpoint[EAttrTypeL1.PHY_DODGE] = this.dpoint[EAttrTypeL1.PHY_DODGE] || 0;
		this.dpoint[EAttrTypeL1.PHY_COMBO] = this.dpoint[EAttrTypeL1.PHY_COMBO] || 0;
		this.dpoint[EAttrTypeL1.PHY_COMBO_PROB] = this.dpoint[EAttrTypeL1.PHY_COMBO_PROB] || 0;
		this.dpoint[EAttrTypeL1.PHY_DEADLY] = this.dpoint[EAttrTypeL1.PHY_DEADLY] || 0;
		this.dpoint[EAttrTypeL1.PHY_BREAK] = this.dpoint[EAttrTypeL1.PHY_BREAK] || 0;
		this.dpoint[EAttrTypeL1.PHY_BREAK_PROB] = this.dpoint[EAttrTypeL1.PHY_BREAK_PROB] || 0;
		this.dpoint[EAttrTypeL1.PHY_REBOUND_PROB] = this.dpoint[EAttrTypeL1.PHY_REBOUND_PROB] || 0;
		this.dpoint[EAttrTypeL1.PHY_REBOUND] = this.dpoint[EAttrTypeL1.PHY_REBOUND] || 0;

		this.pxishou = this.dpoint[EAttrTypeL1.PHY_GET] * 3;
		this.pmingzhong = 80 + this.dpoint[EAttrTypeL1.PHY_HIT] * 1.5;
		this.pshanbi = this.dpoint[EAttrTypeL1.PHY_DODGE] * 1.5;
		this.plianji = 3 + this.dpoint[EAttrTypeL1.PHY_COMBO] * 1;
		this.plianjilv = this.dpoint[EAttrTypeL1.PHY_COMBO_PROB] * 1.5;
		this.pkuangbao = this.dpoint[EAttrTypeL1.PHY_DEADLY] * 1.5;
		this.ppofang = this.dpoint[EAttrTypeL1.PHY_BREAK] * 3;
		this.ppofanglv = this.dpoint[EAttrTypeL1.PHY_BREAK_PROB] * 3;
		this.pfanzhenlv = this.dpoint[EAttrTypeL1.PHY_REBOUND_PROB] * 4;
		this.pfanzhen = this.dpoint[EAttrTypeL1.PHY_REBOUND] * 4;

		this.setAttr1(EAttrTypeL1.PHY_GET, this.pxishou);
		this.setAttr1(EAttrTypeL1.PHY_HIT, this.pmingzhong);
		this.setAttr1(EAttrTypeL1.PHY_DODGE, this.pshanbi);
		this.setAttr1(EAttrTypeL1.PHY_COMBO, this.plianji);
		this.setAttr1(EAttrTypeL1.PHY_COMBO_PROB, this.plianjilv);
		this.setAttr1(EAttrTypeL1.PHY_DEADLY, this.pkuangbao);
		this.setAttr1(EAttrTypeL1.PHY_BREAK, this.ppofang);
		this.setAttr1(EAttrTypeL1.PHY_BREAK_PROB, this.ppofanglv);
		this.setAttr1(EAttrTypeL1.PHY_REBOUND_PROB, this.pfanzhenlv);
		this.setAttr1(EAttrTypeL1.PHY_REBOUND, this.pfanzhen);

		this.maxhp = this.getBaseProperty('hp');
		this.maxmp = this.getBaseProperty('mp');
		this.maxexp = ExpUtil.getSummonUpGradeExp(this.relive, this.level);
		this.calcPassiveSkillAttr();
		this.calcHorseSkillAttr();
	}
	
	// 计算被动技能属性
	calcPassiveSkillAttr() {
		for (let skillId in this.skill_list) {
			let skill = SkillUtil.getSkill(skillId);
			this.checkSkill(skill, "召唤兽");
		}
		if (this.shenskill != 0) {
			let skill = SkillUtil.getSkill(this.shenskill);
			this.checkSkill(skill, "神兽");
		}
	}

	// 计算坐骑技能属性
	calcHorseSkillAttr() {
		if (this.control < 1) {
			return;
		}
		if (this.owner == null) {
			return;
		}
		let horse = this.owner.horseList.getHorse(this.control);
		if (horse == null) {
			return;
		}
		let skillList = this.owner.horseSkill.getList(this.control);
		for (let skill of skillList) {
			this.checkHorseSkill(skill, horse);
		}
	}

	checkSkill(skill: SkillBase, prefix: string) {
		if (skill == null) {
			return;
		}
		if (skill.action_type != EActionType.PASSIVE) {
			return;
		}
		let effectMap = skill.effectMap;
		for (let key in effectMap) {
			let type: EAttrTypeL1 = SKDataUtil.toNumber(key);
			let params: any = {
				type: type,
				level: this.level,
				relive: this.relive,
				qinmi: this.qinmi
			};
			let ret = skill.getEffect(params);
			if (ret.add) {
				let old = SKDataUtil.toDecimal2(this.attr1[type]);
				this.attr1[type] = SKDataUtil.toDecimal2(old + ret.add);
				let current = this.attr1[type];
				SKLogger.debug(`${prefix}[${this.name}]技能[${skill.skill_name}][${GameUtil.attrTypeL1Name[type]}]改变[${ret.add}]:${old}->${current}`);
				let oldHP = this.attr1[EAttrTypeL1.HP];
				let oldMP = this.attr1[EAttrTypeL1.MP];
				let oldATK = this.attr1[EAttrTypeL1.ATK];
				let oldSPD = this.attr1[EAttrTypeL1.SPD];
				if (type == EAttrTypeL1.HP_MAX) {
					this.attr1[EAttrTypeL1.HP] = this.attr1[EAttrTypeL1.HP_MAX];
					SKLogger.debug(`${prefix}[${this.name}]技能[${skill.skill_name}]气血最大值改变:${oldHP}->${this.attr1[EAttrTypeL1.HP]}`);
				} else if (type == EAttrTypeL1.MP_MAX) {
					this.attr1[EAttrTypeL1.MP] = this.attr1[EAttrTypeL1.MP_MAX];
					SKLogger.debug(`${prefix}[${this.name}]技能[${skill.skill_name}]法力最大值改变:${oldMP}->${this.attr1[EAttrTypeL1.MP]}`);
				} else if (type == EAttrTypeL1.HP_PERC) {
					this.attr1[EAttrTypeL1.HP] = Math.floor(this.attr1[EAttrTypeL1.HP_MAX] * (1 + ret.add / 100));
					SKLogger.debug(`${prefix}[${this.name}]技能[${skill.skill_name}]气血百分比改变:${oldHP}->${this.attr1[EAttrTypeL1.HP]}`);
				} else if (type == EAttrTypeL1.MP_PERC) {
					this.attr1[EAttrTypeL1.MP] = Math.floor(this.attr1[EAttrTypeL1.MP_MAX] * (1 + ret.add / 100));
					SKLogger.debug(`${prefix}[${this.name}]技能[${skill.skill_name}]法力百分比改变:${oldMP}->${this.attr1[EAttrTypeL1.MP]}`);
				} else if (type == EAttrTypeL1.ATK_PERC) {
					this.attr1[EAttrTypeL1.ATK] = Math.floor(this.attr1[EAttrTypeL1.ATK] * (1 + ret.add / 100));
					SKLogger.debug(`${prefix}[${this.name}]技能[${skill.skill_name}]攻击百分比改变:${oldATK}->${this.attr1[EAttrTypeL1.ATK]}`);
				} else if (type == EAttrTypeL1.SPD_PERC) {
					this.attr1[EAttrTypeL1.SPD] = Math.floor(this.attr1[EAttrTypeL1.SPD] * (1 + ret.add / 100));
					SKLogger.debug(`${prefix}[${this.name}]技能[${skill.skill_name}]速度百分比改变:${oldSPD}->${this.attr1[EAttrTypeL1.SPD]}`);
				}
			}
		}
	}
	// 检查坐骑技能
	checkHorseSkill(skill: SkillBase, horse: Horse) {
		if (skill == null) {
			return;
		}
		if (skill.action_type != EActionType.PASSIVE) {
			return;
		}
		let effectMap = skill.effectMap;
		for (let key in effectMap) {
			let type: EAttrTypeL1 = SKDataUtil.toNumber(key);
			let ret = skill.getHorseEffect(type, horse.level, skill.exp);
			if (ret.add) {
				let old = SKDataUtil.toDecimal2(this.attr1[type]);
				this.attr1[type] = SKDataUtil.toDecimal2(old + ret.add);
				let current: number = this.attr1[type];
				SKLogger.debug(`召唤兽[${this.name}]坐骑[${horse.name}]技能[${skill.skill_name}][${GameUtil.attrTypeL1Name[type]}]改变[${ret.add}]:${old}->${current}`);
				let oldHP = this.attr1[EAttrTypeL1.HP];
				let oldMP = this.attr1[EAttrTypeL1.MP];
				let oldATK = this.attr1[EAttrTypeL1.ATK];
				let oldSPD = this.attr1[EAttrTypeL1.SPD];
				if (type == EAttrTypeL1.HP_MAX) {
					this.attr1[EAttrTypeL1.HP] = this.attr1[EAttrTypeL1.HP_MAX];
					SKLogger.debug(`召唤兽[${this.name}]坐骑[${horse.name}]技能[${skill.skill_name}]气血最大值改变:${oldHP}->${this.attr1[EAttrTypeL1.HP]}`);
				} else if (type == EAttrTypeL1.MP_MAX) {
					this.attr1[EAttrTypeL1.MP] = this.attr1[EAttrTypeL1.MP_MAX];
					SKLogger.debug(`召唤兽[${this.name}]坐骑[${horse.name}]技能[${skill.skill_name}]法力最大值改变:${oldMP}->${this.attr1[EAttrTypeL1.MP]}`);
				} else if (type == EAttrTypeL1.HP_PERC) {
					this.attr1[EAttrTypeL1.HP] = Math.floor(this.attr1[EAttrTypeL1.HP_MAX] * (1 + ret.add / 100));
					SKLogger.debug(`召唤兽[${this.name}]坐骑[${horse.name}]技能[${skill.skill_name}]气血百分比改变:${oldHP}->${this.attr1[EAttrTypeL1.HP]}`);
				} else if (type == EAttrTypeL1.MP_PERC) {
					this.attr1[EAttrTypeL1.MP] = Math.floor(this.attr1[EAttrTypeL1.MP_MAX] * (1 + ret.add / 100));
					SKLogger.debug(`召唤兽[${this.name}]坐骑[${horse.name}]技能[${skill.skill_name}]法力百分比改变:${oldMP}->${this.attr1[EAttrTypeL1.MP]}`);
				} else if (type == EAttrTypeL1.ATK_PERC) {
					this.attr1[EAttrTypeL1.ATK] = Math.floor(this.attr1[EAttrTypeL1.ATK] * (1 + ret.add / 100));
					SKLogger.debug(`召唤兽[${this.name}]坐骑[${horse.name}]技能[${skill.skill_name}]攻击百分比改变:${oldATK}->${this.attr1[EAttrTypeL1.ATK]}`);
				} else if (type == EAttrTypeL1.SPD_PERC) {
					this.attr1[EAttrTypeL1.SPD] = Math.floor(this.attr1[EAttrTypeL1.SPD] * (1 + ret.add / 100));
					SKLogger.debug(`召唤兽[${this.name}]坐骑[${horse.name}]技能[${skill.skill_name}]速度百分比改变:${oldSPD}->${this.attr1[EAttrTypeL1.SPD]}`);
				}
			}
		}
	}

	toObj() {
		let obj: any = {};
		obj.petid = this.petid;
		obj.dataid = this.dataid;
		obj.onlyid = this.onlyid;
		obj.roleid = this.owner.roleid;
		obj.name = this.name;
		obj.relive = this.relive;
		obj.level = this.level;
		obj.resid = this.resid;
		obj.grade = this.grade;
		obj.skill = SKDataUtil.toJson(this.skill_list);
		obj.ppoint = SKDataUtil.toJson(this.ppoint);
		obj.dpoint = SKDataUtil.toJson(this.dpoint);
		obj.wuxing = SKDataUtil.toJson(this.wuxing);
		obj.exp = this.exp;
		obj.rate = this.getCurRate();
		obj.maxrate = this.getMaxRate();
		obj.hp = this.getBaseProperty('hp');
		obj.mp = this.getBaseProperty('mp');
		obj.atk = this.getBaseProperty('atk');
		obj.spd = this.getBaseProperty('spd');
		obj.intro = this.intro;
		obj.xexp = this.xexp;
		obj.xlevel = this.xlevel;
		obj.longgu = this.longgu;
		obj.maxskillcnt = this.maxskillcnt;
		obj.attr1 = SKDataUtil.toJson(this.attr1);
		obj.shenskill = this.shenskill;
		obj.color = this.color;
		obj.qinmi = this.qinmi;
		obj.fly = this.fly;
		obj.control = this.control;
		obj.lock = this.lock;
		return obj;
	}
	//宝宝转生
	petRelive() {
		if (!this.owner) {
			return;
		}
		let nextlive = this.relive + 1;
		if (nextlive > 4) { //最大转生4
			this.owner.send('s2c_notice', {
				//更高转生等级暂未开放
				strRichText: MsgCode.RELIVE_LEVEL_TOO_HIGH + ''
			});
			return;
		}
		if (nextlive > this.owner.relive) {
			this.owner.send('s2c_notice', {
				strRichText: `角色转生等级不足!`
			});
			return;
		}
		if (this.level < ExpUtil.getSummonMaxGrade(this.relive)) { //等级不够
			this.owner.send('s2c_notice', {
				strRichText: MsgCode.RELIVE_LEVEL_NOT_ENOUGH + ''
			});
			return;
		}
		let maxrate = this.getMaxRate();
		if (this.rate > maxrate) {
			this.rate = maxrate;
		}
		this.relive = nextlive;
		this.level = ExpUtil.getSummonGradeStart(this.relive);
		for (const key in this.ppoint) {
			this.ppoint[key] = 0;
		}
		this.addExp(0);
		this.calculateAttribute();
		let info = `您的召唤兽[${this.name}]${this.relive < 4 ? `${this.relive}转` : "飞升"}成功！`
		this.owner.send('s2c_notice', {
			strRichText: info
		});
		this.save(false,"宠物转生");
	}

	/*
	 * 洗练属性 
	 */
	washProperty() {
		if (!this.owner) {
			return;
		}
		let data = PetMgr.shared.getBaseAttr(this.dataid);
		this.wash_property = SKDataUtil.clone(data); // 保存的属性不能+60 
		switch (parseInt("" + this.fly / 10)) { // 神兽飞升 
			case 1:
				data.hp += 60;
				break;
			case 2:
				data.mp += 60;
				break;
			case 3:
				data.atk += 60;
				break;
			case 4:
				data.spd += 60;
				break;
		}
		data.rate += this.getRateAdd();
		data.maxrate = this.getMaxRate(); // 元气丹可以影响最大成长率 
		if (data.rate > data.maxrate) {
			SKLogger.debug(`${data.rate},${data.maxrate}`);
		}
		this.owner.send('s2c_wash_petproperty', data);
	}

	/*
	 * 保存洗练属性
	 */
	saveProperty() {
		if (!this.owner) {
			return;
		}
		if (this.wash_property) {
			this.rate = this.wash_property.rate;
			this.basehp = this.wash_property.hp;
			this.basemp = this.wash_property.mp;
			this.basespd = this.wash_property.spd;
			this.baseatk = this.wash_property.atk;
			this.calculateAttribute();
			this.owner.send('s2c_update_pet', {
				info: this.toObj()
			});
			let ret_data = {
				errcode: MsgCode.SUCCESS,
				petid: this.petid,
				rate: this.getCurRate(),
				maxrate: this.getMaxRate(),
				hp: this.getBaseProperty('hp'),
				mp: this.getBaseProperty('mp'),
				spd: this.getBaseProperty('spd'),
				atk: this.getBaseProperty('atk'),
			};
			this.owner.send('s2c_save_petproperty', ret_data);
			this.wash_property = null;
			this.save(false,"宠物保存洗练属性");
		}
	}

	//使用龙骨
	useLongGu() {
		if (this.longgu < PetMgr.shared.getMaxLongGu(this.relive)) {
			this.longgu += 1;
			this.calculateAttribute();
			if (this.owner) {
				this.owner.send('s2c_update_pet', {
					info: this.toObj()
				});
			}
			this.save(false,"宠物使用龙骨");
			return true;
		}
		return false;
	}

	toSaveObj(): any {
		let result: any = {};
		result.petid = this.petid;
		result.roleid = this.owner.roleid;
		result.name = this.name;
		result.dataid = this.dataid;
		result.relive = this.relive;
		result.level = this.level;
		result.resid = this.resid;
		result.color = this.petColorTransformDB(this.color);
		result.grade = this.grade;
		result.fly = this.fly;
		result.qinmi = this.qinmi;
		result.locks = this.lock;
		result.shenskill = this.shenskill;
		result.skill = SKDataUtil.toJson(this.skill_list);
		result.ppoint = SKDataUtil.toJson(this.ppoint);
		result.dpoint = SKDataUtil.toJson(this.dpoint);
		result.rate = this.rate;
		result.hp = this.basehp;
		result.mp = this.basemp;
		result.atk = this.baseatk;
		result.spd = this.basespd;
		result.wuxing = SKDataUtil.toJson(this.wuxing);
		result.exp = this.exp;
		result.xexp = this.xexp;
		result.xlevel = this.xlevel;
		result.longgu = this.longgu;
		result.control = this.control;
		return result;
	}

	addExp(exp: any): boolean {
		if (exp == 0) {
			return false;
		}
		let maxlevel = ExpUtil.getSummonMaxGrade(this.relive);
		let plevel = this.owner == null ? 0 : this.owner.level;
		let prelive = this.owner == null ? 0 : this.owner.relive;
		if (this.relive >= prelive) {
			maxlevel = Math.min(maxlevel, plevel + 10);
		}
		let upexp = ExpUtil.getSummonUpGradeExp(this.relive, this.level);
		if (this.level >= maxlevel && this.exp >= upexp) { //超过本次转生的最大等级
			return false;
		}
		this.exp += exp;
		let isleavelup = false;
		while (this.exp >= upexp) {
			this.exp -= upexp;
			this.level++;
			if (this.level > maxlevel) {
				this.level = maxlevel;
				this.exp = ExpUtil.getSummonUpGradeExp(this.relive, this.level);
				break;
			}
			isleavelup = true;
			upexp = ExpUtil.getSummonUpGradeExp(this.relive, this.level);
		}
		if (isleavelup) {
			this.owner.send('s2c_notice', {
				strRichText: `您的召唤兽${this.name}等级升到了${this.level}级！`
			});
		}
		this.calculateAttribute();
		if (this.owner) {
			this.owner.send('s2c_update_pet', {
				info: this.toObj()
			});
		}
		this.owner.send('s2c_notice', {
			strRichText: `获得  ${exp} 宠物经验`
		});
		this.save(true,"宠物增加经验");
		return true;
	}

	getSkillNum() {
		return Object.keys(this.skill_list).length;
	}

	//学习技能
	learnSkill(skillid: any) {
		let skilldata: SkillBase = SkillUtil.getSkill(skillid);
		if (skilldata == null) {
			return false;
		}
		if (this.skill_list[skillid] != null) {
			return false;
		}
		let skillnum = this.getSkillNum();
		if (skillnum >= this.maxskillcnt) {
			this.send('s2c_notice', {
				strRichText: `宠物技能已满`
			});
			return false;
		}
		if(skillnum >= this.lock){
			this.send('s2c_notice', {
				strRichText: `请先解锁新的技能格。`
			});
			return false;
		}
		if (skilldata.kind != 0) {
			for (const sid in this.skill_list) {
				let tmpsinfo = SkillUtil.getSkill(sid);
				if (tmpsinfo.kind == skilldata.kind) {
					if (tmpsinfo.quality > skilldata.quality) {
						return false;
					}
					delete this.skill_list[sid];
				}
			}
		}
		// 遗忘上一个技能
		let forget_str = '';
		let lastskillinfo = null;
		let tmp = 0;
		for (const skillid in this.skill_list) {
			const skillinfo = this.skill_list[skillid];
			if (skillinfo.idx > tmp && skillinfo.lck == 0) {
				lastskillinfo = skillinfo;
				lastskillinfo.skillid = skillid;
				tmp = skillinfo.idx;
			}
		}
		if (lastskillinfo && lastskillinfo.lck == 0) {
			if (skillnum > 1 || skilldata.skill_id == 0 || lastskillinfo.skillid != skilldata.skill_id) {
				let onerand = 10000 / (this.maxskillcnt - 1);
				let rand = GameUtil.random(0, 10000);
				if (rand < onerand * tmp) {
					delete this.skill_list[lastskillinfo.skillid];
					skillnum--;
					let lastskilldata = SkillUtil.getSkill(lastskillinfo.skillid);
					if (lastskilldata) {
						forget_str = `, 遗忘了 ${lastskilldata.skill_name} 技能`;
					} else {
						forget_str = `, 遗忘了技能`;
					}
				}
			}
		}
		this.skill_list[skillid] = {
			idx: skillnum,
			lck: 0
		};
		this.calculateAttribute();
		let str = `${this.name}习得 ${skilldata.skill_name}` + forget_str;
		this.send('s2c_notice', {
			strRichText: str,
		});
		this.send('s2c_update_pet', {
			info: this.toObj()
		});
		if (this.owner) {
			SKLogger.debug(`玩家[${this.owner.roleid}:${this.owner.name}]的召唤兽[${this.petid}:${this.name}]习得${skilldata.skill_name}` + forget_str);
		}
		this.save(false,"宠物学习技能");
		return true;
	}

	getLockedSkillNum() {
		let n = 0;
		for (const skillid in this.skill_list) {
			if (this.skill_list.hasOwnProperty(skillid)) {
				const skillinfo = this.skill_list[skillid];
				if (skillinfo.lck == 1) {
					n++;
				}
			}
		}
		return n;
	}

	//遗忘技能
	forgetSkill(skillid: any) {
		delete this.skill_list[skillid];
		let skillinfo = SkillUtil.getSkill(skillid);
		this.calculateAttribute();
		let str = `玩家[${this.owner.name}(${this.owner.roleid})]的召唤兽[${this.name}(${this.petid})]遗忘了`;
		if (skillinfo) {
			str += `${skillinfo.skill_name}`;
			this.send('s2c_notice', {
				strRichText: `你的召唤兽 ${this.name} 遗忘了 ${skillinfo.skill_name}`,
			});
		}
		str += `(${skillid})`;
		SKLogger.debug(str);
		this.send('s2c_update_pet', {
			info: this.toObj()
		});
		this.save(false,"宠物遗忘技能");
	}

	//锁定技能
	lockSkill(skillid: any) {
		let skillinfo = this.skill_list[skillid];
		if (skillinfo && skillinfo.lck == 0) {
			skillinfo.lck = 1;
			this.send('s2c_update_pet', {
				info: this.toObj()
			});
			this.save(false,"宠物锁定技能");
			return true;
		}
		return false;
	}

	//改名
	changeName(name: string){
		this.name = name;
		this.send('s2c_update_pet', {
			info: this.toObj()
		});
		this.save(false,"宠物改名");
	}


	//变更神兽技能
	changeShenShouSkill(skillid: any) {
		this.shenskill = skillid;
		this.calculateAttribute();
		this.save(false,"宠物变更神兽技能");
	}

	send(event: any, data: any) {
		if (this.owner) {
			this.owner.send(event, data);
		}
	}

	/*
	 * 宠物颜色储存转换
	 */
	petColorTransformDB(color: any) {
		if (!SKDataUtil.isNumber(color)) {
			SKLogger.warn(`玩家[${this.owner.roleid}:${this.owner.name}]召唤兽[${this.name}]颜色异常:${color}`)
			return -1;
		}
		if (isNaN(color)) {
			SKLogger.warn(`玩家[${this.owner.roleid}:${this.owner.name}]召唤兽[${this.name}]颜色异常:${color}`)
			return -1;
		}
		if (color > 700) {
			return color;
		}
		return color + 2000;
	}

	/*
	 * 正常使用的颜色
	 */
	petColorTransformCom(color: any) {
		if (!SKDataUtil.isNumber(color)) {
			color = -1;
		} else if (isNaN(color)) {
			color = -1;
		}
		if (color > 700) {
			return color - 2000;
		}
		return color;
	}

	/*
	 * 宠物增加亲密值
	 * @param qinmi 增加的亲密值
	 */
	addqinmi(qinmi: number) {
		if (this.qinmi < 2e9) {
			SKLogger.debug(`召唤兽[${this.name}]亲密度${this.qinmi}+${qinmi}`);
			this.qinmi += qinmi;
			this.calculateAttribute();
			this.owner.send('s2c_update_pet', {
				info: this.toObj()
			});
			this.save(true,"宠物增加亲密度");
			return true;
		}
		return false;
	}

	getMaxRate() {
		let maxrate = PetMgr.shared.getMaxRate(this.dataid) + this.getRateAdd(); // 元气丹可以影响最大成长率 
		return maxrate;
	}

	// 成长增量 0.612 + 0.01 * 12 + 0.1 * 3 + 1 = 
	getRateAdd(): number {
		let yqrate = GoodsMgr.shared.getPetUseYuanqiRate(this.dataid);
		yqrate = this.color == -1 ? 0 : yqrate;
		let addrate = this.relive * 1000 + this.longgu * 100 + yqrate * 10000;
		addrate += (this.fly % 10 >= 1) ? 1000 : 0;
		addrate += (this.fly % 10 >= 2) ? 500 : 0;
		return addrate;
	}

	getCurRate(): number {
		let rate = this.rate + this.getRateAdd(); // 成长率，服务器计算 
		return rate;
	}

	/*
	 * 飞升增加属性
	 */
	flyingUp(type: any) {
		if (this.grade < 3 || !this.owner) {
			return;
		}
		if (this.level >= 50 && this.relive >= 0 && this.fly % 10 == 0) { // 第一次飞升 
			++this.fly;
			type = 0;
			this.owner.send('s2c_notice', { strRichText: '第一次飞升成功！' });
		}
		else if (this.level >= 100 && this.relive >= 1 && this.fly % 10 == 1) { // 第二次飞升 
			++this.fly;
			type = 0;
			this.owner.send('s2c_notice', { strRichText: '第二次飞升成功！' });
		}
		else if (this.level >= 120 && this.relive >= 2 && this.fly % 10 == 2) { // 第三次飞升 
			if (this.owner.money < 5000000) {
				this.owner.send('s2c_notice', { strRichText: '银两不足' });
				return;
			}
			this.owner.send('s2c_notice', { strRichText: '第三次飞升成功！' });
			++this.fly;
		}
		else if (this.level >= 120 && this.relive >= 2 && this.fly % 10 == 3) { // 不是修改属性 
			if (this.owner.money < 5000000) {
				this.owner.send('s2c_notice', { strRichText: '银两不足' });
				return;
			}
			this.owner.send('s2c_notice', { strRichText: '修改属性成功！' });
		}
		else {
			return;
		}
		if (this.fly % 10 == 3 && type != 0 && type != parseInt("" + this.fly / 10)) {
			this.owner.addMoney(0, -5000000, '宠物进行飞升');
		}
		this.fly = type * 10 + this.fly % 10;
		this.calculateAttribute();
		this.owner.send('s2c_update_pet', {
			info: this.toObj()
		});
		this.save(false,"宠物飞升");
	}

	/*
	 * 获取基础属性
	 */
	getBaseProperty(type: any) {
		let fly_property = parseInt("" + this.fly / 10);
		let ret = 0;
		if (type == 1 || type == 'hp') {
			ret = this.basehp + ((fly_property == 1) ? 60 : 0);
		}
		else if (type == 2 || type == 'mp') {
			ret = this.basemp + ((fly_property == 2) ? 60 : 0);
		}
		else if (type == 3 || type == 'atk') {
			ret = this.baseatk + ((fly_property == 3) ? 60 : 0);
		}
		else if (type == 4 || type == 'spd') {
			ret = this.basespd + ((fly_property == 4) ? 60 : 0);
		}
		return ret;
	}

	/**
	 * 存档
	 * @param sleep 是否延迟存档
	 * @param source 存档原因
	 */
	save(sleep: boolean = false, source = ''){
		let self = this;
		if(sleep){
			//延迟5s存档
			if(this.times != 0){
				SKTimeUtil.cancelDelay(this.times);
				this.times = 0;
			}
			this.times = SKTimeUtil.delay(()=>{
				self.save(false,source);
			},5 * 1000);
			return;
		}
		DB.savePet(self,(code,msg)=>{
			if(code == MsgCode.SUCCESS){
				SKLogger.debug(`${source}`);
			}
		});
	}
}
