import Bang from "./Bang";
import BangMember from "./BangMember";
import BangZhanInfo from "./BangZhanInfo";
import Player from "../../game/object/Player";
import BangMgr from "../../game/bang/BangMgr";
import SKLogger from "../../gear/SKLogger";
import SKDataUtil from "../../gear/SKDataUtil";
import GTimer from "../../common/GTimer";
import Launch from "../core/Launch";
import ActivityMgr from "../activity/ActivityMgr";
import e from "express";
import NoticeMgr from "../core/NoticeMgr";
import TeamMgr from "../core/TeamMgr";
import { BattleType } from "../role/EEnum";
import MapMgr from "../core/MapMgr";
import GameUtil from "../core/GameUtil";
import SKTimeUtil from "../../gear/SKTimeUtil";
import { timeStamp } from "console";
import ActivityDefine from "../activity/ActivityDefine";
import GFile from "../../utils/GFile";


export default class BangZhan {
    static shared = new BangZhan();
    /*
        帮战设计思路

        1.由会长申请 加入帮战 并加入组中
        2.等待选出对阵表后关闭申请
        3.


    */
   /**帮战状态
    * 0=关闭
    * 1=报名中
    * 2=等待比赛
    * 3=准备进场
    * 4=开始比赛
    * 
    */
    state: number = 1;

    /** 报名组*/
    sign_list: number[] = [];
    /** 对战组  储存对战信息
    帮派ID {   
        帮战日期周几: {
            bangid: 对战帮ID
            iswin: 对战结果
            day: 周几
        }
    }
    */
    fight_list: any= {};

    /** 帮战列表*/
    bangzhan_list: any= {};

    /**报名日期星期几 */
    sign_day = [1,2,3];
    /**发放对战表日期星期几 */
    show_fight_list_day = 4;
    /**战斗日 */
    fight_day:number[] = [5,6];

    /**准备时间 - 开始时间 - 结束时间 */
    open_time: number[] = [2120, 2130, 2230];

    /**出生区域 左上角-右下角 */
    start_pos:any = {
        1: [[58, 51], [71, 41]],
        2: [[148, 89], [158, 83]],
    };
    /**等待区域 */
    wait_pos:any = {
        1: [[17, 24], [31, 16]],
        2: [[183, 119], [197, 102]],
    };
    days = ['日', '一', '二', '三', '四' ,'五', '六'];
    m_timer: NodeJS.Timeout;
    time:number = 0;
    //帮派排名
    ranking: Bang[] = [];
    //GM开启帮战
    gmBangzhan: boolean = false;
    //龙炮发射等待时间
    dragon_cd: number = 30 * 1000;
    //死亡等待时间
    die_wait_time:number = 10 * 1000;
    //门血量
    doorHP: number = 5000;
    //龙炮攻击力
    dragonATK: number[] = [50, 100];
    //开战的时间
    fight_time:number = 0;
    next_time: number = 0;
    //定时任务
    handle:any = undefined;

    gmBangzhanHandle: any = null;

    activity_id = ActivityDefine.activityKindID.bangzhan;

    //胜利击杀奖励
    winKillReward:any = {
        money: 0,
        jade: 30000,
        exp: 0,
        item: [{id:50004,count:3}], //[{id:1,count:1},{id:2,count:1}]
    };
    //失败击杀奖励
    failKillReward:any = {
        money: 0,
        jade: 5000,
        exp: 0,
        item: [{id:50004,count:1}], //[{id:1,count:1},{id:2,count:1}]
    };
    //胜利奖励
    winReward:any = {
        money: 10000000,
        jade: 30000,
        exp: 10000000,
        item: [{id:10006,count:5}],
    };
    //胜利奖励-帮主
    winRewardMaster:any = {
        money: 10000000,
        jade: 50000,
        exp: 10000000,
        item: [{id:50004,count:10}],
    };
    //失败奖励  平局也按失败算
    failReward:any = {
        money: 2000000,
        jade: 5000,
        exp: 2000000,
        item: [{id:10006,count:3}],
    };



