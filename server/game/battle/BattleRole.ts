import GameUtil from "../core/GameUtil";
import PlayerMgr from "../object/PlayerMgr";
import Player from "../object/Player";
import BattleObj from "../object/BattleObj";
import Pet from "../object/Pet";
import Partner from "../object/Partner";
import Monster from "../core/Monster";
import Buff from "../skill/core/Buff";
import SkillUtil from '../skill/core/SkillUtil';
import SKDataUtil from "../../gear/SKDataUtil";
import ExpUtil from "../core/ExpUtil";
import SKLogger from "../../gear/SKLogger";
import ChargeSum from "../core/ChargeSum";
import BattleMgr from "./BattleMgr";
import { EAttrTypeL1, ELiveingType, EMagicType, ESkillType, ESubType } from "../role/EEnum";
import Battle from "./Battle";

export default class BattleRole {
	onlyid: number;
	online_state: number;
	battle_id: number;
	dataid: number;
	name: string;
	resid: number;
	level: number;
	relive: number;
	pos: number;
	owner: any;
	own_onlyid: number;
	qinmi: number;
	bindid: number;
	living_type: number;
	team_id: number;
	isact: boolean;
	isroundact: boolean;
	isdead: boolean;
	beCache: boolean;
	act: any;
	roleattr: any;
	last_skill: any;
	def_skill_times: any;
	skill_list: any;
	buff_list: Buff[];
	is_bb: boolean;
	color: any;
	color1: any;
	color2: any;
	// 自己的原型
	source: any;
	// 用过的技能 限制技能
	used_skill: any; // skillid: times
	ownid: any;
	weapon: any;
	wingId: number;
	chargesum: number;
	bianshen: boolean;
	nextBianshen: number;
	skins:any;
	childres: number;
	childname: string;

	constructor() {
		this.onlyid = 0;
		this.online_state = 1;
		this.battle_id = 0;
		this.dataid = 0;
		this.name = '';
		this.resid = 0;
		this.level = 0;
		this.relive = 0;
		this.pos = 0; // -1 不可登场 0 等待登场 >0 战场所在位置
		this.owner = null;
		this.own_onlyid = 0;
		this.qinmi = 0;// 如果是宠物 亲密值
		this.bindid = 0; // 关系id 宠物对应主人，主人对应上场宠物
		this.living_type = GameUtil.livingType.Unknow;
		this.team_id = 0; // 1 or 2
		this.isact = false; // 是否 得到了玩家行动指令
		this.isroundact = false; // 在一回合内是否行动过
		this.isdead = false;
		this.beCache = false;
		this.act = {
			acttype: 0, //1伤害 2治疗 3buff
			skill: 0,
			target: 0,
			actionid: 0,
			action: 0, // 1技能 2道具 3召唤
		};
		this.roleattr = {};
		this.last_skill = 0;
		this.def_skill_times = 0;
		this.skill_list = {};
		this.buff_list = [];
		this.is_bb = false;
		this.color = -1;
		this.color1 = 0;
		this.color2 = 0;
		// 自己的原型
		this.source = null;
		// 用过的技能 限制技能
		this.used_skill = {}; // skillid: times
		this.wingId = 0;
		this.chargesum = 0;
		this.nextBianshen = 0;
		this.skins = [0,0,0,0,0,0];
		this.childres = 0;
		this.childname = '';
	}

