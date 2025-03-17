/*
 * 开服读取记录玩家充值总额
 */

import PlayerMgr from "../object/PlayerMgr";
import DB from "../../utils/DB";
import Launch from "./Launch";
import SKLogger from "../../gear/SKLogger";
import Player from "../object/Player";
import ItemUtil from "./ItemUtil";
import SKDataUtil from "../../gear/SKDataUtil";
import GameUtil from "./GameUtil";
import { MsgCode } from "../role/EEnum";
import ChargeEverDayMgr from "./ChargeEverDayMgr";
import NoticeMgr from "./NoticeMgr";
import ChargeConfig from "./ChargeConfig";

export default class ChargeSum {
	static shared = new ChargeSum();
	roleList: any;
	dayReward: any;
	fanbei: number = 2;
	fanbeiMoney: number = 98;


	constructor() {
		this.roleList = {};
	}
	/*
	 * 从数据库读取role的总充值金额
	 */
	init() {
		let conf = GameUtil.game_conf.today;
		this.dayReward = {};
		for (let item of conf) {
			if (this.dayReward[item.money] == null) {
				this.dayReward[item.money] = [];
			}
			this.dayReward[item.money].push(item);
		}
		DB.queryCharge((rows: any) => {
			if (rows.length != 0) {
				for (let item of rows) {
					if (item.roleid && item.rmb) {
						if (this.roleList[item.roleid]) {
							this.roleList[item.roleid] += item.rmb;
						} else {
							this.roleList[item.roleid] = item.rmb;
						}
					}
				}
			}
			SKLogger.info('充值模块加载完毕！');
			Launch.shared.complete("ChargeMgr");
		});
	}

	/*
	 * 玩家充值
	 * @param roleid 玩家角色id
	 * @param money 充值金额
	 * @param jade 充值仙玉
	 */
	playerCharge(roleid: any, money: any, jade: any) {
		if(money >= this.fanbeiMoney){
			money *= this.fanbei;
		}
		if (this.roleList[roleid]) {
			this.roleList[roleid] += money;
		} else {
			this.roleList[roleid] = money;
		}
		this.checkDayReward(roleid, money,jade);
		let player = PlayerMgr.shared.getPlayerByRoleId(roleid , false);
		if (player) {
			player.chargeSuccess(jade, money);
			ChargeEverDayMgr.shared.playerCharge(roleid,money);
			this.chargeNotice(player.name, money);
		}else{
			let sql = `SELECT name FROM qy_role WHERE roleid = '${roleid}'`;
			DB.query(sql, (ret:any, rows:any) => {
				if (rows.length > 0) {
					this.chargeNotice(rows[0].name, money);
				}	
			});
		}
	}

	chargeNotice(name: string, money: any){

		return;

		let conf = ChargeConfig.shared.get(money);
		if(!conf.notice || GameUtil.serverConfig.GAME.PLAT=='ltxy') 
			return;
		let msg:string = conf.notice;
		msg = msg.replace('[NAME]', name);
		NoticeMgr.shared.sendNotice({
			type: 2,
			text: msg,
		});
	}



	// 检查每日充值奖励
	checkDayReward(roleId: number, money: number, jade: number) {
		let player = PlayerMgr.shared.getPlayerByRoleId(roleId, false);
		if (player != null) {
			this.changePlayerDaySum(player, money);
			return;
		}
		let self = this;
		DB.loginByRoleid(roleId, (code: number, data: any) => {
			if (code != MsgCode.SUCCESS || data == null) {
				return;
			}
			let player = new Player();
			player.offline = false;
			player.setDB(data);
			self.changePlayerDaySum(player, money);
			player.chargeSuccess(jade, money);
			player.saveAll((failed: string) => {
				player.offline = true;
				if (failed.length > 0) {
					SKLogger.warn(`玩家[${player.roleid}:${player.name}]每日累充奖励存档失败!`);
				} else {
					SKLogger.debug(`玩家[${player.roleid}:${player.name}]每日累充奖励存档成功!`);
				}
			});
		})
	}
	// 改变玩家每日累充
	changePlayerDaySum(player: Player, money: Number) {
		let daySum = (player.dayMap[`daySum`] || 0);
		daySum += money;
		player.dayMap[`daySum`] = daySum;
	}
	/*
	 * 获取玩家充值总额
	 * @param roleid 玩家角色id
	 */
	getPlayerChargeSum(roleid: any): any {
		return this.roleList[roleid] || 0;
	}
}