    //载入缓存数据
    init(){
        let self = this;
        GFile.loadRuntime(`bangzhan${GameUtil.serverId}.txt`, (error, data)=>{
            if(error){
                SKLogger.warn(`帮战缓存载入失败`);
                return;
            }
            let json = SKDataUtil.jsonBy(data);
            if(!json){
                SKLogger.warn(`帮战缓存解析失败`);
                return;
            }
            self.sign_list = json.sign_list;
            self.fight_list = json.fight_list;
        });
        


        this.updateRanking();
        ActivityMgr.shared.addActivity(this);
    }

    getInfo(bangid: number): BangZhanInfo{
        let bang:BangZhanInfo = this.bangzhan_list[bangid];
        return bang ? bang : null
    }
    update(dt: number){
        if(this.state != 4 && this.fight_day.indexOf(new Date().getDay()) > -1){
            let time = Number(GTimer.format("hhmm"));
            if(time == this.open_time[0]){
                this.BangzhanStart()
            }
        }else if(this.state == 4){

            if(Number(GTimer.format("hhmm")) >= this.open_time[2]){
                //帮战结束
                this.BangzhanEnd();
            }

        }
    }

    update2(){
        if(this.state != 4) 
            return;
        for (const key in this.bangzhan_list) {
            let bz:BangZhanInfo = this.bangzhan_list[key];
            if(bz.end) continue;

            if(bz.guard_team && (bz.guard_team.offline || bz.guard_team.teamid==0)){
                bz.guard_team = null;
                let data = {
                    roleid: 0,
                    name: '',
                    fireTime: -1,
                };
                bz.sendAll('s2c_bangzhan_dragon_prepare', data);
            }else if(bz.guard_team && GameUtil.gameTime - bz.guard_time >= this.dragon_cd){
                bz.playerDragonFire();
            }
        }
        
    }
    close(dt: number){


        SKTimeUtil.cancelLoop(this.gmBangzhanHandle);

    }

    GmBangzhanOpen(num = 10){
        if(this.gmBangzhan){
            SKLogger.info(`帮战已开启`);
            return
        }
        this.gmBangzhan = true;
        this.state = 1;
        SKLogger.info(`启动帮战`);
        NoticeMgr.shared.sendNotice({
            type: 2,
            text: `帮战将于${num}分钟后开启，各位帮主请抓紧时间报名，本次帮战准备期间也可以报名`,
        });
        this.gmBangzhanHandle = SKTimeUtil.loop(()=>{
            num--;
            if(num > 0){
                NoticeMgr.shared.sendNotice({
                    type: 2,
                    text: `帮战将于${num}分钟后开启，各位帮主请抓紧时间报名，本次帮战准备期间也可以报名`,
                });
            }else{
                SKTimeUtil.cancelLoop(this.gmBangzhanHandle);
                this.gmBangzhanHandle = null;
                NoticeMgr.shared.sendNotice({
                    type: 2,
                    text: '帮战对战表已发布',
                });
                BangZhan.shared.showFightList();
                BangZhan.shared.BangzhanStart();
            }
        }, 60 * 1000, this.gmBangzhanHandle);
    }

    BangzhanEnd(){
        if(this.fight_day[this.fight_day.length-1] == new Date().getDay()){ 
            //如果是最后一个战斗日 则清空数据
            this.fight_list = {};
            this.sign_list = [];
            this.state = 0;
        }else{
            this.state = 2;
        }
        this.gmBangzhan = false;
        
        NoticeMgr.shared.sendNotice({
            type: 2,
            text: '本次帮战结束！',
        });
        SKLogger.info('帮战到达结束时间');

        for (const key in this.bangzhan_list) {
            this.bangzhan_list[key].FAIL();
        }

        MapMgr.shared.bangzhan_map_list = {};
        this.bangzhan_list = {};
        SKTimeUtil.cancelLoop(this.handle);
        SKTimeUtil.cancelLoop(this.gmBangzhanHandle);
        this.gmBangzhanHandle = null;
        this.handle = null;
        this.updateRanking();
    }