	init() {
		this.isact = false;
		this.isroundact = false; // 在一回合内是否行动过
		this.act = {
			acttype: 0, //1伤害 2治疗 3buff
			skill: 0,
			target: 0,
			actionid: 0,
			action: 0, // 1技能 2道具 3召唤
		};
	}
	// 设置角色
	setObj(obj: BattleObj) {
		if (obj.onlyid == 10363) {
			console.log(`?`);
		}
		this.roleattr = obj.getBtlAttr();
		this.onlyid = obj.onlyid;
		let skilllist = obj.getSkillList();
		let slist: any = {};
		for (let key in skilllist) {
			let p = skilllist[key];
			let sid = SKDataUtil.toNumber(key);
			if (sid == ESkillType.FeiLongZaiTian) {
				slist[ESkillType.FeiLongZaiTian_Feng] = { skillid: ESkillType.FeiLongZaiTian_Feng, profic: p, canuse: true, cooldown: 0, };
				slist[ESkillType.FeiLongZaiTian_Huo] = { skillid: ESkillType.FeiLongZaiTian_Huo, profic: p, canuse: true, cooldown: 0, };
				slist[ESkillType.FeiLongZaiTian_Shui] = { skillid: ESkillType.FeiLongZaiTian_Shui, profic: p, canuse: true, cooldown: 0, };
				slist[ESkillType.FeiLongZaiTian_Lei] = { skillid: ESkillType.FeiLongZaiTian_Lei, profic: p, canuse: true, cooldown: 0, };
				continue;
			}
			if (sid == ESkillType.YouFengLaiYi) {
				slist[ESkillType.YouFengLaiYi_Jin] = { skillid: ESkillType.YouFengLaiYi_Jin, profic: p, canuse: true, cooldown: 0, };
				slist[ESkillType.YouFengLaiYi_Mu] = { skillid: ESkillType.YouFengLaiYi_Mu, profic: p, canuse: true, cooldown: 0, };
				slist[ESkillType.YouFengLaiYi_Shui] = { skillid: ESkillType.YouFengLaiYi_Shui, profic: p, canuse: true, cooldown: 0, };
				slist[ESkillType.YouFengLaiYi_Huo] = { skillid: ESkillType.YouFengLaiYi_Huo, profic: p, canuse: true, cooldown: 0, };
				slist[ESkillType.YouFengLaiYi_Tu] = { skillid: ESkillType.YouFengLaiYi_Tu, profic: p, canuse: true, cooldown: 0, };
				continue;
			}
			slist[sid] = {
				skillid: sid,
				profic: p,
				canuse: true,
				cooldown: 0,
			};
		}
		let pet: Pet = null;
		let player: Player = null;
		let partner: Partner = null;
		let monster: Monster = null;
		if (obj instanceof Pet) {
			pet = <Pet>obj;
		} else if (obj instanceof Player) {
			player = <Player>obj;
		} else if (obj instanceof Partner) {
			partner = <Partner>obj;
		} else if (obj instanceof Monster) {
			monster = <Monster>obj;
		} else {
			console.error(`?`);
		}
		if (pet != null) {
			if (pet.shenskill != 0) {
				slist[pet.shenskill] = {
					skillid: pet.shenskill,
					profic: 0,
					canuse: true,
					cooldown: 0,
				};
			}
		}
		this.skill_list = slist;
		this.resid = obj.resid;
		this.name = obj.name;
		this.level = obj.level;
		this.relive = obj.relive;
		this.skins = obj.skins && obj.skins.use;
		this.childres = obj.childres;
		this.childname = obj.childname;

		this.living_type = obj.living_type;
		if (pet != null) {
			if (pet.owner) {
				this.ownid = pet.owner.roleid;
				this.own_onlyid = pet.owner.onlyid;
				if (pet.owner.offline) {
					this.online_state = 0;
				}
			}
			this.qinmi = pet.qinmi || 0;
		}
		if (player != null) {
			if (player.offline) {
				this.online_state = 0;
			}
		}
		this.last_skill = obj.default_btl_skill;
		this.weapon = '';
		if (player != null) {
			if (player.currentEquips) {
				for (let equip of player.currentEquips) {
					if (equip.EIndex == 1) {
						let equipobj: any = {};
						equipobj.equipid = equip.EquipID;
						equipobj.gemcnt = equip.GemCnt;
						equipobj.type = equip.EquipType;
						equipobj.level = equip.Grade;
						this.weapon = SKDataUtil.toJson(equipobj);
						break;
					}
				}
			}
		}
		this.dataid = obj.dataid;
		if (pet != null && typeof (pet.color) == 'number') { // 宠物变色 
			this.color = pet.color;
		}
		if (player != null && player.color1 == 'number') { // 人物染色1 
			this.color1 = player.color1;
		}
		if (player != null && player.color2 == 'number') { // 人物染色2 
			this.color2 = player.color2;
		}
		this.source = obj;
		if (player != null) {
			this.wingId = player.wingId;
			this.chargesum = ChargeSum.shared.getPlayerChargeSum(player.roleid);
		} else {
			this.wingId = 0;
		}
	}

