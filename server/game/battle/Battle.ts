import SkillBase from '../skill/core/SkillBase';
import GameUtil from "../core/GameUtil";
import BattleMgr from "./BattleMgr";
import PlayerMgr from "../object/PlayerMgr";
import Buff from "../skill/core/Buff";
import GoodsMgr from "../item/GoodsMgr";
import MonsterMgr from "../core/MonsterMgr";
import SkillUtil from "../skill/core/SkillUtil";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from '../../gear/SKLogger';
import { BattleType, EActNumType, EActType, EAttrTypeL1, EBtlRespone, EMagicType, ESkillType, ESubType } from '../role/EEnum';
import BattleRole from './BattleRole';
import TianceMgr from '../tiance/TianceMgr';

export default class Battle {
	battle_id: any;	//战斗ID
	plist: any;		//所有战斗对象列表
	petlist: any;	//宠物列表
	winteam: any;
	turnList: any[];
	campA: any;
	campB: any;
	timer: any;
	cur_round: number;
	player_can_oper: boolean;
	monster_group_id: number;
	battle_type: any;
	source: number;
	destroyTimer: any;
	linghouInfo: any;
	dieNum: number[] = [];

	constructor(id: any) {
		this.battle_id = id;
		this.plist = {};
		this.petlist = {};
		this.winteam = [];
		this.turnList = [];

		this.campA = {
			effect: {}, // 1 强化悬刃 2 强化遗患
			broles: [],
		}
		this.campB = {
			effect: {}, // 1 强化悬刃 2 强化遗患
			broles: [],
		}
		this.timer = 0;

		this.cur_round = 0;
		this.player_can_oper = false;
		this.monster_group_id = 0;

		this.battle_type = BattleType.Normal;
		this.source = 0; // 战斗来源

		this.destroyTimer = setTimeout(() => {
			BattleMgr.shared.destroyBattle(this.battle_id);
		}, GameUtil.battleSkipTime);
	}
	//销毁战斗
	destroy() {
		if (this.timer != 0) {
			clearTimeout(this.timer);
			this.timer = 0;
		}
		if (this.destroyTimer != 0) {
			clearTimeout(this.destroyTimer);
			this.timer = 0;
		}
		this.campA.broles = [];
		this.campB.broles = [];
		this.winteam = [];
		this.turnList = [];
		for (const onlyid in this.plist) {
			if (this.plist.hasOwnProperty(onlyid)) {
				delete this.plist[onlyid];
			}
		}
	}
	//设置战斗类型
	setBattleType(bt: any) {
		this.battle_type = bt;
		if (this.battle_type == BattleType.LingHou) {
			this.linghouInfo = {
				steal_money: 0,
				wintype: 0, // 0 猴子死了 1 猴子跑了
			}
		}
	}
	//设置战斗队伍
	setTeam(team1: any, team2: any) {
		let self = this;
		let team2brole = (team: any, teamtype: any) => {
			let t1 = [];
			for (let onlyId in team) {
				if (team.hasOwnProperty(onlyId)) {
					const role = team[onlyId];
					let brole = new BattleRole();
					brole.setObj(role);
					brole.team_id = teamtype;
					brole.battle_id = this.battle_id;
					brole.init();
					//亲密度加成属性
					if(brole.isPet() && brole.qinmi > 0){
						//计算亲密百分比
						let addition = brole.qinmi / 2e9;
						let hp = Math.ceil((5e4 * (1 + addition)));//Math.ceil((brole.getAttr(EAttrTypeL1.HP) * (1 + addition)));
						let mp = Math.ceil((4e4 * (1 + addition)));
						let atk = Math.ceil((2e4 * (1 + addition)));
						let spd = Math.ceil((4e2 * (1 + addition)));
						//气血加成
						brole.setAttr(EAttrTypeL1.HP_MAX,brole.getAttr(EAttrTypeL1.HP_MAX) + hp);
						brole.setAttr(EAttrTypeL1.HP,brole.getAttr(EAttrTypeL1.HP_MAX));
						//蓝加成
						brole.setAttr(EAttrTypeL1.MP_MAX,brole.getAttr(EAttrTypeL1.MP_MAX) + mp);
						brole.setAttr(EAttrTypeL1.MP,brole.getAttr(EAttrTypeL1.MP_MAX));
						//攻击加成
						brole.setAttr(EAttrTypeL1.ATK,brole.getAttr(EAttrTypeL1.ATK) + atk);
						//速度加成
						brole.setAttr(EAttrTypeL1.SPD,brole.getAttr(EAttrTypeL1.SPD) + spd);
					}
					t1.push(brole);
					self.plist[onlyId] = brole;
				}
			}
			return t1;
		};
		this.campA.broles = team2brole(team1, 1);
		this.campB.broles = team2brole(team2, 2);
		TianceMgr.shared.initBattleBuff(this);
	}
	//设置队伍角色
	setTeamBRole(team1: any, team2: any) {
		this.campA.broles = team1;
		this.campB.broles = team2;

		for (const brole of this.campA.broles) {
			brole.battle_id = this.battle_id;
			brole.team_id = 1;

			if (brole.pos == 0) {
				this.petlist[brole.onlyid] = brole;
			}
			if (brole.pos > 0) {
				this.turnList.push({
					spd: brole.getAttr(EAttrTypeL1.SPD),
					onlyid: brole.onlyid,
				});
				this.plist[brole.onlyid] = brole;
			}
		}
		for (const brole of this.campB.broles) {
			brole.battle_id = this.battle_id;
			brole.team_id = 2;

			if (brole.pos == 0) {
				this.petlist[brole.onlyid] = brole;
			}
			if (brole.pos > 0) {
				this.turnList.push({
					spd: brole.getAttr(EAttrTypeL1.SPD),
					onlyid: brole.onlyid,
				});
				this.plist[brole.onlyid] = brole;
			}
		}
	}

	//获取队伍数据
	getTeamData(aorb?: any) {
		let team = this.campA.broles;
		let camp = 1;
		if (aorb == 2 || aorb == 'B' || aorb == 'b') {
			team = this.campB.broles;
			camp = 2;
		}
		let teamdata: any = {};
		teamdata.camp = camp;
		teamdata.list = [];
		for (let brole of team) {
			teamdata.list.push(brole.getData());
		}
		return teamdata;
	}

	/**
	 * 获得第一个玩家
	 */
	getAPlayer(): any {
		let pid: any = 0;
		for (let onlyid in this.plist) {
			let pinfo = this.plist[onlyid];
			if (pinfo.isPlayer()) {
				pid = onlyid;
				break;
			}
		}
		if (pid != 0) {
			return PlayerMgr.shared.getPlayerByOnlyId(pid, false);
		}
		return null;
	}
	//是否有召唤兽
	hasBB(): boolean {
		for (const onlyid in this.plist) {
			if (this.plist.hasOwnProperty(onlyid)) {
				const brole = this.plist[onlyid];
				if (!brole.isdead && brole.is_bb) {
					return true;
				}
			}
		}
		return false;
	}
	// 是否有场景效果
	hasStageEffect(camp: any, effect: any): any {
		let eff = camp.effect[effect];
		if (eff) {
			return eff.hurt;
		}
		return 0;
	}
	// 设置场景效果
	setStageEffect(camp: any, effect: any, value: any) {
		let eff = camp.effect[effect];
		if (eff) {
			eff.hurt = value;
			eff.role = value;
		}
	}
	// 获得场景效果
	getStageEffects(): any {
		let ret: any = [];
		let effectinfo: any = (effect: any) => {
			for (const skillid in effect) {
				if (effect.hasOwnProperty(skillid)) {
					const info = effect[skillid];
					if (info.hurt > 0) {
						ret.push({
							eff: skillid,
							role: info.roleid
						});
					}
				}
			}
		}
		effectinfo(this.campA.effect);
		effectinfo(this.campB.effect);
		return ret;
	}
	// 检查场景效果
	checkStageEffect() {
		let checkEffect = (camp: any) => {
			let team: BattleRole[] = camp.broles;
			if (camp.effect[ESkillType.HuaWu] == null) {
				camp.effect[ESkillType.HuaWu] = {
					hurt: 0,
					roles: [],
					role: 0
				};
			}
			if (camp.effect[ESkillType.XuanRen] == null) {
				camp.effect[ESkillType.XuanRen] = {
					hurt: 0,
					roles: [],
					role: 0
				};
			}
			if (camp.effect[ESkillType.YiHuan] == null) {
				camp.effect[ESkillType.YiHuan] = {
					hurt: 0,
					roles: [],
					role: 0
				};
			}
			for (let brole of team) {
				if (brole.pos > 0) {
					let canHuaWu = SKDataUtil.atRange(this.battle_type, [BattleType.Force, BattleType.PK, BattleType.ShuiLu, BattleType.PALACE]);
					if (canHuaWu && brole.hasPassiveSkill(ESkillType.HuaWu) && camp.effect[ESkillType.HuaWu].roles.indexOf(brole.onlyid) == -1) {
						camp.effect[ESkillType.HuaWu].roles.push(brole.onlyid);
						camp.effect[ESkillType.HuaWu].hurt = 1;
						camp.effect[ESkillType.HuaWu].roleid = brole.onlyid;
						camp.effect[ESkillType.XuanRen].roles.push(brole.onlyid);
						camp.effect[ESkillType.YiHuan].roles.push(brole.onlyid);
					}
					// 如果存在化无 就没有 遗患或者悬刃
					if (camp.effect[ESkillType.HuaWu].hurt == 0) {
						if ((brole.hasPassiveSkill(ESkillType.QiangHuaXuanRen) || brole.hasPassiveSkill(ESkillType.XuanRen)) &&
							(camp.effect[ESkillType.XuanRen] == null || camp.effect[ESkillType.XuanRen].roles.indexOf(brole.onlyid) == -1)) {
							let hurtbase = 100;
							if (brole.hasPassiveSkill(ESkillType.QiangHuaXuanRen)) {
								hurtbase = 150;
							}
							let hurt = brole.level * hurtbase;
							camp.effect[ESkillType.XuanRen].roles.push(brole.onlyid);
							if (hurt > camp.effect[ESkillType.XuanRen].hurt) {
								camp.effect[ESkillType.XuanRen].hurt = hurt;
								camp.effect[ESkillType.XuanRen].roleid = brole.onlyid;
							}
						}
						if ((brole.hasPassiveSkill(ESkillType.QiangHuaYiHuan) || brole.hasPassiveSkill(ESkillType.YiHuan)) &&
							(camp.effect[ESkillType.YiHuan] == null || camp.effect[ESkillType.YiHuan].roles.indexOf(brole.onlyid) == -1)) {
							let hurtbase = 100;
							if (brole.hasPassiveSkill(ESkillType.QiangHuaYiHuan)) {
								hurtbase = 150;
							}
							let hurt = brole.level * hurtbase;
							camp.effect[ESkillType.YiHuan].roles.push(brole.onlyid);
							if (hurt > camp.effect[ESkillType.YiHuan].hurt) {
								camp.effect[ESkillType.YiHuan].hurt = hurt;
								camp.effect[ESkillType.YiHuan].roleid = brole.onlyid;
							}
						}
					}
				}
			}
		}
		checkEffect(this.campA);
		checkEffect(this.campB);
	}

