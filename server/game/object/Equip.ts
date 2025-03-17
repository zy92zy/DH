import SKTimeUtil from "../../gear/SKTimeUtil";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import DB from "../../utils/DB";
import GameUtil from "../core/GameUtil";
import { EEquipPos, EEquipType } from "../role/EEnum";
import EquipMgr from "./EquipMgr";
import Player from "./Player";

export default class Equip {
	owner: Player;
	name: string;
	EquipID: any;
	EquipType: number;
	BaseAttr: any;
	Grade: number;
	EIndex: number;
	Shuxingxuqiu: any;
	Type: any;
	GemCnt: any;
	LianhuaAttr: any;
	pos: any;
	state: any;
	attr1: any;
	gemarr: any;
	refine: any;
	recast: any;

	times: any;

	constructor(info: any, owner: Player) {
		this.owner = owner;
		this.name = '';
		this.EquipID = info.EquipID;
		this.EquipType = 0;
		this.BaseAttr = {};
		this.Grade = 0;
		this.EIndex = 0;
		this.Shuxingxuqiu = {};
		this.Type = 0;
		this.GemCnt = 0;
		this.LianhuaAttr = {};
		this.pos = EEquipPos.BAG; // 所在位置 0 初始 1身上 2背包 3仓库
		this.state = 1;
		// 属性
		this.attr1 = {};
		this.times = 0;
		GameUtil.clearAllAttr(this.attr1);
		// 行 装备位 0-武器 ... 列 1,2,3,4,5,6,7级宝石
		this.gemarr = [
			[30025, 30026, 30027, 30028, 30029, 30030, 30104, 30109, 30209], // 红宝石
			[30013, 30014, 30015, 30016, 30017, 30018, 30102, 30107, 30207], // 绿宝石
			[30019, 30020, 30021, 30022, 30023, 30024, 30103, 30108, 30208], // 蓝宝石
			[30001, 30002, 30003, 30004, 30005, 30006, 30100, 30105, 30205], // 紫宝石
			[30007, 30008, 30009, 30010, 30011, 30012, 30101, 30106, 30206], // 橙宝石
		    [30110, 30111, 30112, 30113, 30114, 30115, 30116, 30117, 30217], // 翅膀宝石
		    [30118, 30119, 30120, 30121, 30122, 30123, 30124, 30125], // 星卡宝石
		];
		//info.recast = {};
		this.setDB(info);
	}

	setDB(info: any) {
		if (info == null) {
			return;
		}
		if (info.name) {
			this.name = info.name;
		} else if (info.EName) {
			this.name = info.EName;
		}
		info.EquipType && (this.EquipType = info.EquipType);
		if (info.BaseAttr) {
			this.BaseAttr = SKDataUtil.jsonBy(info.BaseAttr);
		}
		info.Grade && (this.Grade = info.Grade);
		info.EIndex && (this.EIndex = info.EIndex);
		info.Shuxingxuqiu && (this.Shuxingxuqiu = SKDataUtil.jsonBy(info.Shuxingxuqiu));
		info.Type && (this.Type = info.Type);
		info.GemCnt && (this.GemCnt = info.GemCnt);
		info.LianhuaAttr && (this.LianhuaAttr = SKDataUtil.jsonBy(info.LianhuaAttr));
		if (info.refine) {
			this.refine = SKDataUtil.jsonBy(info.refine);
		}
		/*if (info.recast) {
			this.refine = SKDataUtil.jsonBy(info.recast);
		}*/
		info.pos && (this.pos = info.pos);
		this.calculateAttribute();
	}

	getAttr(attrtype: number): number {
		return this.attr1[attrtype];
	}

	//判断能否升级
	canUpgrade(): boolean {
		let fulldata: any = this.getFullData();
		if (fulldata.EquipType == EEquipType.XinShou) {

		} else if (fulldata.EquipType == EEquipType.HIGH) {
			if (fulldata.Grade >= 120) {
				return false;
			}
		} else if (fulldata.EquipType > EEquipType.HIGH) {
			if (!fulldata.NextType || fulldata.NextType == 0) {
				return false;
			}
		}
		return true;
	}

