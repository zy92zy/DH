import * as crypto from "crypto";
import DB from "./DB";
import ChargeConfig from "../game/core/ChargeConfig";
import ServerMgr from "../gate/ServerMgr";
import Http from "./Http";
import GameUtil from "../game/core/GameUtil";
import SKLogger from "../gear/SKLogger";
import SKDataUtil from "../gear/SKDataUtil";
import { MsgCode, PayType } from "../game/role/EEnum";
import GTimer from "../common/GTimer";
const NodeRSA = require('node-rsa');

// 充值
export default class Charge {
	static shared = new Charge();
	
	yixunKey = `r9jos9SDk4OQyrrZof994Nd9oRD96DJD`;
	yixunuid = 1000;
	yixunurl = `http://pay.8ppay.com/submit.php`;

	rjyKey=``;
	rjyuid = 1;
	rjyurl = `http://2393.n0o0n8.cn/apisubmit`;


	gesy8Key = ``;
	orderList: any;

	wechat = {
		//appid
		appid: 'appid',
		//商户号
		mch_id: '',
		url: 'api.mch.weixin.qq.com',
		//充值推送url
		notify_url: 'http://www.com:8562/payNotify_wx',
		//二维码生成URL
		code_url: 'http://www.com:8095/pay/qr_code.php?',
		//充值提示文本
		body: '充值',
		key: '',
	};
	
	alipay = {
		app_id: '',
		notify_url: 'http://www.com:8562/payNotify_ali',
		//标题
		subject: '充值',
		quit_url: 'http://www.com:8095/pay/file.html',
		url : 'https://openapi.alipay.com/gateway.do?',
		jump_url: 'http://www.com:8095/pay/alipay.php?',

		privateKey: "",
		
		pubilcKey: '',
		key: '',
	}

	xinzhifu = {
		key: ``,
		uid: '',
		url: `http://qqq.xinzhifu.top/Pay.html`,
	}


	constructor() {
		this.orderList = {};



	}

	/*
	 * 获取随机的20位的订单号
	 */
	getRandomOrderid20() {
		let date = new Date();
		let second = date.getTime();
		let random = Math.floor(900000 * Math.random()) + 100000;
		let orderid = 'E' + second + '' + random;
		return orderid;
	}

	getAgentOrderid20() {
		let date = new Date();
		let second = date.getTime();
		let random = Math.floor(900000 * Math.random()) + 100000;
		let orderid = 'A' + second + '' + random;
		return orderid;
	}

	/*
	 * 获取随机的30位的订单号
	 */
	getRandomOrderid30() {
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth();
		let smonth = "" + month;
		if (month < 10) { smonth = '0' + month; }
		let day = date.getDate();
		let sday = "" + day;
		if (day < 10) { sday = '0' + day; }
		let hour = date.getHours();
		let shour = "" + hour;
		if (hour < 10) { shour = '0' + hour; }
		let min = date.getMinutes();
		let smin = "" + min;
		if (min < 10) { smin = '0' + min; }
		let second = date.getSeconds();
		let ssecond = "" + second;
		if (second < 10) { ssecond = '0' + second; }
		let random = Math.floor(900000000 * Math.random()) + 100000000;
		let orderid = `E${year}${smonth}${sday}00${shour}00${smin}00${ssecond}${random}`;
		return orderid;
	}

	/*
	 * 创建自定义订单
	 */
	createCustomOrder(roleid: any, goodsid: any, goodscount: any, pay_bankcode: any, money: any, activitystates: any, callback: any) {
		if ([210, 220, 310, 330].indexOf(pay_bankcode) == -1) {
			callback(false);
			return;
		}
		money = parseInt(money);
		if (isNaN(money) || money <= 998) {
			callback(false);
			return;
		}
		let jade = this.getAllJadeByMoney(money);
		let orderid = this.getRandomOrderid20();
		DB.createChargeOrder(orderid, roleid, money, jade, goodscount, goodsid, activitystates, (ret: any) => {
			if (!ret) {
				callback(false, {});
				return;
			}
			let url = this.getPayH5(roleid, orderid, money, pay_bankcode);
			callback(true, { url: url });
		});
	}

