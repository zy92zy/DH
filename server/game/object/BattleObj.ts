import LivingThing from "./LivingThing";
import SKDataUtil from "../../gear/SKDataUtil";
import GameUtil from "../core/GameUtil";
import { EAttrTypeL1 } from "../role/EEnum";

export default class BattleObj extends LivingThing {
	dataid: number;
	hp: number;
	mp: number;
	maxhp: number;
	maxmp: number;
	exp: number;
	maxexp: number;
	level: number;
	relive: number;
	atk: number;
	spd: number;
	attr1: {[key:string]:number};
	addattr1: any;
	addattr2: any;
	qianneng: number;
	skill_list: any;
	buff_list: any;
	ownid: number;
	default_btl_skill: number;
	nFuBenID: any;
	bangid: any;
	skins:any = [0,0,0,0,0,0];
	childres:any = 0;
	childname:any = '';

	constructor() {
		super();
		this.dataid = 0;
		// 血 蓝
		this.hp = 0;
		this.mp = 0;
		this.maxhp = 0;
		this.maxmp = 0;
		// 经验
		this.exp = 0;
		this.maxexp = 0;
		this.level = 0;
		this.relive = 0;//转生
		// 攻击 速度
		this.atk = 0;
		this.spd = 0;
		// 属性
		this.attr1 = {};
		this.addattr1 = {};
		for (let key in EAttrTypeL1) {
			let value = SKDataUtil.toNumber(key);
			if (isNaN(value)) {
				continue;
			}
			this.attr1[value] = 0;
			this.addattr1[value] = 0;
		}
		// 潜能二级属性
		this.addattr2 = {};
		for (let key in EAttrTypeL1) {
			let value = SKDataUtil.toNumber(key);
			if (isNaN(value)) {
				continue;
			}
			this.addattr2[value] = 0;
		}
		// 潜能
		this.qianneng = 0;

		// 技能列表
		this.skill_list = {};
		// buff列表
		this.buff_list = {};
		// 从属关系
		this.ownid = 0;

		// 战斗默认技能
		this.default_btl_skill = 0;
	}

	setAttr1(attrtype: any, num: any) {
		this.attr1[attrtype] = num;
	}

	getAttr1(attrtype: any): any {
		return this.attr1[attrtype];
	}

	setAddAttr2(attrtype: any, num: any) {
		this.addattr2[attrtype] = num;
	}

	getAddAttr2(attrtype: any): any {
		return this.addattr2[attrtype];
	}

	getBtlAttr(): any {
		return SKDataUtil.clone(this.attr1);
	}

	getSkillList(): any {
		return this.skill_list;
	}

	addExp(exp: number) {
		let fexp = this.exp + exp;
		if (this.maxexp > 0) {
			while (fexp >= this.maxexp) {
				fexp -= this.maxexp;
				this.levelUp(fexp < this.maxexp);
			}
		}
		this.exp = fexp;
	}

	setLevel(level: any, issend: any) {
		this.level = level;
	}

	levelUp(issend: any) {
		let nextlevel = this.level + 1;
		this.setLevel(nextlevel, issend);
	}

	calculatePointAttr() {

	}

	calculateEquipAttr() {

	}

	calculateLevel() {

	}

	calculateReliveAttr() {

	}

	calculateXiuAttr() {

	}
	skinBaseAttr(){}
	marryBaseAttr(){}
	baguaBaseAttr(){}
	tianceBaseAttr(){}
	bianshenBaseAttr(){}
	yuanshenBaseAttr(){}

	calculateAttr() {
		GameUtil.clearAllAttr(this.attr1);
		this.calculatePointAttr();
		this.skinBaseAttr();
		this.marryBaseAttr();
		this.yuanshenBaseAttr();
		this.tianceBaseAttr();
		this.baguaBaseAttr();
		this.bianshenBaseAttr();
		this.calculateEquipAttr();
		this.calculateLevel();
		this.calculateReliveAttr();
		this.calculateXiuAttr();
	}
}