	//删除战斗角色
	delBattleRole(onlyid: any) {
		delete this.plist[onlyid];
		for (let i = 0; i < this.campA.broles.length; i++) {
			const teamrole = this.campA.broles[i];
			if (teamrole.onlyid == onlyid) {
				this.campA.broles.splice(i, 1);
				break;
			}
		}
		for (let i = 0; i < this.campB.broles.length; i++) {
			const teamrole = this.campB.broles[i];
			if (teamrole.onlyid == onlyid) {
				this.campB.broles.splice(i, 1);
				break;
			}
		}
		let index = this.turnList.indexOf(onlyid);
		if (index != -1) {
			this.turnList.splice(index, 1);
		}
	}
	// 玩家动作
	playerAction(data: any) {
		let onlyid = data.onlyid;
		let acttype = data.action;
		let actionid = data.actionid;
		let targetid = data.targetid;
		if (this.player_can_oper == false) {
			return;
		}
		let brole: BattleRole = this.plist[onlyid];
		if (brole == null) {
			return;
		}
		if (brole.isact) {
			return;
		}
		brole.act = {
			acttype: acttype,
			actionid: actionid,
			target: targetid,
		}
		brole.isact = true;
		if(actionid == ESkillType.NiLin){
			this.dragonBianshen(brole);
		}
		
		SKLogger.debug(`战斗[${brole.onlyid}:${brole.name}]请求动作:${acttype},${actionid},${targetid}`);
		this.broadcastCamp(brole.onlyid, 's2c_btl_act', {
			action: acttype, // 1 技能 2 道具 3 召唤
			actionid: actionid, // 随 action变化
			targetid: targetid, //目标 onlyid
			onlyid: onlyid, //行动者id
		});
		if (this.checkAllAct()) {
			let self = this;
			setTimeout(() => {
				self.round();
			}, 0.5 * 1000);
		}
	}

	dragonBianshen(brole: BattleRole){
		brole.isact = false;
		brole.bianshen = true;
	}

	// 召唤头兽进入效果
	petEnterEffect(pet_onlyid: number): any {
		let petdata: BattleRole = this.plist[pet_onlyid];
		if (!petdata) {
			petdata = this.petlist[pet_onlyid];
		}
		if (!petdata) {
			return null;
		}
		let enterinfo: any = null;
		let initEnterBuff = (skillid: any) => {
			if (enterinfo == null) {
				enterinfo = {};
				enterinfo.buffs = {};
				enterinfo.act = {};
			}
			if (enterinfo.buffs[skillid] == null) {
				enterinfo.buffs[skillid] = [];
			}
		}
		for (let key in petdata.skill_list) {
			if (petdata.skill_list.hasOwnProperty(key)) {
				// 如虎添翼
				let skillId = SKDataUtil.toNumber(key);
				if (skillId == ESkillType.RuHuTianYi) {
					initEnterBuff(skillId);
					let skill = SkillUtil.getSkill(skillId);
					let effect = skill.getEffect();
					let buff = new Buff(skill, effect);
					buff.source = pet_onlyid;
					buff.probability = 10000;
					petdata.addBuff(buff);
					enterinfo.buffs[skillId].push(pet_onlyid);
					let owner = this.plist[petdata.own_onlyid];
					if (owner && owner.isdead == false) {
						let buff = new Buff(skill, effect);
						buff.source = pet_onlyid;
						buff.probability = 10000;
						owner.addBuff(buff);
						enterinfo.buffs[skillId].push(petdata.own_onlyid);
					}
				}
				//六识炽烈
				if(skillId == ESkillType.LiuShiChiLie){
					let skill = SkillUtil.getSkill(skillId);
					let effect = skill.getEffect();
					let buff = new Buff(skill, effect);

					petdata.addBuff(buff);
				}
				//暗之降临
				// if(skillId == ESkillType.AnZhiJiangLin){
				// 	let skill = SkillUtil.getSkill(skillId);
				// 	let effect = skill.getEffect(petdata);
				// 	let buff = new Buff(skill, effect);
				// 	petdata.addBuff(buff);
				// }
				if (this.cur_round != 0) {
					// 隐身 
					if (skillId == ESkillType.YinShen) {
						initEnterBuff(skillId);
						let skill = SkillUtil.getSkill(skillId);
						let effect = skill.getEffect();
						let buff = new Buff(skill, effect);
						buff.source = pet_onlyid;
						buff.probability = 10000;
						petdata.addBuff(buff);
						enterinfo.buffs[skillId].push(pet_onlyid);
						// 击其不意
					} else if (skillId == ESkillType.JiQiBuYi) {
						initEnterBuff(skillId);
						enterinfo.act = skillId;
					}
				}
			}
		}
		return enterinfo;
	}

	//使用道具
	onBroleUseItem(onlyid: number,targetid: any, itemid: any, tr: any) {
		// let iteminfo = goodsMgr.getItemInfo(itemid);
		let effect = GoodsMgr.shared.getMedicineEffect(itemid);
		let target = this.plist[targetid];

		let tlist: any = [];
		let targetact = SKDataUtil.clone(tr);
		targetact.respone = itemid;
		targetact.targetid = targetid;

		let acttype = 0; //EActNumType.HP;
		let num = 0;
		if (target && target.isPet() && target.isdead) {
			return tlist;
		}
		if (effect && target) {
			//穆如清风条件检测
			if(effect.addhp > 0 || effect.addmp > 0 || effect.mulhp > 0 || effect.mulmp > 0){
				let role = this.plist[onlyid];
				if(onlyid != targetid && role.teamid == target.teamid && role.isPet() && role.hasPassiveSkill(ESkillType.MuRuQingFeng)){
					this.muruqingfeng(onlyid,targetid);
				}
			}
			if (effect.huoyan) {
				let team = this.campA.broles;
				if (target.team_id == 1) {
					team = this.campB.broles;
				}
				for (const onlyid in team) {
					if (team.hasOwnProperty(onlyid)) {
						const brole = team[onlyid];
						let yinshen = brole.getBuffByEffect(EMagicType.YinShen);
						if (yinshen) {
							brole.removeBuff(yinshen.buff_id);
							let tact = SKDataUtil.clone(tr);
							tact.targetid = brole.onlyid;
							tact.isdead = brole.isdead;
							tact.hp = brole.getHP();
							tact.mp = brole.getMP();
							tact.bufflist = brole.getBuffsSkillId();
							tlist.push(tact);
						}
					}
				}
			}
			if (effect.addhp) {
				target.subHP(effect.addhp, ESubType.BUFFER);
				num = effect.addhp;
			}
			if (effect.addmp) {
				target.subMP(effect.addmp, ESubType.BUFFER);
				if (num == 0) {
					num = effect.addmp;
				}
			}
			if (effect.mulhp) {
				let basehp = target.getAttr(EAttrTypeL1.HP_MAX);
				let addhp = Math.ceil(basehp * effect.mulhp / 100);
				target.subHP(addhp, ESubType.MUL);
				num = addhp;
			}
			if (effect.mulmp) {
				let basemp = target.getAttr(EAttrTypeL1.MP_MAX);
				let addmp = Math.ceil(basemp * effect.mulmp / 100);
				target.subMP(addmp, ESubType.MUL);
				if (num == 0) {
					num = effect.addmp;
				}
			}
			if (effect.addhp != 0 || effect.mulhp) {
				acttype = EActNumType.HP;
				if (target.isdead) {
					target.isdead = false;
				}
			}
			if (effect.addmp != 0 || effect.mulmp) {
				if (acttype == 0) {
					acttype = EActNumType.MP;
				} else {
					acttype = EActNumType.HPMP;
				}
			}
			targetact.num = num;
			targetact.acttype = acttype;
		}

		if (target) {
			targetact.hp = target.getHP();
			targetact.mp = target.getMP();
			targetact.isdead = target.isDead() ? 1 : 0;
			targetact.bufflist = target.getBuffsSkillId();
		}
		tlist.unshift(targetact);
		return tlist;
	}
	//宠物进场
	onPetEnter(pet_onlyid: any, pos: any): number {
		let summon_pet = this.petlist[pet_onlyid];
		if (summon_pet && summon_pet.isPet() && summon_pet.isdead == false) {
			summon_pet.pos = pos;
			summon_pet.isroundact = true;
			delete this.petlist[pet_onlyid];
			this.plist[pet_onlyid] = summon_pet;
			let owner = this.plist[summon_pet.bindid];
			if (owner) {
				owner.bindid = pet_onlyid;
			}
			return pet_onlyid;
		}
		return 0;
	}
	// 召唤兽离开
	onPetLeave(onlyId:number): any {
		let pet = this.plist[onlyId];
		if (pet && pet.isPet()) {
			for (let i = 0; i < this.turnList.length; i++) {
				let turn = this.turnList[i];
				if (turn.onlyid == onlyId) {
					this.turnList.splice(i, 1);
					break;
				}
			}
			pet.pos = -1;
			let owner = this.plist[pet.bindid];
			if (owner) {
				owner.bindid = 0;
			}
			delete this.plist[onlyId];
			return onlyId;
		}
		return 0;
	}

	summorBack(actid: any): any {
		let bplayer = this.plist[actid];
		let tpet = this.onPetLeave(bplayer.bindid);
		return tpet;
	}

