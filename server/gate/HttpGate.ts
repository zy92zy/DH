import { MsgCode } from "../game/role/EEnum";
import ServerMgr from "./ServerMgr";
import TokenMgr from "./TokenMgr";
import FrozenIPMgr from "./FrozenIPMgr";
import FrozenMacMgr from "./FrozenMacMgr";
import DB from "../utils/DB";
import WhiteListMgr from "./WhiteListMgr";
import Charge from "../utils/Charge";
import Http from "../utils/Http";
import GateAgentMgr from "./GateAgentMgr";
import GoodsMgr from "../game/item/GoodsMgr";
// 网络请求
import bodyParser from "body-parser";
import express from "express";
import { Express, Request, Response } from "express";
import DataUtil from "../gear/SKDataUtil";
import SKDataUtil from "../gear/SKDataUtil";
import SKLogger from "../gear/SKLogger";
import GTimer from "../common/GTimer";
import ChargeConfig from "../game/core/ChargeConfig";
import ChatLitenMgr from "./ChatLitenMgr";
import GameUtil from "../game/core/GameUtil";
import Log from "../utils/Log";
const schedule = require('node-schedule');
// 解决当FormData表单上传数据POST接收不到参数
const multiparty = require('connect-multiparty')();
export default class HttpGate {
    static shared = new HttpGate();

    app: Express;
    admin: Express;
    AccountRegisterList: any = {};
    createList: any = {};
    chargeActivityState: any = {}; // 充值活动是否开启的状态 
    payUserKey: string = "";
    reportKey: string[] = [];
    funlist: any;

    notice: string = "1111！";

