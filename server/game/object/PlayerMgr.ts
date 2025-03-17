import SKDBUtil from "../../gear/SKDBUtil";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import GameUtil from "../core/GameUtil";
import Player from "./Player";
import { Extension } from "typescript";
import GFile from "../../utils/GFile";
import RobotMgr from "../robot/RobotMgr";
import WorldAnswer from "../activity/WorldQA";
import { MsgCode } from "../role/EEnum";
import MapMgr from "../core/MapMgr";
import DB from "../../utils/DB";
import SKTimeUtil from "../../gear/SKTimeUtil";
import Gift from "../gift/Gift";
import GMMgr from "../core/GMMgr";

// 玩家管理器
export default class PlayerMgr {
    // 单例
    static shared = new PlayerMgr();
    saved: boolean = false;
    propRoleData: any;
    player_num: number;
    player_num_peak: number;
    player_role_list: any;
    player_only_list: any;
    player_offline_list: any;
    player_offline_list2: any = [];

    world_chat_list: any[] = [];
    horn_list: any[] = [];
    world_chat_num = 50;
    player_chat_list:any = {};

    feng_ip_chat = [];

    last_time = 0;

    mongoCheckTime: number = 10 * 60 * 1000;
    mongoCheckTimeLast: number = 0;
    mongoClearTime: number = 24 * 60 * 60 * 1000;

    // 存档
    static saveAll(callback: (msg: string) => void) {
        this.shared.saveAll(callback);
    }

    constructor() {
        this.propRoleData = null;
        this.player_num = 0;
        this.player_num_peak = 0;
        this.player_role_list = {};
        this.player_only_list = {};
        this.player_offline_list = {};
        this.player_offline_list2 = [];
    }

    init() {
        let propRoleData = GameUtil.require_ex('../../conf/prop_data/prop_role_data');
        if (propRoleData) {
            this.propRoleData = {};
            for (const id in propRoleData) {
                if (propRoleData.hasOwnProperty(id)) {
                    const data = propRoleData[id];
                    if (this.propRoleData[data.race] == null) {
                        this.propRoleData[data.race] = {};
                    }
                    if (this.propRoleData[data.race][data.relive] == null) {
                        this.propRoleData[data.race][data.relive] = {};
                    }
                    this.propRoleData[data.race][data.relive][data.level] = data;
                }
            }
        } else {
            SKLogger.warn('prop_role_data 角色属性表加载失败');
        }

        GFile.loadRuntime(`world_chat_${GameUtil.serverId}.txt`, (error, data)=>{
            if(!error){
                let result = SKDataUtil.jsonBy(data);
                if(result){
                    for (let data of result) {
                        data.voice = new Uint8Array(data.voice);
                    }
                    this.world_chat_list = result;
                }
            }
        });
    }

    checkAdvert(player: Player, msg: string){
        if(msg.length <= 20){
            return false;
        }else{
            msg = msg.substr(0,16);
        }

        if(this.feng_ip_chat.indexOf(msg)>-1){
            GMMgr.shared.can_speak(player.roleid, 1);
            SKLogger.warn(`[${player.roleid}:${player.name}]玩家检测到历史刷屏内容,禁言`);
            return true;
        }

        let item = this.player_chat_list[player.roleid];
        if(item){
            if(item[0] == msg){
                item[1]++;
                if(item[1] >= 3){
		            GMMgr.shared.can_speak(player.roleid, 1);
                    delete this.player_chat_list[player.roleid];
                    SKLogger.warn(`[${player.roleid}:${player.name}]玩家刷屏被禁言`);
                    let world_chat_list = [];
                    for (let i of this.world_chat_list) {
                        i.roleid != player.roleid && world_chat_list.push(i);
                    }
                    this.world_chat_list = world_chat_list;
                    this.feng_ip_chat.push(msg);
                    return true;
                }
            }else{
                this.player_chat_list[player.roleid] = [msg, 1];
            }
        }else{
            this.player_chat_list[player.roleid] = [msg, 1];
        }
        return false;
    }

    removeChatByRoleid(roleid: number){
        let world_chat_list = [];
        for (let i of this.world_chat_list) {
            i.roleid != roleid && world_chat_list.push(i);
        }
        this.world_chat_list = world_chat_list;
    }


    world_chat(player:Player ,data:any){
        if(this.checkAdvert(player, data.msg)){
            return;
        }
        PlayerMgr.shared.broadcast('s2c_game_chat', data);
        this.world_chat_list.push(data);
        if(this.world_chat_list.length>this.world_chat_num){
            this.world_chat_list.splice(0,1);
        }
        RobotMgr.shared.worldChat(data.msg);
        WorldAnswer.shared.playerAnswer(player, data.msg);
        Gift.shared.chatGift(player, data.msg);
    }

