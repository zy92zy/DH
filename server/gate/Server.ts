/**
 * 服务器信息类
 * 
 * state服务器状态：1：正常，2：拥挤
 */

import GameUtil from "../game/core/GameUtil";
import Http from "../utils/Http";

export default class Server {
    sid:number;
    net_ip:string;
    wan:string;
    fake_ip:string;
    net_port:number;
    http_port:number;
    name:string;
    player_num:number;
    is_reg:boolean;
    state:number;
    last_ping:number;

    constructor(){
        this.sid = 0;
        this.net_ip = "127.0.0.1";
        this.wan = "127.0.0.1";
        this.fake_ip = "127.0.0.1";
        this.net_port = 8561;
        this.http_port = 8911;
        this.name = '未知服务器';
        this.player_num = 0;
        this.is_reg = false;
        this.state = GameUtil.serverState.lower;
        this.last_ping = 0;
    }

    setServerInfo(server_info:any) {
        server_info.id && (this.sid = server_info.id);
        server_info.wan && (this.wan = server_info.wan);
        server_info.name && (this.name = server_info.name);
        server_info.ip && (this.net_ip = server_info.ip);
        server_info.port && (this.net_port = server_info.port);
        server_info.http_port && (this.http_port = server_info.http_port);
        server_info.num && (this.player_num = server_info.num);
        server_info.fake && (this.fake_ip = server_info.fake);
    }

    registered(pingtime:any){
        this.last_ping = pingtime;
        this.is_reg = true;
        this.UpdateState();
    }

    changePlayerNum(playernum:any){
        this.player_num = playernum;
        if (this.state != 0){
            if (this.player_num >= 300) {
                this.state = GameUtil.serverState.high;
            } else {
                this.state = GameUtil.serverState.lower;
            }
        }
    }

    UpdateState(){
        if (this.is_reg == false){
            return this.state;
        }
        if (this.player_num >= 300) {
            this.state = GameUtil.serverState.high;
        } else {
            this.state = GameUtil.serverState.lower;
        }
        return this.state;
    }

    getPlayerNum(){
        return this.player_num;
    }

    send(event:any, data:any, callback:any){
        Http.sendget(this.wan, this.http_port, event, data, callback);
    }
}