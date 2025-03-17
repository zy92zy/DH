/**
 * agent 类，客户端网络连接代理，用于接收发送与客户端相关的协议包。
 */

 import AgentBase from "./AgentBase";
 import AgentMgr from "./AgentMgr";
 import GMMgr from "../core/GMMgr";
 import Signal from "../core/Signal";
 import GameUtil from "../core/GameUtil";
 import Player from "../object/Player";
 import MapMgr from "../core/MapMgr";
 import PlayerMgr from "../object/PlayerMgr";
 import ChargeSum from "../core/ChargeSum";
 import BangMgr from "../bang/BangMgr";
 import World from "../object/World";
 import PaiHangMgr from "../core/PaiHangMgr";
 import Shop from "../object/Shop";
 import GoodsMgr from "../item/GoodsMgr";
 import ShopItem from "../object/ShopItem";
 import MallMgr from "../core/MallMgr";
 import ZhenbukuiMgr from "../activity/ZhenbukuiMgr";
 import DB from "../../utils/DB";
 import BattleMgr from "../battle/BattleMgr";
 import ActivityMgr from "../activity/ActivityMgr";
 import ActivityDefine from "../activity/ActivityDefine";
 import RelationMgr from "../object/RelationMgr";
 import TeamMgr from "../core/TeamMgr";
 import NpcMgr from "../core/NpcMgr";
 import TaskConfigMgr from "../task/TaskConfigMgr";
 import NpcConfigMgr from "../core/NpcConfigMgr";
 import LotteryMgr from "../core/LotteryMgr";
 import EquipMgr from "../object/EquipMgr";
 import WorldRewardMgr from "../../game/activity/WorldRewardMgr"
 import PalaceFight from "../activity/PalaceFight";
 import SKDataUtil from "../../gear/SKDataUtil";
 import SKLogger from "../../gear/SKLogger";
 import ItemUtil from "../core/ItemUtil";
