import Signal from "../../core/Signal";
import Http from "../../../utils/Http";
import PlayerMgr from "../../object/PlayerMgr";
import GMMgr from "../../core/GMMgr";
import NoticeMgr from "../../core/NoticeMgr";
import ChargeSum from "../../core/ChargeSum";
import DB from "../../../utils/DB";
import Player from "../../object/Player";
// 网络请求
import bodyParser from "body-parser";
import express from "express";
import { Request, Response } from "express";
import Launch from "../../../game/core/Launch";
import { MsgCode } from "../../role/EEnum";
import SKDataUtil from "../../../gear/SKDataUtil";
import SKLogger from "../../../gear/SKLogger";
import MallMgr from "../../../game/core/MallMgr";
import LotteryMgr from "../../../game/core/LotteryMgr";
import GameUtil from "../../../game/core/GameUtil";
import BangMgr from "../../../game/bang/BangMgr";

export default class HttpGame {
	static shared = new HttpGame();
	app: any;
	funlist: any;
	constructor() {
		this.app = express();
		this.app.use(function (req: Request, res: Response, next: any) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Expose-Headers", "'Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With");
			res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
			res.header("X-Powered-By", ' 3.2.1');
			res.header("Content-Type", "application/json;charset=utf-8");
			next();
		});
		this.app.use(bodyParser.json({ limit: "1mb" }));
		this.app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
	}

	loginToken(req: any, res: any) {
		let accountid = req.query.accountid;
		let roleid = req.query.roleid;
		let login_token = req.query.token;
		Signal.shared.addLoginToken(accountid, login_token);
		Http.reply(res, {
			result: MsgCode.SUCCESS,
		});
	}

	getClientIP(req: any, res: any): string {
		var ip = req.headers['x-forwarded-for'] ||
			req.ip ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress || '';
		if (ip.split(',').length > 0) {
			ip = ip.split(',')[0];
		}
		return ip;
	}

	chargeCallback(req: any, res: any) {
		let roleid = req.query.roleid;
		let jade = Number(req.query.jade);
		let sdorderno = req.query.sdorderno;
		let sdpayno = req.query.sdpayno;
		let money = Number(req.query.money);
		/*let ip = this.getClientIP(req, res);
		let gateIP = GameUtil.serverConfig.GAME.GATE_IP;
		if (ip.indexOf(gateIP) == -1) {
			let msg = `在线玩家${roleid}充值${jade}仙玉非法，游戏订单${sdorderno},支付订单${sdpayno}！`
			console.log(msg);
			Http.reply(res, { code: MsgCode.FAILED, msg: msg });
			return;
		}*/
		let player = PlayerMgr.shared.getPlayerByRoleId(roleid, false);
		if (player) {
			let msg = `在线玩家${roleid}充值${jade}仙玉成功，游戏订单${sdorderno},支付订单${sdpayno}！`
			SKLogger.info(msg);
			Http.reply(res, { code: MsgCode.SUCCESS, msg: msg });
		} else {
			let msg = `离线玩家${roleid}充值${jade}仙玉成功，游戏订单${sdorderno},支付订单${sdpayno}！`
			SKLogger.info(msg);
			Http.reply(res, { code: MsgCode.FAILED, msg: msg });
		}
		ChargeSum.shared.playerCharge(roleid, money, jade); // 玩家充值
	}
	// 系统通知
	sysNotice(req: any, res: any) {
		let text = req.query.text;
		let type = req.query.type;         // 1 走马灯 2 聊天框 3 走马灯 + 聊天框
		let serverid = req.query.servre_id; // 0 则全服公告
		let times = req.query.times;       // -1 则永久公告 需入库
		let interval = req.query.interval; // 单位 秒
		let id = req.query.id;             // 消息id
		if (!id) {
			id = 0;
		}
		let notice = {
			id: id,
			text: text,
			type: type,
			times: times,
			interval: interval,
		};
		NoticeMgr.shared.addNewNotice(notice);
		Http.reply(res, { code: MsgCode.SUCCESS, msg: `发送系统通知:${text}成功` });
	}

	deleteNotice(req: any, res: any) {
		let id = req.query.id;
		NoticeMgr.shared.delNotice(id);
		Http.reply(res, { errcode: MsgCode.SUCCESS });
	}

	can_speak(req: any, res: any) {
		let roleid = req.query.roleid;
		let state = req.query.state;
		GMMgr.shared.can_speak(roleid, state);
		if(state != 0){
			PlayerMgr.shared.broadcast('s2c_game_chat', {
				scale: 5,
				msg: '',
				name: '',
				resid: 0,
				teamid: 0,
				roleid: roleid,
			});
			PlayerMgr.shared.removeChatByRoleid(roleid);
		}
		Http.reply(res, { code: MsgCode.SUCCESS });
	}

	clearPCache(req: any, res: any) {
		let ip = this.getClientIP(req, res);
		if (ip != GameUtil.serverConfig.GAME.GATE_IP) {
			return;
		}
		let roleid = req.query.roleid;
		PlayerMgr.shared.clearPlayerCache(roleid);
		res.end(SKDataUtil.toJson({
			ret: `操作完成`,
		}));
	}

	kickedOut(req: any, res: any) {
		let roleids = req.query.roleids;
		PlayerMgr.shared.kickedOutPlayer(roleids);
	}

	/*
	 * 设置充值活动时间
	 */
	setChargeActivity(req: any, res: any) {
		let start = parseInt(req.query.start);
		let end = parseInt(req.query.end);
		GMMgr.shared.setChargeActivity(start, end);
		Http.reply(res, { errcode: 0, });
	}
	/*
	 * 关闭充值活动
	 */
	closeChargeActivity(req: any, res: any) {
		GMMgr.shared.closeChargeActivity();
		Http.reply(res, { errcode: 0, });
	}
	// 加仙玉
	addJade(req: any, res: any) {
		let roleId = req.query.roleId;
		let jade: number = parseInt(req.query.jade);
		jade = Math.min(10000000, jade);
		let player = PlayerMgr.shared.getPlayerByRoleId(roleId);
		if (player) {
			player.addMoney(GameUtil.goldKind.Jade, jade, "系统加仙玉");
			let info = `玩家[${player.roleid}:${player.name}]加${jade}仙玉成功`;
			console.log(info);
			Http.reply(res, {
				code: MsgCode.SUCCESS,
				msg: info
			});
			return;
		}
		let info = `玩家[${roleId}}]加${jade}仙玉失败`;
		Http.reply(res, {
			code: MsgCode.FAILED,
			msg: info
		});
	}
	// 加经验
	addExp(req: any, res: any) {
		let roleId = req.query.roleId;
		let exp: number = parseInt(req.query.exp);
		exp = Math.min(9999999999, exp);
		let player = PlayerMgr.shared.getPlayerByRoleId(roleId);
		if (player) {
			player.addExp(exp);
			let info = `玩家[${player.roleid}:${player.name}]增加加${exp}经验成功`;
			Http.reply(res, {
				code: MsgCode.SUCCESS,
				msg: info
			});
			return;
		}
		DB.addExp(roleId, exp, (code: any) => {
			Http.reply(code, {
				code: code
			});
		});
	}
	// 加道具
	addItem(req: any, res: any) {
		let roleId = req.query.roleId;
		let item: number = parseInt(req.query.item);
		let num: number = parseInt(req.query.num)
		let player = PlayerMgr.shared.getPlayerByRoleId(roleId);
		if (player != null) {
			if (player.addItem(item, num, true, "")) {
				Http.reply(res, { code: MsgCode.SUCCESS });
			} else {
				Http.reply(res, { code: MsgCode.FAILED });
			}
			return;
		}
		DB.loginByRoleid(roleId, (code: number, data: any) => {
			if (code != MsgCode.SUCCESS || data == null) {
				Http.reply(res, { code: MsgCode.FAILED });
				return;
			}
			let player = new Player();
			player.loaded = true;
			player.setDB(data);
			if (player.addItem(item, num, true, "")) {
				player.offline=false;
				player.saveAll(()=>{
					Http.reply(res, { code: MsgCode.SUCCESS });
				});
				return;
			}
			Http.reply(res, { code: MsgCode.FAILED });
		})
	}
	// 加称谓
	addTitle(req: any, res: any) {
		let role_id = req.query.role_id;
		let type = req.query.type;
		let title_id = req.query.title_id;
		let value = req.query.value;
		let onload = req.query.onload;
		let player = PlayerMgr.shared.getPlayerByRoleId(role_id);
		if (player) {
			player.addTitle(type, title_id, value, onload);
		} else {
			DB.addTitle(role_id, type, title_id, (code: number, msg: string) => {
			});
		}
		Http.reply(res, { code: MsgCode.SUCCESS });
	}
	//封号
	FreezePlayer(req: any, res: any){
		let role_id = req.query.role_id;
		let state = req.query.state;

		if(state !=1 && state != 0){
			Http.reply(res, { code: MsgCode.FAILED, msg: "无效的封禁操作！" });
			return;
		}

		let pTarget = PlayerMgr.shared.getPlayerByRoleId(role_id);
		
		if (null == pTarget){
            DB.getRoleByRoleId(role_id,(errcode:any,role:any)=>{
                if(errcode == MsgCode.SUCCESS){
                    let accountid = role.accountid;
                    let sql = `update qy_account set state = '${state}' where accountid = ${accountid}`;
					DB.query(sql, (ret:any, rows:any) => { });
					Http.reply(res, { code: MsgCode.SUCCESS, msg: `角色${role_id}封号操作成功` });
					return;
                }
                Http.reply(res, { code: MsgCode.FAILED, msg: `角色${role_id}封号操作失败` });
            });
			return;
		}
		let sql = `update qy_account set state = '${state}' where accountid = ${pTarget.accountid}`;
		DB.query(sql, (ret:any, rows:any) => { });
		if(state == 1){
			Signal.shared.DeleteTocken(pTarget.accountid);
			pTarget.destroy();
		}
		
		Http.reply(res, { code: MsgCode.SUCCESS, msg: `角色${role_id}封号操作成功` });
	}
	// 关服
	close(req: any, res: any) {
		SKLogger.info(`正在关闭服务器[${GameUtil.serverName}]!`);
		GameUtil.isClose = true;
		PlayerMgr.shared.saved = false;
		Launch.shared.close(10,() => {
			Http.reply(res, { code: MsgCode.SUCCESS });
		});
	}

	// 全部存档
	saveAll(req: any, res: any) {
		SKLogger.info(`服务器[${GameUtil.serverName}]正在存档!`);
		Launch.shared.saveAll((msg: string) => {
			//let msg = `服务器[${GameUtil.serverName}]存档完成[在线玩家数:${GameUtil.online},内存玩家总数:${GameUtil.saveTotal},存档总数:${GameUtil.saveCount}]`;
			SKLogger.info(msg);
			let data = {
				server_id: GameUtil.serverId,
				server_name: GameUtil.serverName,
				online: GameUtil.online,
				saveCount: GameUtil.saveCount,
				saveTotal: GameUtil.saveTotal,
				saveFailed: GameUtil.saveFailed
			}
			Http.reply(res, { code: MsgCode.SUCCESS, msg: msg, data: data });
		});
	}

	//刷新商城
	fresh_shop(req: any, res: any){
		MallMgr.shared.init(true);
		SKLogger.info(`商城已刷新！`);
		Http.reply(res, { code: MsgCode.SUCCESS, msg: "商城已刷新！" });
	}

	//刷新宝图出货表
	fresh_lottery(req: any, res: any){
		LotteryMgr.shared.init(true);
		SKLogger.info(`宝图配置已刷新！`);
		Http.reply(res, { code: MsgCode.SUCCESS, msg: "宝图配置已刷新！" });
	}

	//设置GM号
	setgm(req: any, res: any){
		let roleid = req.query.role_id;
		let level = req.query.level;
		let player = PlayerMgr.shared.getPlayerByRoleId(roleid);
		if(!player){
			Http.reply(res, { code: MsgCode.FAILED, msg: "角色不存在或不在线" });
			return;
		}
		player.gmlevel = level;
		player.send('s2c_player_data', player.getData());
		SKLogger.info(`设置GM角色 roleid:${roleid} gmlevel:${level}`);
		Http.reply(res, { code: MsgCode.SUCCESS, msg: "设置GM角色成功！" });
	}
	//解散帮派
	jsbp(req: any, res: any){
		let bid = req.query.id;
		let bang = BangMgr.shared.getBang(bid);
		if(bang){
			BangMgr.shared.delBang(bid);
			Http.reply(res, { code: MsgCode.SUCCESS, msg: "帮派解散成功" });
			return;
		}
		Http.reply(res, { code: MsgCode.FAILED, msg: "帮派不存在" });
	}
	// 重新加载配置文件
	reload(req: any, res: any){
		let errorlist = GameUtil.reloadPropData();
		let msg = "热更新完成 \r\n"
		if (errorlist && errorlist.length > 0) {
			for (let filename of errorlist) {
				msg += `文件加载错误:[${filename}]\r\n`;
			}
		}
		Http.reply(res, { code: MsgCode.SUCCESS, msg: msg });
	}
	//热修复
	hotfix(req: any, res: any){
		let full_path = '../../../hotfix';
		let old = require.cache[require.resolve(full_path)];
		require.cache[require.resolve(full_path)] = null;
		try {
			require(full_path);
			Http.reply(res, { code: MsgCode.FAILED, msg: "热加载成功" });
		}catch (error) {
			require.cache[require.resolve(full_path)] = old;
			Http.reply(res, { code: MsgCode.FAILED, msg: "热加载失败" });
		}
	}

	//重置每日
	newDay(req: any, res: any){
		let roleid = req.query.role_id || 0;
		if(roleid > 0){
			let player = PlayerMgr.shared.getPlayerByRoleId(roleid);
			if(player){
				player.OnNewDay();
			}
		}else{
			PlayerMgr.shared.OnNewDay();
		}
		let info = `${roleid > 0 ? roleid : '全服'} 重置每日面板成功`
		Http.reply(res, { code: MsgCode.SUCCESS, msg: info });
	}


	//后台请求入口
	admin(req: any, res: any){
		let sign = req.query.sign;
		if(sign != MsgCode.GMSIGN){
			Http.reply(res, { code: MsgCode.FAILED, msg: "非法请求！" });
			return;
		}
		let mod = req.query.mod;
		if(!this.funlist[mod]){
			Http.reply(res, { code: MsgCode.FAILED, msg: "功能模块不存在！" });
			return;
		}
		this.funlist[mod](req,res);
	}
	// 启动Http服务
	start(port: number) {
		// 游戏服务器路由
		this.funlist = {
			login_token: this.loginToken.bind(this),
			charge_callback: this.chargeCallback.bind(this),
			sys_notice: this.sysNotice.bind(this),
			can_speak: this.can_speak.bind(this),
			delete_notice: this.deleteNotice.bind(this),
			clear_pcache: this.clearPCache.bind(this),
			kicked_out: this.kickedOut.bind(this),
			set_charge_activity: this.setChargeActivity.bind(this),
			close_charge_activity: this.closeChargeActivity.bind(this),
			add_jade: this.addJade.bind(this),
			add_exp: this.addExp.bind(this),
			add_item: this.addItem.bind(this),
			add_title: this.addTitle.bind(this),
			freeze_player: this.FreezePlayer.bind(this),
			fresh_shop: this.fresh_shop.bind(this),
			fresh_lottery: this.fresh_lottery.bind(this),
			save: this.saveAll.bind(this),
			close: this.close.bind(this),
			setgm: this.setgm.bind(this),
			jsbp: this.jsbp.bind(this),
			reload: this.reload.bind(this),
			hotfix: this.hotfix.bind(this),
			new_day: this.newDay.bind(this),
		};
		this.app.get('/admin', this.admin.bind(this));
		this.app.listen(port);
	}
}