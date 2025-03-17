import GameUtil from "./GameUtil";
import Signal from "./Signal";
import GoodsMgr from "../item/GoodsMgr";
import PlayerMgr from "../object/PlayerMgr";
import DB from "../../utils/DB";
import Http from "../../utils/Http";
import ActivityMgr from "../activity/ActivityMgr";
import ActivityDefine from "../activity/ActivityDefine";
import HongBao from "../activity/HongBao";
import ShuiLuDaHui from "../activity/ShuiLuDaHui";
import LingHou from "../activity/LingHou";
import ChongZhi from "../activity/ChongZhi";
import NpcMgr from "./NpcMgr";
import Player from "../object/Player";
import ItemUtil from "./ItemUtil";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import { BattleType, MsgCode } from "../role/EEnum";

export default class GMMgr{
	static shared=new GMMgr();
	list:any = {
		//['fight']: this.fight,
		//['add_exp']: this.addExp,
		//['add_item']: this.addItem,
		//['attr']: this.changeAttr,
		['freeze']: this.freeze,
		//['activity']: this.activity,
		['shutup']: this.LetPlayerShutUp,
		['speak']: this.letPlayerSpeak,
		//['mon']: this.createMonster,
		//['role']: this.createPlayer,
	};

	exec(player:any,command:any){
		let func = this.list[command[0]];
		if (func) {
			func(player, command);
		}
	}

	fight(player:any, command:any) {
		if (GameUtil.netType == 'InSide' || (player && player.gmlevel >= 1)) {
			if (player) {
				let groupid = parseInt(command[1]);
				player.monsterBattle(groupid, BattleType.Normal, true);
			}
		}
	}
	
	addExp(player:any, command:any) {
		if (GameUtil.netType == 'InSide' || (player && player.gmlevel >= 20)) {
			let expstr = command[1] + '';
			if (expstr.length >= 10) {
				if (player) {
					player.send('s2c_notice', {
						strRichText: '大兄弟，GM指令不能乱用'
					});
				}
				return;
			}
			let exp = parseInt(expstr);
			player.addExp(exp);
		}
	}
	
	freeze(player:any, command:any) {
		let userid = command[1];
		if (GameUtil.netType == 'InSide' || (player && player.gmlevel > 10)) {
			try {
				let uid = parseInt(userid);
				let target = PlayerMgr.shared.getPlayerByRoleId(uid);
				if (target) {
					player.send('s2c_notice', {
						strRichText: '被GM  踢下线！'
					});
					setTimeout(() => {
						target.agent.close();
					}, 1000);
	
				}
			} catch (error) {
	
			}
		}
	}
	
	FreezePlayer(pGmPlayer:any, nTargetID:any){
		if (null == pGmPlayer)
			return;
		if (pGmPlayer.gmlevel < 10) {
			return;
		}
	
		let pTarget = PlayerMgr.shared.getPlayerByRoleId(nTargetID);
		if (null == pTarget)
			return;
	
		pGmPlayer.send('s2c_notice', {
			strRichText: '封号成功'
		});
	
		let sql = `UPDATE qy_account SET state= 1 where accountid = ${pTarget.accountid}`;
		DB.query(sql, (ret:any, rows:any) => { });
	
		Signal.shared.DeleteTocken(pTarget.accountid);
	
		setTimeout(() => {
			// pTarget.agent.destroy();
			pTarget.destroy();
		}, 1000);
	}
	
	FreezePlayerIP(pGmPlayer:any, nTargetID:any){
		this.FreezePlayer(pGmPlayer, nTargetID);
		if (null == pGmPlayer)
			return;
		if (pGmPlayer.gmlevel < 15) {
			return;
		}
	
		let pTarget = PlayerMgr.shared.getPlayerByRoleId(nTargetID);
		if (null == pTarget)
			return;
	
		DB.freezeIP(pTarget.accountid, (ret:any, ip:any) => {
			if (ret == MsgCode.SUCCESS) {
				pGmPlayer.send('s2c_notice', {
					strRichText: '封IP成功'
				});
				if (ip == 0) {
					return;
				}
				Http.sendget(GameUtil.serverConfig.GAME.GATE_IP, GameUtil.serverConfig.GAME.GATE_PORT, '/admin', {
					mod: "frozen_ip",
					sign: MsgCode.GMSIGN,
					frozenip: ip
				}, () => { });
				let str = `玩家[${pGmPlayer.name}:${pGmPlayer.roleid}]使用GM命令，封了[${pTarget.accountid}]的IP[${ip}]`;
				console.log(str);
			} else {
				// 	pGmPlayer.send('s2c_notice', {
				// 	strRichText: '封IP失败'
				// });
			}
		});
	}
	