import Equip from "../object/Equip";
import ChargeEverDayMgr from "../core/ChargeEverDayMgr";
import { BattleType, MsgCode } from "../role/EEnum";
import Log from "../../utils/Log";
import BangZhan from "../bang/BangZhan";
import DayReward from "../core/DayReward";
import Skin from "../role/Skin";
import MarryMgr from "../marry/MarryMgr";
import DingZhi from "../dingzhi/DingZhi";
import Bagua from "../bagua/Bagua";
import TianceMgr from "../tiance/TianceMgr";
import Bianshen from "../bianshen/Bianshen";
import YuanShen from "../yuanshen/YuanShen";
 
 export default class Agent extends AgentBase {
     accountid: number;
     roleId: number;
     token: string;
     loginstep: number;
     player: Player;
     action_time:any = {};

     static loding_player:any = {};
     static loding_acount:any = {};
 
 
     equipObjs : any;
     constructor(socket: any) {
         super(socket);
         this.accountid = -1; // agent 绑定的玩家id
         this.token = ""; // agent 登录token
         this.loginstep = 0;
         this.action_time = {};

    }

    checkData(pdata:any,funcName:string):boolean{
        if(Object.prototype.hasOwnProperty.call(pdata, 'roleId')){
            if(pdata.roleId != this.roleId){
                console.log ("后门调用,函数:"+ funcName+ ",data = " + pdata);
            }
        }
        return true;
    }

    close() {
        super.close();
        if (this.player) {
            this.player.playerOffline();
            this.player = null;
        }
        this.roleId && (delete Agent.loding_player[this.roleId]);
        AgentMgr.shared.delAgent(this.id);
        SKLogger.debug(`Agent[${this.id},${this.roleId}]socket断开连接`);
    }
 
     gm_command(data: any) {
        SKLogger.warn(`玩家 [${this.roleId}] 尝试使用GM指令 : [${data.commands}]`);
        //  let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        //  player ? GMMgr.shared.exec(player, data.commands) : this.close();
        this.close();
     }

     // 请求登录
     c2s_login(data: any) {
        let accountid = data.accountid;
        let roleid = data.roleid;
        // if(GameUtil.login_status >= GameUtil.limit){//瞬时登录只允许50人
        //     SKLogger.warn(`账号:${accountid} ID:${roleid},当前登陆中人数[${GameUtil.login_status}]人,禁止登陆`);
        //     this.close();
        //     return;
        // }
        if(!/^\d+$/.test(accountid) || !/^\d+$/.test(roleid)){
            SKLogger.warn(`登录数据异常[${accountid}][${roleid}]`);
            this.close();
            return;
        }
        let token = Signal.shared.getLoginToken(accountid);
        // 登录失败，需重新登录
        if (token == 'notoken' || data.token != token) {
            SKLogger.warn(`玩家[agentId=${this.id},账号:${accountid}]登录异常:TOKEN[${data.token}:${token}]无效!`);
            this.close();
            return;
        }
        DB.getAccountid(roleid, (error, _accountid)=>{
            if(error == MsgCode.FAILED){
                this.close();
                return;
            }
            if(_accountid != accountid){
                SKLogger.warn(`玩家尝试登陆他人角色,账号:[${accountid}]`);
                this.close();
                return;
            }
            let time = new Date().getTime();
            if(Agent.loding_player[roleid] && Agent.loding_player[roleid] > time - 5000){
                time = Math.floor((5000 - time - Agent.loding_player[roleid])/1000);
                SKLogger.warn(`玩家[agentId=${this.id},角色:${roleid}]检测到多重登陆，暂停登录${time}秒!`);
                this.close();
                return;
            }
            GameUtil.login_status++;
            Agent.loding_player[roleid] = time;
            this.accountid = accountid;
            this.roleId = roleid;
            let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId, false);
            if (player != null) {
                this.player = player;
                this.player.setAgent(this);
                this.player.playerLogined();
                SKLogger.debug(`玩家[${this.player.roleid}:${this.player.name}]agentId=${this.id}重连`);
                GameUtil.login_status--;
                if(GameUtil.login_status >= GameUtil.limit){
                GameUtil.login_status = GameUtil.limit - 1;
                }
                return;
            }
            this.readDB();
        });
     }

     checkAction(type: string, time=1000, msg:string = null){
        let t = this.action_time[type] || 0;
        let s = (this.action_time[type] = new Date().getTime()) - time > t;
        s || msg && (t = PlayerMgr.shared.getPlayerByRoleId(this.roleId)) && t.send('s2c_notice', {strRichText: msg});
        return s;
     }
 
     readDB() {
         SKLogger.info(`玩家[agentId=${this.id},角色:${this.roleId}]读表中...`);
         DB.loginByRoleid(this.roleId, (code: any, data: any) => {
             if (code == MsgCode.SUCCESS) {
                 this.doLogin(data);
             } else {
                 this.close();
             }
             GameUtil.login_status--;
             if(GameUtil.login_status >= GameUtil.limit){
                GameUtil.login_status = GameUtil.limit - 1;
             }
         });
     }
     
     doLogin(data: any) {
         this.player = new Player();
         this.player.setAgent(this);
         this.player.setDB(data);
         if (this.player.x == -1 || this.player.y == -1) {
             this.player.x = MapMgr.shared.getMap(this.player).map_data.startPos.x;
             this.player.y = MapMgr.shared.getMap(this.player).map_data.startPos.y;
         }
         SKLogger.info(`玩家[${this.player.roleid}:${this.player.name}]agentId:${this.id}登录成功!`);
         
         this.player.playerLogined();
        Agent.loding_player[this.roleId] && delete Agent.loding_player[this.roleId];
     };

     // 其他设备登录
     otherLogin() {
         if (this.player) {
             this.player.send("s2c_otherlogin");
         }
         this.player = null;
     }

     // 重新登录
     c2s_relogin(data: any) {
        let accountid = data.accountid;
        let roleid = data.roleid;
        if(!accountid || !roleid || data.token == 'notoken' || !/^\d+$/.test(accountid) || !/^\d+$/.test(accountid) || data.token != Signal.shared.getLoginToken(accountid)){
            return;
        }

        DB.getRoleid(accountid, (error, roles)=>{
            if(error == MsgCode.FAILED){
                this.close();
                return;
            }
            if(roles.indexOf(roleid)==-1){
                SKLogger.warn(`玩家尝试登陆他人角色,账号:[${accountid}]`);
                this.close();
                return;
            }

            let otheragent = AgentMgr.shared.getAgentByAccountid(roleid);
            if (otheragent) {
                otheragent.close();
            }
            // 处理掉线玩家
            let player = PlayerMgr.shared.getPlayerByRoleId(roleid);
            if (player) {
                if (player.offline == true) {
                    player.setAgent(this);
                    player.playerRelogin();
                }else{
                    player.agent.close();
                    player.setAgent(this);
                    player.playerRelogin();
                }
            }
        })
     }
     
     c2s_enter_game(data: any) {
        if(!this.checkAction('enter_game',3000, '角色正在进入游戏'))
           return;
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.onEnterGame() : this.close();
     }
     
     c2s_change_map(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.changeMap(data) : this.close();
     }
     
     c2s_create_team(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? TeamMgr.shared.creatTeam(player, data) : this.close();
     }
     c2s_revise_team(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? TeamMgr.shared.reviseInfo(player, data) : this.close();
     }
     
     c2s_match_team(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? TeamMgr.shared.matchTeam(player) : this.close();
     }

     c2s_requst_team(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             if (player.inPrison) {
                 player.send('s2c_notice', {
                     strRichText: '老实点，天王老子都不会收留你。'
                 });
             }
             TeamMgr.shared.requestTeam(player, data.teamid);
         }else{
             this.close();
         }
     }

     //邀请组队
     c2s_join_myteam(data: any){
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
            this.close();
            return;
        }
        if(player.teamid <= 0){
            TeamMgr.shared.creatTeam(player, {});
        }
         let tarplayer = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
         if (tarplayer){
             if(tarplayer.teamid > 0){
                 player.send('s2c_notice', {
                     strRichText: '邀请失败，对方已有队伍。'
                 });
                 return;
             }
         }else{
             player.send('s2c_notice', {
                 strRichText: '邀请失败，对方似乎不在线。'
             });
             return;
         }
 
         tarplayer.send('s2s_join_myteam',{
             name: player.name,
             teamid: player.teamid
         });
         player.send('s2c_notice', {
             strRichText: '组队邀请已发送。'
         });
     }
     //同意邀请组队
     c2s_join_team(data: any){
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
            this.close();
            return;
        }
         let pTeamInfo = TeamMgr.shared.teamList[data.teamid];
         if(!pTeamInfo){
             player.send('s2c_notice', {
                 strRichText: '队伍不存在。'
             });
             return;
         }
         if(pTeamInfo.playerlist.length >= 5){
             player.send('s2c_notice', {
                 strRichText: '队伍已经满员啦!'
             });
             return;
         }
         TeamMgr.shared.joinTeam(player,data.teamid);
     }

     //离开队伍/ T出队伍
     c2s_leave_team(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
            this.close();
            return;
        }
        if(player.roleid != data.roleid){
            player.isleader && (player = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false)) &&
            TeamMgr.shared.leaveTeam(player)
        }else{
            TeamMgr.shared.leaveTeam(player);
        }
     }
     
     // 改变队长
     c2s_transfer_team(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
            this.close();
            return;
        }
        let toPlayer = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
        toPlayer && TeamMgr.shared.changeTeamLeader(toPlayer, player, player.teamid);
     }
     
     // y
     c2s_transfer_team_requst(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
            this.close();
            return;
        }
        let toplayer = PlayerMgr.shared.getPlayerByRoleId(data.toid, false);
         if (!toplayer) {
             console.warn(`$警告:组队邀请玩家[${data.toid}]找不到`);
             return;
         }
         if (toplayer.isleader) {
             return;
         }
         if (toplayer.teamid != player.teamid) {
             return;
         }
         toplayer.send('s2c_transfer_team_requst', {
             roleid: player.roleid,
         });
     }
     c2s_team_rob(data: any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if (!player) {
            this.close();
            return;
        }
        let team = TeamMgr.shared.getTeamInfo(player.teamid);
        if (!team) {
            return;
        }
        let player2:Player = team.leader;
        if(player2.offline || data.type == 2){
            if(data.roleid){
                player2 = PlayerMgr.shared.getPlayerByRoleId(data.roleid)
                TeamMgr.shared.changeTeamLeader(player, player2, player.teamid);
                TeamMgr.shared.broadcast(player.teamid, 's2c_notice', {
                    strRichText: `[${player2.name}]成为了队长!`
                });
            }else{
                TeamMgr.shared.changeTeamLeader(player2, player, player.teamid);
                TeamMgr.shared.broadcast(player.teamid, 's2c_notice', {
                    strRichText: `[${player.name}]成为了队长!`
                });
            }
            player.send('s2c_team_rob', {type:2});
            player2.send('s2c_team_rob', {type:2});
        }else if(data.type ==1){
            player2.send('s2c_team_rob', {msg: `[${player.name}]希望成为队长\n[TIME]秒后自动同意`,type:1, roleid: player.roleid})
        } else if(data.type == 3){
            if(player.isleader){
                player2 = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
                player2 && player2.send('s2c_notice', {
                    strRichText: `[${player.name}]拒绝了您的提议!`
                });
                player2 && player2.send('s2c_team_rob', {type:2});
            }else{
                player2 && player2.send('s2c_team_rob', {type:2});

            }
        }
     }
     
     c2s_team_list(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId, false);
         if (player) {
             TeamMgr.shared.getTeamList(player, data.type);
         }
     }
     
     c2s_team_requeslist(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
            this.close();
            return;
        }
        player && player.isleader && TeamMgr.shared.getRequestList(player, player.teamid);
     }
     
     c2s_operteam(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
            this.close();
            return;
        }
         let dealp = PlayerMgr.shared.getPlayerByRoleId(data.roleid);
         if (player && dealp && player.teamid == data.teamid && player.isleader) {
             TeamMgr.shared.dealRequest(dealp, data);
             TeamMgr.shared.getRequestList(player, data.teamid);
         }
     }
     
     c2s_aoi_move(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId, false);
         if (player) {
             player.playerMove(data);
         }
     }

     c2s_aoi_stop(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId, false);
         if (player) {
             player.playerStop(data);
         }
     }
     
     c2s_player_upskill(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             player.updateSkill(data.skillId);
         }
     }
     
     c2s_player_addpoint(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             player.addCustomPoint(data);
         }
     }
     
     c2s_xiulian_point(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             player.addXiulianPoint(data);
         }
     }
     
     c2s_xiulian_upgrade(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             player.xiulianUpgrade(data);
         }
     }
     // scale 0 世界 1 队伍 2 帮派
     c2s_game_chat(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
             this.close();
             return;
         }
         let msg = data.msg;
         let chargeTotal = ChargeSum.shared.getPlayerChargeSum(player.roleid);
         if (player.gmlevel <= 0) {
             if (player.GetFlag(GameUtil.EPlayerFlag.EBanSpeak) == 1) {
                 player.send('s2c_notice', {
                     strRichText: '你处于禁言状态'
                 });
                 return;
             }
         }
         
         for (let i = 0; i < GameUtil.limitWordList.length; i++) {
             const fword = GameUtil.limitWordList[i];
             if (msg.indexOf(fword) != -1) {
                 msg = msg.replace(new RegExp(fword, 'g'), '*');
             }
         }
         let canBroadcast = GameUtil.checkLimitWord(msg);
         // // 两条信息相同 不广播
         // if (player.lastWorldChatStr == msg) {
         //     canBroadcast = false;
         // }
         if (!canBroadcast) {
             player.send('s2c_game_chat', data);
             return;
         }
         data.msg = msg;
         data.teamid = player.teamid;
         data.name = player.name;
         data.resid = player.resid;
         data.roleid = player.roleid;
         data.onlyid = player.onlyid;
         data.voice = new Uint8Array(data.voice);
         if(data.equipid > 0){//分享了饰品
             let equip: Equip = this.player.equipObjs[data.equipid];
             //赋值
             data.equip = SKDataUtil.toJson(equip.toObj());
         }
         if(data.tiance){//分享天策
            data.tiance = player.roleid;
         }
         if(data.petid){//分享宝宝
            let pet = player.getPetByID(data.petid);
            if(!pet){
                player.send('s2c_notice', {
                    strRichText: '宠物不存在'
                });
                return;
            }
            data.pet = SKDataUtil.toJson(pet.toObj());
         }
         if(data.team == 1){//分享队伍
            if(player.teamid==0){
                player.send('s2c_notice', {
                    strRichText: '您还未组队'
                });
                return;
            }
            data.team = 1;
         }
         if (data.scale == 2) {
             if (player.bangid != null && player.bangid != 0) {
                 let bang = BangMgr.shared.getBang(player.bangid);
                 if (bang) {
                     if (player.level < GameUtil.limitBangChatLevel) {
                         let msg = `帮派聊天需要等级达到${GameUtil.limitBangChatLevel}级`;
                         player.send('s2c_notice', {
                             strRichText: msg
                         });
                         return;
                     }
                     SKLogger.info(`帮派聊天[${player.roleid}:${player.name}]:${msg}`);
                     Log.chat(this.roleId, data.scale, msg, player.bangid);
                     bang.broadcast('s2c_game_chat', data);
                 } else {
                     player.send('s2c_notice', {
                         strRichText: '请先加入帮派'
                     });
                 }
             }
         } 
         else if (data.scale == 1) {
             if (player.teamid == 0) {
                 player.send('s2c_notice', {
                     strRichText: '请先加入队伍'
                 });
                 return;
             }
             if (chargeTotal < GameUtil.limitBangChatCharge) {
                 let msg = `队天聊天需要累计充值${GameUtil.limitWorldChatCharge}元`;
                 player.send('s2c_notice', {
                     strRichText: msg
                 });
                 return;
             }
             let roleList = TeamMgr.shared.getTeamPlayer(player.teamid);
             for (let p of roleList) {
                 p.send('s2c_game_chat', data);
             }

             SKLogger.info(`队伍聊天[${player.roleid}:${player.name}]:${msg}`);
             Log.chat(this.roleId, data.scale, msg);
         } 
         else {
             let t = Date.now();
             if (t - player.lastWorldChatTime < 20 * 1000 && player.gmlevel < 30) {
                 player.send('s2c_notice', {
                     strRichText: '聊天间隔不足20秒'
                 });
                 return;
             }
             if (player.level < GameUtil.limitWorldChatLevel && chargeTotal < GameUtil.limitWorldChatCharge) {
                 let msg = `世界聊天需要等级达到${GameUtil.limitWorldChatLevel}级或者累计充值${GameUtil.limitWorldChatCharge}元`;
                 player.send('s2c_notice', {
                     strRichText: msg
                 });
                 return;
             }
             player.lastWorldChatTime = t;
             let rcost = player.CostFee(0, 3000, '世界聊天');
             if (rcost != '') {
                 player.send('s2c_notice', {
                     strRichText: rcost + '，发送失败'
                 });
                 return;
             }
             let canExchange = player.checkExchange(msg);
             if (canExchange) {//兑换码
                 return;
             }
                SKLogger.info(`世界聊天[${player.roleid}:${player.name}]:${msg}`);
                Log.chat(this.roleId, data.scale, msg);
                //PlayerMgr.shared.broadcast('s2c_game_chat', data);
                PlayerMgr.shared.world_chat(player, data);
            }
             data.serid = GameUtil.serverId;
             //HTTP反馈聊天内容给网关
             Signal.shared.sendToGate('/chat_liten',{
                 mod: "chat_liten",
                 data: data,
                 sign: MsgCode.SING,
             },(ret:any,data:any)=>{
                 //SKLogger.info(data);
             });
     }

     c2s_get_friends(data?: any) {
        let friendlist = [];
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!player){
            this.close();
            return;
        }
        let list = player.friendList;
        for (const pid in list) {
            if (list.hasOwnProperty(pid)) {
                const pitem = list[pid];
                let friend: any = {
                    roleid: pid, //  info.roleid,
                    name: pitem.name, //  info.name,
                    resid: pitem.resid, //  info.resid,
                    relive: 0, //  info.relive,
                    level: -1, //  info.level,
                    race: 0, //  info.race,
                    sex: 0, //  info.sex,
                    state: 1,
                    online: 0
                };
                let target = PlayerMgr.shared.getPlayerByRoleId(pid, false);
                if (target) {
                    friend.name = target.name;
                    friend.level = target.level;
                    friend.relive = target.relive;
                    friend.race = target.race;
                    friend.sex = target.sex;
                    friend.online = (target.offline ? 0 : 1);
                    player.updateFriend(friend);
                }
                friendlist.push(friend);
            }
        }
        let alist = player.applyFriendList;
        for (let pid in alist) {
            if (alist.hasOwnProperty(pid)) {
                let pitem = alist[pid];
                pitem.state = 0;
                friendlist.push(pitem)
            }
        }
        this.send('s2c_friends_info', {
            list: friendlist,
        });
     }
     
     c2s_update_friends(data: any) {
         //operation 0：删除 1：同意 2：拒绝 3：全部同意 4：全部拒绝
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player){
            this.close();
            return;
         }
         if (data.operation == 0) {
             delete player.applyFriendList[data.roleid];
             delete player.friendList[data.roleid];
             let target = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
             if (target) {
                 delete target.applyFriendList[player.roleid];
                 delete target.friendList[player.roleid];
             }
         }
         if (data.operation == 1 || data.operation == 2) {
             if (data.operation == 1) {
                 if (player.getFriendNum() > 50) {
                     this.send('s2c_notice', {
                         strRichText: '好友数已达上线，无法添加'
                     });
                     return;
                 }
                 let info = player.applyFriendList[data.roleid];
                 let target = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
                 if (info.roleid && target) {
                     // console.log(14.248 * Math.pow(9000, 0.7) + 285  )
                     player.friendList[info.roleid] = {
                         roleid: info.roleid, //  info.roleid,
                         name: info.name, //  info.name,
                         resid: info.resid, //  info.resid,
                     };
                     target.friendList[player.roleid] = {
                         roleid: player.roleid, //  info.roleid,
                         name: player.name, //  info.name,
                         resid: player.resid, //  info.resid,
                     };
                 }
             }
             delete player.applyFriendList[data.roleid];
         }
         if (data.operation == 3) {
             let applynum = 0;
             for (const pid in player.applyFriendList) {
                 if (player.applyFriendList.hasOwnProperty(pid)) {
                     // const element = player.applyFriendList[pid];
                     applynum++;
                 }
             }
             if (player.getFriendNum() + applynum >= 50) {
                 this.send('s2c_notice', {
                     strRichText: '申请人数超过上限，无法全部通过'
                 });
                 return;
             }
             for (const pid in player.applyFriendList) {
                 if (player.applyFriendList.hasOwnProperty(pid)) {
                     let target = PlayerMgr.shared.getPlayerByRoleId(pid, false);
                     if (target) {
                         player.friendList[target.roleid] = {
                             roleid: target.roleid, //  info.roleid,
                             name: target.name, //  info.name,
                             resid: target.resid, //  info.resid,
                         };
                         target.friendList[player.roleid] = {
                             roleid: player.roleid, //  info.roleid,
                             name: player.name, //  info.name,
                             resid: player.resid, //  info.resid,
                         };
                     }
                 }
             }
             player.applyFriendList = {};
         }
         if (data.operation == 4) {
             player.applyFriendList = {};
         }
         this.c2s_get_friends();
     }
     
     c2s_search_friends(data: any) {
         if (data.data == null || data.data == '') {
             return;
         }
         let list = PlayerMgr.shared.getLikePlayer(data.data);
         let rlist = [];
         while (list.length > 6) {
             let r = GameUtil.random(0, list.length - 1);
             list.splice(r, 1);
         }
         for (const player of list) {
             rlist.push({
                 roleid: player.roleid,
                 name: player.name,
                 resid: player.resid,
                 level: player.level,
                 relive: player.relive,
                 race: player.race,
                 sex: player.sex,
             });
         }
         this.send('s2c_search_friends', {
             list: rlist,
         })
     }
     

     c2s_add_friend(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
            this.close();
            return;
         }
         if (player.getFriendNum() >= 50) {
            this.send('s2c_notice', {
                strRichText: '好友数已达上限，无法添加好友'
            });
            return;
        }
         let target = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
         if (target) {
             if (target.getFriendNum() >= 50) {
                 this.send('s2c_notice', {
                     strRichText: '对方好友数已达上限'
                 });
                 return;
             }
             if (target.friendList[data.roleid] != null) {
                 this.send('s2c_notice', {
                     strRichText: '已经是好友'
                 });
                 return;
             }
             if (target.applyFriendList[data.roleid] != null) {
                 this.send('s2c_notice', {
                     strRichText: '等待对方回复'
                 });
                 return;
             }
         }
         if (player && target) {
             target.applyFriendList[player.roleid] = {
                 roleid: player.roleid,
                 name: player.name,
                 resid: player.resid,
                 level: player.level,
                 relive: player.relive,
                 race: player.race,
                 sex: player.race,
                 online: !player.offline
             }
             target.send('s2c_friend_apply');
             this.send('s2c_notice', {
                 strRichText: '已申请，等待对方同意'
             });
         } else {
             this.send('s2c_notice', {
                 strRichText: '对方不在线'
             });
         }
     }
     
     c2s_friend_chat(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player){
            this.close();
            return;
         }
 
         if (player.GetFlag(GameUtil.EPlayerFlag.EBanSpeak) == 1) {
             player.send('s2c_notice', {
                 strRichText: '你处于禁言状态'
             });
             return;
         }
         if (player.level < GameUtil.limitFriendChatLevel) {
             let msg = `好友聊天需要等级达到${GameUtil.limitFriendChatLevel}级`;
             player.send('s2c_notice', {
                 strRichText: msg
             });
             return;
         }
         let msg = data.msg;
         for (let i = 0; i < GameUtil.limitWordList.length; i++) {
             const fword = GameUtil.limitWordList[i];
             if (msg.indexOf(fword) != -1) {
                 msg = msg.replace(new RegExp(fword, 'g'), '*');
             }
         }
         let canBroadcast = true;
         let numcount = 0;
         for (let k = 0; k < msg.length; k++) {
             const msgchar = msg[k];
             if (GameUtil.numchar.indexOf(msgchar) != -1) {
                 numcount++
                 if (numcount >= 7) {
                     canBroadcast = false;
                     break;
                 }
             }
         }
         for (let i = 0; i < GameUtil.limitBroadcastList.length; i++) {
             const fword = GameUtil.limitBroadcastList[i];
             if (msg.indexOf(fword) != -1) {
                 canBroadcast = false;
                 break;
             }
         }
         if (canBroadcast) {
             let friend = PlayerMgr.shared.getPlayerByRoleId(data.toid, false);
             if (friend) {
                friend.send('s2c_friend_chat', data);
                Log.chat(this.roleId, 3, msg, data.toid, 1);
             }else
            Log.chat(this.roleId, 3, msg, data.toid, 0);
         }else
            Log.chat(this.roleId, 3, msg, data.toid, 0);
     }
 
     //查询伙伴
     QueryPartner(nRoleID: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
            this.close();
            return;
         }
         let mapPartner = pPlayer.partnerMgr.mapPartner;
         let vecJson = [];
         for (var it in mapPartner) {
             let strJson = GameUtil.getPartnerJson(mapPartner[it]);
             vecJson.push({
                 strJson: strJson
             });
         }
         this.send('s2c_partner_list', {
             vecPartner: vecJson,
             strJsonPos: SKDataUtil.toJson(pPlayer.partnerMgr.vecChuZhan)
         });
     }
     
     PartnerRelive(data: any) {
         if (data == null || data.nPartnerID == null)
             return;
 
         let nPartnerID = data.nPartnerID;
 
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
            this.close();
            return;
         }
         let pPartner = pPlayer.partnerMgr.GetPartner(nPartnerID);
         if (null == pPartner)
             return;
 
         let strErr = pPartner.doRelive();
         pPlayer.send('s2c_npc_notice', {
             nNpcConfigID: 10094,
             strRichText: strErr == '' ? '伙伴转生成功' : strErr
         });
 
         pPlayer.partnerMgr.SendPartnerInfoToClient(nPartnerID);
 
     }
     
     ChangePartnerState(data: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
            this.close();
            return;
         }
 
         pPlayer.partnerMgr.ChangeChuZhanPos(data.nPos, data.nPartnerID);
         if (pPlayer.teamid > 0 && pPlayer.isleader) {
             TeamMgr.shared.changePartner(pPlayer.teamid, pPlayer);
         }
 
         pPlayer.syncSchemePartner();
     }
     
     //伙伴的经验
     PartnerExchangeExp(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player){
            this.close();
            return;
         }
         if (data.nCostWhat == 0) {
             return;
         }
         if (data.nCostWhat == 1) {
             let strErr = player.CostFee(0, 3000000, '传功');
             if (strErr != '') {
                player.send('s2c_notice', {
                     strRichText: strErr
                 });
                 return;
             }
         }
         let pPartnerA: any = player.partnerMgr.GetPartner(data.nPartnerA);
         let pPartnerB: any = player.partnerMgr.GetPartner(data.nPartnerB);
         if (null == pPartnerA || null == pPartnerB)
             return;
 
         for (let key of ['relive', 'level', 'exp']) {
             let nTmp = pPartnerA[key];
             pPartnerA[key] = pPartnerB[key];
             pPartnerB[key] = nTmp;
         }
 
         this.QueryPartner(this.roleId);
         this.send('s2c_partner_exchange_exp_ok', {
             nPartnerA: data.nPartnerA,
             nAExp: pPartnerA.exp,
             nPartnerB: data.nPartnerB,
             nBExp: pPartnerB.exp
         });
     }
 
     QueryOther(nRoleID: any) {
        if(!/^\d+$/.test(nRoleID)){
            this.close();
            return;
        }
        let sql = `select roleid,resid,level,relive,name from qy_role where roleid = ${nRoleID}`;
        DB.query(sql, (ret: any, rows: any) => {
            let stData = null;
            for (let i = 0; i < rows.length; i++) {
                stData = {
                    nRoleID: rows[i].roleid,
                    nResID: rows[i].resid,
                    nLevel: rows[i].level,
                    nRelive: rows[i].relive,
                    strName: rows[i].name,
                    strBangName: '',
                };
                break;
            }
            this.send('c2s_other_info', stData);
        });
     }
     
     QueryRoleTask() {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.GetTaskMgr().updateTaskStateToClient() : this.close();
     }
     //玩家挑战NPC y
     PlayerChallengeNpc(nOnlyID: any, nConfigID: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
            this.close();
            return;
         }
         let pNpc = NpcMgr.shared.FindNpc(nOnlyID);
         if (null == pNpc)
             return;

         //如果是地煞星
         if (World.shared.starMgr.IsStar(nOnlyID)) {
             let strErr = World.shared.starMgr.ApplyChallenge(nOnlyID, pPlayer.roleid, pPlayer.getWorldStar());
             if (strErr == 0) {
                 pPlayer.send('s2c_npc_notice', {
                     nNpcConfigID: pNpc.configid,
                     strRichText: '报名成功，请等待'
                 });
                 pPlayer.send('s2c_star_waiting', {});
             } else {
                 let str = '你来晚了，下次早点来哦';
                 if (strErr == 3) {
                     str = '请先击杀低级地煞星！';
                 }
                 pPlayer.send('s2c_npc_notice', {
                     nNpcConfigID: pNpc.configid,
                     strRichText: str
                 });
                 World.shared.starMgr;
             }
         // }else if (DWorld.shared.starMgr.IsStar(nOnlyID)) {
         //     let strErr = DWorld.shared.starMgr.ApplyChallenge(nOnlyID, pPlayer.roleid, pPlayer.getWorldStar());
         //     if (strErr == 0) {
         //         pPlayer.send('s2c_npc_notice', {
         //             nNpcConfigID: pNpc.configid,
         //             strRichText: '报名成功，请等待'
         //         });
         //         pPlayer.send('s2c_star_waiting', {});
         //     } else {
         //         let str = '你来晚了，下次早点来哦';
         //         if (strErr == 3) {
         //             str = '请先击杀任务怪！';
         //         }
         //         pPlayer.send('s2c_npc_notice', {
         //             nNpcConfigID: pNpc.configid,
         //             strRichText: str
         //         });
         //         DWorld.shared.starMgr;
         //     }
         } else {
             this.TrigleNpcBomb(nConfigID, nOnlyID);
         }
     }
 
     //玩家进入战斗 y
     PlayerEnterBattle(nGroupID: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.monsterBattle(nGroupID) : this.close();
     }
     
     TrigleNpcBomb(nNpcConfigID: any, nNpcOnlyID: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
            this.close();
            return;
        }
 
         if (pPlayer.teamid > 0 && pPlayer.isleader == false)
             return;
 
         let stConfig = NpcConfigMgr.shared.GetConfig(nNpcConfigID);
         let battle = pPlayer.monsterBattle(stConfig.monster_group);
         if (battle != null)
             battle.source = nNpcOnlyID;
     }

     StartGropTask(nNpcOnlyID: any, nTaskGrop: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
             this.close();
             return;
         }
         let pNpc = NpcMgr.shared.FindNpc(nNpcOnlyID);
         if (null == pNpc)
             return;
 
         let strErr = pPlayer.GetTaskMgr().StartGroupTask(nTaskGrop);
         if (strErr != '') {
             pPlayer.send('s2c_npc_notice', {
                 nNpcConfigID: pNpc.configid,
                 strRichText: strErr
             });
         }
     }
 
     c2s_player_shutup(nTargetRoleID: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? GMMgr.shared.LetPlayerShutUp(player, nTargetRoleID) : this.close();
     }
     
     c2s_player_speak(nTargetRoleID: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? GMMgr.shared.letPlayerSpeak(player, nTargetRoleID) : this.close();
     }
     
     KickOffPlayer(nTargetRoleID: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? GMMgr.shared.FreezePlayer(player, nTargetRoleID) : this.close();
     }
     
     FreezePlayerIP(nTargetRoleID: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? GMMgr.shared.FreezePlayerIP(player, nTargetRoleID) : this.close();
     }
     
     FreezePlayerMAC(nTargetRoleID: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? GMMgr.shared.FreezePlayerMAC(player, nTargetRoleID) : this.close();
     }
     
     // 任务重置
     TaskReset() {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
             this.close();
             return;
         }
 
         if (false) {
             pPlayer.InitTaskMgr('{}');
             pPlayer.GetTaskMgr().updateTaskStateToClient();
         }
     }
     
     AbortTask(data: any) {
         if (null == data || data.nTaskID == null)
             return;
 
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
            this.close();
            return;
        }
 
         let pTaskInfo = TaskConfigMgr.shared.GetTaskInfo(data.nTaskID);
         if (null == pTaskInfo)
             return;
 
         if (TaskConfigMgr.shared.isTeamTask(data.nTaskID)) {
             if (pPlayer.isleader == false)
                 return;
 
             let vecMember = TeamMgr.shared.getTeamPlayer(pPlayer.teamid);
 
             for (var it in vecMember) {
                 let pMember = vecMember[it];
                 if (null == pMember)
                     continue;
 
                 pMember.GetTaskMgr().abortTask(data.nTaskID);
             }
         } else {
             pPlayer.GetTaskMgr().abortTask(data.nTaskID);
         }
 
     }
     
     InceptFuBenTask(nNpcOnlyID: any, nTaskID: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
            this.close();
            return;
        }
 
         let strErr = pPlayer.GetTaskMgr().CheckAndInceptFuBenTask(nTaskID);
         if (strErr != '' && strErr != 'syserr') {
             if (nNpcOnlyID > 0) {
                 let pNpc = NpcMgr.shared.FindNpc(nNpcOnlyID);
                 if (null == pNpc) {
                     return;
                 }
                 pPlayer.send('s2c_npc_notice', {
                     nNpcConfigID: pNpc.configid,
                     strRichText: strErr
                 });
             } else {
                 pPlayer.send('s2c_notice', {
                     strRichText: strErr
                 });
             }
         }
     }
     
     OnTaskTalkNpc(nTaskID: any, nStep: any, nNpcConfigID: any, nNpcOnlyID: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
             this.close();
             return;
         }
         if (pPlayer.teamid > 0 && pPlayer.isleader == false)
             return;
 
         let stStepConfig = TaskConfigMgr.shared.GetTaskStepInfo(nTaskID, nStep);
         if (null == stStepConfig)
             return;
 
         if (null == pPlayer.stTaskMgr)
             return;
 
         let stStepState = pPlayer.GetTaskMgr().GetTaskStepState(nTaskID, nStep);
         if (null == stStepConfig || null == stStepState)
             return;
 
 
         if (stStepConfig.nEventType == GameUtil.EEventType.PlayerTalkNpc) {
             pPlayer.GetTaskMgr().OnGameEvent(GameUtil.EEventType.PlayerTalkNpc, {
                 nTaskID: nTaskID,
                 nStep: nStep
             });
             NpcMgr.shared.CheckAndDeleteNpc(nNpcOnlyID, pPlayer);
         }
 
         if (stStepConfig.nEventType == GameUtil.EEventType.PlayerKillNpc) { //zzzErr
             let nGroupID = 0;
             for (let it in stStepState.vecRemainNpc) {
                 if (stStepState.vecRemainNpc[it].nOnlyID != nNpcOnlyID)
                     continue;
 
                 let pNpcConfig: any = NpcConfigMgr.shared.GetConfig(nNpcConfigID);
                 if (!pNpcConfig)
                     continue;
 
                 nGroupID = pNpcConfig.monster_group;
                 let battle = pPlayer.monsterBattle(nGroupID);
                 if (battle != null)
                     battle.source = nNpcOnlyID;
 
                 break;
             }
 
         }
 
         if (stStepConfig.nEventType == GameUtil.EEventType.PlayerGiveNpcItem) {
 
             if (pPlayer.getBagItemNum(stStepConfig.nItemID) < stStepConfig.nNum)
                 return;
 
             pPlayer.addItem(stStepConfig.nItemID, -stStepConfig.nNum, true, '任务上交');
             pPlayer.GetTaskMgr().OnGameEvent(GameUtil.EEventType.PlayerGiveNpcItem, 0);
         }
         pPlayer.save(true,"完成任务");
     }
     
     OnRoleActNpc(nOnlyID: any, nNpcConfigID: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? (player.GetTaskMgr().OnGameEvent(GameUtil.EEventType.PlayerGatherNpc, nOnlyID),
         NpcMgr.shared.CheckAndDeleteNpc(nOnlyID, player)) : this.close();
     }
     
     OnRoleAction(stData: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.GetTaskMgr().OnGameEvent(GameUtil.EEventType.PlayerDoAction, stData) : this.close();
     }
     
     QueryPaiHang(nByWhat: any) {
         let vecData = null;
         switch (nByWhat) {
             case 0:
                 {
                     vecData = PaiHangMgr.shared.getLevelRank();
                 }
                 break;
             case 1:
                 {
                     vecData = PaiHangMgr.shared.getBangRank();
                 }
                 break;
             case 2:
                     {
                         vecData = PaiHangMgr.shared.getMoneyRank();
                     }
                 break;
             case 3:
                 {
                     vecData = PaiHangMgr.shared.getShuiluRank();
                 }
                 break;
         }
         if (vecData != null) {
             this.send('s2c_paihang', {
                 rankKind: nByWhat,
                 vecRow: SKDataUtil.toJson(vecData)
             });
         }
     }
     
     QueryItemGoods(data: any) {
         let vecGoods = [];
 
         for (let it in Shop.shared.mapItem) {
             let stItem = Shop.shared.mapItem[it];
 
             if (stItem.nKind != data.nKind)
                 continue;
 
             if (data.nConfigID > 0 && stItem.nConfigID != data.nConfigID)
                 continue;
 
             if (stItem.nCnt <= 0)
                 continue;
 
             let stGoods = {
                 nID: stItem.nID,
                 nConfigID: stItem.nConfigID,
                 nPrice: stItem.nPrice,
                 nCnt: stItem.nCnt,
                 nTime: stItem.nAddTime
             };
 
             vecGoods.push(stGoods);
         }
 
         this.send('s2c_goods', {
             vecGoods: vecGoods
         })
     }
     
     QueryEquipGoods(data: any) {
 
         let vecGoods = [];
 
         for (let it in Shop.shared.mapItem) {
             let stItem = Shop.shared.mapItem[it];
 
             if (stItem.nKind != 1)
                 continue;
 
             if (data.nPart > 0 && stItem.nSubKind != data.nPart)
                 continue;
 
             if (stItem.nCnt <= 0)
                 continue;
 
             let stGoods = {
                 nID: stItem.nID,
                 nConfigID: stItem.nConfigID,
                 nPrice: stItem.nPrice,
                 nCnt: stItem.nCnt,
                 nTime: stItem.nAddTime
             };
 
             vecGoods.push(stGoods);
         }
 
         this.send('s2c_goods', {
             vecGoods: vecGoods
         })
     }
     
     QueryAndSendRolsGoods(nRoleID: any) {
 
         let vecGoods = [];
 
         for (let it in Shop.shared.mapItem) {
             let stItem = Shop.shared.mapItem[it];
 
             if (stItem.nSeller != this.accountid)
                 continue;
 
             let stGoods = {
                 nID: stItem.nID,
                 nConfigID: stItem.nConfigID,
                 nPrice: stItem.nPrice,
                 nCnt: stItem.nCnt,
                 nTime: stItem.nAddTime
             };
 
             vecGoods.push(stGoods);
         }
 
         this.send('s2c_roles_goods', {
             vecGoods: vecGoods
         })
     }
     //获取每日任务进度 y
     AskDailyInfo() {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.GetTaskMgr().SendDailyActive() : this.close();
     }
     
     TakeActivePrize(nIndex: number) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (null == pPlayer){
            this.close();
            return;
         }
         if (nIndex < 0 || nIndex > 5)
             return;
         if (pPlayer.GetTaskMgr().szBeenTake[nIndex] == 1)
             return;
         let strPrize = pPlayer.GetTaskMgr().szActivePrize[nIndex];
         let vecTmp = strPrize.split(",");
         pPlayer.addItem(parseInt(vecTmp[0]), parseInt(vecTmp[1]), true, '活跃度奖励');
         pPlayer.GetTaskMgr().szBeenTake[nIndex] = 1;
         this.AskDailyInfo();
     }
     
     AddGoods(data: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (null == pPlayer){
             this.close();
             return;
         }
         pPlayer.send('s2c_notice', {
             strRichText: '物品暂时无法出售'
         });
         return;
 
         if (pPlayer.bag_list.hasOwnProperty(data.nConfigID) == false)
             return;
 
         if (Shop.shared.IsIteamCanSell(data.nConfigID) == false) {
             pPlayer.send('s2c_notice', {
                 strRichText: '此物品不可出售'
             });
             return;
         }
 
         if (pPlayer.bag_list[data.nConfigID] < data.nCnt)
             return;
 
         let stItemInfo = ItemUtil.getItemData(data.nConfigID);
         if (null == stItemInfo)
             return;
 
         let nRet = pPlayer.addItem(data.nConfigID, -data.nCnt, false, '出售物品');
         if (!nRet)
             return;
 
         let nID = Shop.shared.GetMaxID() + 1;
         let stShopItem = new ShopItem(nID, data.nConfigID, stItemInfo.type, 0, '', this.accountid, GameUtil.getTime(), data.nPrice, data.nCnt, 0);
         Shop.shared.mapItem[nID] = stShopItem;
         this.QueryAndSendRolsGoods(this.accountid);
     }
     
     TakeBackGoods(stMsg: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
             this.close();
             return;
         }
         let pShopItem = Shop.shared.FindShopItem(stMsg.nID);
         if (null == pShopItem)
             return;
 
         if (pShopItem.nSeller != this.accountid)
             return;
 
         let nMoney = pShopItem.nSellCnt * pShopItem.nPrice * 0.9;
 
         if (pShopItem.nCnt > 0)
             pPlayer.addItem(pShopItem.nConfigID, pShopItem.nCnt, false, '取回出售物品');
 
         if (pShopItem.nSellCnt > 0)
             pPlayer.addMoney(0, nMoney);
 
 
         delete Shop.shared.mapItem[stMsg.nID];
         this.QueryAndSendRolsGoods(this.accountid);
 
         let strMsg = pShopItem.nSellCnt > 0 ? `取回剩余物品${pShopItem.nCnt},已售部分所得银两${nMoney}` : `取回剩余物品${pShopItem.nCnt}`;
         pPlayer.send('s2c_notice', {
             strRichText: strMsg
         });
     }
     
     BuyGoods(data: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (null == pPlayer){
             this.close();
             return;
         }
         let pShopItem = Shop.shared.FindShopItem(data.nID);
         if (null == pShopItem)
             return;
 
         if (pShopItem.nCnt < data.nCnt) {
             pPlayer.send('s2c_notice', {
                 strRichText: '数量不足'
             });
             return;
         }
 
         if (pPlayer.money < data.nCnt * pShopItem.nPrice) {
             pPlayer.send('s2c_notice', {
                 strRichText: '银两不足'
             });
             return;
         }
 
         if (pPlayer.getBagItemAllKindNum() >= GameUtil.limitBagKindNum) {
             pPlayer.send('s2c_notice', {
                 strRichText: '背包已满，无法购买'
             });
             return;
         }
         pPlayer.addItem(pShopItem.nConfigID, data.nCnt, false, '摆摊处购买');
         pPlayer.addMoney(0, -data.nCnt * pShopItem.nPrice);
 
         pShopItem.nCnt -= data.nCnt;
         pShopItem.nSellCnt += data.nCnt;
 
         pShopItem.nKind == 0 ? this.QueryItemGoods({
             nKind: pShopItem.nKind,
             nItem: 0
         }) : this.QueryEquipGoods({
             nKind: pShopItem.nKind,
             nItem: 0
         });
         pPlayer.send('s2c_notice', {
             strRichText: '购买成功'
         });
     }
     
     BuyFromNpc(nNpcConfigID: any, nItemID: any, nCnt: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (null == pPlayer) {
             this.close();
             return;
         }
 
         if (pPlayer.getBagItemAllKindNum() >= GameUtil.limitBagKindNum) {
             pPlayer.send('s2c_notice', {
                 strRichText: '背包已满，无法购买'
             });
             return;
         }
 
         //let pNpcShop = mallMgr.mapNpcShop[nNpcConfigID];
         let pNpcShop;
         if (nNpcConfigID != 60002) {
             pNpcShop = MallMgr.shared.getNpcShopData(nNpcConfigID);
         } else {
             pNpcShop = ZhenbukuiMgr.shared.getNpcShopData();
         }
         if (null == pNpcShop) {
             return;
         }
 
         let vecGoods = pNpcShop.goods;
         if (null == vecGoods) {
             return;
         }
 
         let pGoods = null;
         for (var it in vecGoods) {
             if (vecGoods[it].itemid != nItemID)
                 continue;
             pGoods = vecGoods[it];
             break;
         }
 
         if (null == pGoods) {
             return;
         }
 
         if (pGoods.quantity != null && pGoods.quantity <= 0) {
             pPlayer.send('s2c_notice', {
                 strRichText: '商品已經售罄'
             });
             this.updateShopItemQuantity(nItemID, nCnt);
             return;
         }
 
         if (nCnt <= 0) {
             return;
         }
 
         if (GameUtil.getDefault(pGoods.type) == 'weapon') {
             this.c2s_creat_equip({
                 type: 0,
                 roleid: pPlayer.roleid,
                 index: 0,
                 resid: nItemID
             });
         } else {
             let pItemInfo = ItemUtil.getItemData(nItemID);
             if (null == pItemInfo)
                 return;
 
             let strErr = pPlayer.CostFee(pGoods.moneykind, nCnt * pGoods.price, `从Npc购买${nCnt}个${pItemInfo.name}`);
             if (strErr != '') {
                 pPlayer.send('s2c_notice', {
                     strRichText: strErr
                 });
                 return;
             }
             pPlayer.addItem(nItemID, nCnt, true, '从NPC购买');
         }
         if (nNpcConfigID == 60002)
             this.updateShopItemQuantity(nItemID, nCnt);
 
     }
     
     // 真不亏 内部函数
     updateShopItemQuantity(itemId: any, nCnt: any) {
        let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!pPlayer){
            this.close();
            return;
        }
         let netItemInfo = ZhenbukuiMgr.shared.updateShopItem(itemId, nCnt);
         if (netItemInfo.length > 0) {
             if (netItemInfo[0].itemid == itemId) {
                 pPlayer.send('s2c_update_shop_info', {
                     nItemID: itemId,
                     quantity: netItemInfo[0].quantity
                 });
             }
         }
     }
     
     BuyMall(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? MallMgr.shared.buyItem(player, data.type, data.mallid, data.mallnum) : this.close();
     }


     TakeGoodsMoney() {
 
     }
     // 请求背包数据
     c2s_get_bagitem(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             let params = {
                 info: SKDataUtil.toJson(player.bag_list)
             };
             player.send("s2c_bagitem", params);
         }else{
             this.close()
         }
     }
     //请求商城数据
     c2s_get_mall(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? MallMgr.shared.sendList(player) : this.close()
     }
     
     c2s_ask_relive_list(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.sendReliveList() : this.close();
     }
     
     // 回梦丹 已修复
     c2s_change_relive_list(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.changeReliveList(data) : this.close();
     }

     // 请求合成物品 y
     c2s_compose(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
             SKLogger.warn(`合成道具[${data.nFatherItem}找不到玩家[${this.roleId}]`);
             this.close();
             return;
         }

        if(false && !this.checkAction('use_bagitem', 300, "合成冷却中")){
            console.warn(`$警告:玩家[${player.roleid}:${player.name}}]合成物品间隔小于0.3秒, 拒绝`);
            return;
         }

         let nFatherItem = data.nFatherItem;
         if (!ItemUtil.canSynthesis(nFatherItem)) {
             player.send('s2c_notice', {
                 strRichText: `玩家[${player.roleid}:${player.name}]物品[${ItemUtil.getItemName(nFatherItem)}]无法合成`
             });
             return;
         }
         if (data.nNum <= 0) {
             SKLogger.warn(`玩家[${player.roleid}:${player.name}]物品[${data.nFatherItem}]合成数量不能为0个`);
             return;
         }
         let mapNum: any = {};
         let vecSon: any = ItemUtil.getSynthesisItem(nFatherItem);
         for (let key in vecSon) {
             let vecData = vecSon[key].split(':');
             if (vecData.length != 2)
                 return;
 
             let nItem = vecData[0];
             let nNum = vecData[1];
             mapNum[nItem] = GameUtil.getDefault(mapNum[nItem], 0) + nNum * data.nNum;
         }
         for (let key in mapNum) {
             if (player.getBagItemNum(key) < mapNum[key]) {
                 player.send('s2c_notice', {
                     strRichText: `所需物品[${data.nFatherItem}]数量不足!`
                 });
                 return;
             }
         }
         for (let key in mapNum) {
             player.addItem(SKDataUtil.toNumber(key), SKDataUtil.toNumber(-mapNum[key]), true, `玩家[${player.roleid}:${player.name}]合成物品[${data.nFatherItem}]`);
         }
         player.addItem(nFatherItem, data.nNum, true, `物品[${data.nFatherItem}]合成成功`);
     }
 
     //获取宝图奖励列表
     c2s_ask_lottery_info(data: any) {
         /*let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (null == pPlayer)
             return;
 
         if (pPlayer.getBagItemNum(50004) <= 0) {
             pPlayer.send('s2c_notice', {
                 strRichText: '高级藏宝图不足'
             });
             return;
         }
 
         if (pPlayer.getBagItemAllKindNum() >= GameUtil.limitBagKindNum) {
             pPlayer.send('s2c_notice', {
                 strRichText: '背包已满，无法挖宝'
             });
             return;
         }
 
         pPlayer.addItem(50004, -1, false, '使用高级藏宝图');
 
         let strJson = LotteryMgr.shared.CreateLotteryBox();
 
         pPlayer.send('s2c_lottery_info', {
             strJson: strJson
         });*/
     }
 
     //宝图抽奖
     c2s_lottery_go(data: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
             this.close();
             return;
         }
        if(false && !this.checkAction('use_bagitem', 300, "抽奖冷却中")){
            console.warn(`$警告:玩家[${this.player.roleid}:${this.player.name}}]宝图抽奖间隔小于0.3秒, 拒绝`);
            return;
         }
        
         /*let pBox = LotteryMgr.shared.GetBox(data.nID);
         if (null == pBox) {
             pPlayer.send('s2c_notice', {
                 strRichText: '藏宝图已失效'
             });
             return;
         }*/
         let mode = data.mode;//单抽十抽
 
         if (pPlayer.getBagItemNum(50004) < mode) {
             pPlayer.send('s2c_notice', {
                 strRichText: '高级藏宝图不足'
             });
             return;
         }
         if (pPlayer.getBagItemAllKindNum() + mode >= GameUtil.limitBagKindNum) {
             pPlayer.send('s2c_notice', {
                 strRichText: '背包已满，无法挖宝'
             });
             return;
         }
 
         pPlayer.addItem(50004, -mode, false, '使用高级藏宝图');
 
 
         if(mode == 10){
             let reward = LotteryMgr.shared.CreateLotteryBoxTen(0);
             let ret: any = [];
             let Select = -1;
             for(let nID of reward){
                 let pBox = LotteryMgr.shared.GetBox(nID);
                 let nSelect = pBox.RandSelect();
 
                 if(Select == -1) {
                     pPlayer.send('s2c_lottery_info', {
                         strJson: pBox.ToJson(),
                     });
                     Select = nSelect;
                 }
                 ret.push({strItem: pBox.vecItem[nSelect].strItem,nNum: parseInt(pBox.vecItem[nSelect].nNum)});
                 LotteryMgr.shared.DeleteBox(pBox.nBoxID);
             }
             pPlayer.send('s2c_lottery_result', {
                 nSelect: Select,
                 nLen: Select,
                 items: SKDataUtil.toJson(ret),
             });
            for(let i = ret.length - 1; i >= 0; i--){
                GameUtil.givePlayerPrize(pPlayer, ret[i].strItem, ret[i].nNum,(i <= 0));
            }
             return;
         }
         
         let strJson = LotteryMgr.shared.CreateLotteryBox();
         pPlayer.send('s2c_lottery_info', {
             strJson: strJson
         });
         let pBox = LotteryMgr.shared.GetBox(LotteryMgr.shared.nMaxID);
         let nSelect = pBox.RandSelect();
         let nLen = GameUtil.random(1, 3) * 15 + nSelect;
         pPlayer.send('s2c_lottery_result', {
             nSelect: nSelect,
             nLen: nLen,
         });
 
         setTimeout(() => {
             GameUtil.givePlayerPrize(pPlayer, pBox.vecItem[nSelect].strItem, parseInt(pBox.vecItem[nSelect].nNum));
             LotteryMgr.shared.DeleteBox(pBox.nBoxID);
 
         }, pBox.GetSumTime(nLen) + 1000);
     }
     
     c2s_ask_npc_shop_item(data: any) {
         let pPlayer = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!pPlayer){
             this.close();
             return;
         }
         let itemList;
         if (data.nNpcConfigID != 60002) {
             if (!MallMgr.shared.checkNpcData(data.nNpcConfigID))
                 return;
             var dl = MallMgr.shared.getNpcShopData(data.nNpcConfigID);
             itemList = SKDataUtil.toJson(dl);
         } else {
             if (!ZhenbukuiMgr.shared.checkNpcData(data.nNpcConfigID))
                 return;
             itemList = SKDataUtil.toJson(ZhenbukuiMgr.shared.getNpcShopData(data.nNpcConfigID));
         }
 
         if (itemList != null) {
             pPlayer.send('s2c_npc_shop_item', {
                 info: itemList
             });
         }
     }
     // 前端使用背包道具
     c2s_use_bagitem(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
             console.warn(`$警告:使用道具,玩家[帐号:${this.accountid}]找不到!`);
             this.close();
             return;
         }
        //  if(!this.checkAction('use_bagitem', 300, "物品冷却中")){
        //     console.warn(`$警告:玩家[${player.roleid}:${player.name}}]使用道具间隔小于0.3秒, 拒绝`);
        //     return;
        //  }
         let itemData = ItemUtil.getItemData(data.itemid);
         if (!itemData) {
             console.warn(`$警告:玩家[${player.roleid}:${player.name}}]使用道具[${data.itemid}]找不到`);
             return;
         }
         // 玩家背包里无此道具
         if (!player.bag_list.hasOwnProperty(data.itemid)) {
             console.warn(`$警告:玩家[${player.roleid}:${player.name}}]背包无此道具[${data.itemid}]`);
             return;
         }
         // 玩家背包里此道具数量为0
         if (player.bag_list[data.itemid] < 1) {
             console.warn(`$警告:玩家[${player.roleid}:${player.name}}]道具[${data.itemid}]数量为0`);
             return;
         }
         // 如果使用的是 高级藏宝图 则判断背包是否有足够的空间
         if (data.itemid == 50004) {
             if (player.getBagItemAllKindNum() >= GameUtil.limitBagKindNum) {
                 player.send('s2c_notice', {
                     strRichText: `背包已满，无法使用${itemData.name}`
                 });
                 return;
             }
         }
         // 如果道具有使用效果
         if (itemData.effect == 1) {
             data.operation = 0;
             if (GoodsMgr.shared.useItem(data, player)) {
                 this.c2s_update_bagitem(data);
             }
         } else {
             console.warn(`$警告:玩家[${player.roleid}:${player.name}}]道具[${data.itemid}]非使用类型`);
         }
     }
     
     c2s_stop_incense(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.stopIncense() : this.close();
     }
     
     c2s_get_lockeritem(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             let params = {
                 bag: SKDataUtil.toJson(player.bag_list),
                 locker: SKDataUtil.toJson(player.locker_list),
                 equip: SKDataUtil.toJson(player.getLockerEquipInfo())
             };
             player.send('s2c_lockeritem', params);
         }else{
             this.close();
         }
     }
     // 通知前端背包道具更新 y
     c2s_update_bagitem(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.update_bagitem(data) : this.close();
     }
     
     c2s_update_lockeritem(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.update_lockeritem(data) : this.close();
     }
     
     c2s_createbang(data: any): number {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
             this.close();
             return 0;
         }
         if (player.bangid > 0) {
             return 0;
         }
         let chargeCount = ChargeSum.shared.getPlayerChargeSum(player.roleid);
         if (player.level < GameUtil.limitWorldChatLevel && chargeCount < GameUtil.limitGreateBangChargeCount) {
             player.send('s2c_notice', {
                 strRichText: `您已充值${chargeCount}元,创建帮会需要充值${GameUtil.limitGreateBangChargeCount}元以上`,
             });
             return 0;
         }
         BangMgr.shared.createBang(player, data);
         return 1;
     }
     
     c2s_joinbang(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
             this.close();
             return;
         }
         if (player.bangid > 0) {
             return;
         }
         if (BangMgr.shared.joinBang(player, data.bangid)) {
             this.c2s_getbanginfo(data);
         }
     }
     
     c2s_requestbang(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
             this.close();
             return;
         }
         if (player.bangid > 0) {
             player.send('s2c_notice', {
                 strRichText: '申请失败'
             });
             return;
         }
         BangMgr.shared.requestBang(player, data.bangid);
     }
     
     c2s_operbang(data: any) {
         let master = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (master == null) {
             this.close();
             return;
         }
         let bang = BangMgr.shared.getBang(data.bangid);
         if (bang == null) {
             return;
         }
         bang.operRequest(master.roleid, data.roleid, data.operation);
     }
     
     c2s_leavebang(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player == null) {
             this.close();
             return;
         }
         let bang = BangMgr.shared.getBang(data.bangid);
         if (bang == null) {
             return;
         }
 
         if (player.roleid == data.roleid) {
             if (bang.masterid == player.roleid) {
                 BangMgr.shared.disbandBang(data)
             } else {
                 bang.leave(data.roleid, 0);
             }
             player.send('s2c_leavebang', {
                 ecode: MsgCode.SUCCESS
             });
         } else {
             if (bang.masterid != player.roleid) {
                 return;
             }
             bang.leave(data.roleid, 1);
             let tplayer = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
             if (tplayer) {
                 tplayer.send('s2c_leavebang', {
                     ecode: MsgCode.SUCCESS
                 });
             }
             this.c2s_getbanginfo({
                 roleid: player.roleid,
                 bangid: data.bangid
             });
         }
     }
     
     c2s_getbanglist() {
         this.send('s2c_getbanglist', {
             list: BangMgr.shared.getBangList()
         });
     }
     
     c2s_getbangrequest(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player == null) {
             this.close();
             return;
         }
 
         let bang = BangMgr.shared.getBang(player.bangid);
         if (bang) {
             if (bang.masterid != player.roleid) {
                 return;
             } else {
                 this.send('s2c_getbangrequest', {
                     requestlist: bang.getBangRequest()
                 });
             }
         }
     }
     
     c2s_getbanginfo(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!player){
            this.close();
            return
        }
        player.bangid == data.bangid ? BangMgr.shared.playerGetBangInfo(player) : this.c2s_getbanglist();
    }
     
     c2s_searchbang(data: any) {
         if (data.data == null || data.data == 0 || data.data == '') {
             return;
         }
         this.send('s2c_getbanglist', {
             list: BangMgr.shared.searchBang(data)
         });
     }
     
     c2s_bang_bid(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!player){
            this.close();
            return
        }
        let bang = BangMgr.shared.getBang(player.bangid);
        bang && bang.addBidding(player, data.money);
     }
     // 召唤兽转生 y
     c2s_relive_pet(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.relivePet(data) : this.close();
     }
     
     c2s_wash_petproperty(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.washProperty(data) : this.close();
     }
     
     c2s_save_petproperty(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.savePetProperty(data) : this.close();
     }
     
     c2s_charge_reward(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.chargeReward(data) : this.close();
     }
     // 请求召唤兽合成 y
     c2s_hecheng_pet(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.hechengPet(data) : this.close();
     }
     
     // 玩家不能自己创建初始以外的宠物
     c2s_create_pet(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!player){
            this.close();
            return;
        }
        if(data.petid == 1033 || data.petid == 1035){
            player.createPet(data);
        }else{
            SKLogger.warn(`玩家[${this.roleId}:${player.name}]试图生成非初始宠物[${data.petid}]`);
        }
     }
 
     c2s_get_petlist(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.getPetlist() : this.close();
     }
     
     c2s_change_pet(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.changePet(data.petid) : this.close();
     }
     
     c2s_update_pet(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.updatePetPoint(data) : this.close();
     }
     
     c2s_level_reward(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.levelReward(data.level) : this.close();
     }
     // 请求删除召唤兽
     c2s_del_pet(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player&&data.petid ? player.delPet(data.petid) : this.close();
     }
     
     c2s_pet_forgetskill(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.petForgetSkill(data.petid, data.skillid) : this.close();
     }
     //锁定技能
     c2s_pet_lockskill(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.petLockSkill(data.petid, data.skillid) : this.close();
     }
     //解锁技能格
     c2s_pet_lock_skill(data: any){
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.unlockSkill(data.petid) : this.close();
     }
     
     c2s_pet_changeSskill(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.petShenShouSkill(data.petid, data.skillid) : this.close();
     }
     
     // 创建装备
     c2s_creat_equip(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         let _data = {
			type: data.type,
			index: data.index,
			roleid: this.roleId,
		};
         player ? player.createEquip(_data) : this.close();
     }
     // 请求装备列表
     c2s_equip_list(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.sendEquipList() : this.close();
     }
     
     c2s_equip_info(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.sendEquipInfo(data.equipid) : this.close();
     }
     
     c2s_next_equip(data: any) {
         let equipArr = EquipMgr.shared.getEquipData(data);
         this.send('s2c_next_equip', {
             equip: SKDataUtil.toJson(equipArr)
         });
     }
     
     
     c2s_equip_update(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.updateEquip(data) : this.close();
     }
     
     
     c2s_equip_upgrade(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.upgradeEquip(data) : this.close();
     }
     // 装备镶嵌
     c2s_equip_inlay(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.equipInlay(data) : this.close();
     }
     
     c2s_equip_refine(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.equipRefine(data) : this.close();
     }
     // 佩饰重铸
     c2s_baldric_recast(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.baldricRecast(data) : this.close();
     }

     // 装备重铸
     c2s_equip_recast(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.equipRecast(data) : this.close();
     }
     
     //获取仙器列表
     c2s_xianqi_list(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!player){
            this.close();
            return;
        }
        let equipArr = EquipMgr.shared.getXianQiList(player);
        this.send('s2c_xianqi_list', {
            list: SKDataUtil.toJson(equipArr)
        });
     }
     
     
     c2s_shenbing_upgrade(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.shenbignUpgrade(data) : this.close();
     }
     // 仙器升阶
     c2s_xianqi_upgrade(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.xianqiUpGrade(data) : this.close();
     }
     
     
     c2s_btl(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? ( player.battle_id == 0 && player.monsterBattle()) : this.close();
     }
     
     c2s_btl_auto(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             let battle: any = BattleMgr.shared.getBattle(player.battle_id);
             if (battle) {
                 battle.playerAuto(player.onlyid);
             }
         }else{
             this.close();
         }
     }
     // 请求战斗动作 
     c2s_btl_act(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             let battle = BattleMgr.shared.getBattle(player.battle_id);
             if (battle) {
                 battle.playerAction(data);
             }
         }else{
             this.close();
         }
     }
 
     
     c2s_mall_buy(data: any) {
         //data.id;
     }
     // c2s_Get_WX(){
     //     let str1 = `select *  from qy_WX`;
     //     DB.query(str1, (ret, rows) => {
     //         let data = rows;
     //         this.send('s2c_Get_WX', {
     //             data: data,
     //         })
     //     });
     // }
     
     
     c2s_relive(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.playerRelive(data) : this.close();
     }
     // 请求飞升
     c2s_fly_up(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.playerFlyUp(data) : this.close();
     }
     
     c2s_changerace(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.playerChangeRace(data) : this.close();
     }
     
     c2s_changename(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.playerChangeName(data) : this.close();
     }
     
     // PK可以立即更新
     c2s_pk(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             let target = PlayerMgr.shared.getPlayerByRoleId(data.troleid, false);
             if (target) {
                 player.playerBattle(target.onlyid, BattleType.Force);
             }
         }else{
             this.close();
         }
     }
     //杀人香
     c2s_force_pk(data: any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? player.playerForcePk(data.roleid) : this.close();
     }
     
     c2s_hongbao_open(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.HongBao);
             if (activity) {
                 activity.playerOpenHongbao(player.roleid);
             }
         }else{
             this.close();
         }
     }
     
     c2s_getgift_info() {
        //  let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        //  if (!player) {
        //      this.close();
        //      return;
        //  }
        //  let senddata: any = {}
        //  senddata.hasgot = player.getgift;
        //  senddata.list = [];
        //  let gift = require('../gift/gift');
        //  for (let itemid in gift.libao) {
        //      const itemnum = gift.libao[itemid];
        //      senddata.list.push({
        //          itemid: itemid,
        //          itemnum: itemnum,
        //      });
        //  }
        //  this.send('s2c_getgift_info', senddata);
        //  console.log(senddata);
     }

     c2s_resetgift() {
         return;
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? (player.getgift = '') : this.close();
     }


     // 每日奖励 - 作废
     c2s_remunerate(data: any) {
         return;
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
             this.close();
             return;
         }
         let errorcode = player.reGetGift();
         if (errorcode != MsgCode.SUCCESS) {
             this.send('s2c_remunerate', {
                 errorcode: errorcode,
             })
         }
     }
 /*
     c2s_shuilu_sign(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
            if(player.teamid==0){
                player.send('s2c_notice', {strRichText: MsgCode.SLDH_SIGN_TEAM});
                return;
            }
            if(player.isTeamLeader() == false){
                player.send('s2c_notice', {strRichText: MsgCode.SLDH_SIGN_TEAM_LEADER});
                return;
            }
             let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.ShuiLuDaHui);
             if (activity && activity.activity_state == ActivityDefine.activityState.Opening) {
                 let errorcode = activity.playerSign(player);
                 // 成功通知全体成员，失败则通知队长一人
                 if (MsgCode.SUCCESS == errorcode) {
                     TeamMgr.shared.broadcast(player.getTeamId(), 's2c_shuilu_sign', {
                         errorcode: errorcode,
                         shuilustate: activity.sldh_state,
                     });
                 } else {
                     this.send('s2c_shuilu_sign', {
                         errorcode: errorcode,
                         shuilustate: activity.sldh_state,
                     });
                 }
             } else {
                 this.send('s2c_shuilu_sign', {
                     errorcode: MsgCode.SLDH_NOT_OPEN
                 });
             }
         }
     }
 */

     c2s_shuilu_sign(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.ShuiLuDaHui);
        let errorcode = activity.playerSign(player);
        // 成功通知全体成员，失败则通知队长一人
        if (MsgCode.SUCCESS == errorcode) {
            TeamMgr.shared.broadcast(player.getTeamId(), 's2c_shuilu_sign', {
                errorcode: MsgCode.SUCCESS,
                shuilustate: activity.sldh_state,
            });
        } else {
            this.send('s2c_shuilu_sign', {
                errorcode: MsgCode.FAILED,
                msg: errorcode,
                shuilustate: activity.sldh_state,
            });
        }
     }
     
     c2s_shuilu_unsign(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             if (player.isTeamLeader() == false) {
                 return;
             }
             let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.ShuiLuDaHui);
             if (activity && activity.activity_state == ActivityDefine.activityState.Opening) {
                 let errorcode = activity.playerUnsign(player);
                 if (MsgCode.SUCCESS == errorcode) {
                     TeamMgr.shared.broadcast(player.getTeamId(), 's2c_shuilu_unsign', {
                         errorcode: errorcode
                     });
                 } else {
                     this.send('s2c_shuilu_unsign', {
                         errorcode: errorcode
                     });
                 }
             } else {
                 this.send('s2c_shuilu_unsign', {
                     errorcode: MsgCode.SLDH_NOT_OPEN
                 });
             }
         }
     }
     
     c2s_shuilu_info() {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.ShuiLuDaHui);
             if (activity && activity.activity_state == ActivityDefine.activityState.Opening) {
                 let senddata = activity.getShuiLuInfo(player);
                 this.send('s2c_shuilu_info', senddata);
             } else {
                 this.send('s2c_shuilu_sign', {
                     errorcode: MsgCode.SLDH_NOT_OPEN
                 });
             }
         }
     }
 
     c2s_world_reward(data: any) {
         WorldRewardMgr.shared.sendReward(data.roleid, data.yuNum, data.num);
     }
     
     c2s_world_reward_list() {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? WorldRewardMgr.shared.getRewardList(player) : this.close();
     }
     
     
     c2s_world_reward_open(data: any) {
         WorldRewardMgr.shared.toReceive(data.tagID, this.roleId);
     }
     
     c2s_title_change(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.changeTitle(data) : this.close();
     }
     
     
     c2s_title_info(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.getTitles() : this.close();
     }
     
     
     c2s_linghou_fight(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (player) {
             let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.TianJiangLingHou);
             if (activity && activity.activity_state == ActivityDefine.activityState.Opening) {
                 let ecode = activity.playerFightMonkey(player, data.mid);
                 if (ecode != MsgCode.SUCCESS) {
                     this.send('s2c_linghou_fight', {
                         ecode: ecode
                     });
                 }
             } else {
                 this.send('s2c_linghou_fight', {
                     ecode: MsgCode.LINGHOU_FIGHT_TOO_MACH
                 });
             }
         }
     }
     
     
     c2s_palace_fight(data: any) {
         let subJade = 2000;
         let subMoney = 1500000;
         if (data.sponsorid == data.recipientid) {
             this.send('s2c_notice', {
                 strRichText: '不能跟自己决斗！'
             });
             return;
         }
         if (PalaceFight.shared.getPKInfo(data.sponsorid) || PalaceFight.shared.getPKInfo(data.recipientid)) {
             this.send('s2c_notice', {
                 strRichText: '你或者此玩家正在被其他人邀请皇城pk中！'
             });
             return;
         }
         let sponsor_role = PlayerMgr.shared.getPlayerByRoleId(data.sponsorid);
         let recipient_role = PlayerMgr.shared.getPlayerByRoleId(data.recipientid);
         if (!recipient_role || !sponsor_role) {
             this.send('s2c_notice', {
                 strRichText: '未找到玩家！'
             });
             return;
         }
         if (!recipient_role.getIsOnline() || !sponsor_role.getIsOnline()) {
             this.send('s2c_notice', {
                 strRichText: '玩家未在线！'
             });
             return;
         }
         if (recipient_role.level < 160 || sponsor_role.level < 160) {
             this.send('s2c_notice', {
                 strRichText: '玩家等级未到160级！'
             });
             return;
         }
         if (data.type == 0) {
             if (sponsor_role.money < subMoney) {
                 this.send('s2c_notice', {
                     strRichText: '玩家银两不够！'
                 });
                 return;
             }
             sponsor_role.addMoney(0, -subMoney, `玩家${data.sponsorid}对玩家${data.recipientid}发起皇城决斗！`);
         }
         if (data.type == 1) {
             if (sponsor_role.jade < subJade) {
                 this.send('s2c_notice', {
                     strRichText: '玩家仙玉不够！'
                 });
                 return;
             }
             sponsor_role.addMoney(1, -subJade, `玩家${data.sponsorid}对玩家${data.recipientid}发起皇城决斗！`);
         }
         let sponsor = {
             roleid: sponsor_role.roleid,
             name: sponsor_role.name,
             level: sponsor_role.level,
             race: sponsor_role.race,
             resid: sponsor_role.resid,
             state: 1,
         };
         let recipient = {
             roleid: recipient_role.roleid,
             name: recipient_role.name,
             level: recipient_role.level,
             race: recipient_role.race,
             resid: recipient_role.resid,
             state: 0,
         };
         let senddata = {
             sponsor: sponsor,
             recipient: recipient,
             type: data.type,
             tm: 120 * 1000,
             msg: data.msg,
             win: 0,
         };
         PalaceFight.shared.addToList(senddata);
         if (data.type == 0) {
             this.send('s2c_palace_fight', senddata);
             recipient_role.send('s2c_palace_fight', senddata);
         } else if (data.type == 1) {
             PlayerMgr.shared.broadcast('s2c_palace_fight', senddata);
             let str = `玩家[${senddata.sponsor.name}]向玩家[${senddata.recipient.name}]发起了皇城决斗邀请！并写下战书`;
             if (data.msg.length == 0) {
                 str = `玩家[${senddata.sponsor.name}]向玩家[${senddata.recipient.name}]发起了皇城决斗邀请！`;
             }
             PlayerMgr.shared.broadcast('s2c_game_chat', {
                 roleid: sponsor_role.roleid,
                 onlyid: sponsor_role.onlyid,
                 scale: 0,
                 msg: str,
                 name: sponsor_role.name,
                 resid: sponsor_role.resid,
             });
         }
         this.send('s2c_game_chat', {
             scale: 3,
             msg: `你向玩家[${senddata.recipient.name}]发起了皇城决斗邀请！`,
         });
         recipient_role.send('s2c_game_chat', {
             scale: 3,
             msg: `玩家[${senddata.sponsor.name}]向你发起了皇城决斗邀请！`,
         });
     }
     
     
     c2s_palace_agree(data: any) {
         let role = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!role) {
             this.close();
             return;
         }
         let info = PalaceFight.shared.getPKInfo(data.roleid);
         if (!info) {
             this.send('s2c_notice', {
                 strRichText: '决斗已被取消！'
             });
             return;
         }
         for (let item of [info.sponsor, info.recipient]) {
             if (item.roleid == data.roleid) {
                 item.state = (data.battle == 1) ? 1 : 2;
             }
         }
         let sponsor_role = PlayerMgr.shared.getPlayerByRoleId(info.sponsor.roleid);
         let recipient_role = PlayerMgr.shared.getPlayerByRoleId(info.recipient.roleid);
         if (!sponsor_role || !recipient_role) {
             return;
         }
 
 
         if (info.sponsor.state == 1 && info.recipient.state == 1) { // 两人都同意决斗 
             if (!sponsor_role.canPalaceFight()) {
                 info.sponsor.state = 2;
                 PalaceFight.shared.delPKInfo(data.roleid, 'sponsor');
             } else if (!recipient_role.canPalaceFight()) {
                 info.recipient.state = 2;
                 PalaceFight.shared.delPKInfo(data.roleid, 'recipient');
             } else {
                 PalaceFight.shared.setCanPK(info);
             }
         }
 
         sponsor_role.send('s2c_palace_fight', info);
         recipient_role.send('s2c_palace_fight', info);
 
         if (info.sponsor.state == 2) { // 发起人取消决斗 
             PalaceFight.shared.delPKInfo(data.roleid, 'sponsor');
         }
         if (info.recipient.state == 2) { // 接受人取消了决斗 
             PalaceFight.shared.delPKInfo(data.roleid, 'recipient');
         }
     }
     
     c2s_palace_rolelist(data: any) {
         PalaceFight.shared.sendPalaceRoleList(this.roleId);
     }
 
     //创建关系
     c2s_relation_new(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player && RelationMgr.shared.applyRelation(player, data);
     }
     //关系申请处理
     c2s_relation_agree(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player && RelationMgr.shared.confirmRelation(player, data);
     }
 
     //获取关系成员列表
     c2s_relation_List(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player && RelationMgr.shared.getRelationListByRoleId(player, data);
     }
 
     //退出关系
     c2s_relation_leave(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player && RelationMgr.shared.leaveRelation(player, data);
     }
     //关系添加成员
     c2s_relation_add(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player && RelationMgr.shared.addRelationMember(player, data);
     }
     //拒绝关系
     c2s_relation_reject(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player && RelationMgr.shared.rejectRelation(player, data);
     }
     
     c2s_change_role_color(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.setRoleColor(data.index1, data.index2) : this.close();
     }
     
     c2s_scheme_create(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.schemeMgr.addScheme(data) : this.close();
     }
     
     
     c2s_scheme_List(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.schemeMgr.getSchemeNameList(data) : this.close();
     }
     
     c2s_scheme_info(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.schemeMgr.getSchemeInfo(data) : this.close();
     }
     
     c2s_scheme_updateEquip(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.schemeMgr.updateSchemeEquip(data) : this.close();
     }
     
     c2s_scheme_addCustomPoint(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.schemeMgr.addCustomPoint(data) : this.close();
     }
 
     //套装修炼加点
     c2s_scheme_addXiulianPoint(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.schemeMgr.addXiulianPoint(data) : this.close();
     }
     
     c2s_scheme_resetXiulianPoint(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.schemeMgr.resetXiulianPoint(data) : this.close();
     }
     
     
     c2s_scheme_changePartner(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.schemeMgr.changePartner(data) : this.close();
     }
     
     
     c2s_scheme_activate(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.schemeMgr.activateScheme(data) : this.close();
     }
     
     
     c2s_scheme_changeName(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.schemeMgr.changeScheneName(data) : this.close();
     }
     
     
     c2s_scheme_use(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.schemeMgr.useSchene(data) : this.close();
     }
     
     
     c2s_bell_msg(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.costBell(data.msg) : this.close();
     }
     
     
     c2s_safepass_msg(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.setSafePassword(data.pass, data.lock) : this.close();
     }
     
     
     c2s_petfly_msg(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         if (!player) {
             this.close();
             return;
         }
         let pet = player.getPetByID(data.petid);
         if (!pet) {
             return;
         }
         pet.flyingUp(data.type);
     }
     // 骑乘
     c2s_ride(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.ride(data.horseIndex) : this.close();
     }
     // 下马 
     c2s_get_down(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.get_down() : this.close();
     }
     // 坐骑升级
     c2s_horse_upgrade(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.upgradeHorse(data) : this.close();
     }
     
     c2s_pet_control(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.petControl(data) : this.close();
     }

     
     c2s_horse_skill(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.getHorseSkill() : this.close();
     }

     
     c2s_upgrade_skill(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.upgradeHorseSkill(data) : this.close();
     }

     // 坐骑洗炼 
     c2s_horse_refining(data: any) {
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId, false);
         player ? player.horseRefining(data) : this.close();
     }
 
     //每日充值信息 
     charge_everday(data: any){
         ChargeEverDayMgr.shared.getinfo(this.roleId);
     }
     //领取奖项 
     everday_receive(data: any){
         ChargeEverDayMgr.shared.receive(this.roleId, data.nId);
     }
     //重置每日充值 
     everday_reset(data: any){
         ChargeEverDayMgr.shared.reset(this.roleId);
     }
 
 
     //一键分解
     c2s_bag_fenjie(data: any){
         let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
         player ? player.gfenjieEquip() : this.close();
     }

    // 获得排行榜数据
    getRanking(nByWhat: any) {
        let vecData = null;
        switch (nByWhat) {
            case 0:
                {
                    vecData = PaiHangMgr.shared.getLevelRank();
                }
                break;
            case 1:
                {
                    vecData = PaiHangMgr.shared.getMoneyRank();
                }
                break;
            case 2:
                {
                    vecData = PaiHangMgr.shared.getBangRank();
                }
                break;
            case 3:
                {
                    vecData = PaiHangMgr.shared.getShuiluRank();
                }
                break;
        }
        if (vecData != null) {
            this.send('s2c_paihang', {
                rankKind: nByWhat,
                vecRow: SKDataUtil.toJson(vecData)
            });
        }
    }

    // 道具分解 
    c2s_item_resolve(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? player.itemResolve(data) : this.close();
    }

    // 佩饰分解 
    c2s_baldric_resolve(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? player.baldricResolve(data) : this.close();
    }

    // 装备分解 
    c2s_equip_resolve(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? player.equipResolve(data) : this.close();
    }

    // 领取VIP每日奖励 
    c2s_vip_reward(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? player.vipReward(data) : this.close();
    }

    // 领取每日充值奖励 
    c2s_day_reward(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? DayReward.shared.getGift(player) : this.close();
    }

    //获取每日奖励天数
    c2s_day_reward_info(){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? DayReward.shared.getGift(player) : this.close();

    }

    // 请求挖宝列表 
    c2s_dug_list(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? player.dugList(data) : this.close();
    }

    // 开挖 
    c2s_dug(data: any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? player.dug(data) : this.close();
    }

    // 获取帮战列表
    c2s_bangzhan_info() {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? BangZhan.shared.bangzhanInfo(player)  : this.close();
    }
    // 报名帮战
    c2s_bangzhan_sign() {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? BangZhan.shared.signBangZhan(player) : this.close();
    }
    // 帮战前往战场
    c2s_bangzhan_gobattle() {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? BangZhan.shared.goToBattlefield(player) : this.close();
    }
    // 帮战前往战场
    c2s_bangzhan_leave() {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? BangZhan.shared.playerLeave(player) : this.close();
    }
    // 帮战发起战斗
    c2s_bangzhan_fight(data:any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!player || !data || !data.fightid){
            return;
        }
        let player2 = PlayerMgr.shared.getPlayerByOnlyId(data.fightid);
        if(!player2){
            return;
        }
        BangZhan.shared.startFight(player, player2);
    }
    // 玩家点击龙炮
    c2s_bangzhan_dragon() {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!player || !player.isTeamLeader())
            return;
        BangZhan.shared.playerDragon(player);
    }

    // 玩家撤离龙炮
    c2s_bangzhan_leave_dragon() {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!player || !player.isTeamLeader())
            return;
        BangZhan.shared.playerLeaveDragon(player);
    }

    // 玩家进入战斗区
    c2s_bangzhan_gofight() {
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!player) return;
        BangZhan.shared.goFight(player);
    }


    c2s_day_login_reward_info(){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? DayReward.shared.getInfo(player) : this.close();
    }
    c2s_day_login_reward(){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? DayReward.shared.getGift(player) : this.close();
    }


    c2s_game_chat_list(){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? PlayerMgr.shared.chat_list(player) : this.close();
    }

    c2s_player_data(){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? player.getPlayerData() : this.close();

    }

    c2s_skin_info(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? Skin.shared.getInfo(player, data) : this.close();
    }
    c2s_marry_apply(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? MarryMgr.shared.playerApply(player, data) : this.close();
    }
    c2s_marry_divorce(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? MarryMgr.shared.marryRemove(player) : this.close();
    }

    c2s_marry_info(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? MarryMgr.shared.getInfo(player, data) : this.close();
    }
    c2s_marry_point(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? MarryMgr.shared.addPoint(player, data) : this.close();
    }
    c2s_marry_child(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? MarryMgr.shared.updateChild(player, data) : this.close();
    }
    c2s_dingzhi_create(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? DingZhi.shared.creatEquip(player, data) : this.close();
    }
    c2s_auto(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? player.setAuto(data) : this.close();
    }
    c2s_jzca_fight(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!player){
            this.close();
            return;
        }
        let player2 = PlayerMgr.shared.getPlayerByOnlyId(data.onlyid);
        if(!player2){
            return;
        }
        let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.JueZhanChangAn);
        activity && activity.playerFight(player, player2);

    }
    c2s_jzca_go(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        if(!player){
            this.close();
            return;
        }
        let activity = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.JueZhanChangAn);
        activity && activity.goMap(player);
    }
    c2s_bagua_info(){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? Bagua.shared.sendInfo(player) : this.close();
    }
    c2s_bagua_refine(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? Bagua.shared.refine(player, data) : this.close();
    }
    c2s_bagua_levelup(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? Bagua.shared.levelup(player, data.index) : this.close();
    }
    c2s_tiance_share(){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? TianceMgr.shared.share(player) : this.close();
    }
    c2s_tiance_list(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId, false);
        if(!player){
            this.close();
            return;
        }
        if(data.roleid){
            let p2 = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
            if(p2){
                player.send('s2c_tiance_list', TianceMgr.shared.getInfo(p2));
            }else{
                this.send('s2c_notice', {
                    strRichText: `无法查看离线玩家`
                });
            }
        }else{
            TianceMgr.shared.sendInfo(player);
        }
    }
    c2s_tiance_new(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? TianceMgr.shared.drawTiance(player, data) : this.close();
    }
    c2s_tiance_use(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? TianceMgr.shared.use(player, data.id) : this.close();
    }
    c2s_bianshen_use(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? Bianshen.shared.use(player, data.id) : this.close();
    }
    c2s_bianshen_info(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? Bianshen.shared.getInfo(player) : this.close();
    }
    c2s_bianshen_exp(data:any){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? Bianshen.shared.addExp(player, data) : this.close();
    }
	 c2s_yuanshen_info(){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? YuanShen.shared.getInfo(player) : this.close();
    }
    c2s_yuanshen_levelup(){
        let player = PlayerMgr.shared.getPlayerByRoleId(this.roleId);
        player ? YuanShen.shared.levelUp(player) : this.close();
    }
    // 修行之路
    trigleMonsterBomb(monsterConfId: number) {
        if (this.player == null) {
            return;
        }
        // 队员不能攻打NPC
        if (this.player.teamid > 0 && this.player.isleader == false) {
            return;
        }
        // 我自己的服门票玩法你自己自定
        // 门票检查
        if (ItemUtil.getBagItemCount(this.player, GameUtil.chengjiuItemId) < 1) {
            this.player.send("s2c_notice", {
                strRichText: "门票不足~"
            });
            return;
        }
        this.player.addItem(GameUtil.chengjiuItemId, -1, false, '消耗门票1个]');
        //SKLogger.info(`玩家[${this.player.roleid}:${this.player.name}]消耗[成就门票]1个`);
        let battle = this.player.monsterBattle(monsterConfId);
        if (battle != null) {
            battle.source = monsterConfId;
        }
    }




 }
 