	/*
	 * 创建订单
	 * @param roleid 角色id
	 * @param goodsid 货物pid
	 * @param goodscount 货品数量
	 * @param activitystates 双倍充值活动是否开启
	 */
	createOrder(roleid: any, goodsid: any, goodscount: any, pay_bankcode: any, money: any, activitystates: any, callback: any) {
		if (goodsid == 0) {
			this.createCustomOrder(roleid, goodsid, goodscount, pay_bankcode, money, activitystates, callback);
			return;
		}
		if ([210, 220, 310, 330].indexOf(pay_bankcode) == -1) {
			callback(false);
			return;
		}
		let jade = 0;
		let name = '';
		let list = ChargeConfig.shared.charge_list;
		for (let data of list) {
			if (data.goodsid == goodsid) {
				jade = (data.jade + data.ex_jade) * goodscount;
				money = data.money * goodscount;
				name = data.name;
			}
		}
		if (jade == 0 || money == 0 || name == '') {
			callback(false);
			return;
		}
		let _this = this;
		let orderid = this.getRandomOrderid20();
		DB.createChargeOrder(orderid, roleid, money, jade, goodscount, goodsid, activitystates, (ret: any) => {
			if (!ret) {
				callback(false, {});
				return;
			}
			if (GameUtil.payType == PayType.NEW) {
				if (pay_bankcode == 330 || pay_bankcode == 310) {
					let sql = 'SELECT login_ip FROM qy_role a INNER JOIN qy_account b ON a.accountid=b.accountid WHERE a.roleid='+roleid;
					DB.query(sql, (error: any, rows: any[])=>{
						if(error) 
							callback(false, {});
						else
						this.getWxCode(rows[0].login_ip, orderid, money, (state:boolean, code:string)=>{
							let url = _this.wechat.code_url + 'url=' + encodeURI(code) + '&order=' + orderid ;
							callback(state, { url: url });
						})
					})
				}else{
					this.getAliCode(roleid, orderid, money, (state:boolean, url:string)=>{
						url = Buffer.from(url).toString('base64');
						callback(state, { url: url, base64: 1});
					})
				}
			}else{
				let url = this.getPayH5(roleid, orderid, money, pay_bankcode);
				callback(true, { url: url });
			}
		});
	}

	test(req: any, res: any){

		let time:string = Date.parse(new Date().toString()).toString();
		//this.getWxCode(req, time, 1)
		Http.reply(res, {
			code: MsgCode.SUCCESS,
			msg: "11111"
		});
	}


	getWxCode(ip: string, orderId: string, money: number, call: Function){
		let e = this;
		let data = {
			appid: this.wechat.appid,
			mch_id: this.wechat.mch_id,
			nonce_str: this.randomString(),
			out_trade_no: orderId,
			total_fee: money * 100,
			body: this.wechat.body,
			trade_type: 'NATIVE',
			product_id: 1,
			notify_url: this.wechat.notify_url,
			sign: '',
			sign_type: 'MD5',
			spbill_create_ip: ip,
		};
		data.sign = this.getSignStr(data) + '&key=' + this.wechat.key;
		data.sign = this.getStrMd5(data.sign).toUpperCase();
		function callback(req:any){
			if(e.searchXml('return_code', req) == 'SUCCESS')
				call(true, e.searchXml('code_url', req));
			else
				console.log(e.searchXml('return_msg', req)),call(false, '');
		}
		Http.sendPost2('api.mch.weixin.qq.com', '/pay/unifiedorder', this.ArrToXml(data), callback);
	}
	getAliCode(roleid: string, orderId: string, money: number, call: Function){
		let biz_content = {
			//body: '',
			subject: this.alipay.subject,
			out_trade_no: orderId,
			total_amount: money,
			quit_url: this.alipay.quit_url,
			product_code: 'FAST_INSTANT_TRADE_PAY',
			qr_pay_mode: 4,
			qrcode_width: 300,
		};
		let data = {
			app_id: this.alipay.app_id,
			notify_url: this.alipay.notify_url,
			method: 'alipay.trade.page.pay',
			charset: 'utf-8',
			sign_type: 'RSA2',
			timestamp: this.getNowDate(),
			version: '1.0',
			biz_content: JSON.stringify(biz_content),
			sign: '',
		};
		
		const key = new NodeRSA();
		key.setOptions({b: 2048, signingScheme: "sha256"});
		key.importKey(this.alipay.privateKey, 'pkcs8-private');
		//const publicDer = key.exportKey('pkcs8-public');
		let buffer = Buffer.from(this.getSignStr(data));
		data.sign = key.sign(buffer).toString('base64');

		call(true, this.alipay.jump_url + this.build_url(data))
	}