	isDragon(){
		let list = [1101, 1102, 1111, 1112, 1131, 1132];
		return list.indexOf(Number(this.resid)) > -1
	}

	isNpc() {
		return this.living_type == GameUtil.livingType.NPC;
	}

	isPlayer() {
		return this.living_type == GameUtil.livingType.Player;
	}

	isMonster() {
		return this.living_type == ELiveingType.MONSTER;
	}

	isPet() {
		return this.living_type == GameUtil.livingType.Pet;
	}

	isPartner() {
		return this.living_type == GameUtil.livingType.Partner;
	}

	addLimitSkill(skillid: any) {
		if (this.used_skill[skillid] == null) {
			this.used_skill[skillid] = 0;
		}
		this.used_skill[skillid]++;
	}

	getData(): any {
		let skilllist = [];
		if (this.living_type == GameUtil.livingType.Pet) {
			for (let skillid in this.skill_list) {
				let sinfo = this.skill_list[skillid];
				skilllist.push(sinfo.skillid);
			}
		}
		let result = {
			onlyid: this.onlyid,
			resid: this.resid,
			name: this.name,
			maxhp: this.getMaxHp(),
			maxmp: this.getMaxMp(),
			hp: this.getHP(),
			mp: this.getMP(),
			pos: this.pos,
			type: this.living_type,
			ownonlyid: this.own_onlyid,
			weapon: this.weapon,
			relive: this.relive,
			skilllist: skilllist,
			isbb: this.is_bb,
			level: this.level,
			isfight: this.pos != 0 ? 1 : 0,
			color: this.color,
			color1: this.color1,
			color2: this.color2,
			wingId: this.wingId,
			chargesum: this.chargesum,
			skins: this.skins,
			childname: this.childname,
			childres: this.childres,
		};
		return result;
	}

	getHP(): number {
		return this.roleattr[EAttrTypeL1.HP];
	}

	getMP(): number {
		return this.roleattr[EAttrTypeL1.MP];
	}

	getMaxHp(): number {
		return this.roleattr[EAttrTypeL1.HP_MAX] + this.getBuffAttr(EAttrTypeL1.HP_MAX);
	}

	getMaxMp(): number {
		return this.roleattr[EAttrTypeL1.MP_MAX] + this.getBuffAttr(EAttrTypeL1.MP_MAX);
	}

	clean() {
	}

	getSubName(type: ESubType): string {
		if (type == ESubType.SKILL) {
			return "技能";
		}
		if (type == ESubType.BUFFER) {
			return "BUFFER"
		}
		if (type == ESubType.MUL) {
			return "相乘"
		}
		if (type == ESubType.XUAN_REN) {
			return "悬刃";
		}
		if (type == ESubType.YI_HUAN) {
			return "遗患";
		}
		if (type == ESubType.ADD) {
			return "治疗";
		}
		if (type == ESubType.SUB) {
			return "减少";
		}
		if (type == ESubType.PERCENT) {
			return "百分比";
		}
		return "未知"
	}
	// 减血
	subHP(hp: number, type: ESubType = ESubType.SKILL) {
		let currentHP = this.roleattr[EAttrTypeL1.HP];
		let maxHP = this.roleattr[EAttrTypeL1.HP_MAX];
		SKLogger.debug(`[${this.onlyid}:${this.name}]${this.getSubName(type)}减血:${hp}[${currentHP}/${maxHP}]`);
		this.roleattr[EAttrTypeL1.HP] = currentHP + hp;
		if (this.roleattr[EAttrTypeL1.HP] > maxHP) {
			this.roleattr[EAttrTypeL1.HP] = maxHP;
		}
		if (this.roleattr[EAttrTypeL1.HP] <= 0) {
			this.roleattr[EAttrTypeL1.HP] = 0;
			this.dead();
		} else {
			this.isdead = false;
		}
	}
	// 减蓝
	subMP(mp: number, type: ESubType = ESubType.SKILL) {
		if (this.isMonster() || this.isPartner()) {
			return;
		}
		let currentMP = this.roleattr[EAttrTypeL1.MP];
		let maxMP = this.roleattr[EAttrTypeL1.MP_MAX];
		SKLogger.debug(`[${this.onlyid}:${this.name}]${this.getSubName(type)}减蓝:${mp}[${currentMP}/${maxMP}]${this.living_type}`);
		this.roleattr[EAttrTypeL1.MP] = currentMP + mp;
		if (this.roleattr[EAttrTypeL1.MP] > this.roleattr[EAttrTypeL1.MP_MAX]) {
			this.roleattr[EAttrTypeL1.MP] = this.roleattr[EAttrTypeL1.MP_MAX];
		}
	}

