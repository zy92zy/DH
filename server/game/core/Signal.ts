import GameUtil from "./GameUtil";
import PlayerMgr from "../object/PlayerMgr";
import Http from "../../utils/Http";
import SKLogger from "../../gear/SKLogger";
import { MsgCode } from "../role/EEnum";

export default class Signal {
    static shared=new Signal();
    registed:boolean;
    token_list:any;
    constructor() {
        this.registed = false;
        this.token_list = {};
    }
    // 向网关服务器发起Http请求
    sendToGate(event:any, data:any, callback:any) {
        if(!callback){
            callback = ()=>{}
        }
        Http.sendget(GameUtil.serverConfig.GAME.GATE_IP, GameUtil.serverConfig.GAME.GATE_PORT, event, data, callback);
    }
    // 向网关注册游戏服务器
    registerServer(){
        let params:any={
            id: GameUtil.serverId,
            name: GameUtil.serverName,
            ip: GameUtil.serverConfig.GAME.IP,
            fake: GameUtil.serverConfig.GAME.FAKE,
            port: GameUtil.serverConfig.GAME.PORT,
            http_port: GameUtil.serverConfig.HTTP.PORT,
            wan: GameUtil.serverConfig.GAME.WAN,
            key: MsgCode.SING,
        };
        this.sendToGate("/register_server",params,(isconnect:any, data:any) => {
            if (isconnect) {
                if (data.result == MsgCode.SUCCESS) {
                    this.registed = true;
                    SKLogger.debug(`游戏服[${GameUtil.serverId}:${GameUtil.serverName}]已经连接`);
                    return;
                    for (const accountid in data.tokens) {
                        if (data.tokens.hasOwnProperty(accountid)) {
                            const token = data.tokens[accountid];
                            this.addLoginToken(accountid, token);
                        }
                    }
                }
            }
        });
    }

    //向网关更新当前服务器数据
    update(dt:number) {
        if (dt % (1000 * 15) == 0) {
            if (this.registed == false) {
                this.registerServer();
                return;
            }
            this.checkToken();
            this.sendToGate('/ping_server', {
                id: GameUtil.serverId,
                num: PlayerMgr.shared.getPlayerNum(),
                key: MsgCode.SING,
            }, (isconnect:any, data:any) => {
                if (!isconnect) {
                    this.registed = false;
                }
                if (data.result != MsgCode.SUCCESS){
                    this.registed = false;
                }
            });
        }
    }

    addLoginToken(accountid:any, token:any){
        let time = new Date();
        let pToken = {
            accountid: accountid,
            token: token,
            islogin: false,
            time: time.getTime(),
        };
        this.token_list[accountid] = pToken;
    }

    checkToken(){
        let time = new Date();
        for (const accountid in this.token_list) {
            if (this.token_list.hasOwnProperty(accountid)) {
                const tokeninfo = this.token_list[accountid];
                if (tokeninfo.islogin == false && time.getTime() - tokeninfo.time > 5 * 60 * 1000){
                    delete this.token_list[accountid];
                }
            }
        }
    }

    DeleteTocken(accountId:number){
        if (this.token_list.hasOwnProperty(accountId) == false)
            return;

        delete this.token_list[accountId];
    }

    getLoginToken(accountId:number):string{
        if (this.token_list[accountId]){
            return this.token_list[accountId].token;
        }
        return 'notoken';
    }
}