    BangzhanStart(){
        let week = new Date().getDay();
        this.bangzhan_list = {};
        let mapid = 10000;
        if(Object.keys(this.fight_list).length< 2){
            SKLogger.warn(`帮战队伍少于2支`);
            return;
        }
        if(!this.gmBangzhan && this.fight_day.indexOf(week) == -1){
            SKLogger.warn(`不在战斗日`);
            return;
        }

        for (const id in this.fight_list) {
            let fight = this.fight_list[id][week];
            let info = this.bangzhan_list[id] = new BangZhanInfo(id);
            info.fightid = fight.fightid;
        }
        for (const id in this.bangzhan_list) {
            let bang1:BangZhanInfo = this.bangzhan_list[id];
            if(bang1.fight || !this.bangzhan_list[bang1.fightid])
                continue;
            let bang2:BangZhanInfo = this.bangzhan_list[bang1.fightid];
            let pos = SKDataUtil.random(1, 2);
            bang1.fight = bang2;
            bang2.fight = bang1;
            bang1.pos = pos;
            bang2.pos = pos == 1 ? 2 : 1;
            bang1.map = bang2.map = mapid;
            mapid++;
        }

        let t = this.open_time[1].toString();
        t = GTimer.format('yyyy-MM-dd')+` ${t.substr(0,2)}:${t.substr(2)}:00`;
        this.fight_time = new Date(t).getTime();

        t = this.open_time[0].toString();
        t = GTimer.format('yyyy-MM-dd')+` ${t.substr(0,2)}:${t.substr(2)}:00`;
        let waitTime = this.fight_time - new Date(t).getTime();
        

        if(this.gmBangzhan){
            this.fight_time = new Date().getTime() + waitTime;
        }
        let notice = {
			id: 0,
			text: '帮战即将开始，请报名的帮派成员点击帮战面板的【进入战场】参加战斗',
			type: 2,
			times: Math.floor(waitTime / (1000 * 60 * 2)),
			interval: 120,
		};
        this.state = 3;
        NoticeMgr.shared.addNewNotice(notice);

        if(this.gmBangzhan){
            BangZhan.shared.BangzhanStart2()
        }else{
            setTimeout(()=>{
                BangZhan.shared.BangzhanStart2()
            }, waitTime);
        }

    }

    BangzhanStart2(){
        NoticeMgr.shared.sendNotice({
            type: 2,
            text: '帮战已开始，在等待区的玩家点击[进入战场]按钮可以进入比武场',
        })
        this.state = 4;
        for (const key in this.bangzhan_list){
            this.bangzhan_list[key].sendInfo();
        }

        this.handle = SKTimeUtil.loop(()=>{
            BangZhan.shared.update2()
        }, 1000, this.handle);

    }

    onNewDay(){
        if(this.show_fight_list_day == new Date().getDay())
            this.showFightList()
    }
    onNewHour(){
    }

    updateRanking(){
        let bangList = BangMgr.shared.bangList;
        let keys = Object.keys(bangList).sort(function(a,b){
            return (bangList[a]["fight_win"] - bangList[a]["fight_fail"]) - (bangList[b]["fight_win"] - bangList[b]["fight_fail"]); 
        });
        this.ranking = [];
        for (const id of keys) {
            this.ranking.push(bangList[id]);
        }
        SKLogger.info('更新帮战排名');
    }
 