	getHpPre() {
		return this.getHP() / this.getMaxHp();
	}

	getMpPre() {
		return this.getMP() / this.getMaxMp();
	}

	getBuffAttr(attrtype: EAttrTypeL1): number {
		let attr = 0;
		for (let buff of this.buff_list) {
			attr += buff.getAttr(attrtype);
		}
		return attr;
	}

	isDead(): boolean {
		return this.isdead;
	}

	dead() {
		if (this.isdead) {
			return;
		}
		this.isdead = true;
		SKLogger.debug(`[${this.onlyid}:${this.name}]死亡`);
	}

	getAttr(type: any): number {
		type = SKDataUtil.toNumber(type);
		let num = this.roleattr[type];
		let add = this.getBuffAttr(type);
		// BUFF速度加成为百分比
		if (type == EAttrTypeL1.SPD) {
			if (add != 0) {
				num *= (1 + add / 100);
			}
		} else {
			num += add;
		}
		// 计算对应的百分比加成
		let list = GameUtil.attrToBtlAttr[type];
		if (list != null) {
			for (let item of list) {
				let value = this.roleattr[item];
				if (GameUtil.equipTypeNumerical[item] == null) {
					num = num + value;
				} else {
					num = (1 + value) * num;
				}
			}
		}
		return num || 0;
	}

	setAttr(attrtype: any, num: any) {
		this.roleattr[attrtype] = num;
	}

	getPoFangPre(): number {
		return 1;
	}

	getPoFang(): any {
		let r = GameUtil.random(0, 10000);
		let pflv = this.getAttr(EAttrTypeL1.PHY_BREAK_PROB);
		if (r > pflv * 100) {
			return 0;
		}
		return this.getAttr(EAttrTypeL1.PHY_BREAK);
	}
	// 获得连击
	getCombo(): number {
		let num = 0;
		let lv = this.getAttr(EAttrTypeL1.PHY_COMBO_PROB);
		let r = GameUtil.random(0, 10000);
		if (r > lv * 100) {
			return num;
		}
		let max = this.getAttr(EAttrTypeL1.PHY_COMBO);
		r = GameUtil.random(0, 10000);
		num = Math.ceil(r / (10000 / max));
		return num;
	}

	getKangWuLi(): any {
		return this.getAttr(EAttrTypeL1.K_PHY_GET);
	}
	// 获得狂暴率
	getKuangBaoPre(skilltype: number): number {
		let ret = 0;
		if (skilltype == EMagicType.PHYSICS) {
			ret = this.getAttr(EAttrTypeL1.PHY_DEADLY);
		} else if (skilltype == EMagicType.Fire) {
			ret = this.getAttr(EAttrTypeL1.KB_FIRE);
		} else if (skilltype == EMagicType.Water) {
			ret = this.getAttr(EAttrTypeL1.KB_WATER);
		} else if (skilltype == EMagicType.Wind) {
			ret = this.getAttr(EAttrTypeL1.KB_WIND);
		} else if (skilltype == EMagicType.Thunder) {
			ret = this.getAttr(EAttrTypeL1.KB_THUNDER);
		} else if (skilltype == EMagicType.ThreeCorpse) {
			ret = this.getAttr(EAttrTypeL1.KB_BLOODRETURN);
		} else if (skilltype == EMagicType.GhostFire) {
			ret = this.getAttr(EAttrTypeL1.KB_WILDFIRE);
		} else if (skilltype == EMagicType.HengSao) {
			ret = this.getAttr(EAttrTypeL1.KB_HENGSAO);
			if(this.hasBuff(EMagicType.BianShen))
			{ret *= 1.3;}
		} else if (skilltype == EMagicType.ZhenJi) {
			ret = this.getAttr(EAttrTypeL1.KB_ZHENJI);
			if(this.hasBuff(EMagicType.BianShen))
			{ret *= 1.3;}
		} else if (skilltype == EMagicType.PoJia) {
			ret = this.getAttr(EAttrTypeL1.KB_POJIA);
			if(this.hasBuff(EMagicType.BianShen))
			{ret *= 1.3;}
		}

		return ret;
	}

