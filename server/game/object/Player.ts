import GTimer from "../../common/GTimer";
import BattleObj from "./BattleObj";
import RoleTaskMgr from "../core/RoleTaskMgr";
import PartnerMgr from "./PartnerMgr";
import RelationMgr from "./RelationMgr";
import BattleMgr from "../battle/BattleMgr";
import TeamMgr from "../core/TeamMgr";
import EquipMgr from "./EquipMgr";
import PlayerMgr from "./PlayerMgr";
import NpcMgr from "../core/NpcMgr";
import PaiHangMgr from "../core/PaiHangMgr";
import Equip from "./Equip";
import SchemeMgr from "./SchemeMgr";
import BangMgr from "../bang/BangMgr";
import ActivityMgr from "../activity/ActivityMgr";
import ActivityDefine from "../activity/ActivityDefine";
import PetMgr from "../core/PetMgr";
import ChargeSum from "../core/ChargeSum";
import BattleRole from "../battle/BattleRole";
import MonsterMgr from "../core/MonsterMgr";
import World from "./World";
import DB from "../../utils/DB";
import MapMgr from "../core/MapMgr";
import PetPracticeMgr from "./PetPracticeMgr";
import PalaceFight from "../activity/PalaceFight";
import ChargeConfig from "../core/ChargeConfig";
import RolePracticeMgr from "./RolePracticeMgr";
import NpcConfigMgr from "../core/NpcConfigMgr";
import HorseList from "../horse/HorseList";
import Agent from "../network/Agent";
import Exchange from "../core/Exchange";
import DateUtil from "../../gear/DateUtil";
import HorseSkill from "../horse/HorseSkill";
import Pet from "./Pet";
import SKDataUtil from "../../gear/SKDataUtil";
import Npc, { NpcCreater } from "../core/Npc";
import SkillUtil from "../skill/core/SkillUtil";
import ExpUtil from "../core/ExpUtil";
import SKLogger from "../../gear/SKLogger";
import GameUtil from "../core/GameUtil";
import ItemUtil from "../core/ItemUtil";
import SkillBase from "../skill/core/SkillBase";
import SKTimeUtil from "../../gear/SKTimeUtil";
import VIPUtil from "../role/VIPUtil";
import DugMgr from "../role/DugMgr";
import { BattleType, EActionType, EActType, EAttrCalType, EAttrTypeL1, EAttrTypeL2, EEquipPos, EEquipType, EEventType, MsgCode } from "../role/EEnum";
import SKDBUtil from "../../gear/SKDBUtil";
import { info } from "console";
import Log from "../../utils/Log";
import Signal from "../core/Signal";
import BangZhan from "../bang/BangZhan";
import NoticeMgr from "../core/NoticeMgr";
import Skin from "../role/Skin";
import MarryMgr from "../marry/MarryMgr";
import TianceMgr from "../tiance/TianceMgr";
import Bagua from "../bagua/Bagua";
import Bianshen from "../bianshen/Bianshen";
import YuanShen from "../yuanshen/YuanShen";


// 玩家
export default class Player extends BattleObj {
	accountid: number;
	roleid: number;
	agent: Agent;
	race: number;
	sex: number;
	weapon: string;
	state: number;
	equip_list: any;
	dir: number;
	aoi_model: string;
	aoi_obj_list: any;
	battle_id: number;
	stTaskMgr: RoleTaskMgr;
	partnerMgr: PartnerMgr;
	money: number;
	jade: number;
	bindjade: number;
	rewardrecord: number[];
	curPet: any;
	curPetId: number;
	lastonline: any;
	usingIncense: any;
	loaded: boolean;
	gmlevel: number;
	teamid: number;
	isleader: boolean;
	lastWorldChatTime: number;
	lastWorldChatStr: string;
	nFlag: number;
	offline: boolean;
	offlineTimer: NodeJS.Timeout;
	offlineTime: any = null;
	incenseTimer: NodeJS.Timeout;
	shape: number;
	inPrison: boolean;
	level_reward: string;
	getgift: any;
	getpet: number;
	shuilu: any;
	titleId: number;
	titleType: number;
	onLoad: boolean;
	bangid: number;
	bangname: string;
	bangpost: number;
	titles: any;
	schemeName: string;
	color1: any;
	color2: any;
	safe_password: string;
	safe_lock: number;
	friendList: any;
	applyFriendList: any;
	star: number;
	shane: any;
	titleVal: any;
	equipObjs: any;
	schemeMgr: any;
	xiulevel: any;
	currentEquips: Equip[];
	listEquips: Equip[];
	petList: Pet[];
	bag_list: any;
	locker_list: any;
	relivelist: any;
	lockerEquips: any[];
	tmpData: any;
	anleiCnt: any;
	horseList: HorseList;
	horseSkill: HorseSkill;
	wingId: number;
	exchange: Exchange;
	onlineTime: number = 0;
	createTime: number = 0;
	// 每日限购
	dayMap: any;
	// 宝藏
	treasure: any;
	// 存档计数
	saveTotal: number = 0;

	// 存档失败
	saveFailed: string[];
	//其他数据
	other:any= {};
	//禁止移动
	cantmove: boolean = false;

	//假人
	dummy: boolean = false;
	times: any;
	movetime: number;
	mt: any;
	bagtimes: any;

	isRobot:boolean = false;

	temp: any= {};
	auto: number[] = [0,0,0];
	
	yuanshenlevel: number;


	skins: any;
	marryid: number;
	childres: number;
	childname: string;

	bagua:any = {};
	tianceList:any = {};
	tiance:any = [];
	bianshen:any = {a:{},b:{}}; //a=拥有的变身卡 b=使用中的 [id,到期时间]

	constructor() {
		super();
		this.accountid = 0;
		this.roleid = 0;
		this.agent = null;

		this.race = GameUtil.raceType.Unknow; // 种族
		this.sex = GameUtil.sexType.Unknow;

		this.weapon = '';
		this.state = 1;

		// 装备列表
		this.equip_list = {};

		// dir 朝向   1		2
		// 4方向      3		4
		this.dir = 4;

		this.living_type = GameUtil.livingType.Player;
		this.aoi_model = "wm";
		this.aoi_obj_list = {};
		this.battle_id = 0;
		this.stTaskMgr = new RoleTaskMgr(this);
		this.partnerMgr = new PartnerMgr(this);
		this.money = 0;
		this.jade = 0;
		this.bindjade = 0;
		this.rewardrecord = [0,0,0,0,0,0];
		this.curPet = null;
		this.curPetId = 0;
		this.marryid = 0;
		this.lastonline = null;
		this.usingIncense = false;
		this.loaded = false; // 是否加载完毕，玩家进入了场景
		this.gmlevel = 0;

		this.teamid = 0;
		this.isleader = false;
		this.yuanshenlevel = 0;

		this.lastWorldChatTime = 0;
		this.lastWorldChatStr = '';
		this.nFlag = 0;

		this.offline = false;
		this.offlineTimer = null;
		this.offlineTime = null;

		this.shane = 0;
		this.inPrison = false;
		this.level_reward = '';
		this.getgift = {day:1,time:0};
		this.getpet = 1;

		this.shuilu = {
			season: 1,
			score: 0,
			gongji: 0,
			wtime: 0,
			ltime: 0,
		};
		//this.curtitle = 0;
		this.titleId = -1;
		this.titleType = -1;		//当前的称谓类型
		this.titleVal = '';			//当前称谓值
		this.onLoad = false;			//是否装载称谓

		this.bangid = 0;
		this.bangname = '';
		this.bangpost = 0;
		this.titles = [];

		this.schemeName = '套装方案';
		this.color1 = 0; // 染色部位1 
		this.color2 = 0; // 染色部位2
		this.safe_password = '';
		this.safe_lock = 0;

		this.other = {};

		this.friendList = {};// 好友列表
		this.applyFriendList = {};// 好友申请列表
		this.star = 1; // 击杀地煞星 星级
		this.wingId = 0; // 翅膀索引
		this.dayMap = {};
		this.times = 0;
		this.movetime = 0;

		
		this.childres = 0;
		this.childname = '';

		this.skins = {use:[0,0,0,0,0,0],has:[]};
		// this.mt = SKTimeUtil.loop(()=>{
		// 	if(Date.now() - this.movetime >= 5 * 60 * 1000 && this.level < 79 && this.relive < 1){
		// 		if(this.agent){
		// 			this.agent.close();
		// 			this.agent = null;
		// 		}
		// 		SKTimeUtil.cancelLoop(this.mt);
		// 		SKLogger.debug(`假人筛选程序踢出玩家 ${this.roleid}`);
		// 	}
		// },5 * 60 * 1000);
	}

	update(dt: number) {
		if (this.shane > 0) {
			this.shane--;
			if (this.shane <= 0) {
				this.shane = 0;
				this.ShanEChange();
			}
		}
		// 未关服则每30分钟存档一次
		if (dt % (GameUtil.savePlayerTime) == 0) {
			if (!GameUtil.isClose) {
				let self = this;
				this.saveAll((failed: string) => {
					if (failed.length > 0) {
						SKLogger.warn(`定时存档:玩家[${self.roleid}:${self.name}]存档失败:${failed}`);
					} else {
						SKLogger.debug(`玩家[${self.roleid}:${self.name}]定时存档成功!`);
					}
				});
			}
		}
		if (dt % (1000) == 0) {
			this.GetTaskMgr().OnTimer();
		}
	}

	

	GetFlag(nIndex: any): any {
		return GameUtil.getFlag(this.nFlag, nIndex);
	}

	SetFlag(nIndex: any, bValue: any) {
		this.nFlag = GameUtil.setFlag(this.nFlag, nIndex, bValue);
	}
	// 获得每日限购已购次数
	getDayCount(dayId: number): number {
		let count = this.dayMap[dayId];
		if (!count) {
			return 0;
		}
		return count;
	}
	// 增加加每日限购数量
	addDayCount(dayId: number, count: number) {
		let current = this.dayMap[dayId];
		if (!current) {
			this.dayMap[dayId] = count;
		} else {
			this.dayMap[dayId] = current + count;
		}
	}
	// 清空每日存档
	clearDayMap() {
		this.dayMap = {};
		let chargeSum = ChargeSum.shared.getPlayerChargeSum(this.roleid);
		let vipLevel = VIPUtil.getVipLevel(chargeSum);
		// 小于VIP等级的每日奖励已领取处理
		for (let i = 0; i < vipLevel; i++) {
			this.dayMap[`vip_${i}`] = 1;
		}
		this.send(`s2c_clear_day`, {
			dayMap: SKDataUtil.toJson(this.dayMap)
		});
	}

	//进入队伍
	OnEnterTeam() {
		this.GetTaskMgr().CheckAndInceptTask();
		this.GetTaskMgr().updateTaskStateToClient();
	}
	// 离开队伍
	leaveTeam() {
		if (this.teamid == 0) {
			SKLogger.debug(`玩家[${this.roleid}:${this.name}]已离队`);
			return;
		}
		this.teamid = 0;
		this.isleader = false;
		this.GetTaskMgr().leaveTeam();
		SKLogger.debug(`玩家[${this.roleid}:${this.name}]${this.isleader ? "队长" : "队员"}离开队伍${this.teamid}`);
	}

	getTeamId() {
		return this.teamid;
	}

	isTeamLeader() {
		if (this.teamid == 0) {
			return false;
		}
		return this.isleader;
	}

	GetTaskMgr(): RoleTaskMgr {
		if (!this.stTaskMgr) {
			this.stTaskMgr = new RoleTaskMgr(this);
		}
		return this.stTaskMgr;
	}

	//检查新的一天
	CheckNewDay() {
		if(this.lastonline){
			let cdate = new Date(GameUtil.gameTime);
			let ly = this.lastonline.getFullYear();
			let lm = this.lastonline.getMonth();
			let lw = GTimer.getYearWeek(this.lastonline);
			let ld = GTimer.getYearDay(this.lastonline);
			if (ly < cdate.getFullYear()) {
				this.OnNewYear();
			}
			if (lm < cdate.getMonth()) {
				this.OnNewMonth();
			}
			if (lw < GTimer.getYearWeek(cdate)) {
				this.OnNewWeek();
			}
			if (ld < GTimer.getYearDay(cdate)) {
				this.OnNewDay();
			}
		}
		this.lastonline = new Date(GameUtil.gameTime);
	}

	OnNewYear() {
		// 这辈子估计不会调用
	}
	OnNewMonth() {
	}

	OnNewWeek() {
	}

	OnNewDay() {
		this.GetTaskMgr().OnNewDay();
		let time = GTimer.dateFormat(GTimer.getCurTime());
		SKLogger.debug(`玩家[${this.name}(${this.roleid})], 任务刷新 于${time} `);
	}

	on5oclock() {
		if (this.GetTaskMgr() == null)
			return;
		this.GetTaskMgr().OnNewDay();
	}

	OnNewHour() {
	}

	setAgent(agent: any) {
		if (this.agent) {
			if (this.agent != agent) {
				SKLogger.debug(`玩家[${this.roleid}:${this.name}]在其他设备登录!`);
				this.agent.otherLogin();
			}
		}
		this.agent = agent;
	}