    checkOffline(){
        // if(this.last_time + 10 * 1000< GameUtil.gameTime){
        //     return;
        // }
        // this.last_time = GameUtil.gameTime;
        // if(Object.keys(this.player_offline_list).length < GameUtil.playerSkipNum)
        //     return;
        // let list:any = {};
        // for (let roleId in this.player_offline_list) {
        //     let player:Player = this.player_offline_list[roleId];
        //     if(player.offline){
        //         list[roleId] = player.offlineTime;
        //     }else{
        //         delete this.player_offline_list[roleId];
        //     }
        // }
        // let keys = Object.keys(list).sort(function(a,b){return list[b]-list[a];})
        // if(keys.length < GameUtil.playerSkipNum)
        //     return;
        // for (const k of keys.slice(GameUtil.playerSkipNum)) {
        //     let player:Player = this.player_offline_list[k];
        //     player.destroy();
        // }
    }

    add_horn(info:any){
        this.horn_list.push(info);
        if(this.horn_list.length>5){
            this.horn_list.shift();
        }
    }

    chat_list(player:Player){
        this.world_chat_list.length>0 && 
        player.send('s2c_game_chat_list', {
            list: this.world_chat_list,
            horn: this.horn_list,
        });

    }
    save_chat_list(){
        let data = [];
        for (let i of this.world_chat_list) {
            let s = {
                scale: i.scale,
                msg: i.msg,
                teamid: i.teamid,
                name: i.name,
                resid: i.resid,
                roleid: i.roleid,
                onlyid: i.onlyid,
                voice: i.voice&&i.voice.toString(),
                serid: i.serid,
                // petid: i.petid,
                // tiance: i.tiance,
                // team: i.team,
                // equip: i.equip,
            };
            data.push(s);
        }
        GFile.saveRuntime(`world_chat_${GameUtil.serverId}.txt`, SKDataUtil.toJson(data));
    }

    update(dt: number) {
        for (let roleId in this.player_role_list) {
            let player = this.getPlayerByRoleId(roleId);
            if (player) {
                player.update(dt);
            }
        }

        if(this.last_time + 1000 < GameUtil.gameTime){
            if(this.player_offline_list2.length>0){
                this.loadOfflinePlayer2(this.player_offline_list2.shift());
                this.last_time = GameUtil.gameTime;
            }
            if(GameUtil.gameTime > this.mongoCheckTimeLast){
                this.mongoCheckTimeLast = GameUtil.gameTime + this.mongoCheckTime;
                DB.getOnlines(GameUtil.gameTime - this.mongoClearTime,  (err, res)=>{
                    if(err || !res || res.length==0){
                        return;
                    }
                    for (const item of res) {
                        PlayerMgr.shared.getPlayerByRoleId(item.roleid, false) || DB.removePlayerMongo(item.roleid)
                    }
                })
            }
        }
    }

    addPlayer(player: any) {
        /*if(SKDataUtil.valueForKey(this.player_role_list, player.roleid)){
            delete this.player_role_list[player.roleid];
            delete this.player_only_list[player.onlyid];
        }*/
        this.player_role_list[player.roleid] = player;
        this.player_only_list[player.onlyid] = player;
        this.updatePlayerNum();
        this.playerDestroy(player.roleid);
    }

    getPlayerByOnlyId(onlyId: any, isWarn: boolean = true): Player {
        if(!onlyId){
            return null;
        }
        let result = SKDataUtil.valueForKey(this.player_only_list, onlyId);
        if (result == null && isWarn) {
            SKLogger.error(`$警告:找不到玩家:onlyId=${onlyId}`);
        }
        return result;
    }

    getPlayerByRoleId(roleId: any, isWarn: boolean = true): Player {
        if(!roleId){
            return null;
        }
        let result = this.player_role_list[roleId]; //SKDataUtil.valueForKey(this.player_role_list, roleId);
        if (result == null && isWarn) {
            SKLogger.error(`$警告:找不到玩家:roleId=${roleId}`);
        }
        return result;
    }

    getLikePlayer(info: any): any {
        let list = [];
        for (let roleId in this.player_role_list) {
            let player = this.getPlayerByRoleId(roleId, false);
            if (!player) {
                continue;
            }
            if (player.roleid == info || player.name.indexOf(info) != -1) {
                list.push(player);
            }
        }
        return list;
    }