	getKuangBaoStr(skilltype: any): any {
		let ret = 0;
		if (skilltype == EMagicType.PHYSICS) {
			ret = 50;
		} else if (skilltype == EMagicType.Fire) {
			ret = this.getAttr(EAttrTypeL1.Q_FIRE);
		} else if (skilltype == EMagicType.Water) {
			ret = this.getAttr(EAttrTypeL1.Q_WATER);
		} else if (skilltype == EMagicType.Wind) {
			ret = this.getAttr(EAttrTypeL1.Q_WIND);
		} else if (skilltype == EMagicType.Thunder) {
			ret = this.getAttr(EAttrTypeL1.Q_THUNDER);
		} else if (skilltype == EMagicType.ThreeCorpse) {
			ret = this.getAttr(EAttrTypeL1.Q_BLOODRETURN);
		} else if (skilltype == EMagicType.GhostFire) {
			ret = this.getAttr(EAttrTypeL1.Q_WILDFIRE);
		}
		return ret;
	}
	//获取攻击对象
	getTager(): BattleRole{
		let target_id = this.act.target;
		if(!target_id) 
			return null;
		let battle = this.getBattle();
		return battle ? battle.plist[target_id] : null;
	}
	//获取战斗场景
	getBattle():Battle{
		return BattleMgr.shared.getBattle(this.battle_id)
	}

	// 分花拂柳
	fenhua() {
		if (this.hasPassiveSkill(ESkillType.FenHuaFuLiu) == false) {
			return false;
		}
		let fenhuafuliu = SkillUtil.getSkill(ESkillType.FenHuaFuLiu);
		let params = {
			level: this.level,
			relive: this.relive,
			qinmi: this.qinmi
		};
		let rate = fenhuafuliu.getEffect(params);
		let r = GameUtil.random(0, 10000);
		// rate = 100;
		return r <= rate * 100;
	}

	fenLie() {
		let fenlie = null;
		if (this.hasPassiveSkill(ESkillType.FenLieGongJi)) {
			fenlie = SkillUtil.getSkill(ESkillType.FenLieGongJi);
		}
		if (this.hasPassiveSkill(ESkillType.HighFenLieGongJi)) {
			fenlie = SkillUtil.getSkill(ESkillType.HighFenLieGongJi);
		}
		if (fenlie == null) {
			return false;
		}
		let rate = fenlie.getEffect();
		// rate = 100;
		let r = GameUtil.random(0, 10000);
		return r <= rate * 100;
	}

	geShan() {
		let geshan = null;
		let rate = 0;
		// 隔山打牛
		if (this.hasPassiveSkill(ESkillType.GeShanDaNiu)) {
			geshan = SkillUtil.getSkill(ESkillType.GeShanDaNiu);
			rate = 25;
		}
		// 高级隔山打牛
		if (this.hasPassiveSkill(ESkillType.HighGeShanDaNiu)) {
			geshan = SkillUtil.getSkill(ESkillType.HighGeShanDaNiu);
			rate = 35;
		}
		if (geshan == null) {
			return 0;
		}
		// let rate = fenlie.getPetEffect();
		// rate = 100;
		let r = GameUtil.random(0, 10000);
		if (r > rate * 100) {
			return 0
		}
		let params = {
			level: this.level,
			relive: this.relive,
			qinmi: this.qinmi,
			atk: this.getAttr(EAttrTypeL1.ATK)
		}
		let geshannum = geshan.getEffect(params);
		return geshannum;
	}