	pay_notify_wx(req:any, res:any){
		let data = req.body.xml;
		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				data[key] = data[key][0];
			}
		}
		if(data.return_code != 'SUCCESS'){
			SKLogger.info(`异步通知:充值失败! ${data.return_msg}`);
			Http.reply(res, {
				return_code: 'FAIL',
				return_msg: "充值失败"
			});
			return;
		}
		let sign = this.getSignStr(data) + '&key=' + this.wechat.key;
		sign = this.getStrMd5(sign).toUpperCase();
		if(sign != data.sign){
			SKLogger.info(`异步通知:sign验证失败! ${data.return_msg}`);
			
			Http.reply(res, this.ArrToXml({
				return_code: 'FAIL',
				return_msg: "sign验证失败"
			}));
		}else{
			let ArrToXml = this.ArrToXml;
			function call(success:boolean, msg: string = '') {
				Http.reply(res, ArrToXml({
					return_code: success ? 'SUCCESS' : 'FAIL',
					return_msg: msg
				}));
			}

			let money = (Number(data.cash_fee) / 100).toString();
			DB.getOrderStatus(data.out_trade_no, (status:boolean)=>{
				if(status) {
					call(true, `充值${money}元成功!`) 
				}else{
					let res =this.paySuccess(data.out_trade_no, data.transaction_id, money, call);
				}
			})
			
		}

	}

	pay_notify_ali(req:any, res:any){
		let param = req.body;
		const key = new NodeRSA();
		key.setOptions({b: 2048, signingScheme: "sha256"});
		key.importKey(this.alipay.pubilcKey, 'pkcs8-public');
		let buffer = Buffer.from(this.getSignStr2(param));
		//let sign = key.sign(buffer).toString('base64');
		if(!key.verify(buffer, param.sign, null, 'base64')){
			Http.reply(res, 'sign验证失败');
			return;
		}
		if(param.trade_status == 'TRADE_SUCCESS'){
			DB.getOrderStatus(param.out_trade_no, (status:boolean)=>{
				if(status) {
				}else{
					let res = this.paySuccess(param.out_trade_no, param.trade_no, param.total_amount);
				}
			})

		}
		
		Http.reply(res, 'SUCCESS');
	}


	// 获得支付H5地址
	getPayH5(roleId: string, orderId: string, money: number, type: number): string {
		let apikey = "KfQB180uRW2CKxKs24q6BF4QZqQ8zu8K";
		let payurl = "http://pay.8ppay.com/submit.php";
		let uid:any = 1008;
		// 版本号
		let version = "1.0";
		// 商户编号
		let pid		= uid;
		// 订单号
		let sdorderno = orderId;
		// 订单金额
		let total_fee = money.toFixed(2);
		// 支付编号
		let paytype = "alipay";
		if (type == 330 || type == 310) {
			paytype = "wxpay";
		}

		
		if (GameUtil.payType == PayType.YIXUN) {
			apikey = this.yixunKey;
			payurl = this.yixunurl;
			uid = this.yixunuid;
		} else if (GameUtil.payType == PayType.RJY) {
			apikey = this.rjyKey;
			payurl = this.rjyurl;
			uid = this.rjyuid;
		} else if (GameUtil.payType == PayType.XZF) {
			apikey = this.xinzhifu.key;
			payurl = this.xinzhifu.url;
			uid = this.xinzhifu.uid;
		}


		let path = `http://${GameUtil.serverConfig.HTTP.FAKE}:${GameUtil.serverConfig.HTTP.PORT}`;
		// 异步通知
		let notifyurl = `${path}/pay_notify`;
		notifyurl = encodeURI(notifyurl);
		// 同步跳转
		let returnurl = `${path}/pay_return`;
		returnurl = encodeURI(returnurl);
		// 订单备注
		let remark = GameUtil.channel;
		// 订单备注2
		let server = "";
		// 签名

		let result = '';
		if(GameUtil.payType == PayType.XZF){
			if(type == 210){
				paytype = 'alipay';
			}else if(type == 220){
				paytype = 'alipay';
			}else if(type == 310){
				paytype = 'weixin';
			}else if(type == 330){
				paytype = 'weixin';
			}
			notifyurl = `http://${GameUtil.serverConfig.HTTP.PAY}/pay/jump2.php`;
			let param:any = {
				version: '1.0.0',
				memberid: uid,
				orderid: sdorderno,
				notifyurl: notifyurl,
				//callbackurl: returnurl,
				signmethod: 'md5',
				amount: Number(total_fee) * 100,
				orderdatetime: GTimer.format(),
				paytype: paytype,
			};
			let keys = Object.keys(param).sort();
			let sginstr:any = [];
			for (const key of keys) {
				let str = `${key}=${param[key]}`;
				sginstr.push(str);
			}
			sginstr = sginstr.join('&');
			param.sign = crypto.createHash("md5").update(sginstr + apikey).digest("hex").toUpperCase();
			param.jumpurl = this.xinzhifu.url;
			param.callbackurl=returnurl;
			let data_str = Buffer.from(SKDataUtil.toJson(param)).toString('base64').replace('+','@');
			return `http://${GameUtil.serverConfig.HTTP.PAY}/pay/jump.php?data=${data_str}`;
		}else if(GameUtil.payType == PayType.SKY){
			notifyurl = encodeURI(`http://${GameUtil.serverConfig.HTTP.PAY}/pay/jump2.php`);
			let content = `name=${version}&parter=${uid}&type=${paytype}&money=${total_fee}&orderno=${sdorderno}&return_url=${returnurl}&notify_url=${notifyurl}&sitename=${remark}&orderencodetype=MD5&key=${apikey}`;
			let sign = crypto.createHash("md5").update(content).digest("hex");
			result = `${payurl}?name=${version}&parter=${uid}&type=${paytype}&money=${total_fee}&orderno=${sdorderno}&return_url=${returnurl}&notify_url=${notifyurl}&sitename=${remark}&orderencodetype=MD5&sign=${sign}`;
		}else{
			let content = `money=${total_fee}&name=${version}&notify_url=${notifyurl}&out_trade_no=${sdorderno}&pid=${pid}&return_url=${returnurl}&sitename=${remark}&type=${paytype}${apikey}`;
			let sign = crypto.createHash("md5").update(content).digest("hex");
			result = `${payurl}?money=${total_fee}&name=${version}&notify_url=${notifyurl}&out_trade_no=${sdorderno}&pid=${pid}&return_url=${returnurl}&sitename=${remark}&type=${paytype}&server=${server}&sign=${sign}`;
		}
		console.log(result);
		return result;
	}

	getItem(i: any) {
		let config = ChargeConfig.shared.charge_list;
		for (let item of config) {
			if (item.goodsid == i) {
				return item;
			}
		}
		return null;
	}
	/*
	 * 自定义订单根据money计算jade
	 */
	getAllJadeByMoney(money: any) {
		let jade = money * 100;
		let exjade = 0;
		for (let i = 6; i >= 1; --i) {
			let item = this.getItem(i);
			if (item && money >= item.money) {
				let count = Math.floor(money / item.money);
				exjade += count * item.ex_jade;
				money -= count * item.money;
			}
		}
		return jade + exjade;
	}

	// 充值同步跳转
	pay_return(req: any, res: any) {
		let params = req.query;
		if (GameUtil.payType == PayType.XZF){
			let keys = Object.keys(params).sort();
			let sginstr:any = [];
			for (const key of keys) {
				if(key=='sign') continue;
				let str = `${key}=${params[key]}`;
				sginstr.push(str);
			}
			sginstr = sginstr.join('&');
			let sign = this.getStrMd5(sginstr + this.xinzhifu.key);
			let total_fee:string = (Number(params.amount)/100).toString();

			if (sign == params.sign) {
				if (params.status == "1") {
					this.paySuccess(params.orderid, params.sysorderid, total_fee);
					res.end(`充值${total_fee}元成功!`);
				} else {
					res.end(`充值${total_fee}元失败!`);
				}
			} else {
				res.end(`充值${total_fee}元失败1,签名错误!`);
			}
			return;
		}
		let trade_status = req.query.trade_status;
		let pid = req.query.pid;
		let out_trade_no = req.query.out_trade_no;
		let money = req.query.money;
		let type = req.query.type;
		let trade_no = req.query.trade_no;
		let name = req.query.name;
		let server = req.query.server;
		let sign = req.query.sign;
		let apikey = "KfQB180uRW2CKxKs24q6BF4QZqQ8zu8K";
		if (GameUtil.payType == PayType.GESY8) {
			apikey = this.gesy8Key;
		} else if (GameUtil.payType == PayType.YIXUN) {
			apikey = this.yixunKey;
		} else if (GameUtil.payType == PayType.RJY) {
			apikey = this.rjyKey;
		} else if (GameUtil.payType == PayType.XZF) {
			apikey = this.xinzhifu.key;
		}
		//let content = `customerid=${customerid}&status=${status}&sdpayno=${sdpayno}&sdorderno=${sdorderno}&total_fee=${total_fee}&paytype=${paytype}&${apikey}`;
		let content = `money=${money}&name=${name}&out_trade_no=${out_trade_no}&pid=${pid}&trade_no=${trade_no}&trade_status=${trade_status}&type=${type}${apikey}`;

		let my_sign = crypto.createHash("md5").update(content).digest("hex");
		if (sign == my_sign) {
			if (trade_status == "TRADE_SUCCESS") {
				this.paySuccess(trade_no, out_trade_no, money);
				res.end(`充值${money}元成功!`);
			} else {
				res.end(`充值${money}元失败!`);
			}
		} else {
			res.end(`充值${money}元失败2,签名错误!`);
		}
	}
	// 解析POST参数
	parsePostBody(req: any, done: any) {
		let arr: any = [];
		let chunks: any;
		req.on("data", (buff: any) => {
			arr.push(buff);
		});
		req.on("end", () => {
			chunks = Buffer.concat(arr);
			done(chunks);
		});
	}
	// 充值异步通知
	pay_notify(req: any, res: any) {
		let params: any = (req.method == "POST" ? req.body : req.query);
		if (GameUtil.payType == PayType.XZF){
			let keys = Object.keys(params).sort();
			let sginstr:any = [];
			for (const key of keys) {
				if(key=='sign') continue;
				let str = `${key}=${params[key]}`;
				sginstr.push(str);
			}
			sginstr = sginstr.join('&');
			let sign = crypto.createHash("md5").update(sginstr + this.xinzhifu.key).digest("hex").toUpperCase();
			let total_fee:string = (Number(params.true_amount)/100).toString();

			if (sign == params.sign) {
				if (params.status == "success") {
					this.paySuccess(params.orderid, params.sysorderid, total_fee);
					res.end(`OK`);
					//res.end(`充值${total_fee}元成功!`);
				} else {
					SKLogger.warn(`充值${total_fee}元失败!`);
					SKLogger.warn(params);
					res.end(`充值${total_fee}元失败!`);
				}
			} else {
				SKLogger.warn(`充值${total_fee}元失败,签名错误!`);
				SKLogger.warn(params);
				res.end(`充值${total_fee}元失败,签名错误!`);
			}
			return;
		}

		if (GameUtil.payType == PayType.GESY8) {
			if(SKDataUtil.isEmptyObject(params)){
				SKLogger.warn(`八哥充值回调参数为空!`);
				res.end(`<result>www.8gesy.com</result>`);
				return;
			}
			let account = params.account;
			let attach = params.attach;
			let status = params.status;
			let bili = params.bili; // 比例
			let money = params.money; // 充值金额*比例
			let gift_money = params.gift_money; // 礼包金额
			let real_money = params.real_money; // 充值金额
			let trade_no = params.trade_no;
			let sign = params.sign;
			let apikey = this.gesy8Key;
			let content = `account=${account}&attach=${attach}&bili=${bili}&gift_money=${gift_money}&money=${money}&&real_money=${real_money}&status=${status}&trade_no=${trade_no}&key=${apikey}`;
			let my_sign = crypto.createHash("md5").update(content).digest("hex");
			if (attach) {
				SKLogger.info(`异步通知:充值${real_money}元成功!`);
				this.paySuccess(attach, trade_no, real_money);
			}
			res.end(`<result>www.8gesy.com</result>`);
			return;
		}

		if (SKDataUtil.isEmptyObject(params)) {
			SKLogger.debug(`异步通知:充值参数为空!`);
			res.end(`fail`);
			return;
		}
		let apikey = "KfQB180uRW2CKxKs24q6BF4QZqQ8zu8K";
		if (GameUtil.payType == PayType.YIXUN) {
			apikey = this.yixunKey;
		} else if (GameUtil.payType == PayType.RJY) {
			apikey = this.rjyKey;
		}
		let money = params.money;
		let name = params.name;
		let out_trade_no = params.out_trade_no;
		let pid = params.pid;
		let trade_no = params.trade_no;
		let trade_status = params.trade_status;
		let type = params.type;
		let server = params.server;
		let sign = params.sign;
		let content = `money=${money}&name=${name}&out_trade_no=${out_trade_no}&pid=${pid}&trade_no=${trade_no}&trade_status=${trade_status}&type=${type}${apikey}`;
		let my_sign = crypto.createHash("md5").update(content).digest("hex");
		if (sign == my_sign) {
			if (trade_status == "TRADE_SUCCESS") {
				SKLogger.debug(`异步通知:[${name}]充值${money}元成功!`);
				this.paySuccess(out_trade_no, trade_no, money);
				res.end(`success`);
			} else {
				SKLogger.warn(`异步通知:[${name}]充值${money}元失败!`);
				res.end(`fail`);
			}
		} else {
			SKLogger.debug(`异步通知:[${name}]充值订单${out_trade_no}签名失败!`);
			res.end(`${content}签名失败${my_sign}`);
		}
	}

	paySuccess(sdorderno: string, sdpayno: string, total_fee: string, call:any=null) {
		if (this.orderList[sdorderno]) {
			SKLogger.debug(`订单${sdorderno}正在处理...`);
			return;
		}
		this.orderList[sdorderno] = 0;
		DB.canFinishOrder(sdorderno, sdpayno, total_fee, (code: MsgCode, row: any) => {
			if (code != MsgCode.SUCCESS) {
				delete this.orderList[sdorderno];
				SKLogger.warn(`充值${total_fee}元失败!`);
				call&&call(false, `充值${total_fee}元失败!`);
			} else {
				let server = ServerMgr.shared.getServer(row.serverid);
				if (!server || !server.wan || !server.http_port) {
					delete this.orderList[sdorderno];
					SKLogger.warn(`充值${total_fee}元失败,找不到所在游戏服务器!`);
					call&&call(false, `充值${total_fee}元失败,找不到所在游戏服务器!`);
					return;
				}
				Http.sendget(server.wan, server.http_port, '/admin', {
					mod: "charge_callback",
					sign: MsgCode.GMSIGN,
					roleid: row.roleid,
					sdorderno: sdorderno,
					sdpayno: sdpayno,
					jade: row.jade,
					money: row.money,
				}, (success:boolean, data: any) => {
					if (data.code == MsgCode.FAILED) { /* 不在线 */
						DB.finishOrder(sdorderno, sdpayno, (ret: any) => {
							delete this.orderList[sdorderno];
							if (ret) {
								SKLogger.info(`充值${total_fee}元成功!`);
								call&&call(true, `充值${total_fee}元成功!`);
							} else {
								SKLogger.info(`充值${total_fee}元失败!`);
								call&&call(false, `充值${total_fee}元失败!`);
							}
						});
					} else {
						DB.setOrderFinish(sdorderno, sdpayno,total_fee, (ret: any) => {
							delete this.orderList[sdorderno];
							if (ret) {
								SKLogger.info(`充值${total_fee}元成功!`);
								call&&call(true, `充值${total_fee}元成功!`);
							} else {
								SKLogger.info(`充值${total_fee}元失败!`);
								call&&call(false, `充值${total_fee}元失败!`);
							}
						});
					}
				});
			}
		});
	}
	// 代理充值
	agentCharge(role_id: string, charge_id: number, count: number, activitystates: any, callback: (code: number, msg: string) => void) {
		let list = ChargeConfig.shared.charge_list;
		if (charge_id < 1 || charge_id > list.length) {
			callback(MsgCode.FAILED, `代理充值:charge_id配置没有找到!`);
			return;
		}
		let data = list[charge_id - 1];
		let goodsid = data.goodsid;
		let jade = (data.jade + data.ex_jade) * count;
		let money = data.money * count;
		let order_id = this.getAgentOrderid20();
		DB.agentCharge(order_id, role_id, money, jade, count, goodsid, activitystates, (code: number, msg: string, server_id: any) => {
			if (code == MsgCode.SUCCESS) {
				this.agentPaySuccess(order_id, role_id, jade, money, server_id, callback);
			} else {
				callback(code, msg);
			}
		});
	}


	freeChargeMoney(role_id: string, money: number, activitystates: any, callback: (code: number, msg: string) => void){
		let jade = money * 10000;
		let order_id = this.getAgentOrderid20();
		DB.agentCharge(order_id, role_id, money, jade, 1, 0, activitystates, (code: number, msg: string, server_id: any) => {
			if (code == MsgCode.SUCCESS) {
				this.agentPaySuccess(order_id, role_id, jade, money, server_id, callback);
			} else {
				callback(code, msg);
			}
		});
	}


	//自由充值
	freeCharge(role_id: string, jade: number, callback: (code: number, msg: string) => void){
		let order_id = this.getAgentOrderid20();
		DB.agentCharge(order_id, role_id, 0, jade, 1, 0, {}, (code: number, msg: string, server_id: any) => {
			if (code == MsgCode.SUCCESS) {
				this.agentPaySuccess(order_id, role_id, jade, 0, server_id, callback);
			} else {
				callback(code, msg);
			}
		});
	}


	agentPaySuccess(order_id: string, roleId: any, jade: number, money: number, server_id: any, callback: (code: number, msg: string) => void) {
		let server = ServerMgr.shared.getServer(server_id);
		if (!server || !server.wan || !server.http_port) {
			callback(MsgCode.FAILED, `代理充值${money}元失败,找不到所在游戏服务器!`);
			return;
		}
		Http.sendget(server.wan, server.http_port, '/admin', {
			mod: "charge_callback",
			sign: MsgCode.GMSIGN,
			roleid: roleId,
			sdorderno: order_id,
			sdpayno: "",
			jade: jade,
			money: money,
		}, (ret: any, data: any) => {
			callback(MsgCode.SUCCESS, `代理充值${money}元成功!`);
		});
	}

	//
	getNowDate(fmt:string = 'yyyy-MM-dd hh:mm:ss'): string {
		let _date = new Date();
     	let o:any = {
            "M+" : _date.getMonth()+1,                 //月份
            "d+" : _date.getDate(),                    //日
            "h+" : _date.getHours(),                   //小时
            "m+" : _date.getMinutes(),                 //分
            "s+" : _date.getSeconds(),                 //秒
            "q+" : Math.floor((_date.getMonth()+3)/3), //季度
            "S"  : _date.getMilliseconds()             //毫秒
          };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (_date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(let k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
	}

	
	build_url(data: any,encode:boolean=true){
		var valArr:string[] = [];
		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				valArr.push(key + '=' + (encode?encodeURIComponent(data[key]):data[key]) )
			}
		}
		return valArr.join('&')
	}
	build_url2(data: any,encode:boolean=true){
		var valArr:string[] = [];
		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				valArr.push(key + '=' + (encode?encodeURI(data[key]):data[key]) )
			}
		}
		return valArr.join('&')
	}

	randomString(len:number=32){
		let outString: string = '';
		let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 32; i++)
		  outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
		return outString;
	}

	getSignStr(data:any){
		let keys = Object.keys(data).sort();
		let valArr:string[] = [];
		keys.forEach((k: string) => {
			k !== 'sign' && k !== '' && valArr.push(k + '=' + data[k]);
		});
		return valArr.join('&')
	}
	getSignStr2(data:any){
		let keys = Object.keys(data).sort();
		let valArr:string[] = [];
		keys.forEach((k: string) => {
			k !== 'sign' && k !== 'sign_type' && k !== '' && valArr.push(k + '=' + data[k]);
		});
		return valArr.join('&')
	}


	getStrMd5(str: string){
		return crypto.createHash("md5").update(str).digest("hex")
	}


	searchXml(name:string, data:string): string{
		let reg:any = new RegExp( `<${name}>.*</${name}>`);
		let str:any = reg.exec(data);
		if(!str) return null;
		str = /(\[|\>)((?![\<\>\[\]]).)+(\<|\])/.exec(str[0]);
		if(!str) return null;
		return str[0].substr(1, str[0].length-2);
	}


	
	ArrToXml(data:any){
		let xml:string = "<xml>";
		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				let val = data[key];
				xml +=  `<${key}>${val}</${key}>`;
				//xml += /^[a-zA-Z][a-zA-Z0-9_]*$/.test(val) ? `<${key}>${val}</${key}>` : `<${key}><![CDATA[${val}]]></${key}>`;
			}
		}
		xml +="</xml>";
		return xml;
	}

	getIp(req:any){
		let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
		let e = ip.lastIndexOf(":");
		return e != -1 ? ip.substr(e+1) : ip
	}

}