	//玩家离线
	playerOffline() {
		//离线状态无需操作
		if (this.offline) {
			return;
		}
		delete this.aoi_obj_list[this.onlyid];
		let self = this;
		//获取队伍成员
		let team = TeamMgr.shared.getTeamPlayer(this.teamid);
		//如果没有队伍或者队伍只有自己 启动定时销毁数据
		if (team == null || team.length <= 1) {
			//定时销毁数据/   改替换为假人
			this.offlineTimer = SKTimeUtil.delay(() => {
				//PlayerMgr.shared.playerOffline(this.roleid);
				self.destroy();
			}, GameUtil.playerSkipTime);

			this.offlineTime = GameUtil.gameTime;

			//存在战斗时通知战斗管理器离线
			if (this.battle_id != 0) {
				BattleMgr.shared.playerOffline(this.battle_id, this.onlyid);
			}
		}
		//存档
		this.saveAll((failed: string) => {
			if (failed.length > 0) {
				SKLogger.warn(`存档:玩家[${self.roleid}:${self.name}]离线存档失败!`);
			} else {
				SKLogger.debug(`存档:玩家[${self.roleid}:${self.name}]离线存档成功!`);
			}
		});
		//关系模块移除自身
		RelationMgr.shared.deleteTempRelationByPlayer(this.roleid);
		//置空socket代理
		this.agent = null;
		SKLogger.debug(`玩家[${this.roleid}:${this.name}]已离线`);
		//设置离线状态
		this.offline = true;
		//计算在线时长
		this.calcOnlineTime();

		let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.JueZhanChangAn);
		activity && activity.offline(this);
	}

	//激活套装
	activateScheme() {
		let scheme = this.schemeMgr.getActivateScheme();
		if (scheme) {
			this.addattr2 = scheme.content.attribute.addPoint;
			this.qianneng = scheme.content.attribute.qianNeng;
			this.addattr1 = scheme.content.defense.xiuPoint;
			this.xiulevel = scheme.content.defense.xiuLevel;
			for (const key in this.addattr1) {
				if (this.addattr1.hasOwnProperty(key)) {
					this.xiulevel += this.addattr1[key];
				}
			}
			for (let index = 0; index < this.currentEquips.length; index++) {
				this.currentEquips[index].pos = EEquipPos.BAG;
				this.addEquipList(this.currentEquips[index]);
			}
			this.currentEquips = [];
			for (var it in scheme.content.curEquips) {
				let eid = scheme.content.curEquips[it];
				let equip = this.equipObjs[eid];
				if (equip) {
					equip.pos = EEquipPos.USE;
					this.currentEquips.push(equip);
					for (let index = 0; index < this.listEquips.length; index++) {
						if (this.listEquips[index].EquipID == eid) {
							this.listEquips.splice(index, 1);
							break;
						}
					}
					if (equip.EIndex == 1) {
						this.changeWeapon(equip);
					}
				}
			}
			this.sendEquipList();
			this.schemeName = scheme.schemeName;
			this.partnerMgr.vecChuZhan = SKDataUtil.jsonBy(SKDataUtil.toJson(scheme.content.partner));
			this.calculateAttr();
			this.send('s2c_player_data', this.getData());
		}
	}
	//检查套装装备
	checkSchemeEquip(equipid: any): boolean {
		//装备
		let equip: Equip = this.equipObjs[equipid];
		let fullEquipData = equip.getFullData();
		if (fullEquipData.OwnerRoleId > 0 && fullEquipData.OwnerRoleId != this.resid) {
			this.send('s2c_notice', {
				strRichText: '角色不匹配，不能使用！'
			});
			return false;
		} else if ((fullEquipData.Sex != 9 && fullEquipData.Sex != this.sex) || (fullEquipData.Race != 9 && fullEquipData.Race != this.race)) {
			this.send('s2c_notice', {
				strRichText: '角色不匹配，不能使用！'
			});
			return false;
		}
		// if (fullEquipData.NeedGrade > this.level || fullEquipData.NeedRei > this.relive) {
		// 	this.send('s2c_notice', {
		// 		strRichText: '角色等级不足，尚不能使用！'
		// 	});
		// 	return;//转生或等级不符合
		// }
		if (fullEquipData.Shuxingxuqiu) { //属性需求不符合
			for (const key in fullEquipData.Shuxingxuqiu) {
				if (this.getAttr1(key) < fullEquipData.Shuxingxuqiu[key]) {
					this.send('s2c_notice', {
						strRichText: '角色属性不足，尚不能使用！'
					});
					return false;
				}
			}
		}
		return true;
	}
	//同步套装伙伴
	syncSchemePartner() {
		if (this.schemeMgr != null) {
			this.schemeMgr.syncSchemePartner();
		}
	}
	//销毁数据
	destroy() {
		//置空定时销毁句柄
		if (this.offlineTimer) {
			SKTimeUtil.cancelDelay(this.offlineTimer);
			this.offlineTimer = null;
		}
		//置空引妖香定时句柄
		if (this.incenseTimer) {
			SKTimeUtil.cancelDelay(this.incenseTimer);
			this.incenseTimer = null;
		}
		if (this.agent) {
			this.agent.close();
			this.agent = null;
		}
		for (let equipid in this.equipObjs) {
			EquipMgr.shared.delEquip(equipid);
		}
		let map = MapMgr.shared.getMap(this);
		if (map) {
			map.exitMap(this);
		}
		delete this.stTaskMgr;
		delete this.partnerMgr;
		PlayerMgr.shared.delPlayer(this.roleid);
		NpcMgr.shared.deletePlayersNpc(this.roleid);
		SKLogger.debug(`销毁离线玩家数据 ${this.roleid}`)
	}
	destroyMini(){
		if (this.offlineTimer) {
			SKTimeUtil.cancelDelay(this.offlineTimer);
			this.offlineTimer = null;
		}
		let map = MapMgr.shared.getMap(this);
		if (map) {
			map.exitMap(this);
		}
	}

	//假人
	setDBmini(data:any){
		this.dummy = true;
		this.accountid = data.accountid;
		this.roleid = data.roleid;
		this.mapid = data.mapid;
		this.race = data.race;
		this.name = data.name;
		this.sex = data.sex;
		this.exp = data.exp;
		this.x = data.x;
		this.y = data.y;
		this.relive = data.relive;
		this.level = data.level;
		this.resid = data.resid;
		this.currentEquips = [];
		this.dir = GameUtil.random(1,4);
		let titles: any = SKDataUtil.jsonBy(data.title);
		if (titles) {
			this.titles = titles.titles;
			this.onLoad = titles.onload;
			this.titles.filter((e: any) => {
				if (e.onload) {
					this.titleType = e.type;
					this.titleId = e.titleid;
					this.titleVal = e.value;
				}
			});
		}
		if (data.color && data.color.length > 0) {
			let colors = SKDataUtil.jsonBy(data.color);
			if (colors.c1) {
				this.color1 = colors.c1;
			}
			if (colors.c2) {
				this.color2 = colors.c2;
			}
		}
		this.horseList = new HorseList(this);
		this.horseList.horseIndex = SKDataUtil.clamp(data.horse_index, 0, 4);
		this.horseList.setDB(data.horseRows);
		this.offline= true;
		this.offlineTime= GameUtil.gameTime;
		this.stopIncense();
		let pMap = MapMgr.shared.getMap(this);
		this.skins = SKDataUtil.jsonBy(data.skins);
		this.skins||(this.skins= {use:[0,0,0,0,0,0],has:[]});
		pMap&&pMap.enterMap(this, GameUtil.livingType.Player);
		data.auto&&(this.auto = data.auto.split(','));

		this.marryid = data.marryid;
		if(this.marryid > 0){
			let marry = MarryMgr.shared.addMarryInfo(this, data.marry);
			marry && marry.child && (
				this.childres = marry.child.resid, 
				this.childname = marry.child.name
			);
		}

	}

	setDB(data: any, callback: Function = null) { // 读档
		data.lastonline = new Date(data.lastonline);
		if(!!isNaN(data.lastonline.getTime())){
			data.lastonline = new Date(GameUtil.gameTime);
		}
		this.accountid = data.accountid;
		this.roleid = data.roleid;
		this.mapid = data.mapid;
		this.race = data.race;
		this.name = data.name;
		this.level_reward = (data.level_reward || '');
		this.sex = data.sex;
		this.exp = data.exp;
		// 默认最低星 1星
		this.star = data.star;
		if (this.star < 1) {
			this.star = 1;
		}
		this.bag_list = SKDataUtil.jsonBy(data.bagitem) || {};
		// TODO 背包数据完毕
		// 设置称谓信息 
		// 称谓放在有关系统初始化之前，之后会操作称谓
		let titles: any = SKDataUtil.jsonBy(data.title);
		if (titles) {
			//this.curtitle = titles.curtitle;
			this.titles = titles.titles;
			this.onLoad = titles.onload;
			this.titles.filter((e: any) => {
				if (e.onload) {
					this.titleType = e.type;
					this.titleId = e.titleid;
					this.titleVal = e.value;
				}
			});
		}
		this.initBang(data.bangid);
		let partnerdata = SKDataUtil.jsonBy(data.partnerlist);
		this.partnerMgr.init(partnerdata);
		this.locker_list = SKDataUtil.jsonBy(data.lockeritem) || {};
		this.money = data.money;
		this.jade = data.jade;
		this.bindjade = data.bindjade || 0;
		this.rewardrecord = data.rewardrecord.toString().split(',');
		this.x = data.x;
		this.y = data.y;
		this.resid = data.resid;
		this.curPetId = data.pet;
		this.curPet = null;
		this.petList = [];
		this.lastonline = data.lastonline;
		this.createTime = data.create_time;
		this.nFlag = data.state;
		data.auto&&(this.auto = data.auto.split(','));
		data.skins&&(this.skins = SKDataUtil.jsonBy(data.skins));
		data.getgift&&(this.getgift = SKDataUtil.jsonBy(data.getgift));
		data.bagua && (this.bagua = SKDataUtil.jsonBy(data.bagua));
		data.bianshen && (this.bianshen = SKDataUtil.jsonBy(data.bianshen));
		if(data.tiancedata){
			TianceMgr.shared.initPlayer(this, data.tiancedata);
			data.tiance && (this.tiance = SKDataUtil.jsonBy(data.tiance));
		}

		// 等级相关
		let relivelist = [
			[0, 0],
			[0, 0],
			[0, 0],
			[0, 0],
		];
		let relist = SKDataUtil.jsonBy(data.relivelist) || relivelist;
		let fixed = 4 - relist.length;
		for (let i = 0; i < fixed; i++) {
			relist.push([0, 0]);
		}
		this.yuanshenlevel = data.yuanshenlevel || 0;
		this.relivelist = relist;
		this.relive = data.relive;
		this.level = data.level;
		if (data.color && data.color.length > 0) {
			let colors = SKDataUtil.jsonBy(data.color);
			if (colors.c1) {
				this.color1 = colors.c1;
			}
			if (colors.c2) {
				this.color2 = colors.c2;
			}
		}
		if (data.safecode && data.safecode.length > 0) {
			let array = data.safecode.split(':');
			this.safe_password = array[1] || '';
			this.safe_lock = parseInt(array[0]) || 0;
		}
		else {
			this.safe_password = '';
			this.safe_lock = 0;
		}
		this.currentEquips = [];
		this.listEquips = [];
		this.equipObjs = {};
		this.lockerEquips = [];
		let equipList: any = {};
		for (let k in data.equipRows) {
			let info = data.equipRows[k];
			equipList[info.EquipID] = info;
		}
		for (let equipid in equipList) {
			if (this.equipObjs[equipid] != null) {
				continue;
			}
			let info = SKDataUtil.valueForKey(equipList, equipid);
			if (info == null) {
				SKLogger.warn(``);
			} else {
				let equip = new Equip(info, this);
				switch (info.pos) {
					case EEquipPos.USE: {
						let find = false;
						for (let useequip of this.currentEquips) {
							if (useequip.EIndex == equip.EIndex) {
								find = true;
								equip.pos = EEquipPos.BAG;
								this.addEquipList(equip);
							}
						}
						if (!find) {
							this.currentEquips.push(equip);
							if (equip.EIndex == 6) {
								let conf = EquipMgr.shared.getXianQiBy(equip.Type);
								this.wingId = conf.Shape;
							}
						}
						break;
					}
					case EEquipPos.BAG: {
						this.addEquipList(equip);
						break;
					}
					case EEquipPos.BANK: {
						this.lockerEquips.push(equip);
						break;
					}
					default: {
						equip.pos = EEquipPos.BAG;
						this.addEquipList(equip);
					}
				}
				this.equipObjs[equip.EquipID] = equip;
				SKLogger.debug(`玩家[${this.roleid}:${this.name}]加入装备[${equip.EquipID}:${equip.name}]`);
			}
		}
		this.marryid = data.marryid;
		if(this.marryid > 0){
			let marry = MarryMgr.shared.addMarryInfo(this, data.marry);
			marry && marry.child && (
				this.childres = marry.child.resid, 
				this.childname = marry.child.name
			);
		}

		// 水陆大会信息
		this.initShuilu(data.shuilu);
		this.initRolePoint(data.addpoint);
		this.checkRolePoint();

		this.xiulevel = data.xiulevel;
		this.initXiuLianPoint(data.xiupoint);
		this.checkXiulianPoint();

		// 设置等级在属性设置 之后设置！
		this.setLevel(data.level);
		// 取消技能熟练度升级，直接满级
		this.resetSkill();
		this.getpet = data.getpet;
		this.gmlevel = data.gmlevel;
		this.tmpData = data;
		this.shane = data.shane;
		if (this.shane > 0) {
			let curDate = new Date();
			let passtime = (curDate.getTime() - data.lastonline.getTime()) / 1000;
			if (passtime > 0) {
				this.shane -= Math.floor(passtime * 4);
			}
			if (this.shane <= 0) {
				this.shane = 0;
			}
		}
		let schemeMgr = new SchemeMgr(this);
		this.schemeMgr = schemeMgr;
		this.schemeMgr.init();
		this.schemeMgr.initDefaultScheme();
		// 好友相关
		let friendlist: any = SKDataUtil.jsonBy(data.friendlist) || {};
		if (friendlist.version == 1) {
			for (let roleid in friendlist) {
				if (roleid == 'version') {
					delete friendlist['version'];
					continue;
				}
				if (friendlist.hasOwnProperty(roleid)) {
					let finfo = friendlist[roleid];
					try {
						finfo.name = Buffer.from(finfo.name, 'base64').toString();
					} catch (error) {
						SKLogger.warn(`好友名称[${finfo.name}]编码失败`);
					}
				}
			}
		}
		this.friendList = friendlist;
		// 兑换码
		this.exchange = new Exchange(this.roleid);
		this.exchange.readDB();
		// 坐骑
		this.horseList = new HorseList(this);
		this.horseList.horseIndex = SKDataUtil.clamp(data.horse_index, 0, 4);
		this.horseList.setDB(data.horseRows);
		// 坐骑技能
		this.horseSkill = new HorseSkill(this);
		this.horseSkill.setDB(data.horseSkillRows);
		this.setPetDB(data.petRows);
		this.loaded = true;
		if (data.day_count) {
			this.dayMap = (SKDataUtil.jsonBy(data.day_count) || {});
			if(SKDataUtil.isToday(data.lastonline)){
				this.dayMap = {};
			}
		}

		callback&&callback();
	}

	//设置套餐名
	setActivateSchemeName(schemeName: any) {
		this.schemeName = schemeName;
		this.send('s2c_player_data', this.getData());
	}

	initScheme() {
	}
	//检查装备是否存在
	checkEquipExist(equipId: any) {
		let checkRes = false;
		checkRes = this.currentEquips.some((e: any) => {
			return e.EquipID == equipId;
		})
		if (!checkRes) {
			return this.listEquips.some((e: any) => {
				return e.EquipID == equipId;
			});
		}
		return checkRes;
	}

	initBang(bangid: any) {
		// 检查是否被踢
		this.bangid = bangid;
		if (this.bangid > 0 && BangMgr.shared.bangList[this.bangid] == null) {
			this.bangid = 0;
		}
		if (this.bangid != 0) {
			let bang = BangMgr.shared.getBang(this.bangid);
			if (bang == null) {
				this.bangid = 0;
			} else {
				if (bang.isinit == true) {
					if (bang.checkPlayer(this.roleid)) {
						if (bang.masterid == this.roleid) {
							bang.mastername = this.name;
						}
						this.bangname = bang.name;
						this.bangpost = bang.getBangPost(this.roleid);
						if (bang.masterid == this.roleid) {
							this.addTitle(GameUtil.titleType.CommonTitle, GameUtil.titleBangType.BangZhu, '', false);
						} else {
							this.addTitle(GameUtil.titleType.CommonTitle, GameUtil.titleBangType.BangZhong, '', false);
						}
					} else {
						this.bangid = 0;
						this.bangname = '';
						this.bangpost = 0;
						this.delTitle(GameUtil.titleType.CommonTitle, GameUtil.titleBangType.BangZhu);
						this.delTitle(GameUtil.titleType.CommonTitle, GameUtil.titleBangType.BangZhong);
					}
				}
			}
		}
	}

	initShuilu(shuiluinfo: any) {
		this.shuilu = {
			season: 1,
			score: 0,
			gongji: 0,
			wtime: 0,
			ltime: 0,
		};
		if (shuiluinfo) {
			let t = SKDataUtil.jsonBy(shuiluinfo);
			this.shuilu.season = t.season ? t.season : 0;
			this.shuilu.score = t.score ? t.score : 0;
			this.shuilu.gongji = t.gongji ? t.gongji : 0;
			this.shuilu.wtime = t.wtime ? t.wtime : 0;
			this.shuilu.ltime = t.ltime ? t.ltime : 0;
		}
		let shuiludahui = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.ShuiLuDaHui);
		if (shuiludahui && this.shuilu.season != shuiludahui.season) {
			this.shuilu.season = shuiludahui.season;
			this.shuilu.score = 0;
			this.shuilu.wtime = 0;
			this.shuilu.ltime = 0;
		}
	}
	// 升级技能
	updateSkill(skillId: any) {
		if (this.skill_list[skillId] == null) {
			this.send('s2c_notice', {
				strRichText: `找不到技能[${SkillUtil.getSkillName(skillId)}]`
			});
			return;
		}
		let maxLevel = ExpUtil.getMaxSkillLevel(this.relive);
		if (this.skill_list[skillId] > maxLevel) {
			this.skill_list[skillId] = maxLevel;
		}
		if (this.skill_list[skillId] >= maxLevel) {
			this.send('s2c_notice', {
				strRichText: `技能[${SkillUtil.getSkillName(skillId)}]已经满级了!`
			});
			return;
		}
		this.skill_list[skillId] += 100;
		if (this.skill_list[skillId] > maxLevel) {
			this.skill_list[skillId] = maxLevel;
		}
		this.send('s2c_player_data', this.getData());
		let info = this.CostFee(GameUtil.goldKind.Money, 0); //升级技能所消耗的金币 // data.costMoney
		if (info.length > 0) {
			this.send('s2c_notice', {
				strRichText: info
			});
		}
	}
	//潜能加点
	addCustomPoint(data: any) {
		let addlist = SKDataUtil.jsonBy(data.addattr);
		let alladd = 0;
		for (const key in addlist) {
			if (addlist.hasOwnProperty(key)) {
				alladd += addlist[key];
			}
		}
		if (alladd == 0) {
			return;
		}
		if (alladd <= this.qianneng) {
			for (const key in this.addattr2) {
				if (addlist.hasOwnProperty(key) && this.addattr2.hasOwnProperty(key)) {
					this.addattr2[key] += addlist[key];
				}
			}
			this.calQianNeng();
			this.calculateAttr();
			this.send('s2c_player_data', this.getData());
			this.schemeMgr && this.schemeMgr.syncSchemePoint();
			this.save(false,"潜能加点");
		}
	}
	//初始化任务管理
	InitTaskMgr(taskstate: any) {
		let mapValue: any = SKDataUtil.jsonBy(taskstate) || {};
		let vecStateList = mapValue['StateList'] || [];
		let vecRecordList = mapValue['RecordList'] || [];
		let mapDailyCnt = mapValue['DailyCnt'] || {};
		let mapFuBenCnt = mapValue['FuBenCnt'] || {};
		let mapDailyStart = mapValue['DailyStart'] || {};
		let mapActiveScore = mapValue['mapActiveScore'] || {};
		let szBeenTake = mapValue['szBeenTake'] || [0, 0, 0, 0, 0, 0];
		this.GetTaskMgr().Init(vecStateList, vecRecordList, mapDailyCnt, mapFuBenCnt, mapDailyStart, mapActiveScore, szBeenTake);
	}
	// 设置召唤兽数据
	setPetDB(rows: any) {
		SKLogger.debug(`玩家[${this.roleid}:${this.name}]加载召唤兽列表...`);
		if(rows.length < 1){
			this.getpet = 0;
			return;
		}
		for (let k in rows) {
			let item = rows[k];
			if (item.state == 0) { // 被删除
				continue;
			}
			let pet = new Pet(item.dataid);
			pet.setOwner(this);
			pet.setDB(item);
			this.petList.push(pet);
			if (this.curPetId == 0) {
				this.curPetId = pet.petid;
				this.curPet = pet;
			} else if (this.curPetId == pet.petid) {
				this.curPet = pet;
			}
		}
	}
	// 重置技能,取消技能熟练度升级，直接满级
	resetSkill() {
		this.skill_list = SKDataUtil.clone(GameUtil.defineSkill[this.race][this.sex]);
		let maxLevel = ExpUtil.getMaxSkillLevel(this.relive);
		for (let skillId in this.skill_list) {
			this.skill_list[skillId] = maxLevel;
		}
	}
	// 初始化角色加点
	initRolePoint(rolepoints: any) {
		if (rolepoints == null) {
			return;
		}
		if (rolepoints && rolepoints.length > 0 && (rolepoints[0] == '{' || rolepoints[0] == '[')) {
			let setPonit2 = (key: any, num: any) => {
				if (typeof (num) == 'number' && !isNaN(num)) {
					this.addattr2[key] = num > 0 ? num : 0;
				}
			}
			let addpoint = SKDataUtil.jsonBy(rolepoints);
			if(addpoint == undefined || addpoint == null || SKDataUtil.isString(addpoint)){
				addpoint = {};
			}
			setPonit2(EAttrTypeL2.GENGU, addpoint[EAttrTypeL2.GENGU]);
			setPonit2(EAttrTypeL2.LINGXING, addpoint[EAttrTypeL2.LINGXING]);
			setPonit2(EAttrTypeL2.MINJIE, addpoint[EAttrTypeL2.MINJIE]);
			setPonit2(EAttrTypeL2.LILIANG, addpoint[EAttrTypeL2.LILIANG]);
		}
	}
	//更新好友
	updateFriend(pInfo: any) {
		let friend = this.friendList[pInfo.roleid];
		if (friend) {
			this.friendList[pInfo.roleid].name = pInfo.name;
		}
	}
	//获取好友数量
	getFriendNum() {
		let n = 0;
		for (const pid in this.friendList) {
			if (this.friendList.hasOwnProperty(pid)) {
				// const element = this.friendList[pid];
				n++;
			}
		}
		return n;
	}
	//检查潜能加点
	checkRolePoint() {
		let qncount = this.level * 4; // LevelMgr.getRoleLevelQianneng();
		let qn = 0;
		for (const key in this.addattr2) {
			if (this.addattr2.hasOwnProperty(key)) {
				qn += this.addattr2[key];
			}
		}
		if (qn > qncount) {
			this.resetRolePoint();
			this.calQianNeng();
		}
	}

	initXiuLianPoint(xiupoints: any) {
		if (xiupoints && xiupoints.length > 0 && (xiupoints[0] == '{' || xiupoints[0] == '[')) {
			let setPonit1 = (key: any, num: any) => {
				if (typeof (num) == 'number' && !isNaN(num)) {
					this.addattr1[key] = num > 0 ? num : 0;
				}
			}
			let xiupoint = SKDataUtil.jsonBy(xiupoints);
			if(xiupoint == undefined || xiupoint == null || SKDataUtil.isString(xiupoint)){
				xiupoint = {};
			}
			for (const attrtype in xiupoint) {
				if (xiupoint.hasOwnProperty(attrtype)) {
					const num = xiupoint[attrtype];
					setPonit1(attrtype, num);
				}
			}
		}
	}

	checkXiulianPoint() {
		let maxlevel = RolePracticeMgr.shared.GetMaxPriactiveLevel(this.relive);
		if (this.xiulevel > maxlevel) {
			this.xiulevel = maxlevel;
			this.resetXiulianPoint();
			return;
		}
		let xlpoint = 0
		for (const key in this.addattr1) {
			if (this.addattr1.hasOwnProperty(key)) {
				const p = this.addattr1[key];
				xlpoint += p;
			}
		}
		if (xlpoint > this.xiulevel) {
			this.resetXiulianPoint();
		}
	}

	getTotalQianneng() {
		return this.level * 4;
	}

	calQianNeng() {
		let qncount = this.level * 4; // LevelMgr.getRoleLevelQianneng();
		let qn = 0;
		for (const key in this.addattr2) {
			if (this.addattr2.hasOwnProperty(key)) {
				qn += this.addattr2[key];
			}
		}
		let left_qn = qncount - qn;
		this.qianneng = left_qn;
		//当潜能值发生变化时，同步方案潜能值
		this.schemeMgr && this.schemeMgr.syncSchemePoint();
	}

	calculatePointAttr() {
		this.calQianNeng();
		this.setAttr1(EAttrTypeL1.BONE, this.level + this.addattr2[EAttrTypeL1.BONE]);
		this.setAttr1(EAttrTypeL1.STRENGTH, this.level + this.addattr2[EAttrTypeL1.STRENGTH]);
		this.setAttr1(EAttrTypeL1.SPIRIT, this.level + this.addattr2[EAttrTypeL1.SPIRIT]);
		this.setAttr1(EAttrTypeL1.DEXTERITY, this.level + this.addattr2[EAttrTypeL1.DEXTERITY]);
	}
	
	yuanshenBaseAttr(){
		if (this.yuanshenlevel == 0) {
			return;
		}
		let arrt = YuanShen.shared.getAttr(this);
		for (const key in arrt) {
			this.attr1[key] += arrt[key];
		}
	}

	skinBaseAttr(){
		let arrt = Skin.shared.getAttr(this);
		for (const key in arrt) {
			this.attr1[key] += arrt[key];
		}
	}

	marryBaseAttr(){
		let arrt = MarryMgr.shared.getAttr(this);
		for (const key in arrt) {
			this.attr1[key] += arrt[key];
		}
	}
	baguaBaseAttr(){
		let arrt = Bagua.shared.getAttr(this);
		for (const key in arrt) {
			this.attr1[key] += arrt[key];
		}
	}
	tianceBaseAttr(){
		let arrt = TianceMgr.shared.getAttr(this);
		for (const key in arrt) {
			this.attr1[key] += arrt[key];
		}
	}
	bianshenBaseAttr(){
		let arrt = Bianshen.shared.getAttr(this);
		for (const key in arrt) {
			this.attr1[key] += arrt[key];
		}
	}

	calculateEquipAttr() {
		if (this.currentEquips) {
			let list = [EAttrTypeL1.HP, EAttrTypeL1.MP, EAttrTypeL1.HP_MAX, EAttrTypeL1.MP_MAX, EAttrTypeL1.ATK, EAttrTypeL1.SPD,
			EAttrTypeL1.HP_PERC, EAttrTypeL1.MP_PERC, EAttrTypeL1.ATK_PERC, EAttrTypeL1.SPD_PERC
			];
			for (const equip of this.currentEquips) {
				for (let key in EAttrTypeL1) {
					let value = SKDataUtil.toNumber(key);
					if (isNaN(value)) {
						continue;
					}
					if (list.indexOf(value) != -1) {
						continue;
					}
					let equipattr = equip.getAttr(value);
					if (equipattr == null || equipattr == 0) {
						continue;
					}
					let addattr = GameUtil.attrToBaseAttr[value];
					if (addattr != null) {
						let target_attr = addattr.target;
						if (addattr.cal == EAttrCalType.ADD_PERCENT) {
							this.attr1[target_attr] = (1 + equipattr / 100) * this.attr1[target_attr];
						} else if (addattr.cal == EAttrCalType.PERCENT) {
							this.attr1[target_attr] = (equipattr / 100) * this.attr1[target_attr];
						} else if (addattr.cal == EAttrCalType.ADD_NUM) {
							this.attr1[target_attr] += equipattr;
						}
					} else {
						this.attr1[value] += equipattr;
					}
				}
			}
		}
		this.checkBaldricSuit();
	}
	// 检查佩饰套装
	checkBaldricSuit() {
		let suitId: number = -1;
		let suitCount: number = 0;
		for (let equip of this.currentEquips) {
			if (ItemUtil.isBaldric(equip.EIndex)) {
				let itemData = ItemUtil.getItemData(equip.Type);
				if (itemData) {
					if (suitId == -1) {
						suitId = itemData.level;
						suitCount++;
					} else if (suitId == itemData.level) {
						suitCount++;
					} else {
						break;
					}
				}
			}
		}
		if (suitCount >= 5) {
			let suitData = ItemUtil.getBaldricSuit(suitId);
			if (suitData) {
				let skill = SkillUtil.getSkill(suitData.skill);
				if (skill) {
					this.calcBaldricSkill(skill, "佩饰技能");
				}
			}
		}
	}
	// 计算佩饰技能
	calcBaldricSkill(skill: SkillBase, prefix: string) {
		if (skill == null) {
			return;
		}
		if (skill.action_type != EActionType.PASSIVE) {
			return;
		}
		let effectMap = skill.effectMap;
		for (let key in effectMap) {
			let type: EAttrTypeL1 = SKDataUtil.toNumber(key);
			let ret = skill.getBaldricEffect(type);
			if (ret.add) {
				let old = SKDataUtil.toDecimal2(this.attr1[type]);
				this.attr1[type] = SKDataUtil.toDecimal2(old + ret.add);
				let current: number = this.attr1[type];
				SKLogger.debug(`玩家[${this.roleid}:${this.name}]佩饰技能[${skill.skill_name}][${GameUtil.attrTypeL1Name[type]}]改变[${ret.add}]:${old}->${current}`);
				let oldHP = this.attr1[EAttrTypeL1.HP];
				let oldMP = this.attr1[EAttrTypeL1.MP];
				let oldATK = this.attr1[EAttrTypeL1.ATK];
				let oldSPD = this.attr1[EAttrTypeL1.SPD];
				if (type == EAttrTypeL1.HP_MAX) {
					this.attr1[EAttrTypeL1.HP] = this.attr1[EAttrTypeL1.HP_MAX];
					SKLogger.debug(`玩家[${this.roleid}:${this.name}]佩饰技能[${skill.skill_name}]气血最大值改变:${oldHP}->${this.attr1[EAttrTypeL1.HP]}`);
				} else if (type == EAttrTypeL1.MP_MAX) {
					this.attr1[EAttrTypeL1.MP] = this.attr1[EAttrTypeL1.MP_MAX];
					SKLogger.debug(`玩家[${this.roleid}:${this.name}]佩饰技能[${skill.skill_name}]法力最大值改变:${oldMP}->${this.attr1[EAttrTypeL1.MP]}`);
				} else if (type == EAttrTypeL1.HP_PERC) {
					this.attr1[EAttrTypeL1.HP] = Math.floor(this.attr1[EAttrTypeL1.HP_MAX] * (1 + ret.add / 100));
					SKLogger.debug(`玩家[${this.roleid}:${this.name}]佩饰技能[${skill.skill_name}]气血百分比改变:${oldHP}->${this.attr1[EAttrTypeL1.HP]}`);
				} else if (type == EAttrTypeL1.MP_PERC) {
					this.attr1[EAttrTypeL1.MP] = Math.floor(this.attr1[EAttrTypeL1.MP_MAX] * (1 + ret.add / 100));
					SKLogger.debug(`玩家[${this.roleid}:${this.name}]佩饰技能[${skill.skill_name}]法力百分比改变:${oldMP}->${this.attr1[EAttrTypeL1.MP]}`);
				} else if (type == EAttrTypeL1.ATK_PERC) {
					this.attr1[EAttrTypeL1.ATK] = Math.floor(this.attr1[EAttrTypeL1.ATK] * (1 + ret.add / 100));
					SKLogger.debug(`玩家[${this.roleid}:${this.name}]佩饰技能[${skill.skill_name}]攻击百分比改变:${oldATK}->${this.attr1[EAttrTypeL1.ATK]}`);
				} else if (type == EAttrTypeL1.SPD_PERC) {
					this.attr1[EAttrTypeL1.SPD] = Math.floor(this.attr1[EAttrTypeL1.SPD] * (1 + ret.add / 100));
					SKLogger.debug(`玩家[${this.roleid}:${this.name}]佩饰技能[${skill.skill_name}]速度百分比改变:${oldSPD}->${this.attr1[EAttrTypeL1.SPD]}`);
				}
			}
		}
	}

	// 基础百分比气血等 属性放在 等级计算等级之后
	calculateEquipBaseAttr() {
		if (this.currentEquips) {
			let list = [EAttrTypeL1.HP_ADD, EAttrTypeL1.MP_ADD]; //, EAttrTypeL1.AATK, EAttrTypeL1.ASPD
			for (let equip of this.currentEquips) {
				for (let key in EAttrTypeL1) {
					let value = SKDataUtil.toNumber(key);
					if (isNaN(value)) {
						continue;
					}
					if (list.indexOf(value) == -1) {
						continue;
					}
					let equipattr = equip.getAttr(value);
					if (equipattr == null || equipattr == 0) {
						continue;
					}
					let addattr = GameUtil.attrToBaseAttr[value];
					if (addattr != null) {
						let target_attr = addattr.target;
						if (addattr.cal == EAttrCalType.ADD_PERCENT) {
							this.attr1[target_attr] = Math.floor((1 + equipattr / 100) * this.attr1[target_attr]);
						} else if (addattr.cal == EAttrCalType.PERCENT) {
							this.attr1[target_attr] = Math.floor((equipattr / 100) * this.attr1[target_attr]);
						} else if (addattr.cal == EAttrCalType.ADD_NUM) {
							this.attr1[target_attr] = Math.floor(this.attr1[target_attr] + equipattr);
						}
					} else {
						this.attr1[value] = Math.floor(this.attr1[value] + equipattr);
					}
				}
			}
		}
	}

	addXiulianPoint(data: any) {
		if (!data) {
			return;
		}
		// 重置修炼点
		if (data.type == 0) {
			let strErr = this.CostFee(GameUtil.goldKind.Money, 200000);
			if (strErr != '') {
				return;
			}
			this.resetXiulianPoint();
			this.calculateAttr();
			this.send('s2c_player_data', this.getData());
			this.schemeMgr && this.schemeMgr.syncSchemePoint();
			return;
		}

		if (data.type == 1) {
			let sumpoint = 0;
			let addpoint: any = {};
			addpoint = SKDataUtil.jsonBy(data.info);
			for (const key in addpoint) {
				let max = RolePracticeMgr.shared.GetMaxXiulianPoint(this.relive,key);
				if(max && max > 0){
					let total = this.addattr1[key] + addpoint[key];
					if(total > max){
						this.send('s2c_notice', {
							strRichText: '超出最大可加点'
						});
						return;
					}
				}
				sumpoint += addpoint[key];
			}
			/*
			let curpoint = 0;
			for (const key in this.addattr1) {
				curpoint += this.addattr1[key];
			}
			
			if (sumpoint + curpoint > this.xiulevel) {
				return;
			}
			*/

			if (sumpoint > this.xiulevel) {
				return;
			}
			for (const key in addpoint) {
				if (this.addattr1[key] == null) {
					this.addattr1[key] = 0;
				}
				this.addattr1[key] += addpoint[key];
			}
		}
		this.checkXiulianPoint();
		this.calculateAttr();
		this.send('s2c_player_data', this.getData());
		this.save(false,"修炼加点");
	}

	resetRolePoint() {
		//重置加点
		this.addattr2[EAttrTypeL2.GENGU] = 0;
		this.addattr2[EAttrTypeL2.LINGXING] = 0;
		this.addattr2[EAttrTypeL2.MINJIE] = 0;
		this.addattr2[EAttrTypeL2.LILIANG] = 0;
		for (let equip of this.currentEquips) {
			this.addEquipList(equip);
		}
		this.currentEquips = [];
		this.changeWeapon(null);
		this.save(false,"重置角色加点");
	}

	resetXiulianPoint() {
		for (const key in this.addattr1) {
			this.addattr1[key] = 0;
		}
		this.save(false,"重置修炼加点");
	}

	xiulianUpgrade(data: any) {
		let maxxiulian = RolePracticeMgr.shared.GetMaxPriactiveLevel(this.relive);
		if (this.xiulevel < maxxiulian) {
			this.xiulevel++;
			this.send('s2c_player_data', this.getData());
			this.send('s2c_notice', {
				strRichText: '获得1个修炼点'
			});
			this.schemeMgr && this.schemeMgr.syncSchemePoint();
			this.save(false,"修炼升级");
		} else {
			this.send('s2c_notice', {
				strRichText: '修炼点已达到上限'
			});
		}
	}


	getEquipAttr(attrtype: number): number {
		let tmp = 0;
		for (const equip of this.currentEquips) {
			tmp += equip.getAttr(attrtype);
		}
		return tmp;
	}

	calculateLevel() {
		let int = Math.floor;
		let E = int((100 - this.level) / 5);
		let L = this.level;

		let Gs = GameUtil.growPre[this.race];
		let P = this.getAttr1(EAttrTypeL2.GENGU); // + this.getEquipAttr(EAttrTypeL1.GENGU);
		let G = Gs[EAttrTypeL2.GENGU];
		let base = GameUtil.baseAttr[this.race][EAttrTypeL1.HP];

		let Fs: any = this.getReliveFix();

		let F: any = (Fs[EAttrTypeL1.HP] != null) ? Fs[EAttrTypeL1.HP] : 1;
		let hp = int((int((L + E) * P * G + base) + this.getEquipAttr(EAttrTypeL1.HP_MAX)) * (1 + F / 100));
		P = this.getAttr1(EAttrTypeL2.LINGXING); // + this.getEquipAttr(EAttrTypeL1.LINGXING);
		G = Gs[EAttrTypeL2.LINGXING];
		base = GameUtil.baseAttr[this.race][EAttrTypeL1.MP];
		F = (Fs[EAttrTypeL1.MP] != null) ? Fs[EAttrTypeL1.MP] : 1;
		let mp = int((int((L + E) * P * G + base) + this.getEquipAttr(EAttrTypeL1.MP_MAX)) * (1 + F / 100));

		P = this.getAttr1(EAttrTypeL2.LILIANG); // + this.getEquipAttr(EAttrTypeL1.LILIANG);
		G = Gs[EAttrTypeL2.LILIANG];
		base = GameUtil.baseAttr[this.race][EAttrTypeL1.ATK];
		F = (Fs[EAttrTypeL1.ATK] != null) ? Fs[EAttrTypeL1.ATK] : 1;
		let atk = int((L + E) * P * G / 5 + base + this.getEquipAttr(EAttrTypeL1.ATK) * (1 + F / 100));

		P = this.getAttr1(EAttrTypeL2.MINJIE); // + this.getEquipAttr(EAttrTypeL1.MINJIE);
		G = Gs[EAttrTypeL2.MINJIE];
		base = GameUtil.baseAttr[this.race][EAttrTypeL1.SPD];
		F = (Fs[EAttrTypeL1.SPD] != null) ? Fs[EAttrTypeL1.SPD] : 1;
		let spd = int((int((10 + P) * G) + this.getEquipAttr(EAttrTypeL1.SPD)) * (1 + F / 100))


		this.attr1[EAttrTypeL1.HP] = hp;
		this.attr1[EAttrTypeL1.HP_MAX] = hp;
		this.attr1[EAttrTypeL1.MP] = mp;
		this.attr1[EAttrTypeL1.MP_MAX] = mp;
		this.attr1[EAttrTypeL1.ATK] = atk;
		this.attr1[EAttrTypeL1.SPD] = spd;

		this.calculateEquipBaseAttr();

		this.hp = this.attr1[EAttrTypeL1.HP];
		this.maxhp = this.attr1[EAttrTypeL1.HP];
		this.mp = this.attr1[EAttrTypeL1.MP];
		this.maxmp = this.attr1[EAttrTypeL1.MP];
		this.atk = this.attr1[EAttrTypeL1.ATK];
		this.spd = this.attr1[EAttrTypeL1.SPD];
		this.attr1[EAttrTypeL1.HP_MAX] = this.attr1[EAttrTypeL1.HP];
		this.attr1[EAttrTypeL1.MP_MAX] = this.attr1[EAttrTypeL1.MP];

		if (this.race == GameUtil.raceType.Humen) {
			// 抗混乱 封印 毒 昏睡 每4级 + 1
			this.attr1[EAttrTypeL1.K_CONFUSION] += 0 + int(L / 4);
			this.attr1[EAttrTypeL1.K_SEAL] += 0 + int(L / 4);
			this.attr1[EAttrTypeL1.K_SLEEP] += 0 + int(L / 4);
			this.attr1[EAttrTypeL1.K_POISON] += 0 + int(L / 4);
		} else if (this.race == GameUtil.raceType.Sky) {
			this.attr1[EAttrTypeL1.K_WATER] += 0 + int(L / 8);
			this.attr1[EAttrTypeL1.K_FIRE] += 0 + int(L / 8);
			this.attr1[EAttrTypeL1.K_THUNDER] += 0 + int(L / 8);
			this.attr1[EAttrTypeL1.K_WIND] += 0 + int(L / 8);
		} else if (this.race == GameUtil.raceType.Demon) {
			this.attr1[EAttrTypeL1.K_PHY_GET] += 0 + int(L / 8);

			this.attr1[EAttrTypeL1.K_CONFUSION] += 0 + int(L / 8);
			this.attr1[EAttrTypeL1.K_SEAL] += 0 + int(L / 8);
			this.attr1[EAttrTypeL1.K_SLEEP] += 0 + int(L / 8);
			this.attr1[EAttrTypeL1.K_POISON] += 0 + int(L / 8);

			this.attr1[EAttrTypeL1.K_WATER] += 0 + int(L / 12);
			this.attr1[EAttrTypeL1.K_FIRE] += 0 + int(L / 12);
			this.attr1[EAttrTypeL1.K_THUNDER] += 0 + int(L / 12);
			this.attr1[EAttrTypeL1.K_WIND] += 0 + int(L / 12);
		} else if (this.race == GameUtil.raceType.Ghost) {
			this.attr1[EAttrTypeL1.K_CONFUSION] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_SEAL] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_SLEEP] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_POISON] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_FORGET] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_WILDFIRE] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_BLOODRETURN] += 0 + int(L / 6);

			this.attr1[EAttrTypeL1.K_WATER] += 0 - int(L / 8);
			this.attr1[EAttrTypeL1.K_FIRE] += 0 - int(L / 8);
			this.attr1[EAttrTypeL1.K_THUNDER] += 0 - int(L / 8);
			this.attr1[EAttrTypeL1.K_WIND] += 0 - int(L / 8);

			this.attr1[EAttrTypeL1.PHY_HIT] += 0 + int(L / 4);
			this.attr1[EAttrTypeL1.PHY_DODGE] += 0 + int(L / 4);
		} else if (this.race == GameUtil.raceType.Dragon) {
			this.attr1[EAttrTypeL1.K_CONFUSION] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_SEAL] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_SLEEP] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_POISON] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_FORGET] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_WILDFIRE] += 0 + int(L / 6);
			this.attr1[EAttrTypeL1.K_BLOODRETURN] += 0 + int(L / 6);

			this.attr1[EAttrTypeL1.K_WATER] += 0 - int(L / 8);
			this.attr1[EAttrTypeL1.K_FIRE] += 0 - int(L / 8);
			this.attr1[EAttrTypeL1.K_THUNDER] += 0 - int(L / 8);
			this.attr1[EAttrTypeL1.K_WIND] += 0 - int(L / 8);

			this.attr1[EAttrTypeL1.PHY_HIT] += 0 + int(L / 4);
			this.attr1[EAttrTypeL1.PHY_DODGE] += 0 + int(L / 4);
		}
	}

	getReliveFix() {
		let Fs: any = {};
		let relivefixs = [GameUtil.reliveFixAttr1, GameUtil.reliveFixAttr2, GameUtil.reliveFixAttr3, GameUtil.reliveFixAttr4];
		for (let index = 0; index < this.relive; index++) {
			let rerace = this.relivelist[index][0];
			let resex = this.relivelist[index][1];
			let tmp: any = relivefixs[index][rerace][resex];
			for (const attr1 in tmp) {
				const num = tmp[attr1];
				if (Fs[attr1] == null) {
					Fs[attr1] = 0;
				}
				Fs[attr1] += num;
			}
		}
		return Fs;
	}

	calculateReliveAttr() {
		if (this.relive == 0) {
			return;
		}
		let list = [EAttrTypeL1.HP, EAttrTypeL1.HP_MAX, EAttrTypeL1.MP, EAttrTypeL1.MP_MAX, EAttrTypeL1.ATK, EAttrTypeL1.SPD];
		let Fs = this.getReliveFix();

		for (const key in Fs) {
			if (Fs.hasOwnProperty(key)) {
				const addattr = Fs[key];
				const id = parseInt(key);
				if (list.indexOf(id) == -1) {
					this.attr1[key] += addattr;
				} else {
					// this.attr1[key] = Math.ceil(this.attr1[key] * (1 + addattr / 100));
				}
			}
		}
	}

	calculateXiuAttr() {
		this.attr1[EAttrTypeL1.K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT] = 100 + (this.addattr1[EAttrTypeL1.K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT] == null ? 0 : this.addattr1[EAttrTypeL1.K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT] * 2.5);
		this.attr1[EAttrTypeL1.K_SEAL] += (this.addattr1[EAttrTypeL1.K_SEAL] == null ? 0 : this.addattr1[EAttrTypeL1.K_SEAL] * 5);
		this.attr1[EAttrTypeL1.K_CONFUSION] += (this.addattr1[EAttrTypeL1.K_CONFUSION] == null ? 0 : this.addattr1[EAttrTypeL1.K_CONFUSION] * 5);
		this.attr1[EAttrTypeL1.K_SLEEP] += (this.addattr1[EAttrTypeL1.K_SLEEP] == null ? 0 : this.addattr1[EAttrTypeL1.K_SLEEP] * 5);
		this.attr1[EAttrTypeL1.K_FORGET] += (this.addattr1[EAttrTypeL1.K_FORGET] == null ? 0 : this.addattr1[EAttrTypeL1.K_FORGET] * 5);

		if (this.attr1[EAttrTypeL1.K_SEAL] > this.attr1[EAttrTypeL1.K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT]) {
			this.attr1[EAttrTypeL1.K_SEAL] = this.attr1[EAttrTypeL1.K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT];
		}
		if (this.attr1[EAttrTypeL1.K_CONFUSION] > this.attr1[EAttrTypeL1.K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT]) {
			this.attr1[EAttrTypeL1.K_CONFUSION] = this.attr1[EAttrTypeL1.K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT];
		}
		if (this.attr1[EAttrTypeL1.K_SLEEP] > this.attr1[EAttrTypeL1.K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT]) {
			this.attr1[EAttrTypeL1.K_SLEEP] = this.attr1[EAttrTypeL1.K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT];
		}
		if (this.attr1[EAttrTypeL1.K_FORGET] > this.attr1[EAttrTypeL1.K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT]) {
			this.attr1[EAttrTypeL1.K_FORGET] = this.attr1[EAttrTypeL1.K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT];
		}

		this.attr1[EAttrTypeL1.K_WIND] += (this.addattr1[EAttrTypeL1.K_WIND] == null ? 0 : this.addattr1[EAttrTypeL1.K_WIND] * 5);
		this.attr1[EAttrTypeL1.K_THUNDER] += (this.addattr1[EAttrTypeL1.K_THUNDER] == null ? 0 : this.addattr1[EAttrTypeL1.K_THUNDER] * 5);
		this.attr1[EAttrTypeL1.K_WATER] += (this.addattr1[EAttrTypeL1.K_WATER] == null ? 0 : this.addattr1[EAttrTypeL1.K_WATER] * 5);
		this.attr1[EAttrTypeL1.K_FIRE] += (this.addattr1[EAttrTypeL1.K_FIRE] == null ? 0 : this.addattr1[EAttrTypeL1.K_FIRE] * 5);

		this.attr1[EAttrTypeL1.K_WILDFIRE] += (this.addattr1[EAttrTypeL1.K_WILDFIRE] == null ? 0 : this.addattr1[EAttrTypeL1.K_WILDFIRE] * 5);
		this.attr1[EAttrTypeL1.K_BLOODRETURN] += (this.addattr1[EAttrTypeL1.K_BLOODRETURN] == null ? 0 : this.addattr1[EAttrTypeL1.K_BLOODRETURN] * 5);
		this.attr1[EAttrTypeL1.K_POISON] += (this.addattr1[EAttrTypeL1.K_POISON] == null ? 0 : this.addattr1[EAttrTypeL1.K_POISON] * 5);
		this.attr1[EAttrTypeL1.PHY_GET] += (this.addattr1[EAttrTypeL1.PHY_GET] == null ? 0 : this.addattr1[EAttrTypeL1.PHY_GET] * 4);
	}
	// 全部存档
	saveAll(callback: (failed: string) => void) {
		DB.updateRole(this.roleid);
		DB.savePlayerInfo(this.roleid, this.toSaveObj(), (code: number, msg: string) => {
			let info = `存档:玩家[${this.roleid}:${this.name}]角色存档`;
			if (code == MsgCode.SUCCESS) {
				info += `成功!`;
				SKLogger.debug(info);
			} else {
				info += `失败:[${msg}]!`;
				SKLogger.warn(info);
			}
			callback(msg);
		});
	}


	/**
	 * 角色属性存档
	 * @param sleep 是否延迟
	 * @param soucre 存档原因
	 */
	save(sleep: boolean = false, soucre: any = '角色属性存档'){
		let self = this;
		if(sleep){
			//延迟5s存档
			if(this.times != 0){
				SKTimeUtil.cancelDelay(this.times);
				this.times = 0;
			}
			this.times = SKTimeUtil.delay(()=>{
				self.save(false,soucre);
			},5 * 1000);
			return;
		}
		DB.savePlayerInfo(this.roleid, this.toSaveObj(), (code: number, msg: string) => {
			if (code == MsgCode.SUCCESS) {
				SKLogger.debug(soucre);
			}
		});
	}

	//转到数据库存档数据
	toSaveObj(){
		if (this.mapid == 3002 || this.mapid == 3001 ) {
			this.mapid = 1011;
			this.x = 237;
			this.y = 19;
		}
		if (this.mapid == 5001 ) {
			this.mapid = 1011;
			this.x = 112;
			this.y = 78;
		}
		if (this.mapid == 1201 && !this.inPrison) {
			this.mapid = 1011;
			this.x = 112;
			this.y = 78;
		}
		let title = SKDataUtil.toJson({
			onload: this.onLoad,
			titles: this.titles,
		});
		let partnerList: string = "";
		if (this.partnerMgr) {
			partnerList = this.partnerMgr.toJson();
		}
		let color = { c1: this.color1, c2: this.color2 };

		let friendlist = SKDataUtil.clone(this.friendList);
		/*for (let roleid in friendlist) {
			if (friendlist.hasOwnProperty(roleid)) {
				if (roleid == 'version') {
					continue;
				}
				let finfo = friendlist[roleid];
				finfo.name = Buffer.from(finfo.name).toString('base64');
			}
		}*/
		let dbinfo = {
			roleid: this.roleid,
			accountid: this.accountid,
			serverid: GameUtil.serverId,
			name: this.name,
			resid: this.resid,
			race: this.race,
			sex: this.sex,
			relive: this.relive,
			relivelist: this.relivelist,
			level: this.level,
			level_reward: this.level_reward,
			exp: this.exp,
			day_count: this.dayMap,
			chargesum: ChargeSum.shared.getPlayerChargeSum(this.roleid),
			money: this.money,
			jade: this.jade,
			mapid: this.mapid,
			x: this.x,
			y: this.y,
			bangid: this.bangid,
			color: color,
			star: this.star,
			shane: this.shane,
			addpoint: this.addattr2,
			xiupoint: this.addattr1,
			xiulevel: this.xiulevel,
			title: title,
			skill: this.skill_list,
			bagitem: this.bag_list,
			lockeritem: this.locker_list,
			other: this.other,
			
			pet: this.curPetId,
			getpet: this.getpet,
			equiplist: '[]',
			taskstate: this.taskStateToJson(),
			partnerlist: partnerList,
			rewardrecord: this.rewardrecord.join(','),
			getgift: this.getgift,
			shuilu: this.shuilu,
			active_scheme_name: this.schemeName,
			friendlist: friendlist,
			gmlevel: this.gmlevel,
			state: this.nFlag,
			horse_index: this.horseList && (this.horseList.horseIndex || 0),
			lastonline: SKDBUtil.toString(this.lastonline),
			skins : this.skins,
			marryid: this.marryid,
			bagua: this.bagua,
			tiance: this.tiance,
			bianshen: this.bianshen,
			yuanshenlevel : this.yuanshenlevel,
		};
		return dbinfo;
	}


	toObj() {
		let teamPlayers = TeamMgr.shared.getTeamPlayer(this.teamid);
		let obj: any = super.toObj();
		obj.relive = this.relive;
		obj.xiulevel = this.xiulevel;
		obj.level = this.level;
		obj.accountid = this.accountid;
		obj.roleid = this.roleid;
		obj.resid = this.resid;
		obj.race = this.race;
		obj.sex = this.sex;
		obj.bangid = this.bangid;
		obj.livingtype = this.living_type;
		obj.teamid = this.teamid;
		obj.isleader = this.isleader;
		obj.teamcnt = teamPlayers == null ? 0 : teamPlayers.length;
		obj.weapon = this.getWeapon();
		obj.battleid = this.battle_id;
		// obj.shane = this.shane;
		// obj.title = this.getTitleStr();
		obj.bangname = this.bangname;
		obj.titletype = this.titleType;
		obj.titleid = this.titleId;
		obj.titleval = this.titleVal;
		obj.color1 = this.color1;
		obj.color2 = this.color2;
		obj.schemename = this.schemeName;
		obj.safepassword = this.safe_password;
		obj.safelock = this.safe_lock;
		obj.horseList = this.horseList.toObj();
		obj.wingId = this.wingId;
		obj.dayMap = SKDataUtil.toJson(this.dayMap);
		obj.chargesum = ChargeSum.shared.getPlayerChargeSum(this.roleid);
		obj.dir = this.dir;
		obj.skins = this.skins.use;
		obj.childres = this.childres;
		obj.childname = this.childname;
		if(this.bianshen && this.bianshen.c && this.bianshen.c[1] > GameUtil.gameTime){
			obj.bianshenid = this.bianshen.c[0];
		}
		return obj;
	}

	getWeapon() {
		for (let equip of this.currentEquips) {
			if (equip.EIndex == 1) {
				let equipobj: any = {};
				equipobj.equipid = equip.EquipID;
				equipobj.gemcnt = equip.GemCnt;
				equipobj.type = equip.EquipType;
				equipobj.level = equip.Grade;
				return SKDataUtil.toJson(equipobj);
			}
		}
		return '';
	}

	getData() {
		let obj: any = {};
		obj.onlyid = this.onlyid;
		obj.qianneng = this.qianneng;
		obj.attr1 = SKDataUtil.toJson(this.attr1);
		obj.xiulevel = this.xiulevel;
		obj.addattr1 = SKDataUtil.toJson(this.addattr1);
		obj.addattr2 = SKDataUtil.toJson(this.addattr2);
		obj.skill = SKDataUtil.toJson(this.skill_list);
		obj.level = this.level;
		obj.exp = this.exp;
		obj.bangid = this.bangid;
		obj.race = this.race;
		obj.sex = this.sex;
		obj.maxexp = this.maxexp;
		obj.money = this.money;
		obj.jade = this.jade;
		obj.bindjade = this.bindjade;
		obj.gmlevel = this.gmlevel;
		obj.chargesum = ChargeSum.shared.getPlayerChargeSum(this.roleid);
		obj.rewardrecord = this.rewardrecord;
		obj.levelreward = this.level_reward;
		obj.shuilugj = this.shuilu.gongji;
		obj.titleval = this.titleVal;
		obj.titletype = this.titleType;
		obj.titleid = this.titleId;
		obj.color1 = this.color1;
		obj.color2 = this.color2;
		obj.schemename = this.schemeName;
		obj.wingId = this.wingId;
		obj.skins = this.skins.use;
		obj.marryid = this.marryid;
		obj.auto = this.auto;
		this.bianshen.c && (obj.bianshen = this.bianshen.c.join(','))
		return obj;
	}

	setLevel(level: any, issend?: any) {
		let maxlevel = ExpUtil.getUserMaxGrade(this.relive);
		this.level = Math.min(level, maxlevel);
		SKLogger.debug(`玩家[${this.name}${this.roleid}]等级改变，当前${this.level}级`);
		this.maxexp = ExpUtil.getPlayerUpgradeExp(this.relive, this.level);
		this.calQianNeng();
		this.calculateAttr();
		if (this.partnerMgr) {
			this.partnerMgr.checkAndAddPartner();
			if (this.level <= GameUtil.limitPartnerLevel) {
				this.partnerMgr.UpdatePartnerLevelAsPlayer();
			}
		}
		PaiHangMgr.shared.CheckAndInsertLevelPaihang(this.roleid, this.name, this.relive, this.level, this.money);
		if (issend) {
			this.send('s2c_level_up', {
				onlyid: this.onlyid,
				curlevel: this.level,
			});
		}
	}

	taskStateToJson(): string {
		let mapValue: any = {};
		let vecData = [];
		if (this.GetTaskMgr()) {
			if (this.GetTaskMgr().mapTaskState) {
				for (let it in this.GetTaskMgr().mapTaskState) {
					let stTaskState = this.GetTaskMgr().mapTaskState[it];
					let nCurStep = 0;

					for (let it2 in stTaskState.vecEventState) {
						if (stTaskState.vecEventState[it2].nState == 1)
							nCurStep = Number(it2);
					}
					vecData.push({
						nTaskID: stTaskState.nTaskID,
						nCurStep: nCurStep
					});
				}
			}
			mapValue['RecordList'] = this.GetTaskMgr().vecRecord;
			mapValue['DailyCnt'] = this.GetTaskMgr().mapDailyCnt;
			mapValue['FuBenCnt'] = this.GetTaskMgr().mapFuBenCnt;
			mapValue['DailyStart'] = this.GetTaskMgr().mapDailyStart;
			mapValue['mapActiveScore'] = this.GetTaskMgr().mapActiveScore;
			mapValue['szBeenTake'] = this.GetTaskMgr().szBeenTake;
		}
		mapValue['StateList'] = vecData;
		return mapValue;
	}

	//////////////////////////////  物品 相关   /////////////////////////////
	update_bagitem(data: any) {
		if (data.operation == 0) {
			if (this.bag_list[data.itemid] == null || this.bag_list[data.itemid] < data.count) {
				this.send('s2c_operation_result', {
					code: MsgCode.ITEM_OPERATION_ERROR
				});
			} else {
				this.bag_list[data.itemid] -= data.count;
				if (this.bag_list[data.itemid] <= 0) {
					delete this.bag_list[data.itemid];
				}
				this.send('s2c_bagitem', {
					info: SKDataUtil.toJson(this.bag_list)
				});
				Log.subItem(this.roleid, data.itemid, data.count);
				this.save(true,"背包物品更新");
			}
		} else {
			SKLogger.warn(`玩家[${this.roleid}:${this.name}]尝试使用后门添加物品, 封号`);
			DB.FreezePlayer(this.accountid);
			Signal.shared.DeleteTocken(this.accountid);
			this.destroy();

			/* 后门代码
			if (this.bag_list[data.itemid] == null) {
				this.bag_list[data.itemid] = data.count;
			} else {
				this.bag_list[data.itemid] += data.count;
			}
			*/
		}
	}

	//仓库物品变动
	update_lockeritem(data: any) {
		if (data.operation == 1) {
			if (this.getLockerItemAllKindNum() >= GameUtil.limitLockerKindNum) {
				this.send('s2c_notice', {
					strRichText: `背包已满`
				});
				return;
			}
		}
		//道具变动
		if (data.type == 0) {
			if (data.operation == 0) {
				if (this.locker_list[data.operateid] > 0) {
					if (this.bag_list[data.operateid] == null) this.bag_list[data.operateid] = 0;
					this.bag_list[data.operateid] += this.locker_list[data.operateid];
				}
				delete this.locker_list[data.operateid];
			} else {
				if (this.bag_list[data.operateid] > 0) {
					if (this.locker_list[data.operateid] == null) this.locker_list[data.operateid] = 0;
					this.locker_list[data.operateid] += this.bag_list[data.operateid];
				}
				delete this.bag_list[data.operateid];
			}
			//this.sendbag(true);
		} else if (data.type == 1) {//装备变动
			if (data.operation == 0) {
				for (let index = 0; index < this.lockerEquips.length; index++) {
					let equip = this.lockerEquips[index];
					if (data.operateid == equip.EquipID) {
						equip.pos = EEquipPos.BAG;
						equip.save(false,'仓库取出装备');
						this.lockerEquips.splice(index, 1);
						this.addEquipList(equip);
						break;
					}
				}
			} else {
				for (let index = 0; index < this.listEquips.length; index++) {
					let equip = this.listEquips[index];
					if (data.operateid == equip.EquipID) {
						equip.pos = EEquipPos.BANK;
						this.listEquips.splice(index, 1);
						this.lockerEquips.push(equip);
						equip.save(false,'仓库存入装备');
						break;
					}
				}
			}
			//this.sendEquipList();
		}
		//this.send('c2s_update_lockeritem', data);
		this.save(true,'仓库物品变更');
	}

	//同步背包道具
	sendbag(sleep: boolean = false, source = '仓库变动'){
		let self = this;
		if(sleep){
			//延迟3s发送
			if(this.bagtimes != 0){
				SKTimeUtil.cancelDelay(this.bagtimes);
				this.bagtimes = 0;
			}
			this.bagtimes = SKTimeUtil.delay(()=>{
				self.sendbag(false,source);
			},3 * 1000);
			return;
		}
		this.send('s2c_bagitem', {
			info: SKDataUtil.toJson(this.bag_list)
		});
	}


	getBagItemNum(itemid: any): any {
		if (this.bag_list.hasOwnProperty(itemid) == false)
			return 0;

		return this.bag_list[itemid];
	}
	// 加经验值
	addExp(exp: number) {
		if (exp == 0) {
			return;
		}
		if(exp>9e8){
			SKLogger.error(`[${this.roleid}:${this.name}] 获得经验值过高exp=${exp}`)
		}

		super.addExp(exp);
		Log.addExp(this.roleid, exp);

		if (exp > 0) {
			this.send('s2c_add_exp', {
				onlyid: this.onlyid,
				curexp: this.exp,
				addexp: exp,
				maxexp: this.maxexp,
			});
		}
		this.send('s2c_player_data', this.getData());
		this.save(true,"获得经验");
	}

	//添加道具
	addItem(itemId: number, count: number, isNotice = false, source = '', sync: boolean = true): boolean {
		if(itemId == 50004){
			SKLogger.debug(`玩家[${this.roleid}:${this.name}]:获得藏宝图[${count}]，消息：${source}!`);
		}
		count = SKDataUtil.toNumber(count);
		if (isNaN(count)) {
			SKLogger.warn(`玩家[${this.roleid}:${this.name}]:获得物品[${itemId}]数量无效!`);
			return false;
		}
		let itemData = ItemUtil.getItemData(itemId);
		if (itemData == null) { // 无此道具
			SKLogger.warn(`玩家[${this.roleid}:${this.name}]获得物品[${itemId}]找不到!`);
			return false;
		}
		if (itemData.type < 4) {
			this.addBagItem(itemId, count, isNotice,sync , source);
		} else if (itemData.type == 4) {
			this.addExp(count);
		} else if (itemData.type == 5) {
			this.addMoney(0, count, source);
		} else if (itemData.type == 6) {
			this.addMoney(1, count, source);
		} else if (itemData.type == 7 || itemData.type == 8) { // 7 神器 8 仙器
			let info = itemData.json;
			if (itemData.id) {
				info.resid = itemData.id;
			}
			info.roleid = this.roleid;
			this.addEquip(info,sync);
		} else if (itemData.type == 9) {
			this.createPet(itemData.json);
		} else if (itemData.type == 10) {
			this.addBagItem(itemId, count, isNotice,sync, source);
		} else if (itemData.type == 11) {
			let itemlist = itemData.json;
			if (itemlist) {
				let index = Math.floor(Math.random() * itemlist.length);
				let tempId = itemlist[index];
				if (tempId != null) {
					itemId = tempId;
				}
				this.addBagItem(itemId, 1, isNotice);
			}
		} else if (itemData.type == 12) {
			this.addMoney(GameUtil.goldKind.BindJade, count, source);
		} else if (itemData.type == 13) { // 宝箱
			this.addBagItem(itemId, count, isNotice,sync, source);
		} else if (itemData.type == 14) { // 钥匙
			this.addBagItem(itemId, count, isNotice,sync, source);
		} else if (itemData.type == 21) { // 时装
			this.addBagItem(itemId, count, isNotice,sync, source);
		} else if (itemData.type == 22) { // 变身卡
			let info = itemData.json;
			Bianshen.shared.addItem(this, info.id, count);
		}
		let info = `玩家[(${this.roleid}:${this.name}]`;
		if (count < 0) {
			info += `物品[${itemData.id}:${itemData.name}]减少${count}个]，${source}`;
		} else {
			info += `获得物品[${itemData.id}:${itemData.name}]${count}个]，${source}`;
		}
		SKLogger.debug(info);
		return true;
	}

	//获取背包已用数量
	getBagItemAllKindNum() {
		return this.listEquips.length + Object.keys(this.bag_list).length;
	}

	//获取仓库已用数量
	getLockerItemAllKindNum() {
		return this.lockerEquips.length + Object.keys(this.locker_list).length;
	}

	addBagItem(nItem: any, nNum: any, bNotice: any,syn: boolean = true, source:string='') {
		nNum = SKDataUtil.toNumber(nNum);
		if (isNaN(nNum)) {
			return;
		}
		if (this.bag_list[nItem] == null) {
			if (nNum > 0) {
				if (this.getBagItemAllKindNum() >= GameUtil.limitBagKindNum) {
					this.send('s2c_notice', {
						strRichText: `背包已满`
					});
					return;
				}
			}
			this.bag_list[nItem] = 0;
		}
		let nNewNum = parseInt(this.bag_list[nItem]) + parseInt(nNum);
		if (nNewNum < 0) {
			return;
		}
		let itemData = ItemUtil.getItemData(nItem);
		if (itemData == null) {
			return;
		}
		Log.addBagItem(this.roleid, nItem, nNum, source);
		this.bag_list[nItem] = nNewNum;
		if (this.bag_list[nItem] == 0) {
			delete this.bag_list[nItem];
		}
		if(syn){
			this.send('s2c_bagitem', {
				info: SKDataUtil.toJson(this.bag_list),
			});
		}
		if (bNotice) {
			this.send('s2c_you_get_item', {
				nItem: nItem,
				nNum: nNum
			});
		}
		if (itemData.notice != 0 && nNum > 0) {
			let strRichText = `<color=#00ff00 > ${this.name}</c > <color=#ffffff > 获得了</c ><color=#0fffff > ${itemData.name}</color >，<color=#ffffff > 真是太幸运了</c >`;
			PlayerMgr.shared.broadcast('s2c_screen_msg', {
				strRichText: strRichText,
				bInsertFront: 0
			});
		}
		this.save(true,"获得物品");
	}

	/**
	 * 所有金币类消耗的入口
	 * @param {number} nKind 消耗类型
	 * @param {number} nNum 数量
	 * @param {String} strText 消耗日志
	 * @param {Boolen} usebind 是否使用绑定类型
	 */
	CostFee(nKind: any, nNum: any, strText?: any, usebind = true) {
		let vecMsg = ['银两不足', '仙玉不足', '', '水陆功绩不足'];

		let money = this.GetMoney(nKind);
		let bindjade = this.GetMoney(GameUtil.goldKind.BindJade);
		if (nKind == GameUtil.goldKind.Jade && usebind) {
			money += bindjade;
		}
		if (money < nNum) {
			return vecMsg[nKind];
		}
		if (nKind == GameUtil.goldKind.Jade && usebind) {
			if (bindjade > 0) {
				if (bindjade >= nNum) {
					this.addMoney(GameUtil.goldKind.BindJade, -nNum, strText);
				} else {
					let left = nNum - bindjade;
					this.addMoney(GameUtil.goldKind.BindJade, -bindjade, strText);
					this.addMoney(GameUtil.goldKind.Jade, -left, strText);
				}
			} else {
				this.addMoney(GameUtil.goldKind.Jade, -nNum, strText);
			}
		} else {
			this.addMoney(nKind, -nNum, strText);
		}
		return '';
	}

	//获取指定游戏币数量
	GetMoney(nKind: any) {
		let money = 0;
		switch (nKind) {
			case GameUtil.goldKind.Money://银币
				money = this.money;
				break;
			case GameUtil.goldKind.Jade://仙玉
				money = this.jade;
				break;
			case GameUtil.goldKind.BindJade://绑定仙玉
				money = this.bindjade;
				break;
			case GameUtil.goldKind.SLDH_Score://水路积分
				money = this.shuilu.gongji;
				break;
		}
		return money;
	}
	// 加银两或仙玉
	addMoney(kind: any, count: number, msg: string = "") {
		this.save(true,"游戏货币改变");
		Log.addMoney(this.roleid, kind, count, msg);

		if (kind == GameUtil.goldKind.Money) {
			this.money += count;
			PaiHangMgr.shared.CheckAndInsertMoneyPaihang(this.roleid, this.name, this.relive, this.level, this.money);
			if (count != 0) {
				this.send('s2c_you_money', {
					nKind: kind,
					nNum: this.money,
					nChange: count
				});
				SKLogger.debug(`玩家[${this.name}(${this.roleid})]银两改变[${count}]，当前[${this.money},消息:${msg}]`);
			}
			return;
		}
		if (kind == GameUtil.goldKind.Jade) { // 仙玉 
			this.jade += count;
			if (count != 0) {
				this.send('s2c_you_money', {
					nKind: kind,
					nNum: this.jade,
					nChange: count
				});
				SKLogger.info(`玩家[${this.roleid}:${this.name}]仙玉改变[${count}]，当前[${this.jade}],消息:${msg}`);
			}
			return;
		}
		if (kind == GameUtil.goldKind.BindJade) { // 绑定仙玉 
			this.bindjade += count;
			if (count != 0) {
				this.send('s2c_you_money', {
					nKind: kind,
					nNum: this.bindjade,
					nChange: count
				});
				SKLogger.info(`玩家[${this.roleid}:${this.name}]绑定仙玉改变[${count}]，当前[${this.bindjade}],消息:${msg}`);
			}
			return;
		}
		if (kind == GameUtil.goldKind.SLDH_Score) { // 水陆大会功绩
			this.shuilu.gongji += count;
			if (count != 0) {
				this.send('s2c_you_money', {
					nKind: kind,
					nNum: this.shuilu.gongji,
					nChange: count
				});
				SKLogger.debug(`玩家[${this.name}(${this.roleid})]水陆大会功绩改变[${count}]，当前[${this.shuilu.gongji},,消息:${msg}]`);
			}
			return;
		}
	}

	/*
	 * 充值成功
	 * @param jade 增加的仙玉
	 * @param money 充值的money
	 */
	chargeSuccess(jade: any, money: any) {
		this.addMoney(1, jade, '仙玉充值');
		let money_n = Number(money);
		let chargesum = ChargeSum.shared.getPlayerChargeSum(this.roleid);
		this.send('s2c_charge', {
			money: money_n,
			jade: Number(this.jade),
			chargesum: chargesum,
			dayMap: SKDataUtil.toJson(this.dayMap)
		});
		/*this.saveAll((error)=>{
			if(error.length > 0){
				SKLogger.warn(`充值成功后存档失败: ${error}`);
			}
		});*/
	}

	aoi_enter(obj: BattleObj) {
		if (obj.isNpc() && this.canPlayerSeeNpc(<Npc>obj) == false) {
			return;
		}
		if (this.offline) {
			return;
		}
		this.aoi_obj_list[obj.onlyid] = obj;
		this.send('s2c_aoi_pinfo', {
			list: [obj.toObj()]
		});
	}

	aoi_update(obj: BattleObj) {
		if (obj.isNpc() && this.canPlayerSeeNpc(<Npc>obj) == false) {
			return;
		}
		//离线时返回不发送
		if (this.offline) {
			return;
		}
		this.aoi_obj_list[obj.onlyid] = obj;
		this.send('s2c_aoi_pinfo', {
			list: [obj.toObj()]
		});
	}

	aoi_exit(obj: any) {
		delete this.aoi_obj_list[obj.onlyid];
		if (this.offline) {
			return;
		}
		this.send('s2c_aoi_exit', {
			onlyid: obj.onlyid,
		});
	}
	// 发送消息
	send(event: string, obj?: any) {
		if(this.isRobot){
			return;
		}
		if (this.offline) {
			SKLogger.debug(`玩家[${this.roleid}:${this.name}]已离线,消息[${event}:${obj}]不发送`);
			return;
		}
		if (this.agent) {
			this.agent.send(event, obj);
		} else {
			SKLogger.warn(`玩家[${this.roleid}:${this.name}]发送:${event}失败`);
		}
	}

	//玩家登录完成
	playerLogined() {
		//修正离线状态
		if (this.offline) {
			this.offline = false;
		}
		//角色管理器添加自身
		PlayerMgr.shared.addPlayer(this);
		//置空离线定时销毁任务句柄
		if (this.offlineTimer) {
			SKTimeUtil.cancelDelay(this.offlineTimer);
			this.offlineTimer = null;
		}
		this.offlineTime = null;

		if (this.mapid == 1201) {
			this.inPrison = true;
		}
		//发送登录信息
		this.send('s2c_login', {
			errorcode: MsgCode.SUCCESS,
			info: this.toObj(),
		});
		//计算在线时间
		this.calcOnlineTime();
	}
	// 玩家重新登录
	playerRelogin() {
		//修正离线状态
		if (this.offline) {
			this.offline = false;
		}
		//置空离线定时销毁句柄
		if (this.offlineTimer) {
			SKTimeUtil.cancelDelay(this.offlineTimer);
			this.offlineTimer = null;
		}
		//计算在线时间
		this.calcOnlineTime();
	}
	// 计算在线时长
	calcOnlineTime() {
		if (this.onlineTime < 1) {
			this.onlineTime = new Date().getTime();
		} else {
			let nowTime = new Date().getTime();
			let time = nowTime - this.onlineTime;
			let days = Math.floor(time / (24 * 3600 * 1000)); //相差天数
			let leave1 = time % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
			let hours = Math.floor(leave1 / (3600 * 1000)); // 相差小时数
			let leave2 = leave1 % (3600 * 1000);  //计算小时数后剩余的毫秒数
			let minutes = Math.floor(leave2 / (60 * 1000)); // 相差分钟数
			let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
			let seconds = Math.round(leave3 / 1000); // 相差秒数
			SKLogger.info(`玩家[${this.roleid}:${this.name}]在线时长:${days}天${hours}小时${minutes}分钟${seconds}秒`);
			this.onlineTime = 0;
		}
	}
	
	// 进入地图
	onEnterMap() {
		this.stopIncense();
		let pMap = MapMgr.shared.getMap(this);
		if (pMap) {
			let mPlayers = pMap.enterMap(this, GameUtil.livingType.Player);
			let mList = [];
			for (const oid in mPlayers) {
				if (mPlayers.hasOwnProperty(oid)) {
					const player = mPlayers[oid];
					if (player.isNpc() && this.canPlayerSeeNpc(player) == false)
						continue;
					if (player.nFuBenID > 0 && player.nFuBenID != this.bangid)
						continue;
					this.aoi_obj_list[player.onlyid] = player;
					SKLogger.debug(`玩家[${player.roleid}:${player.name}]进入地图[${pMap.map_name}]!`);
					mList.push(player.toObj());
				}
			}
			this.send('s2c_aoi_pinfo', {
				list: mList
			});

			// 进入皇宫后 检查水路大会情况
			let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.ShuiLuDaHui);
			if (activity && activity.activity_state != ActivityDefine.activityState.Close) {
				if (activity.checkSign(this.teamid) && activity.checkFinish(this.teamid) == false) {
					if (this.mapid == 1000 || this.mapid == 1206) {
						this.send('s2c_shuilu_sign', {
							errorcode: MsgCode.SUCCESS,
							shuilustate: activity.sldh_state,
						});
					} else {
						activity.playerUnsign(this);
						this.send('s2c_shuilu_unsign', {
							errorcode: MsgCode.SUCCESS,
						});
					}
				}
			}
		}
	}

	//进入游戏
	onEnterGame() {
		if (this.ShanEChange()) {
			SKLogger.warn(`玩家[${this.roleid}:${this.name}]进入游戏错误`);
			return;
		}
		SKLogger.debug(`玩家[${this.roleid}:${this.name}]进入游戏`);
		this.onEnterMap();
		// 发送角色数据
		this.send('s2c_player_data', this.getData());

		if (this.getpet == 0) {
			//this.send('s2c_new_pet', {});

			this.createPet({petid: 1059}, '首次登录赠送')
			this.addMoney(1, 2e9, '首次登录赠送');

		} else {
			this.sendPetList();
		}
		// 任务系统初始化放置在进入场景之后进行！
		if (this.tmpData) {
			this.InitTaskMgr(this.tmpData.taskstate ? this.tmpData.taskstate : '{}');
			delete this.tmpData;
		}
		if (this.teamid > 0) {
			TeamMgr.shared.sendInfoToMember(this.teamid);
		}
		if (this.battle_id != 0) {
			BattleMgr.shared.playerBackToBattle(this.battle_id, this.onlyid);
		}

		this.CheckNewDay();
		DB.updateLastOnlineTime(this.roleid);
		this.checkFriendInfo();
	}

	// 整理被删除的好友
	checkFriendInfo() {
		for (const pid in this.friendList) {
			if (this.friendList.hasOwnProperty(pid)) {
				let target = PlayerMgr.shared.getPlayerByRoleId(pid, false);
				if (target) {
					if (target.friendList[this.roleid] == null) {
						delete this.friendList[target.roleid];
					}
				}
			}
		}
	}

	// NPC是否可见
	canPlayerSeeNpc(npc: Npc) {
		// 系统创建的NPC可见
		if (npc.stCreater.nKind == NpcCreater.SYSTEM) {
			return true;
		}
		// 玩家创建的并且是这个玩家可见
		if (npc.stCreater.nKind == NpcCreater.PLAYER && npc.stCreater.nID == this.roleid) {
			return true;
		}
		// 组队创建的NPC并且是这个队伍可见
		if (npc.stCreater.nKind == NpcCreater.TEAM && npc.stCreater.nID == this.teamid && this.teamid > 0) {
			return true;
		}
		return false;
	}

	//角色移动
	playerMove(data: any, stop = false) {
		//更新操作时间
		this.movetime = Date.now();
		//如果是使用引妖香状态
		if (this.usingIncense) {
			//暗雷自减
			this.anleiCnt--;
			//暗雷数小于1
			if (this.anleiCnt <= 0) {
				//触发暗雷怪
				this.triggerAnLei();
				//重置暗雷数
				this.anleiCnt = Math.ceil(Math.random() * 15) + 15;
			}
		}
		//队伍不为空 是队长 且未停止移动 同步全队位置
		if (this.teamid > 0 && this.isleader && !stop) {
			TeamMgr.shared.updateTeamPos(this.teamid, {
				x: data.x,
				y: data.y
			});
		}
		let map = MapMgr.shared.getMap(this);
		if (map) {
			let mPlayers = map.move(this.onlyid, data.x, data.y);
			let mList = [];
			if (mPlayers) {
				if (this.teamid > 0 && !this.isleader) {
					mPlayers.push(this);
					SKLogger.debug(`队友${this.name}加入列表`);
				}
				for (const p of mPlayers) {
					if (p.isNpc() && this.canPlayerSeeNpc(p) == false) {
						continue;
					}
					mList.push(p.toObj());
				};
			}
			this.send('s2c_aoi_pinfo', {
				list: mList
			});
		}
	}

	playerStop(data: any) {
		this.playerMove(data, true);
		if (this.teamid > 0 && this.isleader) {
			TeamMgr.shared.setTeamPath(this.teamid, SKDataUtil.jsonBy(data.path));
		}
	}

	enterPrison() {
		this.inPrison = true;
		if (this.teamid > 0) {
			TeamMgr.shared.leaveTeam(this);
		}

		this.send('s2c_change_map', {
			mapid: 1201,
			pos: SKDataUtil.toJson({
				x: 59,
				y: 4
			})
		});
		this.changeMap({
			mapid: 1201,
			x: 59,
			y: 4
		});
	}

	leavePrison() {
		if (this.shane > 0) {
			return;
		}
		this.inPrison = false;
		this.send('s2c_change_map', {
			mapid: 1011,
			pos: SKDataUtil.toJson({
				x: 112,
				y: 78
			})
		});
		this.changeMap({
			mapid: 1011,
			x: 112,
			y: 78
		});
	}

	changeMap(data: any) {
		if (data.mapid == 1011 && this.shane > 0) {
			this.enterPrison();
			this.send('s2c_prison_time', {
				onlyid: this.onlyid,
				time: this.inPrison ? Math.ceil(this.shane / 4) : 0
			});
			return;
		}
		let pMap = MapMgr.shared.getMap(this);
		if (pMap) {
			pMap.exitMap(this);
		}
		this.mapid = data.mapid;
		this.x = data.x;
		this.y = data.y;
		this.onEnterMap();
		if (this.teamid > 0 && this.isleader) {
			TeamMgr.shared.changeTeamMap(this.teamid, this.mapid);
		}
	}

	//使用引妖香
	useIncense(time: any) {
		//停止当前使用中的引妖香
		this.stopIncense();
		// if (this.teamid > 0) {
		// 	return false;
		// }
		//发送引妖香时长状态
		this.send('s2c_incense_state', {
			ltime: time
		});
		//设定引妖香使用状态
		this.usingIncense = true;
		this.anleiCnt = Math.ceil(Math.random() * 20) + 20;
		let self = this;
		//设定引妖香结束通知
		this.incenseTimer = SKTimeUtil.delay(() => {
			self.usingIncense = false;
			self.send('s2c_incense_state', {
				ltime: 0
			});
		}, time * 1000);
		return true;
	}

	stopIncense() {
		this.usingIncense = false;
		if (this.incenseTimer) {
			SKTimeUtil.cancelDelay(this.incenseTimer);
			this.incenseTimer = null;
		}
	}

	triggerAnLei() { //触发暗雷怪
		let pMap = MapMgr.shared.getMap(this);
		if (pMap) {
			let groupid = pMap.getAnleiGroup();
			if (groupid) {
				this.monsterBattle(groupid, BattleType.Normal, true);
			}
		}
	}

	// 召唤兽转生
	relivePet(data: any) {
		let operationPet = null;
		for (let pet of this.petList) {
			if (pet.petid == data.petid) {
				operationPet = pet;
				break;
			}
		}
		if (operationPet == null) {
			console.warn(`$警告:[${this.roleid}:${this.name}]找不到转宝召唤兽:${data.pedid}`);
			return;
		}
		operationPet.petRelive();
		this.send('s2c_update_pet', {
			info: operationPet.toObj()
		});
	}

	/*
	 * 洗练宠物属性
	 */
	washProperty(data: any) {
		let jll_count = this.bag_list[10118] || 0; /* 金柳露数量 */
		if (jll_count < 3) {
			return;
		}
		let operationPet = null;
		for (const pet of this.petList) {
			if (pet.petid == data.petid) {
				operationPet = pet;
				break;
			}
		}
		if (operationPet == null) {
			return;
		}
		this.update_bagitem({
			itemid: 10118,
			count: 3,
			operation: 0
		});
		operationPet.washProperty();
	}

	savePetProperty(data: any) {
		let operationPet = null;
		for (const pet of this.petList) {
			if (pet.petid == data.petid) {
				operationPet = pet;
				break;
			}
		}
		if (operationPet == null) {
			return;
		}
		operationPet.saveProperty();
	}
	// 合成召唤兽
	hechengPet(data: any) {
		let conf = PetMgr.shared.getPetData(data.petid);
		if (!conf || conf.gettype != 1 || conf.needitem == null || conf.needitem.length < 1) {
			this.send('s2c_notice', {
				strRichText: `该召唤兽[${conf.name}]未开放合成!`
			});
			return;
		}
		if (PetMgr.shared.canHeCheng(this, data.petid)) {
			this.createPet(data, '召唤兽[${conf.name}]合成');
			this.send('s2c_bagitem', {
				info: SKDataUtil.toJson(this.bag_list)
			});
		} else {
			this.send('s2c_notice', {
				strRichText: `召唤兽[${conf.name}]无法合成!`
			});
		}
	}

	createPet(data: any, source = '') {
		// if (this.getpet == 1) {
		// 	return;
		// }
		PetMgr.shared.createPet(this, data.petid, (pet: any) => {
			this.addPet(pet, false);
			if (this.curPet == null) {
				this.changePet(pet.petid, false);
			}
			this.getPetlist();
			if (this.getpet != 1) {
				DB.getPet(this.roleid);
				this.getpet = 1;
			}
			Log.createPet(this.roleid, pet.petid, source || "合成宠物");

			SKLogger.debug(`玩家[${this.roleid}:s${this.name}]获得召唤兽[${pet.petid}:${pet.name}]${source}`);
			this.send('s2c_notice', {
				strRichText: `恭喜您获得了${pet.name}`
			});
			Log.createPet(this.roleid, data.petid);
			this.save(false,"合成宠物");
		});
	}

	addPet(pet: any, issend = true) {
		pet.setOwner(this); //ownid = this.roleid;
		this.petList.push(pet);
		if (issend) {
			this.getPetlist();
		}
	}

	getPetByID(petid: any) {
		for (let pet of this.petList) {
			if (pet.petid == petid) {
				return pet;
			}
		}
		return null;
	}

	sendPetList() {
		if (this.offline) {
			return;
		}
		if (this.loaded == false) {
			return;
		}
		this.getPetlist();
	}
	// 获得召唤兽列表
	getPetlist() {
		let listInfo: any = {};
		listInfo.curid = 0;
		if (this.curPet != null) {
			listInfo.curid = this.curPet.petid;
		}
		listInfo.list = [];
		let repeat = SKDataUtil.removeRepeat(this.petList, "petid");
		if (repeat.length > 0) {
			for (let pet of repeat) {
				SKLogger.warn(`玩家:[${this.roleid}:${this.name}]召唤兽[${pet.petid}:${pet.name}:${pet.state}]重复`);
			}
		}
		for (let pet of this.petList) {
			let conf = PetMgr.shared.getPetData(pet.dataid);
			/*if (pet.name != conf.name) {
				SKLogger.warn(`玩家:[${this.roleid}:${this.name}]召唤兽[${pet.petid}:${pet.name}]修复dataid:${pet.name}->${conf.name}`);
				pet.name = conf.name;
			}*/
			if (pet.resid != conf.resid) {
				SKLogger.warn(`玩家:[${this.roleid}:${this.name}]召唤兽[${pet.petid}:${pet.name}]修复resid:${pet.resid}->${conf.resid}`);
				pet.resid = conf.resid;
			}
			listInfo.list.push(pet.toObj());
		}
		this.send('s2c_get_petlist', listInfo);
		SKLogger.debug(`发送玩家[${this.roleid}:${this.name}]召唤兽列表`);
	}

	updatePetPoint(data: any) {
		if (!data) {
			return;
		}
		let sumpoint = 0;
		let addpoint: any = {};
		if (data.type > 1) {
			addpoint = SKDataUtil.jsonBy(data.info);
			for (let key in addpoint) {
				sumpoint += addpoint[key];
			}
		}
		let operationPet = null;
		for (let pet of this.petList) {
			if (pet.petid == data.petid) {
				operationPet = pet;
				break;
			}
		}
		if (operationPet == null) {
			return;
		}
		if (data.type == 0) {
			for (const key in operationPet.ppoint) {
				operationPet.ppoint[key] = 0;
			}
		} else if (data.type == 1) {
			for (const key in operationPet.dpoint) {
				operationPet.dpoint[key] = 0;
			}
		} else if (data.type == 2) {
			let curpoint = 0;
			for (const key in operationPet.ppoint) {
				curpoint += operationPet.ppoint[key];
			}
			if (sumpoint + curpoint > operationPet.level * 4) {
				return;
			}
			for (const key in addpoint) {
				if (!operationPet.ppoint[key]) {
					operationPet.ppoint[key] = 0;
				}
				operationPet.ppoint[key] += addpoint[key];
			}
		} else if (data.type == 3) {
			let curpoint = 0;
			for (let key in operationPet.dpoint) {
				curpoint += operationPet.dpoint[key];
			}
			if (sumpoint + curpoint > PetPracticeMgr.shared.GetLevelPoint(operationPet.relive, operationPet.xlevel)) { //超过最大修炼点
				return;
			}
			for (let key in addpoint) {
				if (!operationPet.dpoint[key]) {
					operationPet.dpoint[key] = 0;
				}
				operationPet.dpoint[key] += addpoint[key];
			}
		}
		operationPet.calculateAttribute();
		this.send('s2c_update_pet', {
			info: operationPet.toObj()
		});
		operationPet.save(true,"宠物加点");
	}

	petLockSkill(petid: any, skillid: any) {
		// this.send('s2c_notice', {
		// 	strRichText: '功能暂未开放'
		// });
		// return;

		let pet = this.getPetByID(petid);
		if (!pet) {
			return;
		}
		let skillinfo = pet.skill_list[skillid];
		if (!skillinfo) {
			return;
		}
		if (skillinfo.lck == 1) {
			this.send('s2c_notice', {
				strRichText: '技能已经被锁定，仙玉不变'
			});
			return;
		}

		let n = pet.getLockedSkillNum();
		let cost = Math.pow(2, n) * 1000;
		let strErr = this.CostFee(1, cost, '宠物技能锁定');
		if (strErr != '') {
			this.send('s2c_notice', {
				strRichText: strErr
			});
			return;
		}

		pet.lockSkill(skillid);
	}

	//解锁技能格子
	unlockSkill(petid: any){
		let pet = this.getPetByID(petid);
		if (!pet) {
			return;
		}
		//10115
		if(this.getBagItemNum(10115) < GameUtil.unlock[pet.lock]){
			this.send('s2c_notice', {
				strRichText: `解锁技能格需要聚魂丹${GameUtil.unlock[pet.lock + 1]},当前聚魂丹数量不足。`
			});
			return;
		}
		this.addItem(10115,-GameUtil.unlock[pet.lock],true,"解锁宠物技能格");
		pet.lock ++;
		this.send('s2c_notice', {
			strRichText: `技能格解锁成功。`
		});
		this.send('s2c_update_pet',{
			info: pet.toObj(),
		});
		pet.save(true,"宠物解锁技能格子");
	}

	//宠物遗忘技能
	petForgetSkill(petid: any, skillid: any) {
		let pet = this.getPetByID(petid);
		if (pet) {
			pet.forgetSkill(skillid);
		}
	}

	//宠物变更神兽技能
	petShenShouSkill(petid: any, skillid: any) {
		let pet = this.getPetByID(petid);
		if (!pet) {
			return;
		}
		if (pet.grade < GameUtil.petGrade.Shen) {
			return;
		}
		// if (skillid == GameUtil.skillIds.RuHuTianYi) {
		// 	this.send('s2c_notice', {
		// 		strRichText: '该技能稍后开放！'
		// 	});
		// 	return;
		// }

		let strErr = this.CostFee(GameUtil.goldKind.Money, 50000000);
		if (strErr != '') {
			this.send('s2c_notice', {
				strRichText: strErr
			});
			return;
		}

		pet.changeShenShouSkill(skillid);

		this.send('s2c_pet_changeSskill', {
			errorcode: MsgCode.SUCCESS,
			petid: petid,
			skillid: skillid,
		});
	}

	//领取等级奖励
	levelReward(level: any) {
		if (level > this.level)
			return;
		if (this.level_reward.split(':').indexOf(level + '') != -1)
			return;
		let level_reward = GameUtil.require_ex('../../conf/prop_data/prop_level.json');
		let item = level_reward[level];
		if (item) {
			if (this.level_reward == '') {
				this.level_reward += level;
			} else {
				this.level_reward += ':' + level;
			}

			let reward_list = item.reward_item.split(';');
			for (let item of reward_list) {
				let reward = item.split(':');
				this.addItem(reward[0], reward[1], false, '等级奖励');
			}
			let send_data = {
				level: level,
			};
			this.send('s2c_level_reward', send_data);
			this.save(true,"领取等级奖励");
		}
	}

	//切换出战宠物
	changePet(petid: any, issend = true) {
		for (const pet of this.petList) {
			if (pet.petid == petid) {
				this.curPet = pet;
				this.curPetId = petid;
				if (issend) {
					this.send('s2c_change_pet', {
						curid: this.curPet.petid
					});
				}
				break;
			}
		}
		this.save(true,"切换参战宠物");
	}

	delPet(petid: number) {
		let pet: Pet = null;
		for (let index = 0; index < this.petList.length; index++) {
			if (this.petList[index].petid == petid) {
				pet = this.petList[index];
				pet.state = 0;
				this.petList.splice(index, 1);
				DB.delPet(pet.petid, this.roleid, (code: number) => {
					SKLogger.debug(`玩家[${this.roleid}:${this.name}]放生召唤兽[${pet.petid}:${pet.name}]${code == MsgCode.SUCCESS ? "成功" : "失败"}`);
					Log.delPet(this.roleid, petid, code, pet.name);
				})
				break;
			}
		}
		if(!pet){
			SKLogger.warn(`玩家[${this.roleid}:${this.name}]试图删除不属于自己的召唤兽[${petid}]`);
			return
		}
		let params: any = {};
		if(this.curPet != null){
			if (this.curPet.petid == petid) {
				this.curPet.state = 0;
				this.curPet = null;
				params.curid = -1;
			} else {
				params.curid = this.curPet.petid;
			}
		}
		params.delid = petid;
		this.send('s2c_del_pet', params);
		this.save(true,"放生宠物");
	}

	addEquip(data: any,sync: boolean = true) {
		if (this.getBagItemAllKindNum() >= GameUtil.limitBagKindNum) {
			this.send('s2c_notice', {
				strRichText: `背包已满`
			});
			return;
		}
		let equipAttr = EquipMgr.shared.makeEquipAttr(data);
		if (!equipAttr) {
			SKLogger.warn(`玩家[${this.roleid}:${this.name}]加装备失败${data.resid}`);
			this.send('s2c_operation_result', {
				code: 0,
			});
			return;
		}
		/* 神兵 仙器广播  */
		/*if (data.type > 1) {
			if (data.type == 2) {
				SKLogger.debug(`玩家[${this.roleid}:${this.name}]获得神兵[${equipAttr.EquipID}:${equipInfo.EName}]`);
			} else if (data.type == 3) {
				SKLogger.debug(`玩家[${this.roleid}:${this.name}]获得仙器[${equipAttr.EquipID}:${equipInfo.EName}]`);
			}
			let strRichText = `<color=#00ff00 > ${this.name}</c > <color=#ffffff > 获得了</c ><color=#0fffff > ${equipInfo.EDesc}:${equipInfo.EName}</color >，<color=#ffffff > 真是太幸运了</c >`;
			PlayerMgr.shared.broadcast('s2c_screen_msg', {
				strRichText: strRichText,
				bInsertFront: 0
			});
		}*/
		DB.createEquip(this.roleid, equipAttr, (code: MsgCode,data: any) => {
			//SKLogger.warn(data.insertId);
			if (code != MsgCode.SUCCESS) {
				SKLogger.warn(`存档:玩家[${this.roleid}:${this.name}]加入装备属性[${equipAttr}]失败!`);
				return;
			}
			equipAttr.EquipID = data.insertId;
			let equip = new Equip(equipAttr, this);
			this.addEquipList(equip);
			this.equipObjs[equip.EquipID] = equip;
			EquipMgr.shared.addEquip(equip);
			let equipInfo = equip.toObj();
			Log.addEquip(this.roleid, equip.EquipID, equip.EquipType, equip.Grade, `${equip.Type}:${equip.name}`);

			if(sync){
				this.send('s2c_bagitem', {
					info: SKDataUtil.toJson(this.bag_list)
				});
				this.sendEquipList();
				
				let params = {
					equip: SKDataUtil.toJson(equipInfo)
				};
				this.send("s2c_equip_info", params);
				this.send('s2c_notice', {
					strRichText: `恭喜您获得了${equipInfo.EDesc}:${equipInfo.EName}`
				});
			}



		});
	}

	createEquip(data: any) {
		if (this.getBagItemAllKindNum() >= GameUtil.limitBagKindNum) {
			this.send('s2c_notice', {
				strRichText: `背包已满`
			});
			return;
		}
		if(data.type == 0){
			this.addEquip(data);
		} else if (data.type == 2) {
			if (!this.bag_list[10408] || this.bag_list[10408] < 50) {
				return; //神兵碎片不足
			}
			this.bag_list[10408] -= 50;
			this.addEquip(data);
			SKLogger.debug(`玩家[${this.name}${this.roleid}]消耗 神兵碎片 50 个`);
		} else if (data.type == 3) {
			if (!this.bag_list[10406] || this.bag_list[10406] < 40) {
				return; //八荒遗风不足
			}
			this.bag_list[10406] -= 40;
			this.addEquip(data);
			SKLogger.debug(`玩家[${this.name}${this.roleid}]消耗 八荒遗风 40 个`);
		}
		this.save(true,"合成装备");
	}

	sendEquipList() {
		let listInfo: any = {};
		listInfo.use = {};
		listInfo.score = 0;
		listInfo.list = [];
		listInfo.info = {};
		for (let equip of this.currentEquips) {
			let full = equip.getFullData();
			if (full) {
				listInfo.score += Number(full.BaseScore);
				listInfo.use[equip.EIndex] = equip.EquipID;
				listInfo.info[equip.EquipID] = equip.getSendInfo();
			}
		}
		for (let equip of this.listEquips) {
			listInfo.list.push(equip.EquipID);
			listInfo.info[equip.EquipID] = equip.getSendInfo();
		}
		this.send("s2c_equip_list", {
			list: SKDataUtil.toJson(listInfo)
		});
	}

	getLockerEquipInfo() {
		let rInfo: any = {};
		rInfo.locker = [];
		rInfo.list = [];
		for (let equip of this.listEquips) {
			rInfo.list.push(equip.getSendInfo());
		}
		for (let equip of this.lockerEquips) {
			rInfo.locker.push(equip.getSendInfo());
		}
		return rInfo;
	}
	// 发送装备信息
	sendEquipInfo(equipId: number) {
		if (this.equipObjs[equipId]) {
			let equip: Equip = this.equipObjs[equipId];
			let params = {
				equip: SKDataUtil.toJson(equip.toObj())
			};
			this.send("s2c_equip_info", params);
		}
	}

	changeWeapon(weapon: any) {
		if (weapon) {
			let fullEquipData = weapon.getFullData(this.roleid);
			let weaponstr = SKDataUtil.toJson({
				gemcnt: fullEquipData.GemCnt,
				type: fullEquipData.EquipType,
				level: fullEquipData.Grade
			});
			this.send('s2c_change_weapon', {
				weapon: weaponstr
			});
		} else {
			this.send('s2c_change_weapon', {
				weapon: ''
			});
		}
	}

	upgradeEquip(data: any) {
		let equip = this.equipObjs[data.equipid];
		if (equip == null) {
			return;
		}
		if (equip.EquipType > EEquipType.HIGH) {
			return;
		}
		let itemid = 10405;
		if (this.bag_list[itemid] && this.bag_list[itemid] > 0) {
			let up = equip.upgrade(data);
			if (!up) return; //升级失败
			this.addItem(itemid, -1, false, '装备升级消耗');
			if (this.bag_list[itemid] <= 0) {
				delete this.bag_list[itemid];
			}
		} else { //没有盘古精铁
			return;
		}
		Log.upgradeEquip(this.roleid, equip.EquipID, equip.EquipType, equip.Grade, `${equip.Type}:${equip.name}`);
		this.send('s2c_bagitem', {
			info: SKDataUtil.toJson(this.bag_list)
		});
		this.sendEquipInfo(data.equipid);

		if (equip.EIndex == 1 && this.currentEquips.indexOf(equip) != -1) {
			this.changeWeapon(equip);
		}
		this.send('s2c_notice', {
			strRichText: `升级成功`
		});
		this.save(true,"装备升级");
	}

	shenbignUpgrade(data: any) {
		let equip = this.equipObjs[data.equipid];
		if (equip == null) {
			return;
		}

		if (equip.EquipType > EEquipType.ShenBing) {
			return;
		}

		if (data.use > 0 && this.equipObjs[data.use] == null) return;
		if (equip.canUpgrade() == false) {
			return;
		}
		// 是否失败
		if (equip.checkUpgradeBroke() == false) {
			if (equip.Grade == 1) {
				this.delEquip(data.equipid, true, '神兵升级破碎');
			} else {
				this.delEquip(data.use, true, '神兵升级破碎');
			}

			this.sendEquipList();
			// 神兵破碎 给 神兵碎片
			this.addItem(10408, 5, false, '神兵升级破碎');
			this.send('s2c_notice', {
				strRichText: `神兵升级失败`
			});
		} else {
			equip.upgrade(data);
			this.delEquip(data.use, true, '神兵升级');
			this.sendEquipList();
			this.sendEquipInfo(data.equipid);

			if (equip.EIndex == 1 && this.currentEquips.indexOf(equip) != -1) {
				this.changeWeapon(equip);
			}
			this.send('s2c_notice', {
				strRichText: `神兵升级成功`
			});
		}
	}

	xianqiUpGrade(data: any) {
		let equip: Equip = this.equipObjs[data.equipid];
		if (equip == null) {
			return;
		}
		// if ((data.use1 > 0 && this.equipObjs[data.use1] == null) ||
		// 	(data.use2 > 0 && this.equipObjs[data.use2] == null)) {
		// 	return;
		// }
		if (data.use1 > 0 && this.equipObjs[data.use1] == null) {
			return;
		}
		let up = equip.canUpgrade();
		if (!up) {
			SKLogger.warn(`仙器[${equip.name}(${equip.EquipID})]不能升阶!`);
			return;
		}
		this.delEquip(data.use1, true, `仙器升阶`);
		//this.delEquip(data.use2, true, `仙器升阶`);
		equip.upgrade(data);
		this.sendEquipList();
		this.sendEquipInfo(data.equipid);
		if (equip.EIndex == 1 && this.currentEquips.indexOf(equip) != -1) {
			this.changeWeapon(equip);
		}
		this.send('s2c_notice', {
			strRichText: `仙器[${equip.EquipID}:${equip.name}]升${equip.Grade}阶成功`
		});
	}

	delEquip(equipid: any, uninlay = true, source = '') {
		if (!equipid || equipid <= 0) {
			return;
		}
		let delequip = null;
		for (let index = 0; index < this.currentEquips.length; index++) { //已经装备的不能删，所以注释掉以下代码
			if (this.currentEquips[index].EquipID == equipid) {
				delequip = this.currentEquips[index];
				this.currentEquips.splice(index, 1);
				break;
			}
		}
		for (let index = 0; index < this.listEquips.length; index++) {
			if (this.listEquips[index].EquipID == equipid) {
				delequip = this.listEquips[index];
				this.listEquips.splice(index, 1);
				break;
			}
		}
		if (delequip != null) {
			Log.delEquip(this.roleid, equipid, source);
			delequip.pos = EEquipPos.UNKNOW;
			let equipfulldata = delequip.getFullData();
			SKLogger.debug(`玩家[${this.roleid}:${this.name}]删除装备[${delequip.EquipID}:${equipfulldata.EName}]:${source}]`);
			if (uninlay) {
				this.unInLay(delequip);
				this.send('s2c_bagitem', {
					info: SKDataUtil.toJson(this.bag_list)
				});
			}
			delequip.state = 0;
			delequip.save();
			delete this.equipObjs[delequip.EquipID];
			EquipMgr.shared.delEquip(delequip.EquipID);
			this.schemeMgr.deleteCurEquips(delequip.EquipID);
		}
	}

	//一键分解配饰、神兵、仙器
	gfenjieEquip(){
		let list = {xianqi:[0],peishi:[0],shenbin:[0]};
		list.xianqi = [];
		list.peishi = [];
		list.shenbin = [];
		let bahuang = 0; //10406
		Log.gfenjieEquip(this.roleid);
		for(let equipid in this.equipObjs){
			let equip = this.equipObjs[equipid];
			if(equip.pos == EEquipPos.BAG){
				if(equip.EquipType == EEquipType.XianQi){	//仙器
					if(equip.Grade == 1)
						bahuang += 5;
					if(equip.Grade == 2)
						bahuang += 10;
					if(equip.Grade == 3)
						bahuang += 20;
					if(equip.Grade == 4)
						bahuang += 40;
					if(equip.Grade == 2)
						bahuang += 80;
					if(equip.GemCnt > 0){
						for(let i = equip.GemCnt; i > 0; i--){
							equip.GemCnt --;
							let itemid = equip.getInlayGemID();
							this.addItem(itemid,1,false,"装备分解返还宝石",false);
						}
					}
					this.delEquip(equip.EquipID, false, '装备分解');
				}
				if(equip.EquipType == EEquipType.ShenBing){	//神兵
					bahuang ++;
					if(equip.GemCnt > 0){
						for(let i = equip.GemCnt; i > 0; i--){
							equip.GemCnt --;
							let itemid = equip.getInlayGemID();
							this.addItem(itemid,1,false,"装备分解返还宝石",false);
						}
					}
					this.delEquip(equip.EquipID, false, '装备分解');
				}
				if(equip.EquipType == EEquipType.BALDRIC){	//配饰
					if(equip.Grade == 2){
						bahuang += 2;
					}else if(equip.Grade == 3){
						bahuang += 3;
					}else{
						bahuang ++;
					}
					this.delEquip(equip.EquipID, false, '装备分解');
				}
			}
		}
		if(bahuang > 0){
			this.sendEquipList();
			this.addItem(10406,bahuang,true,"装备分解");
			this.save(false,"装备一键分解");
		}
	}

	updateEquip(data: any) {
		if (!data) {
			return;
		}
		let ret = false;
		if(!this.equipObjs[data.equipid]){
			SKLogger.warn(`玩家[${this.roleid}:${this.name}]试图更改不属于他的装备`);
			return;
		}
		if (data.operation == 0) {
			this.delEquip(data.equipid, true, '装备删除');
			this.sendEquipList();
			return;
		} else if (data.operation == 1) {
			//装备
			let equip: Equip = this.equipObjs[data.equipid];
			let fullEquipData = equip.getFullData(this.roleid);
			if (fullEquipData.OwnerRoleId > 0 && fullEquipData.OwnerRoleId != this.resid) {
				this.send('s2c_notice', {
					strRichText: '角色不匹配，不能使用！'
				});
				return;
			} else if ((fullEquipData.Sex != 9 && fullEquipData.Sex != this.sex) || (fullEquipData.Race != 9 && fullEquipData.Race != this.race)) {
				this.send('s2c_notice', {
					strRichText: '角色不匹配，不能使用！'
				});
				return;
			}
			// if (fullEquipData.NeedGrade > this.level || fullEquipData.NeedRei > this.relive) {
			// 	this.send('s2c_notice', {
			// 		strRichText: '角色等级不足，尚不能使用！'
			// 	});
			// 	return;//转生或等级不符合
			// }
			if (fullEquipData.Shuxingxuqiu) { //属性需求不符合
				for (const key in fullEquipData.Shuxingxuqiu) {
					if (this.getAttr1(key) < fullEquipData.Shuxingxuqiu[key]) {
						this.send('s2c_notice', {
							strRichText: '角色属性不足，尚不能使用！'
						});
						return;
					}
				}
			}
			for (let index = 0; index < this.currentEquips.length; index++) {
				let item = this.currentEquips[index];
				if (item.EIndex == equip.EIndex) {
					item.pos = EEquipPos.BAG;
					this.addEquipList(item);
					this.currentEquips.splice(index, 1);
					item.save(false,"穿戴装备");
				}
			}
			equip.pos = EEquipPos.USE;
			equip.save(false,"穿戴装备");
			this.currentEquips.push(equip);
			for (let index = 0; index < this.listEquips.length; index++) {
				let item = this.listEquips[index];
				if (item.EquipID == data.equipid) {
					this.listEquips.splice(index, 1);
					break;
				}
			}
			this.sendEquipList();
			if (equip.EIndex == 1) {
				this.changeWeapon(equip);
			} else if (equip.EIndex == 6) {
				let conf = EquipMgr.shared.getXianQiBy(equip.Type);
				this.wingId = conf.Shape;
			}
			SKLogger.debug(`玩家[${this.roleid}:${this.name}]穿上装备[${equip.name}]`);
			ret = true;
		} else if (data.operation == 2) {
			//卸下
			let equip = this.equipObjs[data.equipid];
			let finduse = false;
			for (let index = 0; index < this.currentEquips.length; index++) {
				if (this.currentEquips[index].EquipID == data.equipid) {
					this.currentEquips[index].pos = EEquipPos.BAG;
					this.currentEquips[index].save(false,"卸下装备");
					this.currentEquips.splice(index, 1);
					finduse = true;
					break;
				}
			}
			if (finduse) {
				this.addEquipList(equip);
				this.sendEquipList();
				if (equip.EIndex == 1) {
					this.changeWeapon(null);
				} else if (equip.EIndex == 6) {
					this.wingId = 0;
				}
				SKLogger.debug(`玩家[${this.roleid}:${this.name}]卸下装备[${equip.name}]`);
				ret = true;
			}
		}
		if (ret) {
			this.calculateAttr();
			this.send('s2c_player_data', this.getData());
			//将通过背包修改的装备信息，同步修改方案装备信息
			let curEqupsData: any = {}
			this.currentEquips.forEach((e: any) => {
				curEqupsData[e.EIndex] = e.EquipID;
			});
			if ((data.operation == 1 || data.operation == 2) && this.schemeMgr) {
				this.schemeMgr.syncSchemeEquips(curEqupsData);
			}
		} else {
			this.send('s2c_operation_result', {
				code: MsgCode.FAILED
			});
		}
	}
	// 拆卸
	unInLay(equip: Equip) {
		if (equip == null) {
			return;
		}
		let itemList = equip.getGemList();
		for (let itemId in itemList) {
			if (itemList[itemId] <= 0) {
				continue;
			}
			if (this.bag_list[itemId] == null) {
				this.bag_list[itemId] = itemList[itemId];
				SKLogger.debug(`玩家[${this.roleid}:${this.name}]装备[${equip.name}]拆卸返回道具[${ItemUtil.getItemName(itemId)}]`);
			} else {
				this.bag_list[itemId] += itemList[itemId];
				SKLogger.debug(`玩家[${this.roleid}:${this.name}]装备[${equip.name}]拆卸返回道具[${ItemUtil.getItemName(itemId)}]${itemList[itemId]}个`);
			}
		}
		equip.GemCnt = 0;
		SKLogger.debug(`玩家[${this.roleid}:${this.name}]装备拆卸[${equip.name}]`);
	}

	// 宝石镶嵌
	equipInlay(data: any) {
		let equip: Equip = this.equipObjs[data.equipid];
		if (equip == null) {
			SKLogger.warn(`玩家[${this.roleid}:${this.name}]宝石镶嵌找不到装备${data.equipid}`);
			return;
		}
		if (data.operation == 0) {
			this.unInLay(equip);
			if (equip.EIndex == 1 && this.currentEquips.indexOf(equip) != -1) {
				this.changeWeapon(equip);
			}
		} else {
			let fullData = equip.getFullData();
			if (fullData) {
				let maxEmbed = fullData.MaxEmbedGemCnt;
				if (equip.GemCnt >= maxEmbed) {
					this.send('s2c_notice', {
						strRichText: `您的装备${equip.name}已经镶嵌到顶级!`
					});
					return;
				}
			}
			let itemid = equip.getInlayGemID();
			let conf = ItemUtil.getItemData(itemid);
			if (conf == null) {
				SKLogger.warn(`玩家[${this.roleid}:${this.name}]装备[${equip.name}]宝石镶嵌找不到道具[${itemid}]定义!`);
				this.send('s2c_notice', {
					strRichText: `您的装备${equip.name}]无法镶嵌宝石!`
				});
				return;
			}
			if (this.bag_list[itemid] && this.bag_list[itemid] > 0) {
				this.bag_list[itemid] -= 1;
				if (this.bag_list[itemid] <= 0) {
					delete this.bag_list[itemid];
				}
				equip.GemCnt += 1;

				Log.equipInlay(this.roleid, data.equipid, conf.id);

				SKLogger.debug(`玩家[${this.roleid}:${this.name}]装备[${equip.name}]镶嵌宝石[${conf.name}]成功!`);
				equip.calculateAttribute();
				if (equip.EIndex == 1 && this.currentEquips.indexOf(equip) != -1) {
					this.changeWeapon(equip);
				}
			} else {
				SKLogger.debug(`玩家[${this.roleid}:${this.name}]装备[${equip.name}]镶嵌,缺少[${conf.name}]!`);
				this.send('s2c_notice', {
					strRichText: `您的装备${equip.name}]无法镶嵌宝石:[${conf.name}]数量不足!`
				});
				return;
			}
		}
		equip.calculateAttribute();
		this.send('s2c_bagitem', {
			info: SKDataUtil.toJson(this.bag_list)
		});
		this.sendEquipInfo(data.equipid);
		this.calculateAttr();
		this.send('s2c_player_data', this.getData());
		equip.save(true,"宝石镶嵌");
		this.save(true,"宝石镶嵌");
	}

	//装备炼化
	equipRefine(data: any) {
		let equip = this.equipObjs[data.equipid];
		if (equip == null) {
			return;
		}
		if (data.operation == 1) {
			if (equip.refine == null) {
				return;
			}
			equip.LianhuaAttr = equip.refine.slice(0);
			equip.refine = null;
			equip.calculateAttribute();
			this.sendEquipInfo(data.equipid);
			this.calculateAttr();
			this.send('s2c_player_data', this.getData());
			this.send('s2c_notice', {
				strRichText: `炼化成功`
			});
			equip.save(true,"装备炼化");
		} else {
			// 如果是翅膀,则需要3个10404练化一次
			if (equip.EIndex == 6) {
				let needitem = 10404;
				if (this.bag_list[needitem] && this.bag_list[needitem] > 2) {
					this.bag_list[needitem] -= 3;
					if (this.bag_list[needitem] <= 0) {
						delete this.bag_list[needitem];
					}
				} else { //
					this.send('s2c_notice', {
						strRichText: `炼化材料不足`
					});
					return;
				}
			} else {
				let needitem = 10402;
				if (data.level == 1) needitem = 10403;
				if (data.level == 2) needitem = 10404;
				if (this.bag_list[needitem] && this.bag_list[needitem] > 0) {
					this.bag_list[needitem] -= 1;
					if (this.bag_list[needitem] <= 0) {
						delete this.bag_list[needitem];
					}
				} else {
					this.send('s2c_notice', {
						strRichText: `炼化材料不足`
					});
					return;
				}
			}
			this.send('s2c_bagitem', {
				info: SKDataUtil.toJson(this.bag_list)
			});
			equip.refine = null;
			equip.refine = EquipMgr.shared.getLianhuaData(equip.EIndex, data.level);
			this.send('s2c_equip_property', {
				property: SKDataUtil.toJson(equip.refine)
			});

			Log.equipRefine(this.roleid, data.equipid);
			this.save(true,"装备炼化");
		}
	}
	// 道具分解
	itemResolve(data: any) {
		let itemData = ItemUtil.getItemData(data.itemId);
		if (itemData == null) { // 无此道具
			SKLogger.warn(`玩家[${this.roleid}:${this.name}]物品[${data.itemId}]分解找不到定义!`);
			return;
		}
		let count = ItemUtil.getBagItemCount(this, itemData.id);
		if (count < 1) {
			SKLogger.warn(`玩家[${this.roleid}:${this.name}]背包无此物品[${data.itemId}]!`);
			return;
		}
		let score = ItemUtil.canResolve(itemData);
		if (score < 1) {
			this.send('s2c_notice', {
				strRichText: `物品[${data.itemId}]无法分解!`
			});
			return;
		}
		this.shuilu.gongji += score;
		this.addItem(itemData.id, -1, false, `道具[${itemData.name}]分解`);
		this.send('s2c_you_money', {
			nKind: GameUtil.goldKind.SLDH_Score,
			nNum: this.shuilu.gongji,
			nChange: score
		});
		let info = `消耗[color=#b94bd1][${itemData.name}][/color]X1得到功绩${score}`;
		this.send('s2c_notice', {
			strRichText: info
		});
		Log.itemResolve(this.roleid, data.itemId);
	}
	// 佩饰重铸
	baldricRecast(data: any) {
		let equip: Equip = this.equipObjs[data.equipid];
		if (equip == null) {
			return;
		}
		if (!ItemUtil.isBaldric(equip.EIndex)) {
			return;
		}
		let item_1 = 10406;
		let item_2 = 10409;
		if (data.operation == 1) {
			if (equip.recast == null) {
				return;
			}
			if (data.locks) {
				let total = 0;
				for (let lock of data.locks) {
					if (lock == 1) {
						total++;
					}
				}
				if (total > 0) {
					total = SKDataUtil.clamp(total, 1, 3);
					if(this.getBagItemNum(10006) < total){
						let name = ItemUtil.getItemName(10006);
						this.send('s2c_notice', {
							strRichText: `您的${name}不足,佩饰重铸锁住${total}条属性需消耗${total}个${name}`,
						});
						return;
					}
					this.addItem(10006, -total, true, `佩饰重铸锁住${total}属性`);

					// let jade = GameUtil.lockJade[total - 1];
					// if (this.jade < jade) {
					// 	this.send('s2c_notice', {
					// 		strRichText: `您的仙玉不足,佩饰重铸锁住${total}条属性需消耗仙玉${jade}`,
					// 	});
					// 	return;
					// }
					//this.addMoney(GameUtil.goldKind.Jade, -jade, `佩饰重铸锁住${total}属性,消耗仙玉${jade}`);
				}
				let source = equip.BaseAttr;
				let target = SKDataUtil.jsonBy(equip.recast);
				let index = 0;
				for (let lock of data.locks) {
					if (lock == 0) {
						source[index] = target[index];
					}
					index++;
				}
			} else {
				equip.BaseAttr = SKDataUtil.jsonBy(equip.recast);
			}
			equip.calculateAttribute();
			equip.recast = null;
			this.sendEquipInfo(data.equipid);
			this.calculateAttr();
			this.send('s2c_player_data', this.getData());
			this.send('s2c_notice', {
				strRichText: `重铸替属性成功`
			});
			equip.save(true,"配饰重铸");
		} else {
			if (this.money < 300000) {
				this.send('s2c_notice', {
					strRichText: `佩饰重铸需要300000银两!`,
				});
				return;
			}
			let item_count_1 = this.getBagItemNum(item_1);
			if (item_count_1 < 5) {
				this.send('s2c_notice', {
					strRichText: `缺少重铸材料[${ItemUtil.getItemName(item_1)}至少5个]`,
				});
				return;
			}
			let item_count_2 = this.getBagItemNum(item_2);
			if (item_count_2 < 1) {
				this.send('s2c_notice', {
					strRichText: `缺少重铸材料[${ItemUtil.getItemName(item_2)}至少1个]`,
				});
				return;
			}
			let recastData = EquipMgr.shared.getBaldricRecast(equip);
			if (recastData) {
				equip.recast = recastData.BaseAttr;
				this.addMoney(0, -300000);
				this.addBagItem(item_1, -5, true);
				this.addBagItem(item_2, -1, true);
				this.send('s2c_equip_property', {
					property: equip.recast
				});
				Log.baldricRecast(this.roleid, data.equipid);
			}
		}
	}
	// 佩饰分解
	baldricResolve(data: any) {
		let equip: Equip = this.equipObjs[data.equipid];
		if (equip == null) {
			SKLogger.debug(`[${this.roleid}:${this.name}]佩饰分解找不到装备${data.equipid}`);
			return;
		}
		if (!ItemUtil.isBaldric(equip.EIndex)) {
			return;
		}
		let score = 10;
		if (equip.Grade == 2) {
			score = 20;
		} else if (equip.Grade == 3) {
			score = 50;
		}
		this.shuilu.gongji += score;
		this.delEquip(equip.EquipID, true, "佩饰分解");
		this.sendEquipList();
		this.send('s2c_you_money', {
			nKind: GameUtil.goldKind.SLDH_Score,
			nNum: this.shuilu.gongji,
			nChange: score
		});
		let info = `消耗[color=${ItemUtil.getBaldricColor(equip.Grade)}][${equip.name}][/color]X1得到功绩${score}`;
		this.send('s2c_notice', {
			strRichText: info
		});
	}
	// 装备重铸
	equipRecast(data: any) {
		let equip: any = this.equipObjs[data.equipid];
		if (equip == null) {
			return;
		}
		if (equip.EquipType == 0 || equip.EquipType == 2) {
			return;
		}
		if (data.operation == 1) {
			if (equip.recast == null) {
				return;
			}
			equip.setDB(equip.recast);
			equip.calculateAttribute();
			equip.recast = null;
			this.sendEquipInfo(data.equipid);
			this.calculateAttr();
			this.send('s2c_player_data', this.getData());
			this.send('s2c_notice', {
				strRichText: `重铸成功`
			});
			equip.save(true,"装备重铸");
		} else {
			let itemid = 10405;
			if (equip.EquipType == 3) {
				itemid = 10401;
			}
			let itemnum = this.getBagItemNum(itemid);
			if (itemnum == 0) {
				this.send('s2c_notice', {
					strRichText: `缺少重铸材料`
				});
				return;
			}
			equip.recast = null;
			let recastData = EquipMgr.shared.getRecastData({
				type: equip.EquipType,
				grade: equip.Grade,
				role: this,
				ower: equip.OwnerRoleId,
				pos: equip.EIndex,
				resid: equip.Type
			});
			equip.recast = recastData;
			if (equip.recast) {
				this.addBagItem(itemid, -1, false);
				this.send('s2c_equip_property', {
					property: equip.recast.BaseAttr
				});
			}
		}
	}
	// 装备分解
	equipResolve(data: any) {
		let equip: Equip = this.equipObjs[data.equipid];
		if (equip == null) {
			this.send('s2c_notice', {
				strRichText: `分解的装备不存在!`
			});
			return;
		}
		if (equip.EquipType != 3 && equip.Grade < 2) {
			this.send('s2c_notice', {
				strRichText: `只有二阶及以上的仙器才能分解!`
			});
			return;
		}
		let count = ItemUtil.getEquipResolve(equip.Grade);
		if (count < 1) {
			this.send('s2c_notice', {
				strRichText: `仙器[color=${ItemUtil.getBaldricColor(equip.Grade)}][${equip.name}][/color]无法分解!`
			});
		}
		this.addItem(10406, count, false, `${equip.name}分解`);
		this.delEquip(equip.EquipID, true, "仙器分解");
		this.sendEquipList();
		let info = `消耗仙器[color=${ItemUtil.getBaldricColor(equip.Grade)}][${equip.name}][/color]X1得到${count}个[img]ui://main_ui/10406[/img]八荒遗风`;
		this.send('s2c_notice', {
			strRichText: info
		});
	}

	buyEquip(info: any) {
	}

	sellEquip(info: any) {

	}
	//////////////////////////////  装备 结束   /////////////////////////////

	getPartnerOnBattle(): any {
		let battlelist: any = [];
		if (this.partnerMgr == null) {
			return battlelist;
		}

		for (var it in this.partnerMgr.vecChuZhan) {
			let nPartnerID = this.partnerMgr.vecChuZhan[it];
			if (0 == nPartnerID)
				continue;

			let pPartner = this.partnerMgr.mapPartner[nPartnerID];
			if (null == pPartner)
				continue;

			battlelist.push(pPartner);
		}

		return battlelist;
	}
	// 获得战斗召唤兽 
	getBattlePet(pos: any): any {
		let pets = [];
		let btlpet = null;
		for (let petid in this.petList) {
			let pet: Pet = this.petList[petid];
			let battlePet = new BattleRole();
			battlePet.setObj(pet);
			battlePet.bindid = this.onlyid;
			if (this.curPet && pet.onlyid == this.curPet.onlyid) {
				battlePet.pos = pos;
				btlpet = battlePet;
			} else {
				battlePet.pos = 0;
			}
			pets.push(battlePet);
		}
		let result = {
			pets: pets,
			btlpet: btlpet
		}
		return result;
	}

	/**
	 * 获取自己的战斗队伍
	 * @param {number} type 是否有伙伴上场 0 上场 1 不上场
	 */
	getBattleTeam(type = BattleType.Normal) {
		let btlteam: any = [];
		let teamid = this.teamid;
		if (teamid != 0) {
			let team_players = TeamMgr.shared.getTeamPlayer(teamid);
			for (let i = 0; i < team_players.length; i++) {
				let player = team_players[i];
				let brole = new BattleRole();
				brole.pos = i + 1;
				brole.setObj(player);
				let pPets = player.getBattlePet(i + 6);
				if (pPets.btlpet) {
					brole.bindid = pPets.btlpet.onlyid;
				}
				btlteam.push(brole);
				btlteam = btlteam.concat(pPets.pets);
			}
			if (type == BattleType.Normal || type == BattleType.PK) {
				let partnerlist = TeamMgr.shared.getTeamLeaderPartner(teamid);
				let index = 1;
				for (const partner of partnerlist) {
					let bpartner = new BattleRole();
					bpartner.pos = team_players.length + index;
					bpartner.setObj(partner);
					btlteam.push(bpartner);
					index++;
				}
			}
		} else {
			let brole = new BattleRole();
			brole.pos = 1;
			brole.setObj(this);
			let petData = this.getBattlePet(6);
			if (petData.btlpet) {
				brole.bindid = petData.btlpet.onlyid;
			}
			btlteam.push(brole);
			btlteam = btlteam.concat(petData.pets);
			if (type == BattleType.Normal || type == BattleType.PK) {
				let partnerlist = this.getPartnerOnBattle();
				let index = 1;
				for (const partner of partnerlist) {
					let bpartner = new BattleRole();
					bpartner.pos = 1 + index;
					bpartner.setObj(partner);
					btlteam.push(bpartner);
					index++;
				}
			}
		}
		return btlteam;
	}

	forcedBattle(p1: any, battle: any) {
		if (this.teamid != 0) {
			let plist = TeamMgr.shared.getTeamPlayer(this.teamid);
			for (const pPlayer of plist) {
				pPlayer.send('s2c_btl', {
					btlid: battle.battle_id,
					teamS: battle.getTeamData(2),
					teamE: battle.getTeamData(),
				});
				pPlayer.battle_id = battle.battle_id;
			}
		} else {
			this.send('s2c_btl', {
				btlid: battle.battle_id,
				teamS: battle.getTeamData(2),
				teamE: battle.getTeamData(),
			});
			this.battle_id = battle.battle_id;
		}
	}

	playerForcePk(troleid: any){
		let target = PlayerMgr.shared.getPlayerByRoleId(troleid, false);
		if(!target || target.offline || target.battle_id > 0){
			this.send('s2c_notice', {
				strRichText: '无法攻击当前玩家'
			});
			return;
		}
		if(this.getBagItemNum(10005) <= 0){
			this.send('s2c_notice', {
				strRichText: '缺少杀人香'
			});
			return;
		}
		if (this.teamid != 0 && this.isleader == false) {
			this.send('s2c_notice', {
				strRichText: '只有队长能使用'
			});
			return;
		}
		if (target.teamid != 0 && this.teamid == target.teamid) {
			this.send('s2c_notice', {
				strRichText: '不能PK队友'
			});
			return;
		}
		if(this.mapid != target.mapid){
			this.send('s2c_notice', {
				strRichText: '距离过远'
			});
			return;
		}
		if(GameUtil.getDistance(this, target)>20){
			this.send('s2c_notice', {
				strRichText: '距离过远'
			});
			return;
		}
		let res = this.playerBattle(target.onlyid, BattleType.ShaRenXiang);
		if(res){
			this.temp.pkroleid = troleid;
			this.addBagItem(10005, -1, false);
			SKLogger.info(`[${this.name}] 强制PK [${target.name}]`);
		}else{
			this.send('s2c_notice', {
				strRichText: '发起PK失败'
			});
		}
	}



	// type 0 正常 1 pk 2 切磋
	playerBattle(onlyid: any, type = BattleType.Normal) {
		if (this.battle_id != 0 || this.onlyid == onlyid) {
			return null;
		}
		let p2 = PlayerMgr.shared.getPlayerByOnlyId(onlyid);
		if (p2 == null || p2.battle_id != 0) {
			return null;
		}
		if (this.teamid != 0 && this.isleader == false) {
			return null;
		}
		if (p2.teamid != 0 && this.teamid == p2.teamid) {
			return null;
		}
		if (type == BattleType.Force) {
			if (this.level < GameUtil.PKLevelLimit || p2.level < GameUtil.PKLevelLimit) {
				return null;
			}

			let mapsi = GameUtil.cantPKMaps.indexOf(this.mapid);
			let mapti = GameUtil.cantPKMaps.indexOf(p2.mapid);
			if (mapsi != -1 || mapti != -1) {
				return null;
			}
		}

		let t1 = this.getBattleTeam(type);
		let t2 = p2.getBattleTeam(type);

		let battle = BattleMgr.shared.createBattle();
		battle.setTeamBRole(t1, t2);
		battle.setBattleType(type);
		battle.source = this.onlyid;

		let senddata = {
			btlid: battle.battle_id,
			teamS: battle.getTeamData(),
			teamE: battle.getTeamData(2),
		};
		if (this.teamid != 0) {
			let plist = TeamMgr.shared.getTeamPlayer(this.teamid);
			for (const pPlayer of plist) {
				pPlayer.battle_id = battle.battle_id;
				pPlayer.send('s2c_btl', senddata);
				pPlayer.synInfoToWatcher();
			}
		} else {
			this.battle_id = battle.battle_id;
			this.send('s2c_btl', senddata);
			this.synInfoToWatcher();
		}

		p2.forcedBattle(this.onlyid, battle);

		setTimeout(() => {
			battle.begin();
		}, 1 * 1000);
		return battle;
	}

	//和NPC战斗
	monsterBattle(mongroupid?: any, battletype = BattleType.Normal, yewai = false) {
		if (this.battle_id != 0)
			return null;

		if (mongroupid == null || isNaN(mongroupid)) {
			mongroupid = 10048;
		}
		let mongroup = MonsterMgr.shared.getGroupData(mongroupid);
		if (mongroup == null) {
			return null;
		}

		let monsterlist = MonsterMgr.shared.getMonGroup(mongroupid);
		if (monsterlist == null) {
			return null;
		}
		if (this.teamid != 0 && this.isleader == false) {
			return null;
		}

		if (this.mapid == 1003) { //北俱芦洲 没有宝宝
			yewai = false;
		}
		let t1 = this.getBattleTeam(mongroup.partner);
		let t2 = [];
		for (let i = 0; i < monsterlist.length; i++) {
			const monster = monsterlist[i];
			let brole = new BattleRole();
			brole.pos = parseInt(monster.pos);
			brole.setObj(monster);
			t2.push(brole);
		}
		if (yewai && t2.length < 10) {
			let r = GameUtil.random(1, 10000);
			if (r < 10000) {
				let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
				for (const key in t2) {
					const brole = t2[key];
					let t = list.indexOf(brole.pos);
					list.splice(t, 1);
				}
				if (list.length > 0) {
					let bb = MonsterMgr.shared.getRandomBB();
					let brole = new BattleRole();
					brole.is_bb = true;
					brole.pos = list[GameUtil.random(0, list.length - 1)];
					brole.setObj(bb);
					t2.push(brole);
				}
			}
		}

		let battle = BattleMgr.shared.createBattle();
		battle.setTeamBRole(t1, t2);
		battle.setBattleType(battletype);
		battle.monster_group_id = mongroupid;
		let senddata = {
			btlid: battle.battle_id,
			teamS: battle.getTeamData(),
			teamE: battle.getTeamData(2),
		};
		if (this.teamid != 0) {
			let plist = TeamMgr.shared.getTeamPlayer(this.teamid);
			for (const pPlayer of plist) {
				pPlayer.battle_id = battle.battle_id;
				pPlayer.send('s2c_btl', senddata);
				pPlayer.synInfoToWatcher();
			}
		} else {
			this.battle_id = battle.battle_id;
			this.send('s2c_btl', senddata);
			this.synInfoToWatcher();
		}

		setTimeout(() => {
			battle.begin();
		}, 1 * 1000);

		return battle;
	}

	// 战斗结束
	exitBattle(iswin: any) {
		this.send('s2c_btl_end', {
			btlid: this.battle_id,
			result: iswin,
		});

		let battle = BattleMgr.shared.getBattle(this.battle_id);
		if (battle == null) {
			this.battle_id = 0;
			return;
		}

		// 奖励相关
		let mgdata = MonsterMgr.shared.getGroupData(battle.monster_group_id);
		if (iswin == 1 && mgdata) {
			this.addExp(mgdata.exp);
			this.addMoney(0, mgdata.gold, '战斗奖励');
			if (this.curPet) {
				this.curPet.addExp(mgdata.exp);
			}

			//是否可以获得奖励状态
			let isReward = true;

			//杀星检测
			if(World.shared.starMgr.IsStar(battle.source)){
				if(this.GetTaskMgr().GetKindTaskCnt(1) > 10){
					isReward = false;
				}
			}
			
			//五环宝图检测
			let wuhuanCnt = this.GetTaskMgr().mapDailyCnt[5];

			if(isReward == true){
				let itemlist = MonsterMgr.shared.makeGroupDrop(battle.monster_group_id);
				for (const iteminfo of itemlist) {
					if(iteminfo.itemid == 50004 && wuhuanCnt > 5){
						continue;
					}
					this.addItem(iteminfo.itemid, iteminfo.itemnum, true, '战斗奖励');
				}
			}

		}

		// 任务相关
		if (iswin == 1) {
			//强制PK
			if (battle.battle_type == BattleType.Force && battle.source == this.onlyid) {
				if (this.teamid > 0) {
					let team_players = TeamMgr.shared.getTeamPlayer(this.teamid);
					for (let i = 0; i < team_players.length; i++) {
						const pPlayer = team_players[i];
						pPlayer.shane += 600 * 4;
						pPlayer.ShanEChange();
					}
				} else {
					this.shane += 600 * 4;
					this.ShanEChange();
				}
			}

			if (battle.battle_type == BattleType.Normal) {
				let pNpc = NpcMgr.shared.FindNpc(battle.source);
				if (pNpc) {
					this.OnKillNpc(pNpc.configid, pNpc.onlyid);
				}
			}
			/* 胜利宠物加10点亲密值 */
			if (this.teamid > 0) {
				let team_players = TeamMgr.shared.getTeamPlayer(this.teamid);
				for (let player of team_players) {
					if (player && player.curPet) {
						player.curPet.addqinmi(10);
					}
				}
				//夫妻双人组队 打卦每次给1经验
				if(this.marryid>0 && team_players.length ==2 && team_players[0].marryid == team_players[1].marryid){
					MarryMgr.shared.addExp(this);
				}
			} else {
				if (this.curPet) {
					this.curPet.addqinmi(10);
				}
			}
		} else {
			// 战斗失败了
			this.GetTaskMgr().OnFailEvent(EEventType.FailEventPlayerDead, 0);
			let pNpc = NpcMgr.shared.FindNpc(battle.source);
			if (pNpc) {
				World.shared.starMgr.ChallengeFail(pNpc.onlyid);
				// DWorld.shared.starMgr.ChallengeFail(pNpc.onlyid);
			}
		}

		if (battle.battle_type == BattleType.ShuiLu) {
			let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.ShuiLuDaHui);
			if (activity) {
				let matchteam = activity.getMatchTeamInfo(this.teamid);
				if (matchteam) {
					activity.battleEnd(this.teamid, iswin);
				}
			}
		} else if (battle.battle_type == BattleType.PALACE) {
			if (iswin && ((this.teamid != 0 && this.isleader) || this.teamid == 0)) {
				PalaceFight.shared.pkWin(this.roleid);
			}
		} else if (battle.battle_type == BattleType.BangZhan) {
			BangZhan.shared.playerFightEnd(this, iswin, battle.source);
		} else if (battle.battle_type == BattleType.ChangAn) {
			let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.JueZhanChangAn);
			activity && activity.fightEnd(this, iswin);
		} else if (battle.battle_type == BattleType.ShaRenXiang) {
			let tplayer = PlayerMgr.shared.getPlayerByRoleId(this.temp.pkroleid, false);
			if(tplayer){
				// let msg = iswin ? `[${this.name}]使用杀人香杀死了[${tplayer.name}]，免费获得10分钟监狱体验，请施主放下屠刀立地成佛，好好改造。` : 
				// `[${this.name}]使用杀人香挑战[${tplayer.name}]，由于实力不足被对方羞辱！以后看见请绕道走。`;
				// NoticeMgr.shared.sendNotice({
				// 	type: 2,
				// 	text: msg,
				// });

			}
			delete this.temp.pkroleid;
		}

		this.battle_id = 0;
		this.synInfoToWatcher();
	}

	ShanEChange() {
		let change = false;
		if (this.mapid == 1201 && this.shane <= 0) {
			this.leavePrison();
			change = true;
		}
		if (this.mapid == 1011 && this.shane > 0) {
			this.enterPrison();
			change = true;
		}
		this.send('s2c_prison_time', {
			onlyid: this.onlyid,
			time: this.inPrison ? Math.ceil(this.shane / 4) : 0
		});
		return change;
	}

	getWorldStar() {
		return this.star;
	}

	//击败NPC
	OnKillNpc(nConfigID: any, nOnlyID: any) {
		let pNpc = NpcMgr.shared.FindNpc(nOnlyID);
		if (null == pNpc)
			return;

		let pConfig = NpcConfigMgr.shared.GetConfig(nConfigID);
		if (null == pConfig)
			return;
		//触发游戏任务事件
		this.GetTaskMgr().OnGameEvent(EEventType.PlayerKillNpc, nOnlyID);
		if (pNpc.stCreater.nKind != GameUtil.ENpcCreater.ESystem) {
			NpcMgr.shared.CheckAndDeleteNpc(nOnlyID, this);
		}
		//杀星统计
		if (World.shared.starMgr.IsStar(nOnlyID)) {
			this.star++;
			if(this.GetTaskMgr().mapDailyCnt.hasOwnProperty(1)){
				this.GetTaskMgr().mapDailyCnt[1] ++;
			}else{
				this.GetTaskMgr().mapDailyCnt[1] = 1;
			}
		}
		World.shared.OnKillNpc(this.accountid, nOnlyID);
	}
	// 加入到装备列表
	addEquipList(value: Equip) {
		this.listEquips.push(value);
	}
	//转生
	playerRelive(data: any) {
		let nextlive = this.relive + 1;
		let relivedata = GameUtil.reliveLimit[nextlive];
		if (relivedata == null) {
			this.send('s2c_relive', {
				result: MsgCode.FAILED,
				info: this.toObj(),
				data: this.getData()
			});
			return;
		}
		if (this.level < relivedata.level) {
			return;
		}
		//处理装备
		for (const equip of this.currentEquips) {
			this.addEquipList(equip);
		}
		this.currentEquips = [];
		this.sendEquipList();
		this.changeWeapon(null);
		//清理加点
		for (const key in this.addattr2) {
			this.addattr2[key] = 0;
		}
		this.relivelist[this.relive] = [this.race, this.sex];
		this.relive = nextlive;
		this.resid = data.resid;
		this.race = data.race;
		this.sex = data.sex;
		this.setLevel(relivedata.tolevel);
		this.resetSkill();
		this.addExp(0);
		this.calculateAttr();
		this.send('s2c_relive', {
			result: MsgCode.SUCCESS,
			info: this.toObj(),
			data: this.getData()
		});
		this.save(true,"角色转生");
	}
	//飞升
	playerFlyUp(data: any) {
		if (this.relive != 3) {
			this.send('s2c_notice', {
				strRichText: `你才{${this.relive}}转,需要3转180级后才可以飞升`
			});
			return;
		}
		let nextlive = this.relive + 1;
		let relivedata = GameUtil.reliveLimit[nextlive];
		if (relivedata == null) {
			this.send('s2c_notice', {
				strRichText: `没有开放飞升配置,请稍候重试!`
			});
			return;
		}
		if (this.level < relivedata.level) {
			this.send('s2c_notice', {
				strRichText: `需要达到等级:${relivedata.level}才可以飞升!`
			});
			return;
		}
		//处理装备
		for (const equip of this.currentEquips) {
			this.addEquipList(equip);
		}
		this.currentEquips = [];
		this.sendEquipList();
		this.changeWeapon(null);
		//清理加点
		for (const key in this.addattr2) {
			this.addattr2[key] = 0;
		}
		this.relivelist[this.relive] = [this.race, this.sex];
		this.relive = nextlive;
		this.setLevel(relivedata.tolevel);
		this.resetSkill();
		this.addExp(0);
		this.calculateAttr();
		this.send('s2c_relive', {
			result: MsgCode.SUCCESS,
			info: this.toObj(),
			data: this.getData()
		});
	}
	// 玩家改变种族
	playerChangeRace(data: any) {
		if (this.jade < 300) {
			this.send('s2c_notice', {
				strRichText: '仙玉不足'
			});
			return;
		}
		this.addMoney(1, -300, `玩家[${this.roleid}:${this.name}]改变种族`);
		for (let equip of this.currentEquips) {
			this.addEquipList(equip);
		}
		this.currentEquips = [];
		this.sendEquipList();
		this.changeWeapon(null);
		this.resid = data.resid;
		this.race = data.race;
		this.sex = data.sex;
		//重置加点
		this.addattr2[EAttrTypeL2.GENGU] = 0;
		this.addattr2[EAttrTypeL2.LINGXING] = 0;
		this.addattr2[EAttrTypeL2.MINJIE] = 0;
		this.addattr2[EAttrTypeL2.LILIANG] = 0;
		this.resetSkill();
		this.addExp(0);
		this.calculateAttr();
		this.horseList.changeRace(this.race);
		let params = {
			result: MsgCode.SUCCESS,
			info: this.toObj(),
			data: this.getData()
		};
		this.send("s2c_changerace", params);
		this.syncChangeRace();
		MarryMgr.shared.updatePlayerInfo(this);
	}

	// 同步种族改变
	syncChangeRace() {
		let playerList = this.getWatcherPlayer();
		if (playerList) {
			for (let key in playerList) {
				let player = playerList[key];
				if (player.isPlayer()) {
					player.send('s2c_sync_race', {
						info: this.toObj(),
						data: this.getData()
					});
				}
			}
		}
	}


	GetNameLength(strName: any) {
		let nCnt = 0;
		let nLen = strName.length;
		for (let i = 0; i < nLen; i++) {
			if (/[a-zA-Z0-9]/.test(strName[i]))
				nCnt += 1;
			else
				nCnt += 2;
		}
		return nCnt;
	}

	//改名相关
	playerChangeName(data: any) {
		if(!SKDataUtil.CheckName(data.name)){
			this.send('s2c_notice', {
				strRichText: '请填写2-8个汉字！'
			});
			return;
		}
        for (let ln of GameUtil.limitWordList) {
            if (data.name.indexOf(ln) != -1) {
				this.send('s2c_notice', {
					strRichText: '非法名称！'
				});
				return;
            }
        }
		//宠物改名
		if(data.petid){
			let operationPet = null;
			for (let pet of this.petList) {
				if (pet.petid == data.petid) {
					operationPet = pet;
					break;
				}
			}
			if(operationPet == null){
				return;
			}
			let namelen = this.GetNameLength(data.name);
			if (namelen > 12 || namelen < 2) {
				this.send('s2c_notice', {
					strRichText: '名字长度错误(2~12位)'
				});
				return;
			}
			operationPet.changeName(data.name);
			return;
		}
		//角色改名
		if (this.jade < 600) {
			this.send('s2c_notice', {
				strRichText: '仙玉不足'
			});
			return;
		}
		let namelen = this.GetNameLength(data.name);
		if (namelen > 12 || namelen < 2) {
			this.send('s2c_notice', {
				strRichText: '名字长度错误(2~12位)'
			});
			return;
		}
		for (let i = 0; i < GameUtil.limitWordList.length; i++) {
			const fword = GameUtil.limitWordList[i];
			if (data.name.indexOf(fword) != -1) {
				this.send('s2c_notice', {
					strRichText: `非法名字！`
				});
				return;
			}
		}

		Log.changeName(this.roleid, `${this.name}:${data.name}`, data.petid);
		let callback = (ret: any) => {
			if (ret == MsgCode.SUCCESS) {
				this.addMoney(1, -600, '玩家改变名字');
				this.send('s2c_notice', {
					strRichText: `改名成功，西游欢迎您重新归来！`
				});
				this.name = data.name;
				this.send('s2c_aoi_pinfo', {
					list: [this.toObj()]
				});
				this.synInfoToWatcher();
				MarryMgr.shared.updatePlayerInfo(this);
			} else {
				this.send('s2c_notice', {
					strRichText: `再想一个独一无二的名字吧，仙玉未扣除！`
				});
			}
			callback = null;
		}

		data.roleid = this.roleid;
		DB.changeName(data, callback);
	}

	resetPoint() {
		//重置加点
		this.resetRolePoint();
		this.sendEquipList();

		this.calculateAttr();
		this.send('s2c_player_data', this.getData());
		this.send('s2c_notice', {
			strRichText: '角色加点重置成功！'
		});
	}

	sendReliveList() {
		this.send('s2c_relive_list', {
			strJson: SKDataUtil.toJson(this.relivelist)
		});
	}

	changeReliveList(data: any) {
		if (this.getBagItemNum(10201) <= 0) {
			this.send('s2c_notice', {
				strRichText: '回梦丹不足'
			});
			return;
		}
		this.addItem(10201, -1, false, '转生修正消耗');
		let vecLiveInfo = SKDataUtil.jsonBy(data.strJson);
		this.relivelist = [];
		for (var nLive in vecLiveInfo) {
			if(nLive == this.relive.toString()) 
				break;
			let stLive = vecLiveInfo[nLive];
			let vecInfo = [GameUtil.getDefault(stLive.nRace, 0), GameUtil.getDefault(stLive.nSex, 0)];
			this.relivelist.push(vecInfo);
		}
		this.calculateAttr();
		this.send('s2c_player_data', this.getData());
		this.send('s2c_notice', {
			strRichText: '修改成功'
		});
	}

	getWatcherPlayer() {
		let pMap = MapMgr.shared.getMap(this);
		if (pMap == null) return;
		return pMap.getWatcher(this.onlyid);
	}

	synPosToWatcher() {
		let mPlayers = this.getWatcherPlayer();
		if (mPlayers) {
			mPlayers[this.onlyid] = this;
			for (const key in mPlayers) {
				let p = mPlayers[key];
				if (p.isPlayer())
					p.send('s2c_player_pos', {
						onlyid: this.onlyid,
						x: this.x,
						y: this.y
					});
			}
		}
	}

	addShuiluScore(jifen: any, gongji: any, iswin: any) {
		this.shuilu.gongji += parseInt(gongji);
		this.shuilu.score += parseInt(jifen);
		if (iswin == 1) {
			this.shuilu.wtime++;
		} else {
			this.shuilu.ltime++;
		}
	}

	synInfoToWatcher() {
		let mPlayers = this.getWatcherPlayer();
		if (mPlayers) {
			for (const key in mPlayers) {
				let p = mPlayers[key];
				if (p.isPlayer())
					p.send('s2c_aoi_pinfo', {
						list: [this.toObj()]
					});
			}
		}
	}

	/*
	 * 充值奖励
	 */
	chargeReward(data: any) {
		let rewardid = data.rewardid;
		let type = data.type;
		let choose_item = null;
		let num = 1 << (rewardid - 1);
		if ((num & this.rewardrecord[type]) != 0) {
			return;
		}
		let list = ChargeConfig.shared.reward_list;

		if(type == 1){
			list = ChargeConfig.shared.reward_list2;
		}
		for (let item of list) {
			if (item.id == rewardid) {
				choose_item = item;
				break;
			}
		}
		let chargesum = ChargeSum.shared.getPlayerChargeSum(this.roleid);
		if (!choose_item || chargesum < choose_item.money)
			return;
		for (let item of choose_item.reward) {
			this.addItem(item.gid, item.count, true, '充值奖励'); 
		}
		this.rewardrecord[type] |= num;
		//this.send('s2c_rewardrecord', {info: this.rewardrecord});
		this.send('s2c_player_data', this.getData());
	}

	reGetGift() {
		let time: number = parseInt(GTimer.format('yyyyMMdd'));
		if(this.getgift.time >= time){
			return MsgCode.GIFT_HAS_GOT;
		}
		this.getgift.day += 1;
		this.getgift.time = time;
		let gift = require("../gift/gift");
		if (gift&&gift.libao&&(gift=gift.libao[this.getgift.day])) {
			for (let gitem of gift) {
				let itemid = gitem.itemid;
				let itemnum = gitem.num;
				this.addItem(itemid, itemnum, true, '新手礼包');
			}
			SKLogger.info(`玩家${this.roleid}领取了第${this.getgift.day}日的登陆奖励`);
		}else{
			return MsgCode.GIFT_HAS_GOT;
		}
		return MsgCode.SUCCESS;
	}

	getBang() {
		if (this.bangid == 0) {
			return null;
		}
		return BangMgr.shared.getBang(this.bangid);
	}
	// 称谓相关
	addTitle(type: any, titleId: any, value = '', onload = false) {
		// let titlesList = this.getTitleItemByTitleId(type, titleId, value)
		// if (titlesList.length <= 0) {
		// 	//添加称谓
		// 	let title = { "type": type, "titleid": titleId, "value": value, "onload": onload }
		// 	this.titles.push(title);
		// }
		// this.save(true,"添加称号");
	}

	delTitle(type: any, titleId: any, value = '') {
		let delIndex = -1;
		let delItem = this.titles.find((e: any, index: any): boolean => {
			if (e.type == type && e.titleid == titleId && e.value == value) {
				delIndex = index;
				return true;
			}
			return false;
		});
		if (delIndex >= 0 && delItem) {
			if (delItem.onload) {
				this.titleId = -1;
				this.titleType = -1;
				this.titleVal = '';
			}
			this.titles.splice(delIndex, 1);
		}
		this.save(true,"删除称号");
	}

	getTitles() {
		this.send('s2c_title_info', {
			titles: SKDataUtil.toJson(this.titles),
		});
	}

	//通过titleID获取title信息
	getTitleItemByTitleId(type: any, titleId: any, value: any): any {
		return this.titles.filter((e: any) => {
			if (e.type == type && e.titleid == titleId && e.value == value) {
				return true;
			}
			return false;
		});
	}

	changeTitle(data: any) {
		if (data.operatetype == 1) {
			let res = this.titles.some((e: any) => {
				e.onload = false;
				return true;
			});
			if (res) {
				this.titleId = -1;
				this.titleType = -1;
				this.titleVal = '';
				this.onLoad = false;
				this.send('s2c_title_change', {
					ecode: MsgCode.SUCCESS,
					titleid: 0,
					type: -1,
					value: '',
					operatetype: data.operatetype
				});
			}
			return;
		} else {
			this.titles.forEach((e: any) => {
				if (e.type == data.type && e.titleid == data.titleid) {
					if ((data.type == GameUtil.titleType.BroTitle || data.type == GameUtil.titleType.CoupleTitle) && e.value == data.value) {
						e.onload = !e.onload;
						this.onLoad = true;
						this.titleVal = e.value;
					} else {
						this.onLoad = false;
						e.onload = !e.onload;
						this.titleVal = '';
					}
					this.titleId = e.titleid;
					this.titleType = e.type;
				}
			});
			this.send('s2c_title_change', {
				ecode: MsgCode.SUCCESS,
				title: this.titles,
				titleid: this.titleId,
				type: this.titleType,
				value: this.titleVal,
				operatetype: data.operatetype
			});
		}
	}

	/*
	 * 是否能进行皇城pk
	 */
	canPalaceFight() {
		return (this.mapid == 1206 && this.battle_id == 0);
	}

	getIsOnline() {
		return !this.offline;
	}

	setRoleColor(index1: any, index2: any) {
		let rolecolor = GameUtil.require_ex('../../conf/prop_rolecolor.json');
		if (!rolecolor[this.resid]) {
			SKLogger.debug(`prop_rolecolor 未找到${this.resid}`);
			return;
		}
		let data1, data2;
		let canset = true;
		if (index1 != 0) {
			data1 = rolecolor[this.resid]['color1_' + index1];
			if (data1 && parseInt(data1.color, 16) != this.color1) {
				if (!this.bag_list[data1.itemid] || this.bag_list[data1.itemid] < data1.count) {
					canset = false;
				}
			}
		}

		if (index2 != 0) {
			data2 = rolecolor[this.resid]['color2_' + index2];
			if (data2 && parseInt(data2.color, 16) != this.color2) {
				if (!this.bag_list[data2.itemid] || this.bag_list[data2.itemid] < data2.count) {
					canset = false;
				}
			}
		}

		if (canset) {
			if (data1) {
				this.update_bagitem({
					itemid: data1.itemid,
					count: data1.count,
					operation: 0,
				});
				this.color1 = parseInt(data1.color, 16);
			}
			else {
				this.color1 = 0;
			}

			if (data2) {
				this.update_bagitem({
					itemid: data2.itemid,
					count: data2.count,
					operation: 0,
				});
				this.color2 = parseInt(data2.color, 16);
			}
			else {
				this.color2 = 0;
			}
			SKLogger.debug(`玩家${this.roleid}成功的进行了染色color1:${this.color1},color2:${this.color2}`);
			this.send('s2c_change_role_color', { color1: this.color1, color2: this.color2, });
			this.send('s2c_notice', { strRichText: '玩家染色成功' });
		}
	}

	clone() {
		let p: any = new Player();
		for (const key in this) {
			if (this.hasOwnProperty(key)) {
				const info = this[key];
				p[key] = info;
			}
		}
		p.accountid = -1;
		p.roleid = -1;
		return p;
	}

	/*
	 * 消耗铃铛进行世界广播
	 */
	costBell(str: any) {
		let bell_count = this.getBagItemNum(10205);
		if (bell_count <= 0) {
			return;
		}
		this.update_bagitem({
			operation: 0,
			count: 1,
			itemid: 10205,
		});
		PlayerMgr.shared.broadcast('s2c_bell_msg', {
			msg: str,
			name: this.name,
			roleid: this.roleid,
		});
		PlayerMgr.shared.broadcast('s2c_game_chat', {
			roleid: this.roleid,
			onlyid: this.onlyid,
			scale: 0,
			msg: str,
			name: this.name,
			resid: this.resid,
		});
	}

	/*
	 * 设置玩家安全锁密码
	 */
	setSafePassword(pass: any, lock: any) {
		this.safe_password = pass;
		this.safe_lock = lock;
		let safecode = this.safe_lock + ':' + this.safe_password;
		DB.setSafecode(this.accountid, safecode, (ret: any) => {
			if (ret == MsgCode.SUCCESS) {
				this.send('s2c_safepass_msg', {
					pass: this.safe_password,
					lock: this.safe_lock,
				});
			}
			else {
				this.safe_password = '';
				this.safe_lock = 0;
			}
		});
	}
	// 骑乘
	ride(horseIndex: number) {
		if (this.horseList.horseIndex == horseIndex) {
			return;
		}
		this.horseList.horseIndex = horseIndex;
		this.syncRide(horseIndex);
		this.save(true,"骑乘");
	}

	syncRide(horseIndex: number) {
		let playerList = this.getWatcherPlayer();
		if (playerList) {
			for (const key in playerList) {
				let player = playerList[key];
				if (player.isPlayer()) {
					player.send("s2c_sync_ride", {
						onlyId: this.onlyid,
						horseIndex: horseIndex,
					});
				}
			}
		}
	}
	// 下马
	get_down() {
		if (this.horseList.horseIndex == 0) {
			return;
		}
		this.horseList.horseIndex = 0;
		this.syncGetDown();
		this.save(true,"下马");
	}
	// 同步下马
	syncGetDown() {
		let mPlayers = this.getWatcherPlayer();
		if (mPlayers) {
			for (const key in mPlayers) {
				let p = mPlayers[key];
				if (p.isPlayer()) {
					p.send('s2c_sync_get_down', {
						onlyId: this.onlyid,
					});
				}
			}
		}
	}
	// 升级坐骑
	upgradeHorse(data: any) {
		this.horseList.addExp(data.itemId, data.horseIndex);
	}
	// 召唤兽管制改变
	petControl(data: any) {
		let petid = data.petid;
		let control = SKDataUtil.clamp(data.control, 0, 4);
		for (let pet of this.petList) {
			if (pet.petid == petid) {
				if (pet.control == control) {
					return;
				}
				pet.control = control;
				SKLogger.debug(`玩家[${this.roleid}:${this.name}]召唤兽[${pet.name}]管制改变:${control}`);
				pet.calculateAttribute();
				this.getPetlist();
				pet.save(false,'管制改变');
				return;
			}
		}
		SKLogger.warn(`玩家[${this.roleid}:${this.name}]召唤兽管制找不到:${petid}:${control}`);
	}
	// 更新召唤兽管制属性
	updatePetControl(control: number) {
		let hasChange = false;
		for (let pet of this.petList) {
			if (pet.control == control) {
				hasChange = true;
				pet.calculateAttribute();
				SKLogger.debug(`玩家[${this.name}(${this.roleid})]召唤兽[${pet.name}管制更新属性:${control}`)
			}
		}
		if (hasChange) {
			this.getPetlist();
		}
	}


	//检查是否可以兑换
	checkExchange(code: string): boolean {
		return false;
		if (this.exchange.hasCode(code)) {
			this.send('s2c_notice', {
				strRichText: `您的兑换码[${code}]已经兑换过了!`
			});
			return true;
		}
		let item = this.exchange.checkCode(code);
		if (item) {
			if (this.level < 80) {
				this.send('s2c_notice', {
					strRichText: `您需要80级以上才可以使用兑换[${code}]!`
				});
				return true;
			}
			let params = item.reward.split(",");
			let hasReward = false;
			for (let temp of params) {
				let itemParams = temp.split(":");
				let itemId = itemParams[0];
				let itemData = ItemUtil.getItemData(itemId);
				if (!itemData) {
					continue;
				}
				let start = item.start ? item.start : "";
				let end = item.end ? item.end : "";
				let atRange = DateUtil.atRange(start, end);
				if (!atRange) {
					this.send('s2c_notice', {
						strRichText: `您的兑换码[${code}]不在有效期内!`
					});
					return true;
				}
				hasReward = true;
				let itemCount = itemParams[1];
				this.addItem(itemId, itemCount, true, `您通过兑换码[${code}]获得${itemData.name}${itemCount}个`);
			}
			if (hasReward) {
				this.exchange.list.push(code);
				DB.saveExchange(this.roleid, code, (code, msg) => {
					if (code == 0) {
						SKLogger.debug(msg);
					} else {
						SKLogger.warn(msg);
					}
				});
			}
			return true;
		}
		return false;
	}
	// 获得坐骑技能列表
	getHorseSkill() {
		let params = this.horseSkill.toObj();
		this.send('s2c_horse_skill', params);
	}
	// 升级坐骑技能
	upgradeHorseSkill(data: any) {
		let skill = this.horseSkill.getSkill(data.position);
		if (skill == null) {
			return;
		}
		let exp = SKDataUtil.clamp(skill.exp + 500, 0, 20000);
		if (skill.exp >= exp) {
			this.send('s2c_notice', {
				strRichText: `坐骑技能[${skill.skill_name}]熟练度已升满!`
			});
			return;
		}
		let itemData = ItemUtil.getItemData(GameUtil.horseSkillUpItemId);
		let count = ItemUtil.getBagItemCount(this, itemData.id);
		if (count < 3) {
			this.send('s2c_notice', {
				strRichText: `您需要至少3个[${itemData.name}]才能升级坐骑技能!`
			});
			return;
		}
		let old = skill.exp;
		skill.exp = exp;
		this.addItem(itemData.id, -3, false, "升级坐骑技能");
		SKLogger.debug(`玩家[${this.roleid}:${this.name}]坐骑技能[${skill.skill_name}]升级经验:${old}->${skill.exp}`);
		this.updatePetControl(Math.floor(data.position / 3) + 1);
		let params = this.horseSkill.toObj();
		this.horseSkill.save(true,'升级坐骑技能');
		this.send("s2c_horse_skill", params);
	}
	// 坐骑洗炼
	horseRefining(data: any) {
		this.horseSkill.refining(data);
	}
	// 领取每日充值奖励
	dayReward(data: any) {
		let key = data.money;
		if (this.dayMap[`day_${key}`]) {
			this.send('s2c_notice', {
				strRichText: `您已领取每日充值${key}元奖励!`
			});
			return;
		}
		if ((this.getBagItemAllKindNum() + 4) >= GameUtil.limitBagKindNum) {
			this.send('s2c_notice', {
				strRichText: `背包没有足够的空间，无法领取每日充值${key}元奖励!`
			});
			return;
		}
		let reward = ChargeSum.shared.dayReward[key];
		for (let item of reward) {
			this.addItem(item.item_id, item.count, true, `每日充值${key}元奖励`);
		}
		this.dayMap[`day_${key}`] = 1;
		this.send(`s2c_day_reward`, {
			dayMap: SKDataUtil.toJson(this.dayMap)
		});
	}
	// 领取VIP每日奖励
	vipReward(data: any) {
		let type = data.type;
		let vipLevel = data.vipLevel;
		let chargeSum = ChargeSum.shared.getPlayerChargeSum(this.roleid);
		let myVip = VIPUtil.getVipLevel(chargeSum);
		if (vipLevel > myVip) {
			this.send('s2c_notice', {
				strRichText: `您不能领取高于自己VIP${vipLevel}每日奖励!`
			});
			return;
		}
		let receive = (this.dayMap[`vip_${vipLevel}`] || 0);
		if (receive > 0) {
			this.send('s2c_notice', {
				strRichText: `您已领取VIP${vipLevel}每日奖励!`
			});
			return;
		}
		if ((this.getBagItemAllKindNum() + 4) >= GameUtil.limitBagKindNum) {
			this.send('s2c_notice', {
				strRichText: `背包没有足够的空间，无法领取VIP${vipLevel}每日奖励!`
			});
			return;
		}
		let reward = VIPUtil.getVipReward(vipLevel);
		if (reward == null) {
			this.send('s2c_notice', {
				strRichText: `奖励物品错误，无法领取VIP${vipLevel}每日奖励!`
			});
			return;
		}
		for (let itemData of reward) {
			this.addItem(itemData.id, itemData.count, true, `VIP${vipLevel}每日奖励`);
		}
		this.dayMap[`vip_${vipLevel}`] = 1;
		this.send(`s2c_vip_reward`, {
			dayMap: SKDataUtil.toJson(this.dayMap)
		});
	}
	// 挖宝列表 
	dugList(data: any) {
		let type = data.type;
		let dug = this.dayMap[`dug_${type}`];
		if (!DugMgr.enabled) {
			this.send('s2c_notice', {
				strRichText: `今日挖宝活动已关闭,何时开启另行通知!`,
			});
			if (dug == null) {
				this.dayMap[`dug_${type}`] = DugMgr.shared.update(type);
			}
			this.send(`s2c_dug_list`, {
				dayMap: SKDataUtil.toJson(this.dayMap)
			});
			return;
		};
		if (dug == null) {
			this.dayMap[`dug_${type}`] = DugMgr.shared.update(type);
		} else {
			let count = (dug.count != null ? dug.count : -1);
			if (count < 0) {
				// 10万仙玉刷新
				let updateJade = DugMgr.updateJade;
				if (this.jade < updateJade) {
					this.send('s2c_notice', {
						strRichText: `挖宝刷新需要消耗${this.jade}仙玉不足`,
					});
				} else {
					this.addMoney(GameUtil.goldKind.Jade, -100000, `挖宝刷新消耗仙玉${updateJade}`);
					this.dayMap[`dug_${type}`] = DugMgr.shared.update(type);
				}
			}
		}
		this.send(`s2c_dug_list`, {
			dayMap: SKDataUtil.toJson(this.dayMap)
		});
	}
	// 开挖
	dug(data: any) {
		let index = data.index;
		if (!DugMgr.enabled) {
			this.send('s2c_notice', {
				strRichText: `今日挖宝活动已关闭,何时开启另行通知!`,
			});
			this.send(`s2c_dug`, {
				state: 0,
				index: index
			});
			return;
		};
		let type = data.type;
		let dug = this.dayMap[`dug_${type}`];
		if (dug == null) {
			return;
		}
		if (index == -1) {
			this.dayMap[`dug_${type}`] = DugMgr.shared.start(dug);
			this.send(`s2c_dug_list`, {
				dayMap: SKDataUtil.toJson(this.dayMap)
			});
		} else {
			// 扣除仙玉
			let reward = dug.list[index];
			let itemData = ItemUtil.getItemData(reward.item_id);
			if (itemData == null) {
				this.send('s2c_notice', {
					strRichText: `您第${dug.count + 1}次挖宝奖励不存在!`,
				});
				this.send(`s2c_dug`, {
					state: 0,
					index: index
				});
				return;
			}
			let jade = DugMgr.shared.getJade(dug.count);
			if (this.jade < jade) {
				this.send('s2c_notice', {
					strRichText: `您第${dug.count + 1}次挖宝消耗仙玉${jade}不足`,
				});
				this.send(`s2c_dug`, {
					state: 0,
					index: index
				});
				return;
			}
			this.addMoney(GameUtil.goldKind.Jade, -jade, `您第${dug.count + 1}次挖宝消耗仙玉${jade}`);
			dug.count = dug.count + 1;
			dug.list[index].done = 1;
			this.addItem(reward.item_id, reward.count, true, `挖宝奖励`);
			SKLogger.info(`玩家[${this.roleid}:${this.name}]第${dug.count + 1}次挖宝消耗仙玉${jade},获得奖励[${itemData.name}]${reward.count}个`);
			this.send(`s2c_dug`, {
				state: 1,
				index: index
			});
		}
	}

	getPlayerData(){
		this.send('s2c_player_data', this.getData());
	}


	setAuto(data:any){
		this.auto = data.auto;
		if(!this.auto[0]){
			return;
		}
		let battle = BattleMgr.shared.getBattle(this.battle_id);
		if (battle == null) {
			this.battle_id = 0;
			return;
		}
		let battleRole: BattleRole = battle.plist[this.onlyid];
		battle.playerAction({
			onlyid: battleRole.onlyid,
			action: EActType.SKILL,
			actionid: this.auto[1],
			targetid: 0,
		});
		let pet :BattleRole = battle.plist[battleRole.bindid];
		pet && !pet.isdead && battle.playerAction({
			onlyid: pet.onlyid,
			action: EActType.SKILL,
			actionid: this.auto[2],
			targetid: 0,
		});
	}

}
