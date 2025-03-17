import GameUtil from "./GameUtil";
import DB from "../../utils/DB";
import Pet from "../object/Pet";
import Launch from "./Launch";
import SKDataUtil from "../../gear/SKDataUtil"
import Player from "../object/Player";
import ItemUtil from "./ItemUtil";
import SKLogger from "../../gear/SKLogger";
import { MsgCode } from "../role/EEnum";
import PlayerMgr from "../object/PlayerMgr";

export default class PetMgr {
	static shared = new PetMgr();
	pet_data_list: any;
	pet_color_list: any;

	constructor() {
		this.pet_data_list = {};
		this.pet_color_list = {};
	}

	init() {
		let propPet = GameUtil.require_ex('../../conf/prop_data/prop_pets');
		for (let petid in propPet) {
			if (propPet.hasOwnProperty(petid)) {
				try {
					let petdata = propPet[petid];
					petdata.rate = SKDataUtil.jsonBy(petdata.rate);
					petdata.hp = SKDataUtil.jsonBy(petdata.hp);
					petdata.mp = SKDataUtil.jsonBy(petdata.mp);
					petdata.atk = SKDataUtil.jsonBy(petdata.atk);
					petdata.spd = SKDataUtil.jsonBy(petdata.spd);
					petdata.needitem = petdata.gettype == 1 ? SKDataUtil.jsonBy(petdata.needitem) : [];
					petdata.wuxing = SKDataUtil.jsonBy(petdata.wuxing);
					this.pet_data_list[petid] = petdata;
				} catch (error) {
					SKLogger.warn(`召唤兽[${petid}]配置错误!`);
				}
			}
		}
		let propPetColor = GameUtil.require_ex('../../conf/prop_data/prop_pet_color');
		for (let petid in propPetColor) {
			if (propPetColor.hasOwnProperty(petid)) {
				try {
					let colorValue = propPetColor[petid].colorValue.split(',');
					let colorNice = propPetColor[petid].colorNice.split(',');
					this.pet_color_list[petid] = {
						colorValue: colorValue,
						colorNice: colorNice,
					};
				} catch (error) {
					SKLogger.warn(`召唤兽[${petid}]换色配置错误!`);
				}
			}
		}
		SKLogger.info('宠物管理模块加载完毕！');
		Launch.shared.complete("PetMgr");
	}

	getPetData(petid: any): any {
		return this.pet_data_list[petid];
	}

	canHeCheng(role: Player, petid: any) {
		if (role.petList.length >= GameUtil.limitPetNum) {
			return false;
		}
		let petdata = this.getPetData(petid);
		let curitems = SKDataUtil.clone(role.bag_list);
		for (const itemid of petdata.needitem) {
			if (!curitems[itemid]) {
				return false;
			}
			curitems[itemid]--;
		}

		let logstr = `玩家[${role.name}(${role.roleid})] 消耗`;
		for (const itemid of petdata.needitem) {
			role.bag_list[itemid]--;
			let iteminfo = ItemUtil.getItemData(itemid);

			if (iteminfo) {
				logstr += `${iteminfo.name}`;
			}
			logstr += `(${itemid})`;
		}
		logstr += `合成[${petdata.name}]`;
		console.log(logstr);
		return true;
	}

	getNextRate(rate: any, dataid: any) {
		let petdata = this.getPetData(dataid);
		let rate2 = petdata.rate[1] * 10000;
		return GameUtil.random(rate, rate2);
	}

	getMaxSkillCnt(dataid: any) {
		let petdata = this.getPetData(dataid);
		if (petdata.maxskillcnt) {
			return petdata.maxskillcnt;
		}
		return 4;
	}

	/*
	 * 获取宠物最大成长率
	 * @param dataid 宠物dataid
	 */
	getMaxRate(dataid: any) {
		let petdata = this.getPetData(dataid);
		let rate2 = petdata.rate[1] * 10000;
		return rate2;
	}

	getBaseAttr(dataid: any) {
		let petdata = this.getPetData(dataid);
		let rate1 = petdata.rate[0] * 10000;
		let rate2 = petdata.rate[1] * 10000;
		let ret: any = {};
		let r = GameUtil.random(0, 10000);
		if (r < 200) {
			ret.rate = rate2;
		} else {
			ret.rate = GameUtil.random(rate1, rate2);
		}
		ret.hp = GameUtil.random(petdata.hp[0], petdata.hp[1]);
		ret.mp = GameUtil.random(petdata.mp[0], petdata.mp[1]);
		ret.atk = GameUtil.random(petdata.atk[0], petdata.atk[1]);
		ret.spd = GameUtil.random(petdata.spd[0], petdata.spd[1]);
		return ret;
	}

	createPet(player: Player, petid: any, callback: any) {
		if (player.petList.length >= GameUtil.limitPetNum) {
			return;
		}
		let pet = new Pet(petid);
		pet.dataid = petid;
		pet.owner = player;
		pet.ownid = player.roleid;

		let petdata = this.getPetData(petid);
		pet.resid = petdata.resid;
		pet.name = petdata.name;
		pet.grade = petdata.grade;
		pet.level = 0;

		let baseattr = this.getBaseAttr(petid);
		pet.rate = baseattr.rate;
		pet.hp = baseattr.hp;
		pet.mp = baseattr.mp;
		pet.atk = baseattr.atk;
		pet.spd = baseattr.spd;

		pet.basehp = pet.hp;
		pet.basemp = pet.mp;
		pet.baseatk = pet.atk;
		pet.basespd = pet.spd;

		pet.skill_list = {};
		if (petdata.skill != null && petdata.skill != '' && petdata.skill != 0) {
			pet.skill_list[petdata.skill] = { idx: 0, lck: 0 };
			pet.lock ++;
		}		
		if(pet.grade >=3 && pet.shenskill <= 0){
			pet.shenskill = 3001;
		}
		
		DB.createPet(pet.toObj(), (ret: any,petid: any) => {
			if (ret != MsgCode.SUCCESS) {
				SKLogger.warn(`玩家[${player.roleid}:${player.name})]召唤兽[${pet.name}]创建失败!`);
				return;
			}
			pet.petid = petid
			if (pet.grade >= 4) {
				SKLogger.debug(`玩家[${player.roleid}:${player.name}]获得神兽[${pet.petid}:${pet.name}]`);
				let strRichText = `<color=#00ff00 > ${player.name}</c > <color=#ffffff > 获得了神兽</c ><color=#0fffff > ${pet.name}</color ><color=#ffffff > 真是好生让人羡慕啊！</c >`;
				PlayerMgr.shared.broadcast('s2c_screen_msg', {
					strRichText: strRichText,
					bInsertFront: 0
				});
			}
			pet.calculateAttribute();
			callback(pet);
		});
		
	}

	getMaxLongGu(relive: any): number {
		if (relive == 0) return 2;
		if (relive == 1) return 4;
		if (relive == 2) return 7;
		if (relive == 3) return 12;
		if (relive == 4) return 12;
		return 0;
	}

	getPetColors(petid: any): any {
		if (this.pet_color_list[petid]) {
			return this.pet_color_list[petid];
		}
		else {
			SKLogger.warn(`未找到召唤兽[${petid}]的宠物颜色！`);
			return { colorValue: [0], colorNice: [0], };
		}
	}
}