    delPlayer(roleId: any) {
        let player = this.getPlayerByRoleId(roleId, false);
        if (player != null) {
            delete this.player_role_list[player.roleid];
            delete this.player_only_list[player.onlyid];
            this.updatePlayerNum();
        }
        this.playerDestroy(roleId);
    }

    updatePlayerNum() {
        let total = 0;
        for (let roleId in this.player_role_list) {
            let player = this.getPlayerByRoleId(roleId);
            if (player) {
                if(!player.offline)
                    total++;
            }
        }
        this.player_num = total;
        if (total > this.player_num_peak) {
            this.player_num_peak = total;
        }
    }

    getPlayerNum(): any {
        return this.player_num;
    }
    
    getPlayerOfflingNum(){
        let offline = 0;
        for (const key in this.player_role_list) {
            if (Object.prototype.hasOwnProperty.call(this.player_role_list, key)) {
                let player: Player = this.player_role_list[key];
                player.offline && offline++
            }
        }
        return offline
    }


    getPlayerNumPeak(): any {
        return this.player_num_peak;
    }

    getPropRoleData(race: any, relive: any, level: any) {
        if (race == null || relive == null || level == null) {
            return null;
        }
        if (this.propRoleData[race] && this.propRoleData[race][relive] && this.propRoleData[race][relive][level]) {
            return this.propRoleData[race][relive][level];
        }
        return null;
    }

    sendToPlayer(onlyid: number, event: any, obj: any) {
        let player = this.getPlayerByOnlyId(onlyid, false);
        if (player) {
            player.send(event, obj);
        }
    }
    // 准备关服
    readyToCloseServer(t = 10, call:any = null, mod:number=null) {
        mod === null && typeof call=='number' && (mod = call);
        let t_timer = setInterval(() => {
            let str = mod==1 ? `服务器在 ${t}秒 后重启` : `服务器在 ${t}秒 后关闭`;
            SKLogger.info(str);
            this.broadcast('s2c_game_chat', {
                onlyid: 0,
                roleid: 0,
                scale: 3,
                msg: `请注意：${str}`,
                name: '',
                resid: 0,
                teamid: 0,
            });
            t--;
            if (t <= 0) {
                clearInterval(t_timer),
                typeof call=='function'&&call()
            }
        }, 1000);
    }
    // 通知所有玩家
    broadcast(event: any, obj?: any) {
        for (let roleId in this.player_role_list) {
            let player = this.getPlayerByRoleId(roleId, false);
            if (player) {
                player.send(event, obj);
            }
        }
    }
    // 全部存档
    saveAll(callback: (msg: string) => void) {
        this.updatePlayerNum();

        //保存聊天记录
        this.save_chat_list();
        
        //获取玩家数
        GameUtil.saveTotal = Object.keys(this.player_role_list).length;
        if (GameUtil.saveTotal < 1) {
            this.saved = false;
            callback( `玩家存档:数量少于1个,无需存档`);
            return;
        }
        //存档状态判断
        if (this.saved) {
            callback(`存档:共[${GameUtil.saveTotal}]个玩家正在存档中...`);
            return;
        }

        //设置保存状态
        this.saved = true;
        // 更新在线人数
        GameUtil.online = this.player_num;
        //置空存档数
        GameUtil.saveCount = 0;
        //置空存档失败列表
        GameUtil.saveFailed = [];

        //存档消息
        let msg = "";

        //遍历玩家列表
        for (let roleId in this.player_role_list) {
            //取出玩家
            let player = this.getPlayerByRoleId(roleId);
            //玩家数据不存在就无需保存
            if (!player) {
                GameUtil.saveTotal --;
            }

            let self = this;
            player.saveAll((failed: string) => {
                GameUtil.saveCount++;//存档数自增
                if (failed.length > 0) {
                    GameUtil.saveFailed.push({ role_id: player.roleid, role_name: player.name, failed: failed });
                }
                //SKLogger.info(`总玩家数[${GameUtil.saveTotal}] 当前存档数[${GameUtil.saveCount}] 失败数[${GameUtil.saveFailed.length}]`);
                // 全部玩家存档完成
                if (GameUtil.saveCount >= GameUtil.saveTotal) {
                    self.saved = false;
                    let failedTotal = GameUtil.saveFailed.length;
                    msg = `玩家存档: 服务器[${GameUtil.serverName}]: 存档失败[${failedTotal}] 在线玩家数[${GameUtil.online}] 总玩家数[${GameUtil.saveTotal}] 存档玩家数[${GameUtil.saveCount}]:\r\n所有玩家存档完毕!`;
                    callback(msg);
                }
            });
        }
    }