	actSummor(actid: any, summonid: any): any {
		let bplayer = this.plist[actid];
		let ownpos = bplayer.pos;
		let tpet = this.onPetLeave(bplayer.bindid);
		let bpet = this.onPetEnter(summonid, ownpos + 5);

		return {
			tback_pet: tpet,
			battle_pet: bpet,
		};
	}

	//检查是否所有对象是否已经下达操作指令
	checkAllAct(): boolean {
		for (let onlyid in this.plist) {
			if (this.plist.hasOwnProperty(onlyid)) {
				let brole: BattleRole = this.plist[onlyid];
				if ((brole.isPlayer() || brole.isPet()) && brole.pos > 0 && !brole.isdead && !brole.isact ) { //&& brole.online_state == 1
					return false;
				}
			}
		}
		return true;
	}

	// 战斗开始
	begin() {
		SKLogger.debug(`战斗[${this.battle_id}]开始`);
		for (let item of this.turnList) {
			let brole: BattleRole = this.plist[item.onlyid];
			if (brole == null) {
				continue;
			}
			if (brole.isPet()) {
				this.petEnterEffect(brole.onlyid);
			}
		}
		this.roundBegin();
	}

	// findtype = 0 找同队中 非自己的 随机一个人
	// findtype = 1 找敌队中 随机一个人
	findRandomTeamTarget(onlyid: any, findtype: any = 0): BattleRole {
		let role = this.plist[onlyid];
		if (!role) {
			return null;
		}
		let tid = role.team_id;
		let team = [];
		if (tid == 1) {
			team = this.campA.broles;
		} else if (tid == 2) {
			team = this.campB.broles;
		}
		if (team.length - 1 <= 0) {
			return null;
		}
		let tmpteam = [];
		for (let i = 0, len = team.length; i < len; i++) {
			let trole = team[i];
			if (trole.pos == 0 || trole.pos == -1) {
				continue;
			}
			if (trole.isdead || trole.hasBuff(EMagicType.Seal)) {
				continue;
			}
			if (findtype == 0 && trole.onlyid == onlyid) {
				continue;
			}
			tmpteam.push(trole);
		}
		if (tmpteam.length <= 0) {
			return null;
		}
		let random = Math.floor(GameUtil.random(0, tmpteam.length - 1));
		return tmpteam[random];
	}

	// mod == 1 敌人 2 自己人 3 全体
	findRandomTarge(onlyid: number, neednum: number, list: number[], mod: number = 1, skill: SkillBase = null): any {
		if (list.length == neednum) {
			return list;
		}
		let role = this.plist[onlyid];
		let tid = 0;
		if (role) {
			tid = role.team_id;
		}
		let team = [];
		let enemy_team = [];
		let self_team = [];
		if (tid == 1) {
			enemy_team = this.campB.broles;
			self_team = this.campA.broles;
		} else if (tid == 2) {
			enemy_team = this.campA.broles;
			self_team = this.campB.broles;
		}
		if (mod == 1) {
			team = enemy_team;
		} else if (mod == 2) {
			team = self_team;
		} else if (mod == 3) {
			team = enemy_team.concat(self_team);
		}
		let tmplist = [];
		for (let brole of team) {
			if (brole.pos == 0 || brole.pos == -1) {
				continue;
			}
			if (mod == 1 || mod == 3) {
				// 不能选择自己为目标
				if (brole.onlyid == onlyid) {
					continue;
				}
				// 过滤已死的
				if (brole.isdead) {
					continue;
				}
				// 过滤 隐身的
				if (brole.hasBuff(EMagicType.YinShen)) {
					continue;
				}
			}
			if (mod == 2) {
				if (skill && skill.skill_type != EMagicType.Rrsume) {
					if (brole.isdead) {
						continue;
					}
				}
			}
			let find = list.indexOf(brole.onlyid);
			if (find == -1) {
				tmplist.push(brole);
			}
		}
		if (tmplist.length > 0) {
			if (mod == 2) {
				tmplist.sort((a, b) => {
					return a.spd - b.spd;
				});
			} else {
				tmplist.sort((a, b) => {
					return Math.random() > .4 ? -1 : 1;
				});
			}
			// 优先选择没有中技能BUFF的目标。
			for (let index = 0; index < tmplist.length; index++) {
				const tbrole = tmplist[index];
				if (tbrole.hasBuff(EMagicType.Seal)) {
					continue;
				}
				if (skill && skill.skill_type != 0) {
					// 非万毒攻心，跳过已中毒的目标
					if (skill.skill_id != ESkillType.WanDuGongXin && tbrole.hasBuff(skill.skill_type)) {
						continue;
					}
				}
				if (list.length < neednum) {
					list.push(tbrole.onlyid);
				} else {
					break;
				}
			}
			// 补选人数
			if (list.length < neednum) {
				for (let index = 0; index < tmplist.length; index++) {
					const tbrole = tmplist[index];
					if (tbrole.hasBuff(EMagicType.Seal)) {
						continue;
					}
					if (list.length < neednum && list.indexOf(tbrole.onlyid) == -1) {
						list.push(tbrole.onlyid);
					} else {
						break;
					}
				}
			}
		}
		return list;
	}

	//利涉大川检测
	lishedachuan(onlyid: number, list: number[],skillId: number): number{
		//判断技能是否能触发利涉大川
		if(skillId != ESkillType.TianMoJieTi &&
			skillId != ESkillType.FenGuangHuaYing &&
			skillId != ESkillType.QingMianLiaoYa &&
			skillId != ESkillType.XiaoLouYeKu &&
			skillId != ESkillType.HighTianMoJieTi &&
			skillId != ESkillType.HighFenGuangHuaYing &&
			skillId != ESkillType.HighQingMianLiaoYa &&
			skillId != ESkillType.HighXiaoLouYeKu
			){
				return 0;
			}
		
		let num = 0;
		let role = this.plist[onlyid];
		//非宠物不能触发
		if(!role.isPet()){
			return 0;
		}
		//没有利涉大川被动不能触发
		let skill = role.skill_list[ESkillType.LiSheDaChuan];
		if(!skill){
			return 0;
		}
		//判断利涉大川回蓝BUFF 不存在就添加
		if(!role.hasBuff(ESkillType.LiSheDaChuan)){
			skill = SkillUtil.getSkill(ESkillType.LiSheDaChuan);
			let effect = skill.getEffect();
			let buff = new Buff(skill, effect);
			role.addBuff(buff);
		}


		SKLogger.debug(`利涉大川被动触发`);
		//倒遍历速度表 将最慢的两个地方目标加入到列表
		for(let i = this.turnList.length - 1; i >= 0; i--){
			let obj = this.turnList[i];
			let brole = this.plist[obj.onlyid];
			//已经加入两个额外目标后直接返回
			if(num >= 2){
				return num;
			}
			//不能选自己为目标
			if (brole.onlyid == onlyid){
				continue;
			}
			//忽略狗带目标
			if(brole.isdead){
				continue;
			}
			//忽略我方目标
			if(brole.team_id == role.team_id){
				continue;
			}
			//忽略隐身目标
			if (brole.hasBuff(EMagicType.YinShen)){
				continue;
			}
			list.push(brole.onlyid);
			num++;
		}
		return num;
	}

	//穆如清风技能
	muruqingfeng(onlyid: number,targetid: number){
		let brole = this.plist[onlyid];
		let level = brole.level;//当前等级
		let relive = brole.relive;//转生等级
		let qinmi = brole.qinmi;
		//概率 满亲密度最高50%  外加等级的加成
		let rate = (qinmi / 2e9 + level / 1000 + relive / 10) * 100
		if(rate < SKDataUtil.random(0,100)){
			return;
		}
		let target = this.plist[targetid];
		if(target.hasBuff(EMagicType.Chaos)){
			target.cleanBuff(EMagicType.Chaos);
			SKLogger.debug(`穆如清风清除混乱`);
		}
		if(target.hasBuff(EMagicType.Sleep)){
			target.cleanBuff(EMagicType.Sleep);
			SKLogger.debug(`穆如清风清除昏睡`);
		}
		if(target.hasBuff(EMagicType.Seal)){
			target.cleanBuff(EMagicType.Seal);
			SKLogger.debug(`穆如清风清除封印`);
		}
	}


	// 检查队伍是否全部死亡
	checkTeamAllDie(team: BattleRole[]): boolean {
		let alldie = true;
		for (let brole of team) {
			if (brole.pos == 0 || brole.pos == -1) {
				continue;
			}
			if (!brole.isdead) {
				alldie = false;
				break;
			}
		}
		return alldie;
	}

	//检查是否处于同一队伍
	isSameTeam(onlyidA: any, onlyidB: any): boolean {
		let arole = this.plist[onlyidA];
		let brole = this.plist[onlyidB];
		return arole.team_id == brole.team_id;
	}

	isPlayerWin(onlyid: any): number {
		if (this.winteam.length == 0) {
			return 2;
		}
		return this.winteam.indexOf(onlyid) == -1 ? 0 : 1;
	}
	// 团队胜
	teamWin(team: any) {
		let t = this.campA.broles;
		if (team == 2) {
			t = this.campB.broles;
		}
		for (const bobj of t) {
			this.winteam.push(bobj.onlyid);
		}
		if (this.battle_type == BattleType.LingHou) {
			let player = this.getAPlayer();
			if (player) {
				let money = this.linghouInfo.steal_money;
				let type = this.linghouInfo.wintype;
				if (type == 1) {
					// 猴子跑了
					money = 0;
					if (this.cur_round == 1) {
						money = GameUtil.LingHouRetMoney;
					}
				} else if (type == 0) {
					money = money * 2;
				}
				if (money > 0) {
					player.addMoney(GameUtil.goldKind.Money, money, '天降灵猴');
				}
				if (money > 500000) {
					PlayerMgr.shared.broadcast('s2c_game_chat', {
						scale: 3,
						msg: `${player.name} 教训灵猴，获得了 ${money} 银两`,
						name: '',
						resid: 0,
						teamid: 0,
					});
				}
			}
		}
		BattleMgr.shared.destroyBattle(this.battle_id);
	}
	// 流局
	end() {
		this.broadcast('s2c_btl_end', {
			btlid: this.battle_id,
			result: false,
		});
		BattleMgr.shared.destroyBattle(this.battle_id);
	}
	// 重新确定移速顺序
	reTurnList() {
		let turnList = [];
		for (let onlyid in this.plist) {
			if (this.plist.hasOwnProperty(onlyid)) {
				let brole = this.plist[onlyid];
				let spd = brole.getAttr(EAttrTypeL1.SPD)
				SKLogger.debug(`[${brole.onlyid}:${brole.name}]速度:${spd}`);
				turnList.push({
					spd: spd,
					onlyid: brole.onlyid,
				})
			}
		}
		turnList.sort((a, b) => {
			return b.spd - a.spd;
		});
		this.turnList = turnList;
	}
	// 检查是否胜利
	checkWin() {
		if (this.checkTeamAllDie(this.campA.broles)) {
			return 2;
		}
		if (this.checkTeamAllDie(this.campB.broles)) {
			return 1;
		}
		return 0;
	}