    constructor() {
        this.app = express();
        this.admin = express();
        this.app.use(express.static(__dirname + '/public'))

        let obj = [this.app,this.admin];
        for(let i = 0; i < obj.length; i++){
            obj[i].use(function (req: Request, res: Response, next: any) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Expose-Headers", "'Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With");
                res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
                res.header("X-Powered-By", ' 3.2.1');
                res.header("Content-Type", "application/json;charset=utf-8");
                next();
            });
            obj[i].use(bodyParser.json({ limit: "1mb" }));
            //obj[i].use(multipart.urlencoded({ limit: "1mb", extended: true }));
        }

    }

    //游戏服务器注册
    registerServer(req: any, res: any) {
        if(MsgCode.SING != req.query.key){
            console.log('GATE密码不匹配');
            return;
        }
        let id = req.query.id;
        let ip = req.query.ip;
        let fake = req.query.fake;
        let port = req.query.port;
        let hport = req.query.http_port;
        let name = req.query.name;
        let wan = req.query.wan;
        let ret = ServerMgr.shared.serverReg(id, ip, fake, port, hport, wan, name);
        console.log('游戏服务器注册:', id, ip, fake, port, hport, wan, name);
        Http.reply(res, {
            result: ret ? MsgCode.SUCCESS : MsgCode.FAILED,
            //tokens: TokenMgr.shared.getAllToken(),
        });
    };
    //ping服务器
    pingServer(req: any, res: any) {
        if(MsgCode.SING != req.query.key){
            console.log('GATE密码不匹配');
            return;
        }
        let id = req.query.id;
        let n = req.query.num;
        let ret = ServerMgr.shared.serverPing(id, n);
        Http.reply(res, {
            result: ret,
        });
    };

    /*
    * 根据serverid获取server列表
    * @param serverid 服务器id
    */
    getServerListByServerid(serverid: number) {
        let server_list = [];
        let servers = ServerMgr.shared.getServerList();
        if (serverid == 0) {
            for (let key in servers) {
                server_list.push(servers[key]);
            }
        }
        else {
            let server = ServerMgr.shared.getServer(serverid);
            if (server) {
                server_list.push(server);
            }
        }
        return server_list;
    }
    // 通过连接 获取客户端ip
    getClientIP(req: any, res: any): string {
        var ip = req.headers['x-forwarded-for'] ||
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '';
        ip = ip.replace(/::ffff:/, '');
        if (ip.split(',').length > 0) {
            ip = ip.split(',')[0];
        }
        return ip;
    }
    // 注册请求
    register(req: any, res: any) {
        if (GameUtil.isClose) {
            Http.reply(res, {
                code: MsgCode.NETWORK_ERROR,
                msg: "游戏关服维护中,请稍候注册!"
            });
            return;
        }
        let account = req.query.account;
        let password = req.query.password;
        let invitecode = req.query.invitecode;
        if (this.AccountRegisterList[account]) {
            Http.reply(res, {
                code: MsgCode.INVITE_CODE_ERR,
                msg: `已注册`
            });
            return;
        }
        let ip = this.getClientIP(req, res);
        if(!FrozenIPMgr.shared.checkip(ip)){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `请求过于频繁`
            });
            return;
        }
        let ban_time = FrozenIPMgr.shared.isbanip(ip);
        if (ban_time) {
            Http.reply(res, {
                code: MsgCode.INVITE_CODE_ERR,
                msg: `您的访问过于频繁,账号被封禁到${ban_time}`
            });
            return;
        }
        if (!FrozenIPMgr.shared.checkIP(ip)) {
            Http.reply(res, {
                code: MsgCode.INVITE_CODE_ERR,
                msg: `禁止注册`
            });
            return;
        }
        
        let data = {
            account : account,
            password : password,
            invitecode : invitecode,
        };
        let rule = {
            account : "^[a-z0-9A-Z]{6,16}$",
            password : "^[a-z0-9A-Z]{6,16}$",
            invitecode : "^[a-z0-9A-Z]+$",
        };

        if(!this.checkVal(data, rule)){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `账号和密码必须是6-16位的字母或数字!`,
                roleid: 0,
            });
            return;
        }
        

        // 检查邀请码
        if (!GateAgentMgr.shared.isCodeEnable(invitecode)) {
            Http.reply(res, {
                code: MsgCode.INVITE_CODE_ERR,
                msg: `无效的邀请码`
            });
            return;
        }
        // let last_reg_time = RegisterIPList[ip];
        let nowtime = Date.now();
        // if (last_reg_time) {
        //     if (nowtime - last_reg_time < 3 * 60 * 1000) {
        //         let retdata = {
        //             result: MsgCode.REGISTER_ACCOUNT_REPEAT
        //         };
        //         Http.reply(res, retdata);
        //         return;
        //     }
        // }
        this.AccountRegisterList[account] = {
            account: account,
            password: password,
            invitecode: invitecode,
            reqtime: nowtime,
            ip: ip,
            state: 0,
            safecode: null,
        }
        // RegisterIPList[ip] = nowtime;
        DB.accountRegister({
            account: account,
            password: password,
            invitecode: invitecode
        }, (code: number, msg: string) => {
            delete this.AccountRegisterList[account];
            Http.reply(res, {
                code: code,
                msg: msg
            });
        });
    }


    //从MAC中获取sign字符串
    //账号的位数-3 = 分割mac的起点 
    //密码的位数+1 = 分割mac的终点
    //如果位数一样则账号+1  如果账号长度<密码 则反过来
    //反转maca.split('').reverse().join('')  作为sign
    //将切割下来的mac反转后 前后颠倒拼接
    login_sign(account:string, password:string, mac:string, sign: string) :boolean{
        if(mac.length != 32||sign==undefined) 
            return false;
        let al = account.length -3;
        let pl = password.length +1;
        let _sign = '';
        if(pl - al>0){
            let e = pl - al;
            _sign = mac.substr(al, e > 7 ? e : e + 5);
        }else{
            let e = -(pl - al);
            _sign = mac.substr(pl-2, e > 7 ? e : e + 5);
        }
        _sign = _sign.split('').reverse().join('')
        sign = sign.substr(0, _sign.length);
        //console.log(_sign + " : " + sign)
        return _sign == sign;
    }


    // 玩家登录
    login(req: any, res: any) {
        if (GameUtil.isClose) {
            Http.reply(res, {
                code: MsgCode.NETWORK_ERROR,
                msg: "游戏关服维护中,请稍候登录!"
            });
            return;
        }
        let account = req.query.account;
        let password = req.query.password;
        let gametype = req.query.gametype;
        let version = req.query.version;
        let mac = req.query.mac;
        let sign = req.query.sign;
        let time = req.query.time;
        let ip = this.getClientIP(req, res);
        let ban_time = FrozenIPMgr.shared.isbanip(ip);
        if (ban_time) {
            Http.reply(res, {
                code: MsgCode.INVITE_CODE_ERR,
                msg: `您的访问过于频繁,账号被封禁到${ban_time}`
            });
            return;
        }
        if(!FrozenIPMgr.shared.checkip(ip)){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `请求过于频繁`
            });
            return;
        }
        let data = {
            account : account,
            password : password,
            mac : mac,
            version: version,
        };
        let rule = {
            account : "^[a-z0-9A-Z]{5,16}$",
            password : "^[a-z0-9A-Z]{5,16}$",
            mac : "^[0-9a-zA-Z]+$",
            version: "^[0-9\.]+$"
        };


        let param = {
            account: account,
            password: password,
            time: time,
            key : 'VscQ2P9iBcZ2d'
        };
        if (SKDataUtil.signStr(param) != sign){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `验证失败`,
            });
            return
        }
        if(!this.checkVal(data, rule)){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `数据异常`,
                roleid: 0,
            });
            SKLogger.warn(`接收到异常数据`);
            return;
        }

        if (!FrozenIPMgr.shared.checkIP(ip)) {
            console.warn(`$警告:帐号${account}登录失败:被禁IP${ip}`);
            Http.reply(res, {
                code: MsgCode.FORZEN_IP,
                msg: "您的帐号IP被冰结!"
            });
            return;
        }
        if (!FrozenMacMgr.shared.checkMAC(mac)) {
            console.warn(`$警告:帐号${account}登录失败:被禁MAC${mac}`);
            Http.reply(res, {
                code: MsgCode.FORZEN_MAC,
                msg: "您的帐号MAC被冰结!"
            });
            return;
        }
        if (DataUtil.checkVersion(version, GameUtil.loginVersion) < 0) {
            let info = `您的游戏端版本号${version}过低,为更好的游戏体验请退出游戏重新下载游戏!`;
            console.warn(`$警告:帐号${account}登录失败:版本号[${version}]过低`);
            Http.reply(res, {
                code: MsgCode.LOGIN_LOW_VERSION,
                msg: info
            });
            return;
        }
        // if(!this.login_sign(account, password, mac, sign)){
        //     console.warn(`$警告:帐号${account} SIGN验证失败`);
        //     Http.reply(res, {
        //         code: MsgCode.FAILED,
        //         msg: '登录失败'
        //     });
        //     return;
        // }

        SKLogger.debug(`玩家[${account}]读表登录...`);
        DB.accountLogin({
            account: account,
            password: password,
            ip: ip,
            mac: mac,
        }, (code: number, msg: string, data: any) => {
            let result: any = {
                code: code,
                msg: msg
            };
            if (code == MsgCode.SUCCESS) {
                result.accountid = data.accountid;
                result.account = data.account;
                if (data.state == 1) {
                    SKLogger.warn(`$警告:玩家[${account}]登录失败:被加入黑名单`);
                    result.code = MsgCode.NETWORK_ERROR;
                    result.msg = "被加入黑名单";
                }
                if (data.state == 0) {
                    let token = TokenMgr.shared.makeSecret(data.accountid);
                    result.token = token;
                    Log.login(data.accountid, ip);
                    SKLogger.debug(`玩家[${account}]读表登录成功:${token}`);
                }else{
                    SKLogger.debug(`玩家[${account}]读表登录状态错误${data.state}`);
                }
            }else{
                SKLogger.debug(`玩家[${account}]读表登录失败${code}`);
            }
            Http.reply(res, result);
        });
    }
    //公告获取
    get_comment(req: any, res: any){
        Http.reply(res,{
            code: MsgCode.SUCCESS,
            text: ''
        });
    }

    /*
     * 修改密码
     */
    changePassword(req: any, res: any) {
        if (GameUtil.isClose) {
            Http.reply(res, {
                code: MsgCode.NETWORK_ERROR,
                msg: "游戏关服维护中,请稍候修改密码!"
            });
            return;
        }
        let account = req.query.account;
        let safecode = req.query.safecode;
        let password = req.query.password;
        let verify = true;
        if (safecode.length < 4 || safecode.length > 12 || !/^[a-zA-Z0-9]*$/.test(safecode)) {
            verify = false;
        }
        if (account.length < 6 || account.length > 20 || !/^[a-zA-Z0-9]*$/.test(account) || /^[0-9]*$/.test(account)) {
            verify = false;
        }
        if (password.length < 6 || password.length > 20 || !/^[a-zA-Z0-9]*$/.test(password)) {
            verify = false;
        }
        if (!verify) {
            Http.reply(res, { errcode: MsgCode.FAILED });
        }
        else {
            DB.accountChangePassword({
                account: account,
                safecode: safecode,
                password: password,
            }, (ret: any) => {
                Http.reply(res, { errcode: ret });
            });
        }
    }
    /**
     * 服务器列表获取
     */
    serList(req: any, res: any) {
        let accountid = req.query.accountid;
        if(accountid == undefined || !/^\d+$/.test(accountid)){
            Http.reply(res, {result: MsgCode.LOGIN_NO_TOKEN});
            return;
        }

        // 设置推荐服
        let guideList = ServerMgr.shared.getGuideList();
        SKLogger.debug(`玩家[${accountid}]读取服务器列表...`);
        let guides: any = {};
        for (let sid in guideList) {
            if (guideList.hasOwnProperty(sid)) {
                let server = guideList[sid];
                let item = {
                    id: server.sid,
                    servername: server.name,
                    ip: 0, //net_ip,
                    port: 0, //net_port,
                };
                guides[item.id] = item;
            }
        }
        let serverList = ServerMgr.shared.getServerList();
        let servers: any = {};
        for (let sid in serverList) {
            if (serverList.hasOwnProperty(sid)) {
                let server = serverList[sid];
                let item = {
                    id: server.sid,
                    servername: server.name,
                    ip: 0, //net_ip,
                    port: 0, //net_port,
                };
                servers[item.id] = item;
            }
        }
        let retdata: any = {
            guideList: guides,
            serverList: servers,
            roleList: [],
        };
        DB.getServerListByAccountId(accountid, (code: any, dbdata: any) => {
            if (code == MsgCode.SUCCESS) {
                for (let data of dbdata) {
                    let rinfo = {
                        accountid: data.accountid,
                        roleid: data.roleid,
                        name: data.name,
                        race: data.race,
                        sex: data.sex,
                        level: data.level,
                        serverid: data.serverid,
                        resid: data.resid,
                        mapid: data.mapid,
                    };
                    retdata.roleList.push(rinfo);
                }
                retdata.result = code;
            }
            SKLogger.debug(`玩家[${accountid}]读取服务器列表完成${code}`);
            Http.reply(res, retdata);
        });
    }

    checkVal(data:any, rule: any){
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if(!new RegExp(rule[key]).test(data[key]))
                    return false;
            }
        }
        return true;
    }

    // 创建角色
    createRole(req: any, res: any) {
        if (GameUtil.isClose) {
            Http.reply(res, {
                code: MsgCode.NETWORK_ERROR,
                msg: "游戏关服维护中,请稍候注册角色!"
            });
            return;
        }
        let ip = this.getClientIP(req, res);
        if(!FrozenIPMgr.shared.checkip(ip)){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `请求过于频繁`
            });
            return;
        }
        let name = req.query.name;
        let race = req.query.race;
        let sex = req.query.sex;
        let accountid = req.query.accountid;
        let serverid = req.query.serverid;
        let resid = req.query.resid;
        let namelimit = ['江湖', '如来', '第一人','管理', '技术', '精灵', '托', '客服', '党', '西游'];
        for (let ln of namelimit) {
            if (name.indexOf(ln) != -1) {
                Http.reply(res, {
                    code: MsgCode.FAILED,
                    msg: `非法角色名称`,
                    roleid: 0,
                });
                SKLogger.warn(`创建角色:[${accountid}:${name}]角色名非法!`);
                return;
            }
        }
        let data = {
            race : race,
            sex : sex,
            accountid : accountid,
            serverid : serverid,
            resid : resid,
        };
        let rule = {
            race : "^[0-9]+$",
            sex : "^[0-9]+$",
            accountid : "^[0-9]+$",
            serverid : "^[0-9]+$",
            resid : "^[0-9]+$",
        };
        if(!this.checkVal(data, rule)){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `字母或数字!`,
                roleid: 0,
            });
            SKLogger.warn(`接收到异常数据`);
            return;
        }

        if(!SKDataUtil.CheckName(name)){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `请填写2-8个汉字`,
                roleid: 0,
            });
            SKLogger.warn(`创建角色:[${accountid}:${name}]角色名非法!`);
            return;
        }
        let checkname = GameUtil.checkLimitWord(name);
        if (!checkname) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `角色名称已存在`,
                roleid: 0,
            });
            SKLogger.warn(`创建角色:[${accountid}:${name}]角色名不合要求!`);
            return;
        }
        let roleData = {
            name: name,
            race: race,
            sex: sex,
            accountid: accountid,
            serverid: serverid,
            resid: resid,
        };
        let nowtime = Date.now();
        let createTime = this.createList[accountid * 10000 + serverid];
        if (createTime != null && (nowtime - createTime) < 10 * 1000) {
            res.end();
            SKLogger.warn(`创建角色:[${accountid}:${name}]超时返回!`);
            return;
        }
        this.createList[accountid * 10000 + serverid] = nowtime;
        DB.insertRole(roleData, (code: any, roleId: any) => {
            delete this.createList[accountid * 10000 + serverid];
            Http.reply(res, {
                code: code,
                msg: `创建角色${code == MsgCode.SUCCESS ? "成功" : "失败"}`,
                roleid: roleId,
            });
            SKLogger.debug(`创建角色:[${accountid}:${name}]${code == 0 ? "成功" : "失败"}`);
        });
    }
    /**
     *  进入某个服务器
     *  req 
     *      accountid
     *      serverid
     *  res 
     *      result: errorcode
     *      ip:
     *      port
     */
    // 登录游戏服务器
    toServer(req: any, res: any) {
        if (GameUtil.isClose) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: "游戏关服维护中,请稍候进入!"
            });
            return;
        }
        let ip = this.getClientIP(req, res);
        if(!FrozenIPMgr.shared.checkip(ip)){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `请求过于频繁`
            });
            return;
        }
        let accountId = req.query.accountId;
        let roleId = req.query.roleId;
        let serverId = req.query.serverId;
        let token = TokenMgr.shared.getSecretByAccountId(accountId);
        if (token == null) {
            console.warn(`玩家[${roleId}]登录Token不存在!`);
            Http.reply(res, {
                code: MsgCode.LOGIN_NO_TOKEN,
                msg: `你需要重新登录获得Token!`,
            });
        } else {
            let server = ServerMgr.shared.getServer(serverId);
            if (server == null) {
                console.warn(`玩家[${roleId}]登录服务器[${serverId}]不存在!`);
                Http.reply(res, {
                    code: MsgCode.LOGIN_NO_SERVER,
                    result: `登录服务器不存在,请稍候重试!`
                });
            } else {
                Http.sendget(server.wan, server.http_port, "/admin", {
                    mod: "login_token",
                    sign: MsgCode.GMSIGN,
                    accountid: accountId,
                    roleid: roleId,
                    token: token,
                }, (success: boolean, data: any) => {
                    console.log(`玩家[${roleId}][${ip}]登录服务器[${server.fake_ip}:${server.net_port}]成功!`);
                    Http.reply(res, {
                        code: success ? MsgCode.SUCCESS : MsgCode.FAILED,
                        ip: server.fake_ip,
                        port: server.net_port,
                        token: token,
                    });
                });
            }
        }
    }

    getWX(req: any, res: any) {
        DB.dbGETWX((isback: any, dbdata: any) => {
            Http.reply(res, dbdata);
        });
    }


    //后台入口管理
    gm(req: any, res: any){
        //获取签名

        let sign = req.query.sign;
        //检查签名是否存在
        if(sign != MsgCode.SING){
            SKLogger.info(`GM接口访问异常 SIGN错误: ${sign}`);
            Http.reply(res,{
                code: MsgCode.FAILED,
                msg: "非法请求"
            });
            return;
        }
        let mod = req.query.mod;
        if(!this.funlist[mod]){
            Http.reply(res,{
                code: MsgCode.FAILED,
                msg: `${mod}功能模块不存在`
            });
            SKLogger.info(`${mod}功能模块不存在`);
            return;
        }
        this.funlist[mod](req,res);
    }
    /*
     * 充值活动(双倍活动)
     * @param req.query.start 开始时间
     * @param req.query.end 结束时间
     * @param req.query.serverid 服务器id 0为所有服务器
     */
    setChargeActivity(req: any, res: any) {
        let cur_tm = (new Date()).getTime();
        Http.reply(res, {
            errcode: (cur_tm < req.query.end) ? 0 : 1,
        });
        if (cur_tm >= req.query.end) {
            return;
        }
        let ip = this.getClientIP(req, res);
        if (ip != GameUtil.serverConfig.HTTP.IP) {
            return;
        }

        let send_data: any = {
            mod: "set_charge_activity",
            sign: MsgCode.GMSIGN,
            start: parseInt(req.query.start),
            end: parseInt(req.query.end),
        };
        let callback = (ret: any, data: any) => {
            // console.log(ret, data);
        };
        let serverid = req.query.serverid;
        let server_list = this.getServerListByServerid(serverid);
        for (let server of server_list) {
            Http.sendget(
                server.wan,
                server.http_port,
                '/admin',
                send_data,
                callback
            );
            this.chargeActivityState[server.sid] = {
                state: 0,
                start: req.query.start,
                end: req.query.end,
            };
        }
    }

    /*
     * 打开充值活动
     */
    openChargeActivity(req: any, res: any) {
        Http.reply(res, {
            errcode: 0,
        });
        let ip = this.getClientIP(req, res);
        if (ip != GameUtil.serverConfig.HTTP.IP) {
            return;
        }
        let serverid = req.query.serverid;
        if (serverid == 0) {
            let servers = ServerMgr.shared.getServerList();
            for (let key in servers) {
                if (this.chargeActivityState[key]) {
                    this.chargeActivityState[key].state = 1;
                }
            }
        }
        else {
            if (this.chargeActivityState[serverid]) {
                this.chargeActivityState[serverid].state = 1;
            }
        }
    }

    /*
     * 关闭充值活动
     * @param req.query.serverid 服务器id 0为所有服务器
     */
    closeChargeActivity(req: any, res: any) {
        Http.reply(res, {
            errcode: 0,
        });
        let ip = this.getClientIP(req, res);
        if (ip != GameUtil.serverConfig.HTTP.IP) {
            return;
        }
        let serverid = req.query.serverid;
        if (serverid == 0) {
            let servers = ServerMgr.shared.getServerList();
            for (let key in servers) {
                if (this.chargeActivityState[key]) {
                    this.chargeActivityState[key].state = 0;
                }
            }
        }
        else {
            if (this.chargeActivityState[serverid]) {
                this.chargeActivityState[serverid].state = 0;
            }
        }

        let server_list = this.getServerListByServerid(serverid);
        let callback = (ret: any, data: any) => {
            // console.log(ret, data);
        };
        for (let server of server_list) {
            Http.sendget(
                server.wan,
                server.http_port,
                '/admin',
                {
                    mod: "closeChargeActivity",
                    sign: MsgCode.GMSIGN,
                },
                callback
            );
        }
    }

    /*
     * 查询充值活动
     */
    getChargeActivity(req: any, res: any) {
        Http.reply(res, this.chargeActivityState);
    }

    /*
     * 充值请求接口
     */
    charge(req: any, res: any) {
        // let send_data = {
        //     code: MsgCode.FAILED,
        //     data: '',
        //     msg: '线上充值关闭'
        // };
        // Http.reply(res, send_data);
        // return;

        let roleid = req.query.roleid;
        let goodsid = req.query.goodsid;
        let goodscount = 1;
        let pay_bankcode = parseInt(req.query.pay_bankcode);
        let money = parseInt(req.query.money);
        let rule = {
            roleid: "^[0-9]+$",
            goodsid: "^[0-9]+$",
            goodscount: "^[0-9]+$",
            pay_bankcode: "^[0-9]+$",
            money: "^[0-9]+$",
        };
        this.checkVal(req.query, rule) ?
        Charge.shared.createOrder(roleid, goodsid, goodscount, pay_bankcode, money, this.chargeActivityState, (ret: any, data: any) => {
            let send_data = {
                code: (ret) ? MsgCode.SUCCESS : MsgCode.FAILED,
                data: data,
            };
            Http.reply(res, send_data);
        }) : SKLogger.warn(`充值请求异常 goodsid=${goodsid}, pay_bankcode=${pay_bankcode}, money=${money}`);
    }
    // 代理充值
    agentCharge(req: any, res: any) {
        let roleid = req.query.role_id;
        let charge_id = parseInt(req.query.charge_id);
        if(isNaN(charge_id)){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: '代理充值,无效的charge_id参数',
            });
        }
        let count = parseInt(req.query.count);
        if (!count) {
            count = 1;
        }
        if (charge_id == 0) {
            Charge.shared.freeChargeMoney(roleid, count, this.chargeActivityState, (code: number, msg: string) => {
                Http.reply(res, {
                    code: code,
                    msg: msg,
                });
            });
        }else{
            Charge.shared.agentCharge(roleid, charge_id, count, this.chargeActivityState, (code: number, msg: string) => {
                Http.reply(res, {
                    code: code,
                    msg: msg,
                });
            });
        }
        
    }
    // 代理充值
    freeCharge(req: any, res: any) {
        let roleid = req.query.role_id;
        let jade = parseInt(req.query.jade);
        if (!jade) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: '仙玉必须是数字',
            });
        }
        Charge.shared.freeCharge(roleid, jade, (code: number, msg: string) => {
            Http.reply(res, {
                code: code,
                msg: msg,
            });
        });
    }

    //手工充值，无订单记录
    charge_s(req: any, res: any){
        let roleid = req.query.role_id;
        let charge_id = parseInt(req.query.charge_id);
        if (!charge_id) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: '手工充值,无效的charge_id参数',
            });
        }
        let count = parseInt(req.query.count);
        if (!count) {
            count = 1;
        }
        let list = ChargeConfig.shared.charge_list;
        if (charge_id < 1 || charge_id > list.length+1) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: '手工充值:charge_id配置没有找到!',
            });
        }
        let data = list[charge_id - 1];
        let jade = (data.jade + data.ex_jade) * count;
        let money = data.money * count;
        let order_id = Charge.shared.getAgentOrderid20();

        ServerMgr.shared.sendServer(roleid, '/admin', {
            mod: "charge_callback",
            sign: MsgCode.GMSIGN,
            roleid: roleid,
			sdorderno: order_id,
			sdpayno: "",
			jade: jade,
			money: money,
        }, (success: boolean, data: any) => {
            if (success) {
                Http.reply(res, {
                    code: MsgCode.SUCCESS,
                    msg: '手工充值成功！',
                });
            } else {
                Http.reply(res, {
                    code: MsgCode.SUCCESS,
                    msg: '手工充值失败！',
                });
            }
        });
    }

    //充值异步回调
    payNotify(req: any, res: any) {
        Charge.shared.pay_notify(req, res);
    }

    //充值同步跳转
    payReturn(req: any, res: any) {
        Charge.shared.pay_return(req, res);
    }
    // 获得公告
    async getComment(req: any, res: any) {
        let ip = this.getClientIP(req, res);
        if(!FrozenIPMgr.shared.checkip(ip)){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `请求过于频繁`
            });
            return;
        }
        let serverId = 0;
        if (req.serverId && /^\d+$/.test(req.serverId)) {
            serverId = req.serverId;
        }
        DB.getComment(serverId, (code, text) => {
            if (text) {
            } else {
                text = "";
            }
            Http.reply(res, {
                code: MsgCode.SUCCESS,
                text: text,
            });
        })
    }
    // 设置公告
    setComment(req: any, res: any) {
        let serverId = req.query.serverId;
        if (!serverId) {
            serverId = 0;
        }
        let text: string = req.query.text;
        if (text.length < 1) {
            return;
        }
        text = decodeURI(text);
        DB.setComment(serverId, text, (code: number) => {
            Http.reply(res, {
                code: code,
            });
        })
    }

    sysNotice(req: any, res: any) {
        let text = String(req.query.text);
        if (!text || text.length < 1) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: "通知文本不能为空"
            });
            return;
            return;
        }
        let type = req.query.type; // 1 走马灯 2 聊天框 3 走马灯 + 聊天框
        let serverid = req.query.server_id; // 0 则全服公告
        let times = req.query.times; // -1 则永久公告 需入库
        if (!times || isNaN(times)) {
            times = 1;
        }
        let interval = req.query.interval; // 单位 秒
        text = decodeURIComponent(text);

        let server_list = [];
        if (serverid == 0) {
            let servers = ServerMgr.shared.getServerList();
            for (let key in servers) {
                server_list.push(servers[key]);
            }
        } else {
            let server = ServerMgr.shared.getServer(serverid);
            if (server)
                server_list.push(server);
        }
        if (server_list.length == 0) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: "发送系统通知找不到服务器"
            });
            return;
        }
        Http.reply(res, {
            code: MsgCode.SUCCESS,
            msg: `发送系统通知:${text}到${serverid}成功!`
        });
        for (let server of server_list) {
            Http.sendget(server.wan, server.http_port, '/admin', {
                mod: "sys_notice",
                sign: MsgCode.GMSIGN,
                text: text,
                type: type,
                times: times,
                interval: interval,
            }, (ret: any) => {
            });
        }
        if (times == -1) {
            DB.addScrollNotice(serverid, type, text);
        }
    }

    onlineNum(req: any, res: any) {
        let numinfo = [];
        let list = ServerMgr.shared.getServerList();
        for (const sid in list) {
            if (list.hasOwnProperty(sid)) {
                const server = list[sid];
                let n = server.getPlayerNum();
                numinfo.push({
                    id: server.sid,
                    name: server.name,
                    num: n,
                });
            }
        }
        Http.reply(res, {
            info: SKDataUtil.toJson(numinfo),
        });
    }

    notSpeak(req: any, res: any) {
        let roleid = req.query.role_id;

        ServerMgr.shared.sendServer(roleid, '/admin', {
            mod: "can_speak",
            sign: MsgCode.GMSIGN,
            roleid: roleid,
            state: 1
        }, (success: boolean, data: any) => {
            if (success) {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.SUCCESS,
                    msg: `${roleid}禁言成功`,
                }));
            } else {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.FAILED,
                    msg: `${roleid}禁言失败:${success}`,
                }));
            }
        });
    }

    canSpeak(req: any, res: any) {
        let roleid = req.query.role_id;
        ServerMgr.shared.sendServer(roleid, '/admin', {
            mod: "can_speak",
            sign: MsgCode.GMSIGN,
            roleid: roleid,
            state: 0
        }, (success: boolean, data: any) => {
            if (success) {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.SUCCESS,
                    msg: `${roleid}解除禁言成功`,
                }));
            } else {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.FAILED,
                    msg: `${roleid}解除禁言失败:${success}`,
                }));
            }
        });
    }

    setGuideServer(req: any, res: any) {
        let serverid = req.query.serverid;
        let pServer = ServerMgr.shared.getServer(serverid);
        if (pServer == null || pServer.is_reg == false || !/^\d+$/.test(serverid)) {
            Http.reply(res, {
                ret: 'faild',
            });
            return;
        }
        DB.setGuideServerID(serverid);
        GameUtil.serverConfig.guideServerID = serverid;
        Http.reply(res, {
            ret: 'success',
        });
    }

    //封号
    FreezePlayer(req: any, res: any){
        let role_id = req.query.role_id;
        let state = req.query.state;

        ServerMgr.shared.sendServer(role_id,'/admin',{
            mod: 'freeze_player',
            sign: MsgCode.GMSIGN,
            role_id: role_id,
            state: state
        },(success: boolean, data: any)=>{
            if(success){
                Http.reply(res,{
                    code: MsgCode.SUCCESS,
                    msg: `角色${role_id}封号成功`,
                });
                return;
            }
            Http.reply(res,{
                code: MsgCode.FAILED,
                msg: `角色${role_id}封号失败:${success}`,
            });
        });
        
    }

    frozenIP(req: any, res: any) {
        let fip = req.query.frozen_ip;
        if (!fip) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `封禁失败，需要有效的frozen_ip参数!`
            });
            return;
        }
        let ip = this.getClientIP(req, res);
        let list = ServerMgr.shared.getServerList();
        let find = false;
        for (let serverid in list) {
            let server = list[serverid];
            if (server.net_ip == ip) {
                find = true;
                break;
            }
        }
        if (!find) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `${fip}尝试攻击服务器的封IP!`
            });
            return;
        }
        FrozenIPMgr.shared.addFrozenIP(fip);
        //通知当前IP下的所有玩家下线
        DB.getFrozenIpRoleid(fip, (ret: any, ipList: any) => {
            if (ret == MsgCode.SUCCESS) {
                let roleList = [];
                for (let ip of ipList) {
                    roleList.push(ip.roleid);
                }
                ServerMgr.shared.sendAllServer('/admin', {
                        mod: "kicked_out",
                        sign: MsgCode.GMSIGN,
                    roleids: roleList,
                });
            }
        });
        Http.reply(res, {
            code: MsgCode.SUCCESS,
            msg: `封禁${fip}成功!`
        });
    }
    // 解封IP
    unfrozenIP(req: any, res: any) {
        let fip = req.query.frozen_ip;
        let ip = this.getClientIP(req, res);
        let list = ServerMgr.shared.getServerList();
        let find = false;
        for (let serverid in list) {
            let server = list[serverid];
            if (server.net_ip == ip) {
                find = true;
                break;
            }
        }
        if (!find) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `${fip}尝试攻击服务器的解封IP!`
            });
            return;
        }
        FrozenIPMgr.shared.removeFrozenIP(fip);
        Http.reply(res, {
            code: MsgCode.SUCCESS,
            msg: `解封${fip}成功!`
        });
    }
    // 封设备
    frozenMAC(req: any, res: any) {
        let account_id = req.query.account_id;
        let gm_role_id = req.query.gm_role_id;
        if (!gm_role_id) {
            gm_role_id = 0;
        }
        DB.freezeMAC({
            account_id: account_id,
            gm_role_id: gm_role_id
        }, (code: number, msg: string, mac: string) => {
            if (mac && mac.length > 0) {
                FrozenMacMgr.shared.addFrozenMAC(mac);
                DB.getFrozenMacRoleid(mac, (ret: any, rows: any) => {
                    if (ret == MsgCode.SUCCESS) {
                        let roleList = [];
                        for (let data of rows) {
                            roleList.push(data.roleid);
                        }
                        ServerMgr.shared.sendAllServer('/admin', {
                            mod: "kicked_out",
                            sign: MsgCode.GMSIGN,
                            roleids: roleList,
                        });
                    }
                });
            }
            Http.reply(res, {
                code: code,
                msg: msg
            });
        });
    }

    // 解封设备
    unfrozenMAC(req: any, res: any) {
        let account_id = req.query.account_id;
        DB.unfreezeMAC({
            account_id: account_id
        }, (code: number, msg: string, mac: string) => {
            if (code == MsgCode.SUCCESS) {
                FrozenMacMgr.shared.removeFrozenMAC(mac);
                Http.reply(res, {
                    code: code,
                    msg: msg
                });
            }
        });
    }
    //接收聊天监控
    ChatLiten(req: any, res: any){
        let data = req.query.data;
        if(!data){
            Http.reply(res,{code:MsgCode.FAILED,msg:"fail"});
            return;
        }
        ChatLitenMgr.shared.sendChat(data);
        Http.reply(res,{code:MsgCode.SUCCESS,msg:"success"});
    }


    agentUpdate(req: any, res: any) {
        GateAgentMgr.shared.readItemFromDB();
        Http.reply(res, {
            code: MsgCode.SUCCESS,
        });
    }

    whiteip(req: any, res: any) {
        let wip = req.query.wip;
        let ip = this.getClientIP(req, res);
        if (!WhiteListMgr.shared.checkIn(ip) && ip != GameUtil.serverConfig.HTTP.IP) {
            Http.reply(res, {
                ret: `error`,
            });
            return;
        }
        WhiteListMgr.shared.addWhiteIP(wip);
        Http.reply(res, {
            ret: `添加白名单[${wip}]成功`,
        });
    }

    clearwip(req: any, res: any) {
        let ip = this.getClientIP(req, res);
        if (!WhiteListMgr.shared.checkIn(ip) && ip != GameUtil.serverConfig.HTTP.IP) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `清除白名单失败`
            });
            return;
        }
        WhiteListMgr.shared.clearAllIP();
        Http.reply(res, {
            code: MsgCode.SUCCESS,
            msg: `清除白名单完成！所有ip均可登陆`,
        });
    }
    // 清除玩家缓存
    clearPlayerCache(req: any, res: any) {
        let roleid = req.query.id;
        ServerMgr.shared.sendAllServer('/admin', {
            mod: "clear_pcache",
            sign: MsgCode.GMSIGN,
            roleid: roleid,
        });
        res.end(SKDataUtil.toJson({
            code: MsgCode.SUCCESS,
            msg: `操作完成`
        }));
    }
    // 加仙玉
    addJade(req: any, res: any) {
        let roleId = req.query.role_id;
        let jade = parseInt(req.query.jade);
        jade = Math.min(90000000, jade);
        let invite = req.query.invite;
        DB.addJade(roleId, jade, (code: number) => {
            if (code == MsgCode.SUCCESS) {
                ServerMgr.shared.sendServer(roleId, "/admin",{ 
                        mod: "add_jade",
                        sign: MsgCode.GMSIGN,
                        roleId: roleId,
                        jade: jade,
                        invite: invite 
                    },
                    (success: boolean, data: any) => {
                        if (success) {
                            res.end(SKDataUtil.toJson({
                                code: code,
                                msg: `${roleId}加仙玉${jade}成功`,
                            }));
                        } else {
                            res.end(SKDataUtil.toJson({
                                code: code,
                                msg: `${roleId}加仙玉${jade}失败`,
                            }));
                        }
                    })
                return;
            }
            res.end(SKDataUtil.toJson({
                code: code,
                msg: `${roleId}加仙玉${jade}失败`,
            }));
        })
    }
    // 加经验值
    addExp(req: any, res: any) {
        let roleId = req.query.role_id;
        let exp = parseInt(req.query.exp);
        exp = Math.min(999999999, exp);
        let invite = req.query.invite;
        if (!invite) {
            invite = "";
        }
        ServerMgr.shared.sendServer(roleId, '/admin', {
            mod: "add_exp",
            sign: MsgCode.GMSIGN,
            roleId: roleId,
            exp: exp,
            invite: invite
        }, (success: boolean, data: any) => {
            console.log(`${roleId}加经验${exp}:${success}`);
            if (success) {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.SUCCESS,
                    msg: `角色${roleId}加经验${exp}成功`,
                }));
            } else {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.FAILED,
                    msg: `角色${roleId}加经验${exp}失败:${data}`,
                }));
            }
        });
    }
    // 加道具
    addItem(req: any, res: any) {
        let roleId = req.query.role_id;
        let item = parseInt(req.query.item);
        if (isNaN(item)) {
            let msg=`角色[${roleId}]加道具,道具索引无效`;
            res.end(SKDataUtil.toJson({
                code: MsgCode.FAILED,
                msg: msg,
            }));
            SKLogger.debug(msg);
            return;
        }
        let num = parseInt(req.query.num);
        if (isNaN(item)) {
            let msg=`角色${roleId}加道具,数量无效`
            res.end(SKDataUtil.toJson({
                code: MsgCode.FAILED,
                msg: msg,
            }));
            SKLogger.debug(msg);
            return;
        }
        if (item == 90003) {
            num = Math.min(100000000, num);
        } else {
            num = Math.min(10000, num);
        }
        let invite = req.query.invite;
        if (!invite) {
            invite = "";
        }
        ServerMgr.shared.sendServer(roleId, '/admin', {
            mod: "add_item",
            sign: MsgCode.GMSIGN,
            roleId: roleId,
            item: item,
            num: num,
            invite: invite,
        }, (success: boolean, data: any) => {
            if (success) {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.SUCCESS,
                    msg: `${roleId}加道具成功,${item},数量${num}:${success}`,
                }));
            } else {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.FAILED,
                    msg: `${roleId}加道具失败,${item},数量${num}:${success}`,
                }));
            }
        });
    }
    
    // 获得物品列表
    getItemList(req: any, res: any) {
        let list = GoodsMgr.getItemList();
        res.end(SKDataUtil.toJson({
            code: MsgCode.SUCCESS,
            list: SKDataUtil.toJson(list),
        }));
    }

    //获得服务器列表
    getServList(req: any, res: any) {
        let list = ServerMgr.shared.getServerList();
        res.end(SKDataUtil.toJson({
            code: MsgCode.SUCCESS,
            list: SKDataUtil.toJson(list),
        }));
    }

    getChargeList(req: any, res: any){
        let list:any = [];
        for (const item of ChargeConfig.shared.charge_list) {
            list.push({
                id: item.id,
                name: item.name,
            })
        }
        res.end(SKDataUtil.toJson({
            code: MsgCode.SUCCESS,
            list: SKDataUtil.toJson(list),
        }));

    }


    //解散帮派
    jsbp(req: any, res: any){
        let id = req.query.id
        let roleId = req.query.role_id;
        ServerMgr.shared.sendServer(roleId, '/admin', {
            mod: "jsbp",
            sign: MsgCode.GMSIGN,
            roleId: roleId,
            id: id,
        }, (success: boolean, data: any) => {
            if (success) {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.SUCCESS,
                    msg: `${data.msg}`,
                }));
            } else {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.FAILED,
                    msg: `操作失败`,
                }));
            }
        });
    }
    // 加称谓
    addTitle(req: any, res: any) {
        // title = { "type": type, "titleid": titleId, "value": value, "onload": onload }
        let role_id = req.query.role_id;
        let type = req.query.type;
        if (!type) {
            type = 1;
        }
        let title_id = req.query.title_id;
        if (!title_id) {
            title_id = 1;
        }
        let value = req.query.value;
        let onload = req.query.onload;
        ServerMgr.shared.sendServer(role_id, '/admin', {
            mod: "add_title",
            sign: MsgCode.GMSIGN,
            role_id: role_id,
            type: type,
            title_id: title_id,
            value: value,
            onload: onload
        }, (success: boolean, data: any) => {
            if (success) {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.SUCCESS,
                    msg: `${role_id}加称谓成功,${success}`,
                }));
            } else {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.FAILED,
                    msg: `${role_id}加道具失败,${success}`,
                }));
            }
        });
    }
    // 提交异常日志
    report(req: any, res: any) {
        let params = req.body;
        let roleId = params.roleId;
        let msg = params.msg;
        if(!msg || msg == "" || msg.length < 1)
        {
            Http.reply(res, {code: 0});
            return;
        }
        msg.replace("\'", "\\\'");
        msg.replace("\"", "\\\"");
        if (this.reportKey.indexOf(msg) != -1) {
            Http.reply(res, {
                code: 1
            })
            return;
        }
        let version = params.version;
        if (!version) {
            version = "";
        }
        let platfrom = params.platform;
        let ip = this.getClientIP(req, res);
        Http.reply(res, {
            code: 0
        })
        console.warn(`$前端异常:角色索引[${roleId}]\n消息:${msg},\n版本:${version},平台:${platfrom},IP:${ip}`);
        this.reportKey.push(msg);
    }

    kickedOut(req: any, res: any) {
        let role_id = req.query.role_id;
        if (!role_id) {
            res.end(SKDataUtil.toJson({
                code: MsgCode.FAILED,
                msg: `缺少role_code参数!`,
            }));
        }
        ServerMgr.shared.sendAllServer('/admin', {
            mod: "kicked_out",
            sign: MsgCode.GMSIGN,
            roleids: [role_id],
        });
        res.end(SKDataUtil.toJson({
            code: MsgCode.SUCCESS,
            msg: `角色${role_id}被踢!`,
        }));
    }

    
    //刷新商城 全服刷新
    fresh_shop(req: any, res: any){
        let server_list = [];
        let servers = ServerMgr.shared.getServerList();
        for (let key in servers) {
            server_list.push(servers[key]);
        }
        server_list = server_list.filter(t => t.is_reg);
        if (server_list.length < 1) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `找不到在线的服务器!`
            });
            return;
        }
        let index = 0;
        for (let server of server_list) {
            Http.sendget(server.wan, server.http_port, '/admin', {
                mod: "fresh_shop",
                sign: MsgCode.GMSIGN,
            }, (code) => {
                index++;
                if (index == server_list.length) {
                    Http.reply(res, {
                        code: MsgCode.SUCCESS,
                        msg: "所有服务器商城已全部刷新"
                    });
                }
            });
        }
    }

    //刷新宝图出货表
    fresh_lottery(req: any, res: any){
        let server_list = [];
        let servers = ServerMgr.shared.getServerList();
        for (let key in servers) {
            server_list.push(servers[key]);
        }
        server_list = server_list.filter(t => t.is_reg);
        if (server_list.length < 1) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `找不到在线的服务器!`
            });
            return;
        }
        let index = 0;
        for (let server of server_list) {
            Http.sendget(server.wan, server.http_port, '/admin', {
                mod: "fresh_lottery",
                sign: MsgCode.GMSIGN,
            }, (code) => {
                index++;
                if (index == server_list.length) {
                    Http.reply(res, {
                        code: MsgCode.SUCCESS,
                        msg: "所有服务器宝图出货配置已全部刷新"
                    });
                }
            });
        }
    }

    //存档
    save(req: any, res: any){
        let server_id = req.query.server_id; // 0 则全服公告
        if (!server_id) {
            server_id = 0;
        }
        let server_list = [];
        if (server_id == 0) {
            let servers = ServerMgr.shared.getServerList();
            for (let key in servers) {
                server_list.push(servers[key]);
            }
        } else {
            let server = ServerMgr.shared.getServer(server_id);
            if (server) {
                server_list.push(server);
            }
        }

        server_list = server_list.filter(t => t.is_reg);
        if (server_list.length < 1) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `关服:找不到未开闭的服务器!`
            });
            return;
        }
        /*if (GameUtil.isClose) {
            Http.reply(res, {
                code: MsgCode.SUCCESS,
                msg: "关服:网关服务器已关闭"
            });
        }*/
        let index = 0;
        let msg = "";
        for (let server of server_list) {
            Http.sendget(server.wan, server.http_port, '/admin', {
                mod: "save",
                sign: MsgCode.GMSIGN,
            }, (code,data) => {
                if(code)
                    msg += `${data.msg}\r\n`;
                index++;
                if (index == server_list.length) {
                    Http.reply(res, {
                        code: MsgCode.SUCCESS,
                        msg: msg
                    });
                }
            });
        }
    }

    //设置GM权限
    setgm(req: any, res: any){
        let roleid = req.query.role_id;
        let level = req.query.level;
        ServerMgr.shared.sendServer(roleid, '/admin', {
            mod: "setgm",
            sign: MsgCode.GMSIGN,
            role_id: roleid,
            level: level,
        }, (success: boolean, data: any) => {
            if (success) {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.SUCCESS,
                    msg: `${roleid}设置GM权限成功,${success}`,
                }));
            } else {
                res.end(SKDataUtil.toJson({
                    code: MsgCode.FAILED,
                    msg: `${roleid}设置GM权限失败,${success}`,
                }));
            }
        });
    }


    //重置每日活动
    newDay(req: any, res: any){
        let roleid = req.query.role_id;
        if(!roleid){
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `角色ID错误!`
            });
            return;
        }
        ServerMgr.shared.sendServer(roleid,'/admin',{
            mod: 'new_day',
            role_id: roleid,
            sign: MsgCode.GMSIGN,
        },(success: boolean, data: any)=>{
            Http.reply(res, {
                code: data.code,
                msg: data.msg
            });
        });
    }

    // 关服
    close(req: any, res: any) {
        let server_id = req.query.server_id; // 0 则全服公告
        if (!server_id) {
            server_id = 0;
        }
        let server_list = [];
        if (server_id == 0) {
            let servers = ServerMgr.shared.getServerList();
            for (let key in servers) {
                server_list.push(servers[key]);
            }
        } else {
            let server = ServerMgr.shared.getServer(server_id);
            if (server) {
                server_list.push(server);
            }
        }
        server_list = server_list.filter(t => t.is_reg);
        if (server_list.length < 1) {
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: `关服:找不到未开闭的服务器!`
            });
            return;
        }
        /*if (GameUtil.isClose) {
            Http.reply(res, {
                code: MsgCode.SUCCESS,
                msg: "关服:网关服务器已关闭"
            });
        }*/
        GameUtil.isClose = true;
        let index = 0;
        for (let server of server_list) {
            Http.sendget(server.wan, server.http_port, '/admin', {
                mod: "close",
                sign: MsgCode.GMSIGN,
            }, (code) => {
                index++;
                if (index == server_list.length) {
                    Http.reply(res, {
                        code: MsgCode.SUCCESS,
                        msg: "关服:游戏服务器已全部关闭"
                    });
                }
            });
        }
    }

	pay_test(req: any, res: any){
        
    }


    //充值异步回调
    payNotify_wx(req: any, res: any) {
        Charge.shared.pay_notify_wx(req, res);
    }
    
    //充值异步回调
    payNotify_ali(req: any, res: any) {
        Charge.shared.pay_notify_ali(req, res);
    }
    //检查订单状态
    pay_state(req: any, res: any){
        let order = req.query.order; // 0 则全服公告
        if(order && /[a-z0-9A-Z]+/.test(order))
            DB.getOrderStatus(order, (status:boolean)=>{
                Http.reply(res, {
                    code: MsgCode.SUCCESS,
                    msg: status
                });
            })
        else
            Http.reply(res, {
                code: MsgCode.FAILED,
                msg: ""
            });

    }
    
    // 启动Http服务
    start(port: number) {
        let list: { [key: string]: (req: any, res: any) => void } = {
            ['register_server']: this.registerServer.bind(this),//注册服务器
            ['ping_server']: this.pingServer.bind(this),        //ping服务器
            ['guide_server']: this.setGuideServer.bind(this),   //
            ['register']: this.register.bind(this),             //账号注册
            ["login"]: this.login.bind(this),                   //账号登录
            ['create_role']: this.createRole.bind(this),        //创建角色
            ['ser_list']: this.serList.bind(this),              //服务器列表
            ['to_server']: this.toServer.bind(this),            //
            ['get_wx']: this.getWX.bind(this),                 //
            ['get_comment']: this.getComment.bind(this),       //公告
            ["charge"]: this.charge.bind(this),                 //充值请求接口
            ["pay_notify"]: this.payNotify.bind(this),          //充值异步回调接口
            ["pay_return"]: this.payReturn.bind(this),          //充值同步回调接口
            ['chat_liten']: this.gm.bind(this),
            ["pay_test"]: this.pay_test.bind(this),          //充值异步回调接口


            ["pay_state"]: this.pay_state.bind(this),          //检查订单状态
            ["payNotify_wx"]: this.payNotify_wx.bind(this),          //充值异步回调接口
            ["payNotify_ali"]: this.payNotify_ali.bind(this),          //充值异步回调接口
        };
        for (let key in list) {
            this.app.get('/' + key, list[key]);
        }

        this.app.post("/payNotify_wx",multiparty, this.payNotify_wx.bind(this));
        this.app.post("/payNotify_ali",multiparty, this.payNotify_ali.bind(this));

        this.app.post("/pay_notify",multiparty, this.payNotify.bind(this));
        this.app.post("/report",multiparty, this.report.bind(this));
        this.app.listen(port);
        console.log('HTTP服务启动开始监听端口:' + port);

        this.adminStart(port + 1000);
        
        this.ayNotify_wxStart(port+ 1);
    }

	ayNotify_wxStart(port:number){
	    var app = express(),
	    http = require('http'),
	    server = http.createServer(app),
	    xmlparser = require('express-xml-bodyparser');
	 
		// .. other middleware ...  
		app.use(express.json());
		app.use(express.urlencoded());
		app.use(xmlparser());
		// ... other middleware ...  
		let payNotify_wx = this.payNotify_wx;
		let payNotify_ali = this.payNotify_ali;
		
		app.post('/payNotify_wx', function(req:any, res:any, next:any) {
            payNotify_wx(req, res)
		});
		app.post('/payNotify_ali', function(req:any, res:any, next:any) {
            payNotify_ali(req, res)
		});
		 
		server.listen(port);
	}

    
    //启动后台HTTP服务
    adminStart(port:number){
        let agentMgr = GateAgentMgr.shared;
        this.funlist = {
            get_comment: this.getComment.bind(this),
            set_comment: this.setComment.bind(this),
            sys_notice: this.sysNotice.bind(this),
            online_num: this.onlineNum.bind(this),
            not_speak: this.notSpeak.bind(this),
            can_speak: this.canSpeak.bind(this),
            frozen_ip: this.frozenIP.bind(this),
            unfrozen_ip: this.unfrozenIP.bind(this),
            frozen_mac: this.frozenMAC.bind(this),
            unfrozen_mac: this.unfrozenMAC.bind(this),
            white_ip: this.whiteip.bind(this),
            clear_wip: this.clearwip.bind(this),
            clear_player_cache: this.clearPlayerCache.bind(this),
            change_password: this.changePassword.bind(this),
            set_charge_activity: this.setChargeActivity.bind(this),
            open_charge_activity: this.openChargeActivity.bind(this),
            close_charge_activity: this.closeChargeActivity.bind(this),
            get_charge_activity: this.getChargeActivity.bind(this),
            add_jade: this.addJade.bind(this),
            add_exp: this.addExp.bind(this),
            add_item: this.addItem.bind(this),
            get_item_list: this.getItemList.bind(this),
            get_serv_list: this.getServList.bind(this),
            get_charge_list: this.getChargeList.bind(this),
            // 代理管理接口
            agent_charge: this.agentCharge.bind(this),
            free_charge: this.freeCharge.bind(this),
            update_agent: this.agentUpdate.bind(this),
            agent_list: agentMgr.getAgentList.bind(agentMgr),
            // 加称谓
            add_title: this.addTitle.bind(this),
            kicked_out: this.kickedOut.bind(this),
            close: this.close.bind(this),
            report: this.report.bind(this),

            save: this.save.bind(this),
            setgm: this.setgm.bind(this),
            jsbp: this.jsbp.bind(this),

            freeze_player: this.FreezePlayer.bind(this),
            charge_s: this.charge_s.bind(this),
            chat_liten: this.ChatLiten.bind(this),
            fresh_shop: this.fresh_shop.bind(this),
            fresh_lottery: this.fresh_lottery.bind(this),
            new_day: this.newDay.bind(this)

        };

        //注意! admin访问方法是 http://url/admin?mod=方法

        this.admin.get("/admin",this.gm.bind(this));
        this.admin.post("/admin",this.gm.bind(this));
        this.admin.listen(port);

        console.log(`ADMIN服务启动 port=${port} SIGN=${MsgCode.SING}`);

        ChatLitenMgr.shared.start(port + 1);
    }
}