    /** 计算对战表
    fight_list = {帮派ID {   
        帮战日期周几: {
            bangid: 对战帮ID
            iswin: 对战结果
            day: 周几
        }
    }}
    */
    showFightList(){
        this.updateRanking();
        let fight_list:any = {};
        let ranking:number[] = [];
        if(this.sign_list.length < 2){
            this.fight_list = {};
            SKLogger.warn(`帮战队伍少于2支`);
            return;
        }
        for (let bang of this.ranking) {
            this.sign_list.indexOf(bang.id)>-1 && ranking.push(bang.id);
        }
        for (const day of this.fight_day) {
            this.FightMatching([...ranking], fight_list, day);
        }
        this.fight_list = fight_list;
        this.save();
    }

    FightMatching(ranking:any, fight_list:any, day:number){
        while(ranking.length >= 4){
            let _ranking:number[] = ranking.splice(0, 4);
            let fightid = SKDataUtil.random(1, 3);
            fight_list[_ranking[0]] || (fight_list[_ranking[0]] = {});
            fight_list[_ranking[fightid]] || (fight_list[_ranking[fightid]] = {});
            fight_list[_ranking[0]][day] = {
                day: day,
                iswin: -1,
                fightid: _ranking[fightid],
            };
            fight_list[_ranking[fightid]][day] = {
                day: day,
                iswin: -1,
                fightid: _ranking[0],
            };
            _ranking.splice(fightid,1);
            _ranking.splice(0,1);

            fight_list[_ranking[0]] || (fight_list[_ranking[0]] = {});
            fight_list[_ranking[1]] || (fight_list[_ranking[1]] = {});
            fight_list[_ranking[0]][day] = {
                day: day,
                iswin: -1,
                fightid: _ranking[1],
            };
            fight_list[_ranking[1]][day] = {
                day: day,
                iswin: -1,
                fightid: _ranking[0],
            };
        }
        while(ranking.length >= 2){
            let _ranking:number[] = ranking.splice(0, 2);
            fight_list[_ranking[0]] || (fight_list[_ranking[0]] = {});
            fight_list[_ranking[1]] || (fight_list[_ranking[1]] = {});
            fight_list[_ranking[0]][day] = {
                day: day,
                iswin: -1,
                fightid: _ranking[1],
            };
            fight_list[_ranking[1]][day] = {
                day: day,
                iswin: -1,
                fightid: _ranking[0],
            };
        }
    }


    signBangZhan(player: Player){
        if(player.bangid == 0){
            player.send('s2c_notice', {
				strRichText: `未加入帮派`
			});
            return;
        }
        let bang = BangMgr.shared.getBang(player.bangid);
        if(bang.masterid != player.roleid){
            player.send('s2c_notice', {
				strRichText: `必须由帮主申请`
			});
            return;
        }
        if(this.sign_list.indexOf(bang.id) > -1){
            player.send('s2c_notice', {
				strRichText: `已报名`
			});
            return;
        }
        if((this.gmBangzhan && this.state==2) || this.state != 1){
            player.send('s2c_notice', {
				strRichText: `当前不在报名时间`
			});
            return;
        }
        this.sign_list.push(bang.id);
        player.send('s2c_notice', {
            strRichText: `报名成功`
        });
        SKLogger.info(`[${bang.id}:${bang.name}]报名帮战`);
        this.save();
        this.updateRanking();
    }

    //保存缓存到rides
    save(){
        let data = {
            sign_list: this.sign_list,
            fight_list: this.fight_list,
        };
        GFile.saveRuntime(`bangzhan${GameUtil.serverId}.txt`, SKDataUtil.toJson(data), (error)=>{
            error && SKLogger.warn(`帮战缓存保存失败`);
        });
    }

