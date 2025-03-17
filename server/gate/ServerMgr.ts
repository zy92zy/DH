import Server from "./Server";
import Http from "../utils/Http";
import DB from "../utils/DB";
import SKDataUtil from "../gear/SKDataUtil";
import SKLogger from "../gear/SKLogger";
import GameUtil from "../game/core/GameUtil";
import { MsgCode } from "../game/role/EEnum";

// 游戏服务器管理
export default class ServerMgr {
    static shared = new ServerMgr();

    inv_time: number;
    guide_list: { [key: number]: Server };
    server_list: { [key: number]: Server };

    constructor() {
        this.inv_time = 0;
        this.guide_list = {};
        this.server_list = {};
    }

    init() {
        let gconf = require("../etc/gate_config");
        // 初始化推荐服列表
        let guide_list = gconf.guideList;
        for (let index = 0; index < guide_list.length; index++) {
            let serverinfo = guide_list[index];
            let server = new Server();
            server.setServerInfo(serverinfo);
            this.guide_list[server.sid] = server;
        }
        // 初始化服务器列表
        let server_list = gconf.serverList;
        for (let index = 0; index < server_list.length; index++) {
            let serverinfo = server_list[index];
            let server = new Server();
            server.setServerInfo(serverinfo);
            this.server_list[server.sid] = server;
        }
        let self = this;
        setInterval(() => {
            self.inv_time++;
            for (const sid in self.server_list) {
                if (self.server_list.hasOwnProperty(sid)) {
                    const server = self.server_list[sid];
                    if (server.is_reg && server.state != GameUtil.serverState.close) {
                        if (self.inv_time > server.last_ping + 6) {
                            server.state = GameUtil.serverState.close;
                            SKLogger.info(`网关服：游戏服[${server.name}(${server.sid})], 断开连接！`);
                        } else {
                            server.UpdateState();
                        }
                    }
                }
            }
        }, 5000);
    }

    serverReg(sid: any, ip: any, fake: any, port: any, http_port: any, wan: any, name: string = ''): boolean {
        let serverinfo: any = {
            id: sid,
            name: name,
            ip: ip,
            fake: fake,
            port: port,
            http_port: http_port,
            wan: wan,
        };
        let server = this.getServer(sid);
        if (!server) {
            server = new Server()
        }
        if (server) {
            server.setServerInfo(serverinfo);
            server.registered(this.inv_time);
            this.addServer(server);
            SKLogger.info(`游戏服[${server.name}](${server.sid}), 已经注册！`);
            return true;
        }
        return false;
    }

    getServer(serverId: any): Server {
        return this.server_list[serverId];
    }

    addServer(server: Server) {
        this.server_list[server.sid] = server;
    }

    delServer(server: Server) {
        delete this.server_list[server.sid];
    }

    serverClose(severId: number) {
    }

    serverPing(sid: number, num: any) {
        let server = this.getServer(sid);
        if (server) {
            if (server.is_reg == false || server.state == GameUtil.serverState.close) {
                return MsgCode.FAILED;
            }
            server.last_ping = this.inv_time;
            server.changePlayerNum(num);
            return MsgCode.SUCCESS;
        }
        return MsgCode.FAILED;
    }
    // 获得推荐服列表
    getGuideList() {
        return this.guide_list;
    }
    // 获得服务器列表
    getServerList():any{
        return this.server_list;
    }
    // 发送所有的服务器
    sendAllServer(event: string, data: any, callback?: (success: boolean, data: any) => void) {
        let index=0;
        let total=SKDataUtil.getLength(this.server_list);
        for (let key in this.server_list) {
            let server = this.server_list[key];
            Http.sendget(server.wan, server.http_port, event,data, (success: boolean, data: any) => {
                index++;
                if(index==total){
                    if (callback) {
                        callback(true, data);
                    }
                }
            });
        }
    }
    // 发送角色ID所在服务器消息
    sendServer(roleId: number, event: string, data: any, callback: (success: boolean, data: any) => void) {
        DB.serverIdBy(roleId, (serverId: number) => {
            if (serverId == -1) {
                callback(false, `${roleId}所在服务器没有找到!`);
                return;
            }
            let server = ServerMgr.shared.getServer(serverId);
            if (!server) {
                callback(false, `${roleId}所在服务器${serverId}没有注册!`);
                return;
            }
            Http.sendget(server.wan, server.http_port, event, data, (success: boolean, data: any) => {
                callback(success, data);
            });
        });
    }
}