    // 重置所有玩家的每日限购数
    clearAllDayCount() {
        for (let roleId in this.player_role_list) {
            let player: Player = this.getPlayerByRoleId(roleId);
            if (player != null) {
                player.clearDayMap();
            }
        }
        SKLogger.info(`重置所有玩家每日限购数完成!`);
    }

    OnNewDay() {
        for (let roleId in this.player_role_list) {
            let player = this.getPlayerByRoleId(roleId);
            if (player) {
                player.OnNewDay();
            }
        }
    }

    OnNewHour() {
        for (let roleId in this.player_role_list) {
            let player = this.getPlayerByRoleId(roleId);
            if (player) {
                player.OnNewHour();
            }
        }
    }

    clearRobot() {
        for (let roleId in this.player_role_list) {
            let player = this.getPlayerByRoleId(roleId);
            if (player) {
                if (Number(player.accountid) >= 90000000) {
                    player.destroy();
                    this.delPlayer(roleId);
                }
            }
        }
    }

    clearPlayerCache(roleId: any) {
        let player = this.getPlayerByRoleId(roleId);
        if (player != null) {
            if (player.agent) {
                player.agent.close();
            }
            this.delPlayer(roleId);
        }
    }
    // 踢下线
    kickedOutPlayer(roleList: any[]) {
        for (let roleId of roleList) {
            if (roleId == 0) {
                break;
            }
            let player = this.getPlayerByRoleId(roleId);
            if (player == null) {
                return;
            }
            player.destroy();
            SKLogger.info(`踢出玩家[${player.roleid}:${player.name}]`);
        }
    }

    playerOffline(roleid: any){
        this.player_offline_list[roleid] || this.player_offline_list2.push(roleid);
    }
    playerDestroy(roleId:any){
        let index = this.player_offline_list2.indexOf(roleId);
        if(index>-1){
            this.player_offline_list2.slice(index,1)
        }
        let player:Player = this.player_offline_list[roleId];
        if(player){
            SKLogger.info(`删除假人${player.name}`);
            player.destroyMini();
            delete this.player_offline_list[roleId];
        }
    }

    loadOfflinePlayer2(roleid: any){
        if(Object.keys(this.player_offline_list).length>GameUtil.playerSkipNum)
            return;

        DB.loginByRoleidMini(roleid, (code: any, data: any) => {
            if (code == MsgCode.SUCCESS) {
                let player = new Player();
                player.setDBmini(data);
                if (player.x == -1 || player.y == -1) {
                    player.x = MapMgr.shared.getMap(player).map_data.startPos.x;
                    player.y = MapMgr.shared.getMap(player).map_data.startPos.y;
                }
                let map = MapMgr.shared.getMapById(player.mapid);
                SKLogger.info(`加载假人 ${player.roleid}:${player.name} - ${map.map_name} ${player.x}:${player.y}`);
            
                this.player_offline_list[player.roleid]=player;
            };
        });
    }
    

    loadOfflinePlayer(num:number){
        let sql = `SELECT roleid FROM qy_role ORDER BY RAND() LIMIT ${num};`;
        let timer:any = 0;
        let players: any[] = [];
        let index = 1;
        let load = ()=>{
            let row:any = players.shift();
            if(!row){
                SKTimeUtil.cancelLoop(timer);
                return
            }
            PlayerMgr.shared.getPlayerByRoleId(row['roleid'], false)||DB.loginByRoleidMini(row['roleid'], (code: any, data: any) => {
                if (code == MsgCode.SUCCESS) {
                    let player = new Player();
                    player.setDBmini(data);
                    if (player.x == -1 || player.y == -1) {
                        player.x = MapMgr.shared.getMap(player).map_data.startPos.x;
                        player.y = MapMgr.shared.getMap(player).map_data.startPos.y;
                    }
                    let map = MapMgr.shared.getMapById(player.mapid);
                    SKLogger.info(`加载假人${index++}/${num} ${player.roleid}:${player.name} - ${map.map_name} ${player.x}:${player.y}`);
                    this.player_offline_list[player.roleid]=player;
                };
            });
        };
        DB.query(sql, (code: any, data: any)=>{
            if(code) return SKLogger.warn(`SQL异常${sql}`);
            players = data;
            timer = SKTimeUtil.loop(load, 0.1 * 1000);
        });
    }

}