	FreezePlayerMAC(pGmPlayer:any, nTargetID:any){
		if (null == pGmPlayer)
			return;
		if (pGmPlayer.gmlevel < 30) {
			return;
		}
		let pTarget = PlayerMgr.shared.getPlayerByRoleId(nTargetID);
		if (null == pTarget)
			return;
	
		Http.sendget(GameUtil.serverConfig.GAME.GATE_IP, GameUtil.serverConfig.GAME.GATE_PORT, '/admin', {
			mod: "frozen_mac",
			sign: MsgCode.GMSIGN,
			 accountid: pTarget.accountid,
			 gmRoleid: pGmPlayer.roleid
		}, () => { });
		let str = `玩家[${pGmPlayer.name}:${pGmPlayer.roleid}]使用GM命令，封了[${pTarget.accountid}]的MAC `;
		console.log(str);
	}
	
	LetPlayerShutUp(pGmPlayer:any, nTargetID:any){
		if (null == pGmPlayer)
			return;
		if (pGmPlayer.gmlevel < 1) {
			return;
		}
	
		let pTarget = PlayerMgr.shared.getPlayerByRoleId(nTargetID);
		if (null == pTarget)
			return;
	
		pTarget.SetFlag(GameUtil.EPlayerFlag.EBanSpeak, 1);

		PlayerMgr.shared.removeChatByRoleid(nTargetID);
	
		pGmPlayer.send('s2c_notice', {
			strRichText: '禁言成功'
		});
	
		PlayerMgr.shared.broadcast('s2c_game_chat', {
			scale: 5,
			msg: '',
			name: '',
			resid: 0,
			teamid: 0,
			roleid:nTargetID,
		});
	}
	
	letPlayerSpeak(pGmPlayer:any, nTargetID:any){
		if (null == pGmPlayer)
			return;
		if (pGmPlayer.gmlevel < 1) {
			return;
		}
		let pTarget = PlayerMgr.shared.getPlayerByRoleId(nTargetID);
		if (null == pTarget)
			return;
		pTarget.SetFlag(GameUtil.EPlayerFlag.EBanSpeak, 0);
		pGmPlayer.send('s2c_notice', {
			strRichText: '解禁成功'
		});
		pTarget.send('s2c_notice', {
			strRichText: '成功解禁发言'
		});
	}

	can_speak = (nPlayer:any, nBan:any) => {
		let pTarget = PlayerMgr.shared.getPlayerByRoleId(nPlayer);
		if (null == pTarget)
			return;
		pTarget.SetFlag(GameUtil.EPlayerFlag.EBanSpeak, nBan);
	}
	// 加道具 [addItem,道具索引或道具名称,道具数量,玩家索引]
	addItem(player:Player,command:string[]) {
		if(player==null || player.gmlevel<100){
			SKLogger.debug(`玩家不存在或GM权限不足!`);
			return;
		}
		// GM命令参数不能少于4个
		if(command.length<4){
			console.info(`加道具参数不能少于4个`);
			return;
		}
		// 有GM权限
		if (player && player.gmlevel >= 100){
			let item = command[1];
			let itemnum = SKDataUtil.toNumber(command[2]);
			let targetid = parseInt(command[3]);
			let itemid = parseInt(item);
			if (isNaN(itemid)) {
				let iteminfo = ItemUtil.getItemData(item);
				if (iteminfo) {
					itemid = iteminfo.id;
				} else {
					console.warn(`道具不存在，无法发送`);
					return;
				}
			}
			if (itemid != 0) {
				if (targetid && targetid != 0) {
					let target = PlayerMgr.shared.getPlayerByRoleId(targetid);
					if (target) {
						let info = `玩家[${player.name}:${player.roleid}]使用GM命令，给玩家[${target.name}${target.roleid}]添加${itemnum}个物品[${itemid}]`;
						target.addItem(itemid, itemnum, true, info);
					}
				} else {
					let info= `玩家[${player.name}:${player.roleid}]使用GM命令，给自己添加${itemnum}个物品[${itemid}]`;
					player.addItem(itemid, itemnum, true, info);
				}
			}
	
		}
	}
	