	checkPlayerAuto(){
		for (let onlyid in this.plist) {
			if (this.plist.hasOwnProperty(onlyid)) {
				let battleRole: BattleRole = this.plist[onlyid];
				if (battleRole.isPlayer()) {
					let player = PlayerMgr.shared.getPlayerByOnlyId(battleRole.onlyid, false);
					if(player && player.auto && player.auto[0]){
						!battleRole.isDead() && this.playerAction({
							onlyid: battleRole.onlyid,
							action: EActType.SKILL,
							actionid: player.auto[1],
							targetid: 0,
						});
						let pet: BattleRole = this.plist[battleRole.bindid];
						pet && !pet.isDead() && this.playerAction({
							onlyid: pet.onlyid,
							action: EActType.SKILL,
							actionid: player.auto[2],
							targetid: 0,
						});
					}
				}
			}
		}
	}
	getDieNum(battleRole: BattleRole){
		let tid = battleRole.team_id;
		if(this.dieNum[0] == this.cur_round){
			return this.dieNum[tid]
		}
		let n = 0;
		let team = [];
		if (tid == 1) {
			team = this.campA.broles;
		} else if (tid == 2) {
			team = this.campB.broles;
		}
		for (const r of team) {
			if ((r.isPlayer() || r.isPartner()) && r.isdead) {
				n++;
			}
		}
		this.dieNum[0] = this.cur_round;
		this.dieNum[tid] = n;
		return n;
	}


