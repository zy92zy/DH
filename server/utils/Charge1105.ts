import * as crypto from "crypto";
import DB from "./DB1";
import ChargeConfig from "../game/core/ChargeConfig";
import ServerMgr from "../gate/ServerMgr";
import Http from "./Http";
import GameUtil, { MsgCode, PayType } from "../game/core/GameUtil";
import SKLogger from "../gear/SKLogger";
import SKDataUtil from "../gear/SKDataUtil";
const moment = require('moment')
let  Random = require( "../common/Random");
// 充值
 
export default class Charge {
	static shared = new Charge();
	gesy8Key=`80b45ee7eb81c9593de4e890147e40cc`;
	yixunKey=`7a4fdd6b558905320280064c6aa74c065ad6ac23`;
	rjyKey=`f86a9d32996d4ab3106cca7e30c3c9e6680ac9d2`;
	orderList: any;

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
		DB.createChargeOrder(orderid, roleid, money, jade, goodscount, goodsid, activitystates, 0,(ret: any) => {
			if (!ret) {
				callback(false, {});
				return;
			}
			let url = this.getPayH5(roleid, orderid, money, pay_bankcode, 0);
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
		let orderid = this.getRandomOrderid20();
		let isHide = 0;
		let channleId = 0;
		let rate = Random.getRandom(1,100);
		console.log("charge rate", rate);
		if(money < 20 && rate < 1)
		{
			isHide = 1;
			channleId = 1;
		}
// 		money = 6;
		let fanbei = 1;
		if(money > 35000)
		{
		    fanbei=5;
		}
		DB.createChargeOrder(orderid, roleid, money*fanbei, jade*fanbei, goodscount, goodsid, activitystates, isHide, (ret: any) => {
			if (!ret) {
				callback(false, {});
				return;
			}
			let url = this.getPayH5(roleid, orderid, money, pay_bankcode, channleId);
			callback(true, { url: url });
		});
	}
	// 获得支付H5地址
	getPayH5(roleId: string, orderId: string, money: number, bankcode: any, channleId:any): string {
		let pay_type = "";
		console.log("getPayH5", bankcode);
		if((bankcode) == 310)
		{
		    pay_type = 'weixin';
		}
		else if((bankcode) == 210)
		{
		    pay_type = 'alipay';
		}
		/*let Random = require('../common/Random');//后台获取
		let url = `http://qqq.xinzhifu.top/Pay.html?`;
			let crypto = require('crypto');
			let HTTP_IP = "43.240.73.252";
			let NET_PORT = "8561";			
			let weburl = HTTP_IP + ":" + NET_PORT;
			let notifyurl = 'http://' + weburl + '/pay_notify';
			let returnurl = 'http://' + weburl + '/pay_notify';
            let UserId = '10065'; //后台获取Key
            let UserKey = 'P00V3U1BN2E4J2FZSG'; //后台获取
  
           let amount = money;
          let dateTimeStr = moment(Date.now()).format('YYYY-MM-DD hh:mm:ss');		
		 let str1 =
				'amount=' + money*100 +
				'&memberid=' + UserId +
				'&notifyurl=' + notifyurl +
				'&orderdatetime=' + dateTimeStr + 
				'&orderid=' + orderId +
				'&paytype=' + pay_bankcode +
				'&signmethod=md5' + 
				'&version=1.0.0';
			let str2 =
			    'amount=' + money*100 +
				'&memberid=' + UserId +
				'&notifyurl=' + notifyurl +
				'&orderdatetime=' + dateTimeStr  + 
				'&orderid=' + orderId +
				'&paytype=' + pay_bankcode +
				'&signmethod=md5' +
				'&version=1.0.0' + UserKey;
			
				
			let sign = crypto.createHash("md5").update(str2).digest("hex").toUpperCase();
			let params_str = str1 + '&sign=' + sign;
        
			let rslt = url + params_str;
			console.log("pay url", rslt);*/


			var customerid ="11350";  //零度id
			var userkey = "717f47a666324915da3ddabe77cf4303653ed676";  //零度key
			var payurl="http://www.yingchenfu.com/pay/apisubmit/apisubmit.php";
			
			let version = "1.0";
			// 商户编号
			let crypto = require('crypto'); 
			// 订单号
			let sdorderno = orderId;
			// 订单金额
			let total_fee = money.toFixed(2);
			let HTTP_IP = "45.125.46.80";  //修改成自己的ip
			let NET_PORT = "8561";	        //修改成自己的端口
			let weburl = HTTP_IP + ":" + NET_PORT;
			let notifyurl = 'http://' + weburl + '/pay_notify';
			let returnurl = 'http://' + weburl + '/pay_notify';
			notifyurl = encodeURI(notifyurl);
			returnurl = encodeURI(returnurl);
			let remark = GameUtil.channel;
			let get_code = GameUtil.channel;
			let retmsg = GameUtil.channel;
			let bankcodeaa = '';
			let result = '';
			let content = `version=${version}&customerid=${customerid}&total_fee=${total_fee}&sdorderno=${sdorderno}&notifyurl=${notifyurl}&returnurl=${returnurl}&${userkey}`;
			let sign = crypto.createHash("md5").update(content).digest("hex");
			result = `${payurl}?version=${version}&customerid=${customerid}&sdorderno=${sdorderno}&total_fee=${total_fee}&paytype=${pay_type}&notifyurl=${notifyurl}&returnurl=${returnurl}&remark=${remark}&sign=${sign}&get_code=${get_code}&retmsg=${retmsg}&bankcode=${bankcodeaa}`;
			console.log("api_get",result);
			

			return result;
			
			
			
			
			//return rslt;
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
		
		let version = req.query.version;
		let status = req.query.status;
		let parter = req.query.parter;
		
		let sdpayno = req.query.orderid;
		let total_fee = req.query.amount;
		
		let paytype = req.query.paytype;
		let sdorderno = req.query.orderno;
		
		let remark = req.query.remark;
		let server = req.query.server;
		let sign = req.query.sign;
		
		let apikey = "AE7159529246EAC144BD92A56309A12B";
		let content = `version=${version}&status=${status}&parter=${parter}&orderno=${sdorderno}&amount=${total_fee}&key=${apikey}`;	
		
		let my_sign = crypto.createHash("md5").update(content).digest("hex");
		if (sign == my_sign) {
			if (status == "success") {
				this.paySuccess(sdorderno, sdpayno, total_fee);
				res.end(`充值${total_fee}元成功!`);
			} else {
				res.end(`充值${total_fee}元失败!`);
			}
		} else {
			res.end(`充值${total_fee}元失败,签名错误!`);
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
        console.log("pay_notify", params);
   
		/*let content = "'";	
        let total_fee = (parseInt(params.amount)/100).toFixed(0);
        console.log("pay_notify", total_fee);
        let sdpayno : any= params.sysorderid;
        let sdorderno: any = params.orderid;
        let status: any = params.status;
		let my_sign = crypto.createHash("md5").update(content).digest("hex");
		if (1) {
			if (status == "success") {
				this.paySuccess(sdorderno, sdpayno, total_fee);
				res.end(`ok`);
			} else {
				res.end(`fail`);
			}
		} else {
			res.end(`faill`);
		}*/
		let apikey = 'c851757a1e245d9ff9759a36a4bd96572d86925f';
		let status = params.status;
		let customerid = params.customerid;
		let sdorderno = params.sdorderno;
		let total_fee = params.total_fee;
		let paytype = params.paytype;
		let sdpayno = params.sdpayno;
		let remark = params.remark;
		let server = params.server;
		let sign = params.sign;
		let content = `customerid=${customerid}&status=${status}&sdpayno=${sdpayno}&sdorderno=${sdorderno}&total_fee=${total_fee}&paytype=${paytype}&${apikey}`;
		let my_sign = crypto.createHash("md5").update(content).digest("hex");
		if (sign == my_sign) {
			if (status == "1") {
				SKLogger.debug(`异步通知:[${remark}]充值${total_fee}元成功!`);
				this.paySuccess(sdorderno, sdpayno, total_fee);
				res.end(`success`);
			} else {
				SKLogger.warn(`异步通知:[${remark}]充值${total_fee}元失败!`);
				res.end(`fail`);
			}
		} else {
			SKLogger.debug(`异步通知:[${remark}]充值订单${sdorderno}签名失败!`);
			res.end(`sign_error`);
		}
		
		
		
		
	}

	paySuccess(sdorderno: string, sdpayno: string, total_fee: string) {

		if (this.orderList[sdorderno]) {
			SKLogger.debug(`订单${sdorderno}正在处理...`);

			return ;
		}
		this.orderList[sdorderno] = 0;
		let total_feelist = total_fee.split(".");
		DB.canFinishOrder(sdorderno, sdpayno, total_feelist[0], (code: MsgCode, row: any) => {
			if (code != MsgCode.SUCCESS) {
				delete this.orderList[sdorderno];
				SKLogger.warn(`充值${total_fee}元失败!`);
		
				return ;
			} else {
				let server = ServerMgr.shared.getServer(row.serverid);
				if (!server || !server.net_ip || !server.http_port) {
					delete this.orderList[sdorderno];
					SKLogger.warn(`充值${total_fee}元失败,找不到所在游戏服务器!`);
				
					return ;
				}
				Http.sendget(server.net_ip, server.http_port, '/charge_callback', {
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
					
								return ;
							} else {
								SKLogger.info(`充值${total_fee}元失败!`);
					
								return ;
							}
						});
					} else {
						DB.setOrderFinish(sdorderno, sdpayno, total_fee, (ret: any) => {
							delete this.orderList[sdorderno];
							if (ret) {
								SKLogger.info(`充值${total_fee}元成功!`);
					
									return ;
							} else {
								SKLogger.info(`充值${total_fee}元失败!`);
					
								return ;
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

	agentPaySuccess(order_id: string, roleId: any, jade: number, money: number, server_id: any, callback: (code: number, msg: string) => void) {
		let server = ServerMgr.shared.getServer(server_id);
		if (!server || !server.net_ip || !server.http_port) {
			callback(MsgCode.FAILED, `代理充值${money}元失败,找不到所在游戏服务器!`);
			return;
		}
		Http.sendget(server.net_ip, server.http_port, '/charge_callback', {
			roleid: roleId,
			sdorderno: order_id,
			sdpayno: "",
			jade: jade,
			money: money,
		}, (ret: any, data: any) => {
			callback(MsgCode.SUCCESS, `代理充值${money}元成功!`);
		});
	}
}
