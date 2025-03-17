import BattleObj from "../object/BattleObj";
import { EAttrTypeL1 } from "../role/EEnum";
import GameUtil from "./GameUtil";

export default class Monster extends BattleObj {
	pos: any;
	skill_pre: any;
	canCatch: any;
	constructor(mondata: any) {
		super();
		this.dataid = mondata.monsterid;

		this.hp = mondata.hp;
		this.mp = 9999999;
		this.maxhp = mondata.hp;
		this.maxmp = 9999999;

		this.atk = mondata.atk;
		this.name = mondata.name;
		this.resid = mondata.resid;
		this.pos = 0;

		let skilllist = mondata.skill.split(';');
		let skill_list: any = {}
		for (const t of skilllist) {
			if (t.length > 0) {
				skill_list[t] = 0;
			}
		}
		this.skill_list = skill_list;
		this.skill_pre = mondata.proficient;
		this.level = mondata.level;
		this.canCatch = mondata.catch;
		this.spd = mondata.spd;
		GameUtil.clearAllAttr(this.attr1);
		let props: any = GameUtil.attrTypeL1Text;
		for (let key in props) {
			let type = props[key];
			let value = mondata[key];
			if (value == null) {
				value = 0;
			}
			this.attr1[type] = value;
		}
		this.attr1[EAttrTypeL1.ATK] = this.atk;
		this.attr1[EAttrTypeL1.SPD] = this.spd;
		this.attr1[EAttrTypeL1.HP] = this.hp;
		this.attr1[EAttrTypeL1.MP] = this.mp;
		this.attr1[EAttrTypeL1.HP_MAX] = this.hp;
		this.attr1[EAttrTypeL1.MP_MAX] = this.mp;
		this.living_type = GameUtil.livingType.Monster;
	}

	getSkillProfic(skillid: any): any {
		return this.skill_pre;
	}
}