	// 回合开始
	roundBegin() {
		if (this.timer != 0) {
			clearTimeout(this.timer);
			this.timer = 0;
		}
		let winTeam: number = this.checkWin();
		if (winTeam != 0) {
			this.teamWin(winTeam);
			return;
		}
		this.cur_round++;
		//回合达上限流局
		if (this.cur_round >= 20) {
			this.end();
			return;
		}
		this.player_can_oper = true;
		// 先处理 buff
		let actionList = [];
		for (let turn of this.turnList) {
			let battleRole: BattleRole = this.plist[turn.onlyid];
			if (battleRole == null || battleRole.isdead) {
				continue;
			}
			let addHP = 0;
			let buffList = battleRole.getBuffList();
			for (let i = 0; i < buffList.length; i++) {
				let buff = buffList[i];
				addHP += buff.active(battleRole);
			}
			let action: any = {};
			action.targetid = battleRole.onlyid;
			action.acttype = addHP > 0 ? 2 : 1;
			action.num = addHP; // 对应acttype 伤害量 治疗量
			action.respone = 0; // 0 无响应，1 防御 2闪避 3暴击
			action.isdead = battleRole.isdead; // 0 未死亡 1 死亡
			action.hp = battleRole.getHP(); // 剩余生命值百分比
			action.mp = battleRole.getMP(); // 剩余法力值百分比
			action.bufflist = battleRole.getBuffsSkillId(); // buff列表
			action.param = 0;
			actionList.push(action);
		}
		this.reTurnList();
		this.checkStageEffect();
		let effect = this.getStageEffects();
		this.broadcast('s2c_btl_roundbegin', {
			act: actionList,
			effect: effect,
		});
		// 被buff烫死
		winTeam = this.checkWin();
		if (winTeam != 0) {
			SKLogger.debug(`战斗结束`);
			setTimeout(() => {
				this.teamWin(winTeam);
			}, 5 * 1000);
			return;
		}
		let self = this;
		let waitTime = 31;
		if (this.checkAllAct()) {
			waitTime = 4;
		}
		this.timer = setTimeout(() => {
			self.round();
		}, waitTime * 1000);

		setTimeout(() => {
			self.checkPlayerAuto();
		}, 2000)
	}
	// 一回合开始
	round() {
		if (this.timer != 0) {
			clearTimeout(this.timer);
			this.timer = 0;
		}
		this.player_can_oper = false;
		let roundinfo: any = {};
		roundinfo.round = this.cur_round;
		roundinfo.acts = [];

		let replace_list: any = {};

		let target: any = {
			targetid: 0, // 目标onlyid
			acttype: 0, // 1伤害 2治疗 3buff
			num: 0, // 对应acttype 伤害量 治疗量
			respone: 0, // 0 无响应，1 防御 2 闪避 3 暴击
			isdead: 0, // 0 未死亡 1 死亡
			hp: 0, // 剩余生命值百分比
			mp: 0, // 剩余法力值百分比
			bufflist: [], // buff列表
			param: 0,
			actaffix: '',
		};
		let protect_list: any = {}
		// 整理保护列表
		for (let turn of this.turnList) {
			let battleRole: BattleRole = this.plist[turn.onlyid];
			if (battleRole.act && battleRole.act.acttype == EActType.PROTECT) {
				let target_id = battleRole.act.target;
				if (protect_list[target_id] == null) {
					protect_list[target_id] = battleRole.onlyid;
				}
			}
		}
		let addTime = 0;
		for (let turnIndex = 0; turnIndex < this.turnList.length; turnIndex++) {
			let turn = this.turnList[turnIndex];
			// 出手的角色
			let battleRole: BattleRole = this.plist[turn.onlyid];
			if (battleRole == null || battleRole.beCache) {
				continue;
			}
			// 出手目标死亡则跳过
			if (battleRole.isdead) {
				battleRole.isroundact = true;
				continue;
			}
			// 出手目标被封印或昏睡则跳过
			if (battleRole.hasBuff(EMagicType.Seal) || battleRole.hasBuff(EMagicType.Sleep)) {
				continue;
			}
			if (battleRole.isPartner() && this.hasBB()) {
				continue;
			}
			// 修正内容
			if (battleRole.act.acttype == 0) {
				battleRole.act.acttype = EActType.SKILL;
			}
			if (battleRole.hasBuff(EMagicType.Chaos)) {
				battleRole.act.acttype = EActType.SKILL;
				SKLogger.debug(`战斗:[${battleRole.onlyid}:${battleRole.name}]中了混乱,动作修正为技能`);
			}
			if (this.battle_type == BattleType.LingHou && battleRole.isMonster()) {
				let player = this.getAPlayer();
				if (player && player.money < GameUtil.lingHouMinMoney) {
					battleRole.act.acttype = EActType.RUN_AWAY;
				}
				let r = GameUtil.random(0, 10000);
				if (r < 3500) {
					battleRole.act.acttype = EActType.RUN_AWAY;
				}
			}
			// 不是防御 都要破除隐身状态
			if (battleRole.act.acttype != EActType.SKILL && battleRole.act.actionid != 0 && battleRole.act.actionid != ESkillType.NormalDefSkill) {
				let yinshen = battleRole.getBuffByEffect(EMagicType.YinShen);
				if (yinshen) {
					battleRole.removeBuff(yinshen.buff_id);
				}
			}
			let actionList: any = {};
			actionList.actid = turn.onlyid;
			actionList.action = battleRole.act.acttype;
			let actbef: any = {};
			actionList.act = [];
			battleRole.isroundact = true;
			let runaway = false;
			SKLogger.debug(`战斗:[${battleRole.onlyid}:${battleRole.name}]执行动作:${battleRole.act.acttype}`);
			//龙族 执行动作前给玩家添加 变身buff
			if(battleRole.bianshen && battleRole.isDragon() && !battleRole.hasBuff(EMagicType.BianShen) && this.cur_round > battleRole.nextBianshen){
				let skill = SkillUtil.getSkill(ESkillType.NiLin);
				if(skill && this.cur_round > skill.limit_round ){
					SKLogger.debug(`战斗:[${battleRole.onlyid}:${battleRole.name}]添加变身BUFF`);
					battleRole.addBuff( new Buff(skill, skill.getEffect(battleRole)));
					let actbef2 = {
						next: battleRole.nextBianshen = this.cur_round + skill.cooldown
					};
					let _actionList = {
						bufflist: battleRole.getBuffsSkillId(),
						action: EActType.BIANSHEN,
						actid: turn.onlyid,
						actionid: ESkillType.NiLin,
						act: {},
						actbef:SKDataUtil.toJson(actbef2),
					};
					roundinfo.acts.push(_actionList);
				}
			}
			battleRole.bianshen = false;
			
			if (battleRole.act.acttype == EActType.RUN_AWAY) {
				// 逃跑
				actionList.actionid = 0;
				let r = GameUtil.random(1, 10000);
				if (this.battle_type == BattleType.BangZhan) {
					r = 0;
				}
				if (this.battle_type == BattleType.ShuiLu) {
					r = 10001;
				}
				if (this.battle_type == BattleType.LingHou) {
					r = 0;
					this.linghouInfo.wintype = 1;
				}
				if (r < 8000) {
					runaway = true;
					actionList.actionid = 1;
					let self = this;
					let winteamid = battleRole.team_id == 1 ? 2 : 1;
					setTimeout(() => {
						self.teamWin(winteamid);
					}, (roundinfo.acts.length + 1) * 1.8 * 1000);
				}
			} else if (battleRole.act.acttype == EActType.ITEM) {
				if (battleRole.hasBuff(EMagicType.Forget) || battleRole.hasBuff(EMagicType.Chaos)) {
					continue;
				}
				let itemid = battleRole.act.actionid;
				let target_id = battleRole.act.target;
				let targetact = this.onBroleUseItem(battleRole.onlyid,target_id, itemid, target);
				if (targetact.length > 0) {
					actionList.act = actionList.act.concat(targetact);
					let player = PlayerMgr.shared.getPlayerByOnlyId(battleRole.onlyid, false);
					if (player) {
						player.addBagItem(itemid, -1, false);
					}
				}
			} else if (battleRole.act.acttype == EActType.CATCH) {
				let player = PlayerMgr.shared.getPlayerByOnlyId(battleRole.onlyid, false);
				if (player) {
					let target_id = battleRole.act.target;
					let targetRole: BattleRole = this.plist[target_id];
					let targetAction = SKDataUtil.clone(target);
					targetAction.targetid = target_id;
					targetAction.respone = EBtlRespone.NO_CATCH;
					while (true) {
						if (targetRole.is_bb == false) {
							targetAction.respone = EBtlRespone.NO_CATCH;
							break;
						}
						let rand = GameUtil.random(0, 10000);
						if (rand > 6000) {
							targetAction.respone = EBtlRespone.CATCH_FAILED;
							break;
						}
						targetAction.respone = EBtlRespone.CATCHED;
						let mondata = MonsterMgr.shared.getMonsterData(targetRole.dataid);
						player.createPet({
							petid: mondata.petid
						});
						break
					}
					targetAction.hp = targetRole.getHP();
					targetAction.mp = targetRole.getMP();
					targetAction.isdead = targetRole.isDead() ? 1 : 0;
					targetAction.bufflist = targetRole.getBuffsSkillId();
					actionList.act.push(targetAction);
					if (targetAction.respone == EBtlRespone.CATCHED) {
						this.delBattleRole(target_id);
					}
				}
			} else if (battleRole.act.acttype == EActType.PROTECT) {
				// 保护
				let yinshen = battleRole.getBuffByEffect(EMagicType.YinShen);
				if (yinshen) {
					battleRole.removeBuff(yinshen.buff_id);
				}
			} else if (battleRole.act.acttype == EActType.SUMMON) {
				// 召唤
				let petid = battleRole.act.actionid;
				let summorInfo = this.actSummor(battleRole.onlyid, petid);
				let targetAction = SKDataUtil.clone(target);
				targetAction.targetid = summorInfo.tback_pet;
				targetAction.respone = EBtlRespone.SUMMON_BACK;
				actionList.act.push(targetAction);
				let sumpet = this.plist[summorInfo.battle_pet];
				let targetAction2 = SKDataUtil.clone(target);
				if (sumpet == null) {
					targetAction2.respone = EBtlRespone.SUMMON_FAILED;
					actionList.act.push(targetAction2);
				} else {
					targetAction2.respone = EBtlRespone.SUMMON;
					targetAction2.targetid = sumpet.onlyid;
					targetAction2.num = sumpet.pos;
					targetAction2.hp = sumpet.getHP();
					targetAction2.mp = sumpet.getMP();
					targetAction2.isdead = sumpet.isDead() ? 1 : 0;
					targetAction2.bufflist = sumpet.getBuffsSkillId();
					let sumenterinfo = this.petEnterEffect(sumpet.onlyid);
					if (sumenterinfo) {
						let actaffix: any = {}
						actaffix.petenter = sumenterinfo;
						targetAction2.actaffix = SKDataUtil.toJson(actaffix);
						if (sumenterinfo.act == ESkillType.JiQiBuYi) {
							sumpet.act.acttype = EActType.SKILL;
							sumpet.act.skill = ESkillType.NormalAtkSkill;
							sumpet.act.actionid = ESkillType.NormalAtkSkill;
							this.turnList.splice(turnIndex + 1, 0, { spd: sumpet.getAttr(EAttrTypeL1.SPD), onlyid: sumpet.onlyid });
						}
					}
					actionList.act.push(targetAction2);
					replace_list[summorInfo.tback_pet] = sumpet.onlyid;
				}
			} else if (battleRole.act.acttype == EActType.SUMMON_BACK) {
				// 召还
				let backid = this.summorBack(battleRole.onlyid);
				let targetact = SKDataUtil.clone(target);
				targetact.targetid = backid;
				targetact.respone = EBtlRespone.SUMMON_BACK;
				actionList.act.push(targetact);
			} else if (battleRole.act.acttype == EActType.SKILL) {
				// 确认技能
				let skillId = battleRole.act.actionid;
				if (skillId == null || skillId == 0) {
					skillId = battleRole.getAiSkill();
					battleRole.act.actionid = skillId;
				}
				if (this.battle_type == BattleType.LingHou && battleRole.isMonster()) {
					skillId = ESkillType.StealMoney;
				}
				// 混乱状态-攻击改为普通攻击
				if (battleRole.hasBuff(EMagicType.Chaos)) {
					skillId = ESkillType.NormalAtkSkill;
					SKLogger.debug(`战斗:[${battleRole.onlyid}:${battleRole.name}]混乱中,进行普通攻击!`);
				}
				let skillInfo = battleRole.getSkillInfo(skillId);
				if (skillId != ESkillType.NormalAtkSkill && skillId != ESkillType.NormalDefSkill) {
					if (skillInfo == null) {
						SKLogger.debug(`战斗:[${battleRole.onlyid}:${battleRole.name}]技能[${SkillUtil.getSkillName(skillId)}]异常，改为普攻!`);
						skillId = ESkillType.NormalAtkSkill;
					} else if (skillInfo.cooldown > 0) {
						SKLogger.debug(`战斗:[${battleRole.onlyid}:${battleRole.name}]技能[${SkillUtil.getSkillName(skillId)}]冷却中，改为普攻!`);
						skillId = ESkillType.NormalAtkSkill;
					}
				}
				let skill = SkillUtil.getSkill(skillId);
				if (!skill) {
					console.warn(`战斗:[${battleRole.onlyid}:${battleRole.name}]找不到技能[${skillId}]改为普通攻击`);
					skillId = ESkillType.NormalAtkSkill;
					skill = SkillUtil.getSkill(skillId);
				}
				if (skillId == ESkillType.NormalDefSkill) {
					continue;
				}
				if (skill.limit_round > 0 && this.cur_round < skill.limit_round) {
					skillId = ESkillType.NormalAtkSkill;
					skill = SkillUtil.getSkill(skillId);
					battleRole.act.actionid = skillId;
				}
				if (skill.limit_times > 0) {
					if (battleRole.used_skill[skillId] >= skill.limit_times) {
						skillId = ESkillType.NormalAtkSkill;
						skill = SkillUtil.getSkill(skillId);
						battleRole.act.actionid = skillId;
					}
					if (skill.limit_times > 0) {
						battleRole.addLimitSkill(skillId);
					}
				}
				actionList.actionid = skillId;
				if (battleRole.last_skill != skillId) {
					battleRole.last_skill = skillId;
					if (battleRole.source) {
						battleRole.source.default_btl_skill = skillId;
					}
				}
				let yinshen = battleRole.getBuffByEffect(EMagicType.YinShen);
				if (yinshen) {
					battleRole.removeBuff(yinshen.buff_id);
				}
				// 是否可以使用技能
				let canSubMp = true;
				let canUseSkill = true;
				// 普通战斗不计算蓝耗
				if (SkillUtil.forceMpSkill.indexOf(skillId) == -1) {
					canSubMp = false;
				}
				// 怪物或伙伴 忽略蓝耗
				if (battleRole.isMonster() || battleRole.isPartner()) {
					canSubMp = false;
				}
				if (canSubMp) {
					let info = skill.useSkill(battleRole);
					if (info && info != "" && info.length > 0) {
						SKLogger.debug(`[${battleRole.onlyid}:${battleRole.name}]技能[${SkillUtil.getSkillName(skillId)}]无法使用[${info}]`)
						battleRole.send('s2c_notice', {
							strRichText: info
						});
						if(skill.skill_id==ESkillType.BingLinChengXia){
							skillId = ESkillType.NormalAtkSkill;
							skill = SkillUtil.getSkill(skillId);
						}else{
							canUseSkill = false;
						}
					}
				}
				if (!canUseSkill) {
					SKLogger.debug(`[${battleRole.onlyid}:${battleRole.name}]技能[${SkillUtil.getSkillName(skillId)}]不能释放!`);
					continue;
				}
				// 技能效果
				let params: any = {
					plist: this.plist,
					battleRole: battleRole,
					skillId: skillId,
					round: this.cur_round,
					battle_type: this.battle_type,
					battle_id: this.battle_id,
					battle: this,

					level: battleRole.level,
					relive: battleRole.relive,
					qinmi: battleRole.qinmi,
					profic: battleRole.getSkillProfic(skillId),
					atk: battleRole.getAttr(EAttrTypeL1.ATK),
					deadnum: this.getDieNum(battleRole),
					maxmp: battleRole.getAttr(EAttrTypeL1.MP_MAX),
					targetList: []
				}

				let skillEffect = skill.getEffect(params);
				// 技能冷却
				if (skill.cooldown > 0) {
					let skillInfo = battleRole.getSkillInfo(skillId);
					if (skillInfo) {
						skillInfo.cooldown = skill.cooldown;
					}
				}
				let target_num = skillEffect.cnt;

				let targetList: any = [];
				// 确定主目标
				let main_target_id = battleRole.act.target;
				let main_role = this.plist[main_target_id];
				//利涉大川检测
				target_num += this.lishedachuan(battleRole.onlyid,targetList,skillId);

				if (!battleRole.hasBuff(EMagicType.Chaos)) {
					if (main_role && !main_role.isdead && !main_role.hasBuff(EMagicType.YinShen)) {
						targetList.push(main_target_id);
					}
				}
				let fenlie = false;
				// 如果混乱中,攻击改为全体目标
				if (battleRole.hasBuff(EMagicType.Chaos)) {
					// 判断混乱后 天罡战气 技能
					if (battleRole.hasPassiveSkill(ESkillType.TianGangZhanQi)) {
						targetList = this.findRandomTarge(battleRole.onlyid, target_num, targetList, 1, skill);
						for (let onlyId of targetList) {
							let target = this.plist[onlyId];
							SKLogger.debug(`[${battleRole.onlyid}:${battleRole.name}]技能[${SkillUtil.getSkillName(skillId)}]加入攻击目标[${target.onlyid}:${target.name}]`);
						}
					} else {
						targetList = this.findRandomTarge(battleRole.onlyid, target_num, targetList, 3);
						for (let onlyId of targetList) {
							let target = this.plist[onlyId];
							SKLogger.debug(`[${battleRole.onlyid}:${battleRole.name}]技能[${SkillUtil.getSkillName(skillId)}]加入攻击目标[${target.onlyid}:${target.name}]`);
						}
					}
				} else {
					// 如果是子虚乌有 就直接放入 自己与同队随机一人
					if (skillId == ESkillType.ZiXuWuYou) {
						targetList.push(battleRole.onlyid);
						SKLogger.debug(`战斗:子虚乌有加入施法目标[${battleRole.onlyid}:${battleRole.name}]`);
					} else {
						if (SkillUtil.isSelfBuffSkill(skillId)) {
							targetList = this.findRandomTarge(battleRole.onlyid, target_num, targetList, 2, skill);
							for (let onlyId of targetList) {
								let target = this.plist[onlyId];
								SKLogger.debug(`[${battleRole.onlyid}:${battleRole.name}]技能[${SkillUtil.getSkillName(skillId)}]加入攻击目标[${target.onlyid}:${target.name}]`);
							}
						} else {
							if (skillId == ESkillType.NormalAtkSkill) {
								fenlie = battleRole.fenLie();
								if (fenlie) {
									target_num += 1;
								}
								if (GameUtil.random(0, 100) <= battleRole.getAttr(EAttrTypeL1.PHY_MULTIPLE_PROB)) {
									target_num += battleRole.getAttr(EAttrTypeL1.PHY_MULTIPLE) || 1;
								}
							}
							targetList = this.findRandomTarge(battleRole.onlyid, target_num, targetList, 1, skill);
							for (let onlyId of targetList) {
								let target = this.plist[onlyId];
								SKLogger.debug(`[${battleRole.onlyid}:${battleRole.name}]技能[${SkillUtil.getSkillName(skillId)}]加入攻击目标[${target.onlyid}:${target.name}]`);
							}
						}
					}
				}

				//暗影离魂计算
				if(battleRole.isPet() && !battleRole.hasBuff(EMagicType.Seal) && !battleRole.hasBuff(EMagicType.Sleep) && skillId == ESkillType.NormalAtkSkill){
					if(battleRole.hasPassiveSkill(ESkillType.AnYingLiHun)){
						targetList = [];
						target_num = SkillUtil.getSkill(ESkillType.AnYingLiHun).getEffect(params);
						//target_num = SkillUtil.getSkill(ESkillType.AnYingLiHun).getEffect() >= 45 ? 4 : 3;
						if (main_role && !main_role.isdead && !main_role.hasBuff(EMagicType.YinShen)) {
							targetList.push(main_target_id);
						}
						targetList = this.findRandomTarge(battleRole.onlyid, target_num, targetList, 1, skill);
						actionList.actionid = skillId = ESkillType.AnYingLiHun;

					}else if(battleRole.hasPassiveSkill(ESkillType.AnZhiJiangLin)){
						targetList = [];
						target_num = SkillUtil.getSkill(ESkillType.AnZhiJiangLin).getEffect(params);
						//target_num = SkillUtil.getSkill(ESkillType.AnYingLiHun).getEffect() >= 45 ? 4 : 3;
						if (main_role && !main_role.isdead && !main_role.hasBuff(EMagicType.YinShen)) {
							targetList.push(main_target_id);
						}
						targetList = this.findRandomTarge(battleRole.onlyid, target_num, targetList, 1, skill);
						actionList.actionid = skillId = ESkillType.AnZhiJiangLin;
					}
				}

				if (targetList.length == 0) {
					SKLogger.debug(`战斗:角色[${battleRole.onlyid}:${battleRole.name}]没有攻击目标跳过!`)
					continue;
				}
				params.targetList = targetList;
				for (let _buff of battleRole.buff_list) {
					let buff_skill = SkillUtil.getSkill(_buff.skill_id);
					buff_skill && buff_skill.battleBuff(params, _buff)
				}

				// 计算悬刃 遗患 等 出手前技能
				if (skillId != ESkillType.NormalAtkSkill && skillId != ESkillType.StealMoney) {
					let camp = this.campA;
					if (battleRole.team_id == 1) {
						camp = this.campB;
					}
					let huawu = this.hasStageEffect(camp, ESkillType.HuaWu);
					// 有场景化无特效
					if (huawu > 0) {
						this.setStageEffect(camp, ESkillType.HuaWu, 0);
						actbef.huawu = true;
						actionList.actbef = SKDataUtil.toJson(actbef);
						actionList.act = [];
						roundinfo.acts.push(actionList);
						SKLogger.debug(`战斗:角色[${battleRole.onlyid}:${battleRole.name}]中了化无`);
						continue;
					}
					let xuanren_hurt = this.hasStageEffect(camp, ESkillType.XuanRen);
					if (xuanren_hurt > 0) {
						this.setStageEffect(camp, ESkillType.XuanRen, 0);
						battleRole.subHP(-xuanren_hurt, ESubType.XUAN_REN);
						actbef.xuanren = xuanren_hurt;
					}
					let yihuan_hurt = this.hasStageEffect(camp, ESkillType.YiHuan);
					if (yihuan_hurt > 0) {
						this.setStageEffect(camp, ESkillType.YiHuan, 0);
						battleRole.subMP(-yihuan_hurt, ESubType.YI_HUAN);
						actbef.yihuan = yihuan_hurt;
					}
					if (battleRole.isdead) {
						actbef.hp = battleRole.getHP();
						actbef.mp = battleRole.getMP();
						actbef.isdead = battleRole.isDead() ? 1 : 0;
						actionList.actbef = SKDataUtil.toJson(actbef);
						actionList.act = [];
						roundinfo.acts.push(actionList);
						continue;
					}
				}
				// 吸血池
				let poolHP = [];
				let tgs = [];
				let bmingzhong = battleRole.getAttr(EAttrTypeL1.PHY_HIT) + 80;
				let actaffix: any = {} // 被攻击者后续
				let fenhuatimes = 0;
				for (let trindex = 0; trindex < targetList.length; trindex++) {
					let troleid = targetList[trindex];
					let targetRole: BattleRole = this.plist[troleid];
					if (targetRole == null) {
						continue;
					}
					let ntr = SKDataUtil.clone(target);
					ntr.targetid = troleid;
					if (troleid == 10363) {
						console.log(`?`);
					}
					tgs.push(ntr);
					// 封印状态
					if (targetRole.hasBuff(EMagicType.Seal)) {
						ntr.hp = targetRole.getHP();
						ntr.mp = targetRole.getMP();
						ntr.isdead = targetRole.isDead() ? 1 : 0;
						if (skill.skill_type == EMagicType.Seal && skillEffect.round > 1) {
							targetRole.checkReplaceBuffRound(skillId, skillEffect.round);
						}
						ntr.bufflist = targetRole.getBuffsSkillId();
						SKLogger.debug(`[${targetRole.onlyid}:${targetRole.name}]被封印跳过`);
						continue;
					}
					let hkType = GameUtil.skillTypeStrengthen[skill.skill_type];
					let kType = GameUtil.skillTypeKangXing[skill.skill_type];
					let hkValue = battleRole.getAttr(hkType); // 忽视
					let kValue = targetRole.getAttr(kType); // 抗性
					let subValue = hkValue - kValue;
					SKLogger.debug(`[${battleRole.name}]忽视计算[${GameUtil.attrTypeL1Name[hkType] || '未定义'}]=${hkValue}`);
					SKLogger.debug(`[${targetRole.name}]抗性计算:[${GameUtil.attrTypeL1Name[kType] || '未定义'}]=${kValue}`);
					// 判断控制技能闪避
					if (SkillUtil.isControlSkill(skillId)) {
						let t = (subValue + 110) * 100;
						let rand = GameUtil.random(0, 10000);
						if (t <= rand) {
							ntr.respone = EBtlRespone.DODGE;
							ntr.hp = targetRole.getHP();
							ntr.mp = targetRole.getMP();
							ntr.isdead = targetRole.isDead() ? 1 : 0;
							ntr.bufflist = targetRole.getBuffsSkillId();
							SKLogger.debug(`[${battleRole.onlyid}:${battleRole.name}]的控制技能[${SkillUtil.getSkillName(skillId)}]被目标[${targetRole.onlyid}:${targetRole.name}]闪避跳过`);
							continue;
						}
					}
					// 判断闪避命中
					if (SkillUtil.isCanShanbiSkill(skillId)) {
						let shanbi = targetRole.getAttr(EAttrTypeL1.PHY_DODGE);
						let rand = GameUtil.random(0, 10000);
						if (rand > (bmingzhong - shanbi) * 100) {
							ntr.respone = EBtlRespone.DODGE;
							ntr.hp = targetRole.getHP();
							ntr.mp = targetRole.getMP();
							ntr.isdead = targetRole.isDead() ? 1 : 0;
							ntr.bufflist = targetRole.getBuffsSkillId();
							SKLogger.debug(`[${targetRole.onlyid}:${targetRole.name}]普攻闪避跳过`);
							continue;
						}
					}
					// 伤害
					let respone = EBtlRespone.NOTHING;
					let hurt = skillEffect.hurt;
					SKLogger.debug(`伤害计算:技能[${SkillUtil.getSkillName(skillId)}]效果伤害${hurt}`);
					if (hurt == 0) {
						if (skillEffect.hurtpre != 0) {
							let percent = skillEffect.hurtpre / 100;
							hurt = Math.floor(targetRole.getHP() * percent);
							SKLogger.debug(`伤害计算:技能[${SkillUtil.getSkillName(skillId)}]效果前置伤害${hurt}`);
						}
					}
					// 狂暴率
					let kbpre = battleRole.getKuangBaoPre(skill.skill_type);
					if (hurt > 0 && kbpre > 0) {
						let randkb = SKDataUtil.random(0, 10000);
						if (randkb < kbpre * 100) {
							let kbstr = battleRole.getKuangBaoStr(skill.skill_type);
							hurt = Math.floor(hurt * (1.5 + kbstr / 100));
							respone = EBtlRespone.CRITICAL_HIT;
							SKLogger.debug(`伤害计算:技能[${SkillUtil.getSkillName(skillId)}]狂暴伤害${hurt}`);
						}
					}
					// 没有混乱的时候 攻击自己人 掉1点血 非buff技能
					if (SkillUtil.isAtkSkill(skillId) && !battleRole.hasBuff(EMagicType.Chaos) && this.isSameTeam(battleRole.onlyid, targetRole.onlyid)) {
						hurt = 1;
						SKLogger.debug(`伤害计算:攻击自己人伤害值为1`);
					}
					if (hurt > 0) {
						// 查看保护
						let protect = false;
						let protect_id = protect_list[targetRole.onlyid];
						while (protect_id != null && skillId == ESkillType.NormalAtkSkill) {
							let protecter = this.plist[protect_id];
							if (protecter == null || protecter.isdead) {
								break;
							}
							let thurt = hurt;
							// 前置破防
							let pfpre = battleRole.getPoFangPre();
							let randkb = GameUtil.random(0, 10000);
							if (randkb < pfpre * 100) {
								let pfstr = battleRole.getPoFang();
								let kwl = protecter.getKangWuLi();
								respone = EBtlRespone.PO_FANG;
								thurt = Math.floor(thurt * (1 + (pfstr * 3 - kwl * 2) / 100));
								SKLogger.debug(`伤害计算:前置破防伤害${thurt}`);
							}
							if (thurt <= 0) {
								thurt = 1;
								SKLogger.debug(`伤害计算:伤害值不能小于1`);
							}
							protecter.subHP(-thurt);
							protect = true;
							actaffix.protect = {
								roleid: protect_id,
								hurt: -thurt,
								isdead: protecter.isdead,
								hp: protecter.getHP(),
								mp: protecter.getMP(),
								respone: respone,
							};
							if (thurt > 0) {
								poolHP.push(thurt * 3);
							}
							hurt = 0;
							break;
						}
						if (protect) {
							// 被保护了
							ntr.acttype = EActNumType.HURT;
							ntr.respone = EBtlRespone.PROTECT;
							ntr.num = hurt;
							// ntr.actaffix = SKDataUtil.toJson(protect);
						} else {
							let thurt = hurt;
							// 破防
							if (skillId == ESkillType.NormalAtkSkill) {
								let pf = battleRole.getPoFang();
								if (pf > 0) {
									hkValue += pf;
								}
								thurt = Math.floor(thurt * (1 + (hkValue * 3 - kValue) / 100));
								SKLogger.debug(`伤害计算:普攻破防伤害${thurt}`);
							} else {
								thurt = Math.floor(thurt * (1 + (hkValue * 3 - kValue * 2) / 100));
								// 如果技能效果是震摄，则破防伤害最高为目标血量的百分之50
								if (skill.skill_type == EMagicType.Frighten) {
									let limit = Math.floor(targetRole.getHP() * 0.5);
									if (thurt > limit) {
										thurt = limit;
									}
								}
								SKLogger.debug(`伤害计算:技能[${SkillUtil.getSkillName(skillId)}]破防伤害${thurt}`);
							}
							// 五行
							// 震慑不算五行
							if (skill.skill_type == EMagicType.Frighten) {
							} else {
								let hurtWxPre = 0;
								for (let wuxing in GameUtil.wuXingStrengthen) {
									if (GameUtil.wuXingStrengthen.hasOwnProperty(wuxing)) {
										let kwuxing = GameUtil.wuXingStrengthen[wuxing];
										let bWx = battleRole.getAttr(wuxing);
										let tWx = targetRole.getAttr(kwuxing);
										hurtWxPre += (bWx / 100) * (tWx / 100) * 0.4;
									}
								}
								for (let wuxing in GameUtil.WuXingKeStrengthen) {
									if (GameUtil.WuXingKeStrengthen.hasOwnProperty(wuxing)) {
										const kwuxing = GameUtil.WuXingKeStrengthen[wuxing];
										let bWx = battleRole.getAttr(wuxing);
										let tWx = targetRole.getAttr(kwuxing);
										hurtWxPre += (bWx / 10) * (tWx / 100) * 0.4;
									}
								}
								thurt = Math.floor(thurt * (1 + hurtWxPre));
								SKLogger.debug(`伤害计算:五行伤害${thurt}`);
							}
							// 判断防御
							if (thurt > 0 && targetRole.act.acttype == EActType.SKILL &&
								battleRole.act.actionid == ESkillType.NormalAtkSkill && targetRole.act.actionid == ESkillType.NormalDefSkill &&
								!targetRole.hasBuff(EMagicType.Chaos)) {
								thurt = Math.floor(thurt * 0.5);
								SKLogger.debug(`伤害计算:防御伤害${thurt}`);
								ntr.respone = EBtlRespone.DEFENSE;
							}
							if (thurt <= 0) {
								thurt = 1;
							}
							if (thurt > 0) {
								// 如果中了睡眠
								if (targetRole.hasBuff(EMagicType.Sleep)) {
									// 清理睡眠
									targetRole.cleanBuff(EMagicType.Sleep);
									if (targetRole.isroundact == false) {
										let bindex = this.turnList.indexOf(battleRole.onlyid);
										let tindex = this.turnList.indexOf(targetRole.onlyid);
										if (tindex < bindex) {
											this.turnList.splice(bindex + 1, 0, targetRole.onlyid);
											this.turnList.splice(tindex, 1);
										}
									}
								}
							}
							SKLogger.debug(`[${targetRole.onlyid}:${targetRole.name}]受到[${battleRole.onlyid}:${battleRole.name}]技能[${SkillUtil.getSkillName(skillId)}]伤害${thurt}`);
							targetRole.subHP(-thurt, ESubType.SKILL);
							// 普攻，兵临城下,幻影如风 处理连击,隔山效果
							if (SkillUtil.hasComboSkill(skillId, battleRole) && thurt > 0) {
								let combo = battleRole.getCombo();
								if (combo > 0) {
									actaffix.lianji = {
										hurt: [],
									};
									actaffix.lianji.hurt.push(-thurt);
									let lianjihurt = thurt;
									for (let i = 0; i < combo; i++) {
										lianjihurt = Math.ceil(lianjihurt * 0.5);
										actaffix.lianji.hurt.push(-lianjihurt);
										targetRole.subHP(-lianjihurt, ESubType.SKILL);
									}
									addTime += combo * 0.16;
									SKLogger.debug(`技能[${SkillUtil.getSkillName(skillId)}]触发连击${-hurt}`);
								}
								let geshan = battleRole.geShan();
								if (geshan > 0) {
									// 如果有隔山打牛
									let trole2 = this.findRandomTeamTarget(targetRole.onlyid);
									if (trole2) {
										let atk = battleRole.getAttr(EAttrTypeL1.ATK);
										let hurt = Math.floor(atk * geshan / 100);
										trole2.subHP(-hurt);
										actaffix.geshan = {
											roleid: trole2.onlyid,
											respone: respone,
											num: -hurt,
											hp: trole2.getHP(),
											mp: trole2.getMP(),
											isdead: trole2.isdead ? 1 : 0,
										};
										addTime += 0.8;
										SKLogger.debug(`技能[${SkillUtil.getSkillName(skillId)}]触发隔山打牛${-hurt}`);
									}
								}
							}
							ntr.acttype = EActNumType.HURT;
							ntr.respone = respone;
							ntr.num = -thurt;
							if (thurt > 0) {
								poolHP.push(thurt * 3);
							}
							// 天降灵猴 
							if (skillId == ESkillType.StealMoney) {
								let player = this.getAPlayer();
								if (player) {
									let stealmoney = skillEffect.money;
									if (stealmoney > player.money) {
										stealmoney = player.money;
									}
									this.linghouInfo.steal_money = stealmoney;
									player.addMoney(GameUtil.goldKind.Money, -stealmoney, '天降灵猴偷走');
									SKLogger.debug(`灵猴偷走${stealmoney}银两`);
								}
							}
							hurt = thurt;
						}
					}
					// 治疗
					let hp = skillEffect.hp;
					if (hp > 0) {
						if(targetRole.isDead()){
							targetRole.cleanBuff(EMagicType.Rrsume);
						}
						targetRole.subHP(hp, ESubType.ADD);
						ntr.acttype = EActNumType.HP;
						ntr.num = hp;
					}
					let smppre = skillEffect.smppre;
					if (smppre > 0) {
						let smp = -Math.ceil(targetRole.getMP() * smppre / 100);
						targetRole.subMP(smp, ESubType.SUB);
					}
					let hpper = skillEffect.hppre;
					if (hpper > 0) {
						let maxhp = targetRole.getAttr(EAttrTypeL1.HP_MAX);
						let addhp = maxhp * hpper / 100;
						targetRole.subHP(addhp, ESubType.PERCENT);
						ntr.acttype = EActNumType.HP;
						ntr.num = addhp;
					}
					let mpper = skillEffect.mppre;
					if (mpper > 0) {
						let maxmp = targetRole.getAttr(EAttrTypeL1.MP_MAX);
						let addmp = maxmp * mpper / 100;
						targetRole.subMP(addmp, ESubType.PERCENT);
					}
					// 处理buff
					if (skillEffect.round > 0) {
						let mingzhong = 10000;
						// 抗性计算
						if (SkillUtil.isAtkSkill(skillId)) {
							let sattr = GameUtil.skillTypeStrengthen[skill.skill_type];
							let dattr = GameUtil.skillTypeKangXing[skill.skill_type];
							let sattrnum = battleRole.getAttr(sattr);
							let tattrnum = targetRole.getAttr(dattr);
							let attrnum = (sattrnum - tattrnum + 100) * 100;
							let r = GameUtil.random(0, 10000);
							if (r < attrnum) {
								mingzhong = attrnum;
							} else {
								mingzhong = 0;
							}
						}
						// 如果命中大于0
						if (mingzhong > 0) {
							let buffeffect = SKDataUtil.clone(skillEffect);
							buffeffect.hurt = hurt;
							let buff = new Buff(skill, buffeffect);
							buff.source = battleRole.onlyid;
							buff.probability = mingzhong;
							targetRole.addBuff(buff);
							SKLogger.debug(`战斗:角色[${targetRole.onlyid}:${targetRole.name}]加入BUFF[${skill.skill_name}:${SkillUtil.getBuffName(buff.effecttype)}]`);
						}
					}
					if (targetRole.isDead() == false) {
						// 修正普通攻击属性   混乱 封印
						let fix_atk_skill = 0;
						if (skillId == ESkillType.NormalAtkSkill) {
							let fixskill = null;
							if (battleRole.hasPassiveSkill(ESkillType.HunLuan)) {
								fixskill = SkillUtil.getSkill(ESkillType.HunLuan);
							}
							if (battleRole.hasPassiveSkill(ESkillType.FengYin)) {
								fixskill = SkillUtil.getSkill(ESkillType.FengYin);
							}
							if (fixskill) {
								let params = {
									level: battleRole.level,
									relive: battleRole.relive,
									qinmi: battleRole.qinmi
								}
								let fixEffect = fixskill.getEffect(params);
								if (fixEffect != null) {
									fix_atk_skill = fixEffect;
								}
							}
						}
						if (fix_atk_skill != 0) {
							let buffSkill = SkillUtil.getSkill(fix_atk_skill);
							if (buffSkill) {
								let buffSkillEffect = buffSkill.getEffect();
								buffSkillEffect.round = 1;
								let buff = new Buff(buffSkill, buffSkillEffect);
								buff.source = battleRole.onlyid;
								buff.probability = 10000;
								targetRole.addBuff(buff);
							} else {
								console.warn(`战斗:修正攻击技能找不到${fix_atk_skill}`);
							}
						}
					}
					let isDead = targetRole.isDead();
					ntr.hp = targetRole.getHP();
					ntr.mp = targetRole.getMP();
					ntr.isdead = isDead ? 1 : 0;
					ntr.bufflist = targetRole.getBuffsSkillId();

					if (isDead) {

						if (targetRole.isPet()) {
							if (targetRole.niepan()) {
								actaffix.niepan = {
									hp: targetRole.getHP(),
									mp: targetRole.getMP(),
									bufflist: [],
								}
								addTime += 2;
								SKLogger.debug(`战斗:召唤兽[${targetRole.name}]死亡涅槃!`);
							} else {
								// 设置 死亡宠物不可被召唤
								let ppos = targetRole.pos;
								this.onPetLeave(targetRole.onlyid);
								// 寻找闪现宠物
								for (let oid in this.petlist) {
									let petRole:BattleRole = this.petlist[oid];
									if (petRole.isdead || parseInt(oid) == targetRole.onlyid) {
										continue;
									}
									if (petRole.pos != -1 && petRole.own_onlyid == targetRole.own_onlyid) {
										let shanxian_ret = petRole.shanXian();
										// 没闪现，继续找闪现宠物
										if (shanxian_ret == 1) {
											continue;
										}
										// 有闪现没出来，跳出闪现逻辑
										if (shanxian_ret == 2) {
											break;
										}
										// 成功闪现
										if (shanxian_ret == 0) {
											let petid = this.onPetEnter(petRole.onlyid, ppos);
											SKLogger.debug(`战斗:召唤兽[${targetRole.name}]死亡闪现[${petRole.name}]`);
											if (petid > 0) {
												let petenter = this.petEnterEffect(parseInt(oid));
												actaffix.shanxian = {
													petoid: petid,
													hp: petRole.getHP(),
													mp: petRole.getMP(),
													pos: ppos,
													bufflist: petRole.getBuffsSkillId(),
												};
												actaffix.petenter = petenter;
												if (petenter && petenter.act == ESkillType.JiQiBuYi) {
													let shanxianpet = this.plist[petid];
													if (shanxianpet) {
														shanxianpet.act.acttype = EActType.SKILL;
														shanxianpet.act.skill = ESkillType.NormalAtkSkill;
														shanxianpet.act.actionid = ESkillType.NormalAtkSkill;
														this.turnList.splice(turnIndex + 1, 0, { spd: shanxianpet.getAttr(EAttrTypeL1.SPD), onlyid: shanxianpet.onlyid });
													}
												}
												break;
											}
										}
									}
								}
							}
						}
						if (battleRole.fenhua()) {
							// 分花拂柳
							let trole2 = this.findRandomTeamTarget(targetRole.onlyid);
							//if (trole2 && trindex == targetList.length - 1 && fenhuatimes < 3) {
							if (trole2 && fenhuatimes < 3) {
								targetList.push(trole2.onlyid);
								fenhuatimes++;
							}
						}
					}
					ntr.actaffix = SKDataUtil.toJson(actaffix);
				}
				// 吸血
				let aiHP = skillEffect.aihp;
				if (aiHP > 0) {
					// 智能加血，给队伍中血量最少的 几个人 加血。
					let teamId = battleRole.team_id;
					let team = [];
					if (teamId == 1) {
						team = this.campA.broles;
					} else if (teamId == 2) {
						team = this.campB.broles;
					}
					team.sort((a: any, b: any) => {
						let t1 = a.getAttr(EAttrTypeL1.HP) / a.getAttr(EAttrTypeL1.HP_MAX);
						let t2 = b.getAttr(EAttrTypeL1.HP) / b.getAttr(EAttrTypeL1.HP_MAX);
						return t1 - t2;
					});
					poolHP.sort((a, b) => {
						return b - a;
					});
					let index = 0;
					for (let member of team) {
						// 未出战跳过
						if (member.pos < 0) {
							continue;
						}
						// 如果是召唤兽并死亡跳过
						if (member.isPet() && member.isdead) {
							continue;
						}
						index++;
						if (index > poolHP.length) {
							break;
						}
						let addHP = poolHP[index - 1];
						let addntr = SKDataUtil.clone(target);
						addntr.targetid = member.onlyid;
						if (member.isdead) {
							member.isdead = false;
						}
						addntr.acttype = EActNumType.SUCK;
						member.subHP(addHP);
						addntr.num = addHP;
						addntr.hp = member.getHP();
						addntr.mp = member.getMP();
						addntr.isdead = member.isDead() ? 1 : 0;
						addntr.bufflist = member.getBuffsSkillId();
						if (addntr.targetid == 10363) {
							console.log(`?`);
						}
						tgs.push(addntr);
					}
				}
				actionList.act = tgs;
				skillEffect = null;
			}
			actbef.hp = battleRole.getHP();
			actbef.mp = battleRole.getMP();
			actbef.isdead = battleRole.isDead() ? 1 : 0;
			actionList.actbef = SKDataUtil.toJson(actbef);
			actionList.bufflist = battleRole.getBuffsSkillId();
			roundinfo.acts.push(actionList);
			if (runaway) {
				break;
			}
		}
		let self = this;
		this.timer = setTimeout(() => {
			self.roundEnd();
		}, (roundinfo.acts.length * 1.83 + addTime + 1) * 1000);
		this.broadcast('s2c_btl_round', roundinfo);
	}