	shanXian() {
		// return true;
		let shan_xian_rate = 0;
		let shanxian = null;
		if (this.pos == -1) {
			return 1;
		}
		if (this.hasPassiveSkill(ESkillType.ShanXian)) {
			shanxian = SkillUtil.getSkill(ESkillType.ShanXian);
		}
		if (this.hasPassiveSkill(ESkillType.HighShanXian)) {
			shanxian = SkillUtil.getSkill(ESkillType.HighShanXian);
		}
		if (shanxian == null) {
			return 1;//
		}
		shan_xian_rate = shanxian.getEffect();
		if (shan_xian_rate == 0) {
			return 2;
		}
		let r = GameUtil.random(0, 10000);
		if (r > (shan_xian_rate * 100)) {
			return 2
		}
		return 0;
	}
	// 加入Buff
	addBuff(buff: Buff) {
		let buffindex = -1;
		let alleq = true;
		if (this.hasBuff(EMagicType.Seal)) {
			return;
		}
		if (buff.effecttype == EMagicType.Seal) {
			this.buff_list = [];
			this.buff_list.push(buff);
			return;
		}
		if (buff.effecttype == EMagicType.Forget) {
			let keys = Object.keys(this.skill_list);
			let r = GameUtil.random(0, keys.length - 1);
			let skillid = keys[r];
			if (this.skill_list[skillid]) {
				this.skill_list[skillid].canuse = false;
			}
		}
		let wuxing = [
			ESkillType.ChuiJinZhuanYu, ESkillType.KuMuFengChun, ESkillType.RuRenYinShui,
			ESkillType.FengHuoLiaoYuan, ESkillType.XiTianJingTu,
			ESkillType.YouFengLaiYi_Jin, ESkillType.YouFengLaiYi_Mu, ESkillType.YouFengLaiYi_Shui,
			ESkillType.YouFengLaiYi_Huo, ESkillType.YouFengLaiYi_Tu,
		];
		if (wuxing.indexOf(buff.skill_id) != -1) {
			for (let index = this.buff_list.length - 1; index >= 0; index--) {
				const cbuff = this.buff_list[index];
				if (wuxing.indexOf(cbuff.skill_id) != -1) {
					this.removeBuff(cbuff.buff_id);
				}
			}
		}
		if (SkillUtil.isControlSkill(buff.skill_id)) {
			for (let index = this.buff_list.length - 1; index >= 0; index--) {
				const cbuff = this.buff_list[index];
				if (SkillUtil.isControlSkill(cbuff.skill_id)) {
					this.removeBuff(cbuff.buff_id);
				}
			}
		}
		for (let index = 0; index < this.buff_list.length; index++) {
			const cbuff = this.buff_list[index];
			if (cbuff.skill_id == buff.skill_id) {
				buffindex = index;
				for (const key in cbuff.effects) {
					if (cbuff.effects.hasOwnProperty(key)) {
						const effect = cbuff.effects[key];
						if (buff.effects[key] > effect) {
							this.removeBuff(cbuff.buff_id);
							this.buff_list.push(buff);
							return;
						}
						if (buff.effects[key] != effect) {
							alleq = false;
						}
					}
				}
			}
		}
		if (buffindex == -1) {
			this.buff_list.push(buff);
		}
		if (buffindex != -1 && alleq) {
			this.buff_list[buffindex].cur_round = 0;
		}
	}

	getBuffList() {
		return this.buff_list;
	}

	getBuffsSkillId() {
		let list = [];
		for (const buff of this.buff_list) {
			list.push(buff.skill_id);
		}
		return list;
	}

	removeBuff(buffid: any) {
		for (let i = 0; i < this.buff_list.length; i++) {
			const buff = this.buff_list[i];
			if (buffid == buff.buff_id) {
				if (buff.effecttype == EMagicType.Forget) {
					for (const skillid in this.skill_list) {
						const sinfo = this.skill_list[skillid];
						sinfo.canuse = true;
					}
				}
				this.buff_list.splice(i, 1);
				return;
			}
		}
	}
	// 是否有Buff
	hasBuff(effecttype: any) {
		for (let i = 0; i < this.buff_list.length; i++) {
			let buff = this.buff_list[i];
			if (buff.effecttype == effecttype) {
				return true;
			}
		}
		return false;
	}