	checkUpgradeBroke(): boolean {
		// 		1-2=50%
		// 		2-3=25%
		// 		3-4=5%
		// 		4-5=1%
		if (this.Grade > GameUtil.shenBingBroke.length) {
			return false;
		}
		let r = GameUtil.random(0, 10000);
		let successpre = GameUtil.shenBingBroke[this.Grade - 1];
		if (r < successpre) {
			return true;
		}
		return false;
	}
	// 升阶
	upgrade(data: any): boolean {
		if(data == null){
			return false;
		}
		let fulldata: any = this.getFullData();
		let nextGrade = 0;
		let nextType = fulldata.NextType;
		let toType = fulldata.EquipType;
		if (fulldata.EquipType == 0) {
			nextGrade = 40;
			toType = 1;
		}
		else if (fulldata.EquipType == 1) {
			if (fulldata.Grade < 120) {
				nextGrade = fulldata.Grade + 20;
			} else {
				return false;
			}
		}
		else if (fulldata.EquipType > 1) {
			if (!fulldata.NextType || fulldata.NextType == 0) {
				return false;
			}
			nextGrade = fulldata.Grade + 1;
		}
		data.resid = nextType;
		let oldGrade = data.grade;
		if (oldGrade == null) {
			oldGrade = 1;
		}
		data.grade = nextGrade;
		data.type = toType;
		data.index = fulldata.EIndex;
		let equipData = EquipMgr.shared.getEquipData(data);

		if(!equipData){
			SKLogger.error(JSON.stringify(data));
			return false;
		}
		this.setDB(equipData);
		let name = '';
		if (equipData.name) {
			name = equipData.name;
		} else if (equipData.EName) {
			name = equipData.EName;
		}
		SKLogger.debug(`玩家[${this.owner.roleid}:${this.owner.name}]装备[${name}]${oldGrade}阶->${nextGrade}阶!`);
		this.save(false,'装备升阶');
		return true;
	}

	//计算属性
	calculateAttribute() {
		GameUtil.clearAllAttr(this.attr1);
		if (SKDataUtil.isArray(this.BaseAttr)) {
			for (let item of this.BaseAttr) {
				for (let key in item) {
					let nkey = parseInt(key);
					let value = parseInt(item[nkey]);
					if (GameUtil.equipTypeNumerical.indexOf(nkey) == -1) {
						value = value / 10;
					}
					value = SKDataUtil.toDecimal2(value * (1 + 0.03 * this.GemCnt));
					this.attr1[key] += value;
					break;
				}
			}
		} else {
			for (let key in this.BaseAttr) {
				if (this.BaseAttr.hasOwnProperty(key)) {
					let nkey = parseInt(key);
					let value = parseInt(this.BaseAttr[nkey]);
					if (GameUtil.equipTypeNumerical.indexOf(nkey) == -1) {
						value = value / 10;
					}
					value = SKDataUtil.toDecimal2(value * (1 + 0.03 * this.GemCnt));
					this.attr1[key] += value;
				}
			}
		}
		if (Array.isArray(this.LianhuaAttr)) {
			for (let data of this.LianhuaAttr) {
				for (let key in data) {
					let nkey = parseInt(key);
					let value = parseInt(data[nkey]);
					if (GameUtil.equipTypeNumerical.indexOf(nkey) == -1) {
						value = value / 10;
					}
					this.attr1[key] += value;
					break;
				}
			}
		}
	}

	getInlayGemID(): any {
		let result = this.gemarr[this.EIndex - 1][Math.floor(this.GemCnt / 3)];
		return result;
	}

	//获取宝石列表
	getGemList(): any {
		let list: any = {};
		if (this.GemCnt > 27) {
			this.GemCnt = 27;
		}
		let curGemlevel = Math.floor(this.GemCnt / 3);
		for (let index = 0; index < curGemlevel; index++) {
			list[this.gemarr[this.EIndex - 1][index]] = 3;
		}
		let lastNum = this.GemCnt - Math.floor(this.GemCnt / 3) * 3;
		if (lastNum > 0) {
			list[this.gemarr[this.EIndex - 1][curGemlevel]] = lastNum;
		}
		return list;
	}