	// 回合结束
	roundEnd() {
		if (this.timer != 0) {
			clearTimeout(this.timer);
			this.timer = 0;
		}
		for (const t of this.turnList) {
			let brole = this.plist[t.onlyid];
			if (!brole) {
				continue;
			}
			// 技能冷却减少
			for (const skillid in brole.skill_list) {
				if (brole.skill_list.hasOwnProperty(skillid)) {
					const skillinfo = brole.skill_list[skillid];
					if (skillinfo.cooldown > 0) {
						skillinfo.cooldown--;
					}
				}
			}
			let bufflist = brole.getBuffList();
			for (let i = 0; i < bufflist.length; i++) {
				const buff = bufflist[i];
				buff.addRound(brole);
				if (buff.effecttype == EMagicType.Chaos ||
					buff.effecttype == EMagicType.Sleep ||
					buff.effecttype == EMagicType.Seal) {
					if (buff.probability != 10000) {
						let r = GameUtil.random(0, 10000);
						if (buff.probability < r) {
							brole.removeBuff(buff.buff_id);
							continue;
						}
					}
				}
				if (buff.checkEnd()) {
					brole.removeBuff(buff.buff_id);
				}
			}
			brole.init();
		}
		this.roundBegin();
	}
	// 回到战斗
	backToBattle(onlyid: any) {
		let brole = this.plist[onlyid];
		if (brole == null) {
			return;
		}
		brole.online_state = 1;
		let eteam = 2;
		let steam = 1;
		if (brole.team_id == 2) {
			eteam = 1;
			steam = 2;
		}
		let s2c_btl = {
			btlid: this.battle_id,
			teamS: this.getTeamData(steam),
			teamE: this.getTeamData(eteam),
		};
		brole.send('s2c_btl', s2c_btl);
	}
	//设置角色离线	包括宠物
	setObjOffline(onlyid: any) {
		let brole = this.plist[onlyid];
		if (brole) {
			brole.online_state = 0;
			for (const bonlyid in this.plist) {
				const bobj = this.plist[bonlyid];
				if (bobj.own_onlyid == onlyid) {
					bobj.online_state = 0;
				}
			}
		}
	}
	//设置角色在线	包括宠物
	setObjOnline(onlyid: any) {
		let brole = this.plist[onlyid];
		if (brole) {
			brole.online_state = 1;
			for (const onlyid in this.plist) {
				const bobj = this.plist[onlyid];
				if (bobj.own_onlyid == onlyid) {
					bobj.online_state = 1;
				}
			}
			if (brole.isact == false) {
				brole.isact = true;

				brole.act = {
					acttype: EActType.SKILL,
					actionid: brole.last_skill,
					target: 0,
				}
			}
		}
	}

	//检查是否有在线角色
	checkOnlinePlayer() {
		for (const onlyid in this.plist) {
			if (this.plist.hasOwnProperty(onlyid)) {
				const brole = this.plist[onlyid];
				if (brole.isPlayer() && brole.online_state == 1) {
					return true;
				}
			}
		}
		return false;
	}
	//广播本队所有玩家
	broadcastCamp(onlyid: any, event: any, obj: any) {
		for (let oid in this.plist) {
			if (this.plist.hasOwnProperty(oid)) {
				let brole = this.plist[oid];
				if (brole.isPlayer() && this.isSameTeam(brole.onlyid, onlyid)) {
					brole.send(event, obj);
				}
			}
		}
	}
	//广播消息到本场战斗所有角色
	broadcast(event: any, obj: any, exclude: any = 0) {
		for (let onlyid in this.plist) {
			if (this.plist.hasOwnProperty(onlyid)) {
				let brole = this.plist[onlyid];
				if (exclude != 0 && brole.onlyid == exclude) {
					continue;
				}
				if (brole.isPlayer()) {
					brole.send(event, obj);
				}
			}
		}
	}
}