	changeAttr(player:Player, command:any) {
		if (GameUtil.netType == 'InSide' || (player && player.gmlevel >= 2)) {
			let attrtype = command[1];
			let attr = command[2];
			if (GameUtil.attrTypeStrL1[attrtype] == null) {
				return;
			}
			try {
				let num = attr;
				if (num.length > 10) {
					return;
				}
				num = parseInt(num);
				player.setAttr1(attrtype, num);
				player.send('s2c_player_data', player.getData());
			} catch (error) {
	
			}
		}
	}
	
	activity(player:any, command:any) {
		if (GameUtil.netType == 'InSide' || (player && player.gmlevel >= 100)) {
			let activity_id = parseInt(command[1]);
			let isopen = parseInt(command[2]); // 0 关闭 1 开启
			let activity = ActivityMgr.shared.getActivity(activity_id);
			if (activity) {
				if (isopen == 0) {
					activity.close();
				} 
				else {
					activity.gmState(isopen);
				}
			} 
			else {
				if (isopen == 1) {
					let newactivity = null;
					switch (activity_id) {
						case ActivityDefine.activityKindID.HongBao: {
							newactivity = new HongBao();
						} break;
						case ActivityDefine.activityKindID.ShuiLuDaHui: {
							newactivity = new ShuiLuDaHui();
						} break;
						case ActivityDefine.activityKindID.TianJiangLingHou: {
							newactivity = new LingHou();
						} break;
					}
					if (newactivity) {
						if(newactivity.gmState){
							ActivityMgr.shared.addActivity(newactivity);
							activity.gmState(isopen);
						}
					}
				}
			}
		}
	}
	
	/*
	 * 设置充值活动
	 * @param start 开始时间
	 * @param end 结束时间
	 */
	setChargeActivity (start:any, end:any) {
		let activity_id = ActivityDefine.activityKindID.ChongZhi;
		let activity = ActivityMgr.shared.getActivity(activity_id);
		if (!activity) {
			activity = new ChongZhi();
			ActivityMgr.shared.addActivity(activity);
		}
		activity.setActivityTm(start, end);
	}
	
	/*
	 * 关闭充值活动
	 */
	closeChargeActivity () {
		let activity_id = ActivityDefine.activityKindID.ChongZhi;
		let activity = ActivityMgr.shared.getActivity(activity_id);
		if (! activity) {
			console.log('未发现充值活动！');
			return;
		}
		activity.close();
	}
	
	createMonster(player:any, command:any) {
		if (GameUtil.netType == 'InSide' || (player && player.gmlevel >= 100)) {
			let npcid = parseInt(command[1]);
			NpcMgr.shared.CreateNpc(npcid, player.mapid, player.x, player.y);
		}
	}
	
	createPlayer(player:any, command:any){
		if (GameUtil.netType == 'InSide' || (player && player.gmlevel >= 100)) {
			let playernum = parseInt(command[1]);
			if(playernum == null || isNaN(playernum)){
				playernum = 1;
			}
			PlayerMgr.shared.clearRobot();
			for (let index = 0; index < playernum; index++) {
				let p = player.clone();
				p.onlyid = p.roleid = p.accountid = 99999999 - index;
				p.agent = null;
				p.x = player.x + GameUtil.random(0, 30) - 15;
				p.y = player.y + GameUtil.random(0, 30) - 15;
				PlayerMgr.shared.addPlayer(p);
				p.onEnterMap();
			}
		}
	}
}