	getBuffByEffect(effecttype: any): any {
		for (let i = 0; i < this.buff_list.length; i++) {
			const buff = this.buff_list[i];
			if (buff.effecttype == effecttype) {
				return buff;
			}
		}
		return null;
	}
	// 是否有被动技能
	hasPassiveSkill(skillId: number): boolean {
		let result = SKDataUtil.valueForKey(this.skill_list, skillId);
		if (result == null) {
			return false;
		}
		SKLogger.debug(`战斗:[${this.onlyid}:${this.name}]有被动技能[${SkillUtil.getSkillName(skillId)}]`);
		return true;
	}

	checkReplaceBuffRound(skillid: any, round: any) {
		for (let i = 0; i < this.buff_list.length; i++) {
			const buff = this.buff_list[i];
			if (buff.skill_id == skillid) {
				if (buff.round - buff.cur_round < round) {
					buff.cur_round = 0;
					buff.round = round;
				}
			}
		}
	}

	cleanBuff(effecttype: any) {
		let list = [];
		for (let i = 0; i < this.buff_list.length; i++) {
			const buff = this.buff_list[i];
			let buffskill = SkillUtil.getSkill(buff.skill_id);
			if (buffskill.skill_type == effecttype) {
				list.push(buff.buff_id);
			}
		}
		for (const buffid of list) {
			this.removeBuff(buffid);
		}
	}

	getSkillProfic(skillId: number): number {
		let profic = 0;
		if (skillId == ESkillType.NormalAtkSkill) {
			return profic;
		}
		if (this.isPlayer()) {
			let info = this.skill_list[skillId];
			if (info) {
				profic = info.profic == null ? 0 : info.profic;
			}
		} else if (this.isMonster() || this.isPartner() || this.isPet()) {
			profic = ExpUtil.getMaxSkillLevel(this.relive);
		}
		return profic;
	}

	getSkillInfo(skillid: any): any {
		return this.skill_list[skillid];
	}

	niepan() {
		if (!this.hasPassiveSkill(ESkillType.NiePan)) {
			return false;
		}
		let r = GameUtil.random(0, 10000);
		if (r > 3000) {
			return false;
		}
		this.setAttr(EAttrTypeL1.HP, this.getMaxHp());
		this.setAttr(EAttrTypeL1.MP, this.getMaxMp());
		this.isdead = false;
		this.buff_list = []
		return true;
	}
	//智能出手
	getAiSkill() {
		if (this.isPlayer() || this.isPet()) {
			if (this.last_skill == 0) {
				this.last_skill = ESkillType.NormalAtkSkill;
			}
			return this.last_skill;
		}
		if (this.isPartner() || this.isMonster()) {
			let atk_list = [];
			let def_list = [];
			for (let key in this.skill_list) {
				let skillId = SKDataUtil.toNumber(key);
				if (this.skill_list.hasOwnProperty(skillId)) {
					let sinfo = this.skill_list[skillId];
					if (sinfo.canuse == false || sinfo.cooldown > 0) {
						continue;
					}
					if (SkillUtil.isAtkSkill(skillId)) {
						atk_list.push(skillId);
					}
					if (SkillUtil.isSelfBuffSkill(skillId)) {
						def_list.push(skillId);
					}
					if (SkillUtil.isEnemyBuffSkill(skillId)) {
						atk_list.push(skillId);
					}
				}
			}
			if (def_list.length > 0) {
				if (this.def_skill_times % 3 == 0) {
					this.def_skill_times++;
					let skid: any = def_list[GameUtil.random(0, def_list.length - 1)];
					try {
						skid = parseInt(skid);
					} catch (error) {
						skid = ESkillType.NormalAtkSkill;
					}
					return skid;
				}
				this.def_skill_times++;
			}
			if (atk_list.length > 0) {
				let skid: any = atk_list[GameUtil.random(0, atk_list.length - 1)];
				try {
					skid = parseInt(skid);
				} catch (error) {
					skid = ESkillType.NormalAtkSkill;
				}
				return skid;
			}
			return ESkillType.NormalAtkSkill;
		}
	}

	send(event: any, obj: any) {
		let onlyid = this.onlyid;
		if (this.isPet()) {
			onlyid = this.bindid;
		}
		PlayerMgr.shared.sendToPlayer(onlyid, event, obj);
	}
}