    goToBattlefield(player: Player){
        if(player.bangid == 0){
            player.send('s2c_notice', {
				strRichText: `未加入帮派`
			});
            return;
        }
        if(this.state != 3 && this.state != 4){
            player.send('s2c_notice', {
				strRichText: `帮派战未开始`
			});
            return;
        }
        let bangzhan:BangZhanInfo = this.bangzhan_list[player.bangid];
        if(!bangzhan){
            player.send('s2c_notice', {
				strRichText: `您的帮派未参与帮战`
			});
            return;
        }
        if(!bangzhan.fight){
            player.send('s2c_notice', {
				strRichText: `您的帮派本轮轮空`
			});
            return;
        }
        if(bangzhan.end){
            player.send('s2c_notice', {
				strRichText: `帮战已结束`
			});
            return;
        }
        if(player.teamid==0){
            player.send('s2c_notice', {
                strRichText: `必须组队进入`
            });
            return;
        }
        if(!player.isTeamLeader()){
            player.send('s2c_notice', {
                strRichText: `只有队长才能选择`
            });
            return;
        }
        let team = TeamMgr.shared.getTeamPlayer(player.teamid);
        for (const p of team){
            if(p.isPlayer() && p.bangid != player.bangid){
                player.send('s2c_notice', {
                    strRichText: `队伍成员必须是帮会成员`
                });
                return;
            }
        }
        for (let p of team) {
            bangzhan.role_list[p.roleid] = p;
        }
        bangzhan.role_list[player.roleid] = player;
        
        SKLogger.info(`[${bangzhan.bang.name}:${player.name}]进入帮战战场`);
        player.send('s2c_bangzhan_gobattle', {
            pos: bangzhan.pos,
            startTime: this.open_time[1],
            endTime: this.open_time[2],
            doorA: bangzhan.pos==1 ? bangzhan.door_hp : bangzhan.fight.door_hp,
            doorB: bangzhan.pos==1 ? bangzhan.fight.door_hp : bangzhan.door_hp,
            nameA: bangzhan.pos==1 ? bangzhan.bang.name : bangzhan.fight.bang.name,
            nameB: bangzhan.pos==1 ? bangzhan.fight.bang.name : bangzhan.bang.name,
            isgm: this.gmBangzhan ? 1: 0,
            maxhp: this.doorHP,
            fightTime: this.fight_time,
            state: this.state,
        });

        bangzhan.playerJoin(player);
        bangzhan.toWait(player);
    }

    getPos(pos:number, mod:number){
        let arr = mod == 1 ? this.wait_pos[pos] : this.start_pos[pos];
        return{
            x: SKDataUtil.random(arr[0][0], arr[1][0]),
            y: SKDataUtil.random(arr[0][1], arr[1][1])
        }
    }
    //玩家进入战斗区域
    goFight(player: Player){
        if(!player.isTeamLeader()){
            player.send('s2c_notice', {
				strRichText: `只有队长才能选择`
			});
            return;
        }
        if(this.state != 4){
            player.send('s2c_notice', {
				strRichText: `帮战即将开始，请在等待区等待`
			});
            return;
        }
        let bangzhan:BangZhanInfo = this.bangzhan_list[player.bangid];
        if(!bangzhan){
            player.send('s2c_notice', {
				strRichText: `本轮帮战轮空，请等待下次帮战`
			});
            return;
        }
        let date = new Date().getTime();
        let time = bangzhan.wait_time[player.roleid];
        if(time && time > date){
            player.send('s2c_notice', {
				strRichText: Math.floor((time - date) / 1000) + '秒后可以进入战场',
			});
            return;
        }
        bangzhan.toFight(player);
    }

    // 进入战斗
    startFight(player: Player, player2: Player) {
        if(player.bangid == player2.bangid){
            return; //本帮玩家不战斗
        }
        if(player2.battle_id>0){
            player.send('s2c_notice', {
				strRichText: `对方正在战斗`
			});
            return;
        }
        if(player2.offline){
            player.send('s2c_notice', {
				strRichText: `对方掉线`
			});
            return;
        }
        let dis = GameUtil.getDistance(player, player2);
        if(dis>15){
            player.send('s2c_notice', {
				strRichText: `距离过远`
			});
            return;
        }
        let team = TeamMgr.shared.getTeamInfo(player.teamid);
        let eteam = TeamMgr.shared.getTeamInfo(player2.teamid);

        if (team && eteam) {
            let eonlyid = eteam.leader.onlyid;
            team.leader.playerBattle(eonlyid, BattleType.BangZhan);
        }
    }