	//获取完整数据
	getFullData(roleId?: number): any {
		let equipdata: any = EquipMgr.shared.getEquipData({ resid: this.Type, type: this.EquipType });
		if (equipdata == null) {
			SKLogger.warn(`装备[${this.EquipID}:${this.name}]完整信息为空!`);
			return null;
		}
		if (SKDataUtil.isEmptyString(equipdata.EName)) {
			SKLogger.warn(``);
		} else {
			this.name = equipdata.EName;
		}
		let fulldata: any = {};
		fulldata.EquipID = this.EquipID;
		fulldata.EquipType = this.EquipType;
		fulldata.BaseAttr = this.BaseAttr;
		fulldata.BaseScore = equipdata.BaseScore;
		fulldata.EDesc = equipdata.EDesc;
		fulldata.Detail = equipdata.Detail;
		fulldata.Dynamic = equipdata.Dynamic;
		fulldata.Grade = this.Grade;
		fulldata.EIndex = this.EIndex;
		fulldata.JiLv = equipdata.JiLv;
		fulldata.MaxEmbedGemCnt = equipdata.MaxEmbedGemCnt;
		fulldata.MaxEndure = equipdata.MaxEndure;
		fulldata.EName = this.name;
		fulldata.NeedGrade = equipdata.NeedGrade;
		fulldata.NeedRei = equipdata.NeedRei;
		fulldata.NextType = equipdata.NextType;
		fulldata.Overlap = equipdata.Overlap;
		fulldata.Quan = equipdata.Quan;
		fulldata.Race = equipdata.Race;
		fulldata.Rarity = equipdata.Rarity;
		fulldata.RndRange = equipdata.RndRange;
		fulldata.RndWeight = equipdata.RndWeight;
		fulldata.Sex = equipdata.Sex;
		fulldata.Shape = equipdata.Shape;
		fulldata.Shuxingxuqiu = this.Shuxingxuqiu;
		fulldata.Type = this.Type;
		fulldata.GemCnt = this.GemCnt;
		fulldata.LianhuaAttr = this.LianhuaAttr;
		fulldata.OwnerRoleId = equipdata.OwnerRoleId;
		return fulldata;
	}

	toObj() {
		let fulldata = this.getFullData();
		let baseAttr: any;
		if (SKDataUtil.isArray(this.BaseAttr)) {
			baseAttr = this.BaseAttr;
		} else {
			baseAttr = {};
			for (let key in this.BaseAttr) {
				let value = this.attr1[key];
				baseAttr[key] = value;
				let nkey = parseInt(key);
				if (GameUtil.equipTypeNumerical.indexOf(nkey) == -1) {
					baseAttr[key] *= 10;
				}
			}
		}
		let obj: any = {};
		obj.EquipID = this.EquipID;
		obj.EquipType = this.EquipType;
		obj.BaseAttr = SKDataUtil.toJson(baseAttr);
		obj.BaseScore = fulldata.BaseScore;
		obj.EDesc = fulldata.EDesc;
		obj.Detail = fulldata.Detail;
		obj.Dynamic = fulldata.Dynamic;
		obj.Grade = this.Grade;
		obj.EIndex = this.EIndex;
		obj.JiLv = fulldata.JiLv;
		obj.MaxEmbedGemCnt = fulldata.MaxEmbedGemCnt;
		obj.MaxEndure = fulldata.MaxEndure;
		obj.EName = fulldata.EName;
		obj.NeedGrade = fulldata.NeedGrade;
		obj.NeedRei = fulldata.NeedRei;
		obj.NextType = fulldata.NextType;
		obj.Overlap = fulldata.Overlap;
		obj.Quan = fulldata.Quan;
		obj.Race = fulldata.Race;
		obj.Rarity = fulldata.Rarity;
		obj.RndRange = fulldata.RndRange;
		obj.RndWeight = fulldata.RndWeight;
		obj.Sex = fulldata.Sex;
		obj.Shape = fulldata.Shape;
		obj.Shuxingxuqiu = SKDataUtil.toJson(this.Shuxingxuqiu);
		obj.Type = this.Type;
		obj.GemCnt = this.GemCnt;
		obj.LianhuaAttr = SKDataUtil.toJson(this.LianhuaAttr);
		obj.OwnerRoleId = fulldata.OwnerRoleId;
		obj.refine = SKDataUtil.toJson(this.refine);
		obj.recast = SKDataUtil.toJson(this.recast);
		return obj;
	}