    //战斗结束
    playerFightEnd(player:Player, iswin: any, source: any){
        let bang:BangZhanInfo = this.bangzhan_list[player.bangid];
        bang && bang.playerFightEnd(player, iswin, source);
    }

    bangzhanInfo(player: Player){
        var week = new Date().getDay();
        let templist = [];
        let list = this.ranking;
        let bang:Bang = player.getBang();
        if(!bang) {
            SKLogger.warn(`[${player.roleid}:${player.name}]玩家没有帮派时点击帮战`);
            return;
        }

        if(list.length > 20)
            list = list.splice(0, 20);
        for (let bang of list){
            let fight = '无';
            if(this.fight_list[bang.id]){
                for(let i=week;i<7;i++){
                    if(this.fight_list[bang.id][week]){
                        let bangid = this.fight_list[bang.id][week].bangid;
                        fight = BangMgr.shared.getBangName(bangid) || '无';
                        break;
                    }
                }
            }
            templist.push({
                id: bang.id,
                name: bang.name,
                level: bang.level,
                rolenum: bang.rolelist.length,
                fail: bang.fight_fail,
                win: bang.fight_win,
                fight: fight,
            });
        }
        
        let fight_list:any = [];
        let fightForm =  (this.sign_list.indexOf(bang.id) > -1 ? '等待名单' : '未报名');
        let bz = this.fight_list[bang.id];
        for(let day of this.fight_day){
            if(bz && bz[day]){
                if(bz[day].fightid == -1){
                    fight_list.push({
                        fightid: 0,
                        name: '轮空:跳过本轮',
                        iswin: 1,
                        day: day,
                    })
                }else{
                    fight_list.push({
                        fightid: bz[day].fightid,
                        name: BangMgr.shared.getBangName(bz[day].fightid),
                        iswin: bz[day].iswin,
                        day: day,
                    })
                }
            }else{
                fight_list.push({
                    fightid: 0,
                    name:  this.sign_list.indexOf(bang.id) > -1 ? '等待名单' : '未报名',
                    iswin: -1,
                    day: day,
                })
            }
        }
        if(bz){
            for (const bz of fight_list) {
                if(week <= bz.day){
                    fightForm = `周${this.days[bz.day]}对战：${bz.name}`;
                    break;
                }
            }
        }

        player.send('s2c_bangzhan_info', {
            list: templist,
            fightList : fight_list,
            fail: bang.fight_fail,
            win: bang.fight_win,
            name: bang.name,
            fightForm : fightForm,
        });
    }

    //玩家点击龙炮
    playerDragon(player:Player){
        let bang:BangZhanInfo = this.bangzhan_list[player.bangid];
        //bang && bang.playerDragon(player);
        if(!bang)
            return;
        let guard = bang.guard_team || bang.fight.guard_team;
        if(!guard || guard.offline){ //没有人占领炮 那么触发者占领
            bang.playerDragonPrepare(player);
            return;
        }
        if(guard.bangid == player.bangid){
            player.send('s2c_notice', {
				strRichText: `我方已占领`
			});
            return;
        }
        if(guard.battle_id > 0){
            player.send('s2c_notice', {
				strRichText: `目标正在战斗`
			});
            return;
        }
        this.startFight(player, guard);
    }
    playerLeaveDragon(player:Player){
        let bang:BangZhanInfo = this.bangzhan_list[player.bangid];
        if(bang && player.isTeamLeader() && bang.guard_team == player){
            bang.guard_team = null;
            let data = {
                roleid: 0,
                name: '',
                fireTime: -1,
            };
            player.cantmove = false;
            bang.sendAll('s2c_bangzhan_dragon_prepare', data);
        }

    }

    //玩家退出帮战
    playerLeave(player:Player){
        let bang:BangZhanInfo = this.bangzhan_list[player.bangid];
        bang && bang.playerLeave(player);

    }



}