	getSendInfo(): any {
		let fullEquipData = this.getFullData();
		if (fullEquipData == null) {
			SKLogger.warn(`装备[${this.EquipID}:${this.name}]发送信息为空`);
			return null;
		}
		let result = {
			EquipID: fullEquipData.EquipID,
			Shape: fullEquipData.Shape,
			EName: fullEquipData.EName,
			EquipType: fullEquipData.EquipType,
			EIndex: fullEquipData.EIndex,
			Grade: fullEquipData.Grade,
			NextType: fullEquipData.NextType,
			Type: fullEquipData.Type,
		};
		return result;
	}

	/**
	 * 装备存档
	 * @param sleep 是否延迟
	 * @param soucre 存档原因
	 */
	save(sleep: boolean = false, soucre: any = '装备存档') {
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

		if (this.state == 0) {
			DB.delEquip(this.EquipID, this.owner.roleid, (code: number) => {
			});
		}
		else {
			let savedata: any = {};
			savedata.EquipID = this.EquipID;
			savedata.EquipType = this.EquipType;
			savedata.RoleID = this.owner.roleid;
			savedata.BaseAttr = SKDataUtil.toJson(this.BaseAttr);
			savedata.Grade = this.Grade;
			savedata.EIndex = this.EIndex;
			savedata.Shuxingxuqiu = SKDataUtil.toJson(this.Shuxingxuqiu);
			savedata.Type = this.Type;
			savedata.GemCnt = this.GemCnt;
			savedata.LianhuaAttr = SKDataUtil.toJson(this.LianhuaAttr);
			savedata.refine = SKDataUtil.toJson(this.refine);
			savedata.recast = SKDataUtil.toJson(this.recast);
			savedata.state = this.state;
			savedata.name = this.name;
			savedata.pos = this.pos;
			DB.saveEquipInfo(this.EquipID, this.owner.roleid, savedata, () => { 
				SKLogger.debug(`${soucre}`);
			});
		}
	}

	saveSQL(): string {
		if (this.state == 0) {
			return `UPDATE qy_equip SET state = 0, delete_time = NOW() WHERE EquipID='${this.EquipID}' AND RoleID='${this.owner.roleid}';`
		} else {
			let savedata: any = {};
			savedata.name = this.name;
			savedata.EquipType = this.EquipType;
			savedata.BaseAttr = SKDataUtil.toJson(this.BaseAttr);
			savedata.Grade = this.Grade;
			savedata.EIndex = this.EIndex;
			savedata.Shuxingxuqiu = SKDataUtil.toJson(this.Shuxingxuqiu);
			savedata.Type = this.Type;
			savedata.GemCnt = this.GemCnt;
			savedata.LianhuaAttr = SKDataUtil.toJson(this.LianhuaAttr);
			savedata.refine = SKDataUtil.toJson(this.refine);
			//savedata.recast = SKDataUtil.toJson(this.recast);
			savedata.pos = this.pos;
			let numlist = ['pos', 'Grade', 'Type', 'GemCnt', 'EIndex'];
			let updatestr = '';
			for (const key in savedata) {
				if (numlist.indexOf(key) == -1) {
					updatestr += `${key} = '${savedata[key]}', `
				} else {
					updatestr += `${key} = ${savedata[key]}, `
				}
			}
			updatestr = updatestr.substr(0, updatestr.length - 2);
			let sql = `UPDATE qy_equip SET ${updatestr} WHERE EquipID = ${this.EquipID} AND RoleID='${this.owner.roleid}';`;
			return sql;
		}
	}
}