import SKLogger from "../../gear/SKLogger";
import GTimer from "../../common/GTimer";
import SKDataUtil from "../../gear/SKDataUtil";
import DB from "../../utils/DB";
import TeamMgr from "../core/TeamMgr";
import Player from "../object/Player";
import Bang from "./Bang";
import BangMgr from "./BangMgr";
import BangZhan from "./BangZhan";
import PlayerMgr from "../object/PlayerMgr";
import GameUtil from "../core/GameUtil";
import ItemUtil from "../core/ItemUtil";
import NoticeMgr from "../core/NoticeMgr";

/**
 * 储存帮战中的帮派信息
 * 包括 对战积分 活跃人数等
 * 
 */
export default class BangZhanInfo {

    bangid: number;
    fightid: number;
    bang:Bang;
    /**对战帮派 */
    fight: BangZhanInfo;
    //地图ID
    map: number = 0;

    //城门hp
    door_hp: number;
    //是否胜利 -1=未开始 0=平局 1=胜 2=败
    iswin:number = -1; 
    //本帮击杀玩家数
    pkill: number = 0;
    //本帮死亡玩家数
    pdie: number = 0;
    //龙头炮开炮次数
    fire_num: number = 0;
    //是否结束
    end: boolean = false;
    //阵营位置 1左下角 2右上角
    pos:number = 1;
    //本帮参战玩家组, 发送信息和计算奖励
    role_list: any = {};
    team_list: number[] = [];
    //玩家等待时间
    wait_time:any = {};
    //守炮玩家
    guard_team:Player = null;
    guard_time:number = 0;

    /** 战斗记录
     *  {
     *      玩家id: 胜利次数
     * }
     * 
     * 
     */
    record: any = {};

    constructor(bangid: any){
        this.bangid = bangid;
        this.bang = BangMgr.shared.getBang(bangid);
        this.door_hp = BangZhan.shared.doorHP;
    }

    setFight(fight:BangZhanInfo){
        if(!fight) 
            return;
        this.pos = SKDataUtil.random(1, 2);
        fight.pos = this.pos == 1 ? 2 : 1;
        this.fight = fight;
        this.fightid = fight.bangid;
        fight.fight = this;
        fight.fightid = this.bangid;
    }

    save(){
        let data = {
            bangid: this.bangid,
            fightid: this.fightid,
            door_hp: this.door_hp,
            iswin: this.iswin,
            pkill: this.pkill,
            pdie: this.pdie,
            fire_num: this.fire_num,
        };
        DB.saveBangZhanInfo(data);
    }


    playerGoFight(player:Player){
        if(Number(GTimer.format('hhmm')) < BangZhan.shared.open_time[1]){
            player.send('s2c_notice', {
				strRichText: `战斗未开始`
			});
            return;
        }
        if(this.wait_time[player.roleid] && this.wait_time[player.roleid] > new Date().getTime())
        this.toFight(player);
    }

    playerDie(player:Player){
        this.wait_time[player.roleid] = new Date().getTime() + 10 * 1000;
        this.pdie++;
        this.toWait(player);
        player.send('s2c_bangzhan_die', {
            time: this.wait_time[player.roleid]
        });
        SKLogger.info(`[${player.roleid}:${player.name}]战斗失败返回等待区`);
    }

    playerJoin(player:Player){
        this.role_list[player.roleid] = player
    }

    playerLeave(player:Player){
        delete this.role_list[player.roleid]
    }
    cleckPlayerRecord(roleid: any){
        this.record[roleid] || (this.record[roleid] = {win:0, fail:0, num:0, fire:0});
    }

    playerFightEnd(player:Player, iswin:any, source: any){
        let team = TeamMgr.shared.getTeamPlayer(player.teamid);
        for (let p of team) {
            this.cleckPlayerRecord(p.roleid);
            iswin ? this.record[p.roleid].win++ : this.record[p.roleid].fail++;
            this.record[p.roleid].num++;
        }
        iswin ? this.pkill++ : this.pdie++;
        this.wait_time[player.roleid] = new Date().getTime() + BangZhan.shared.die_wait_time;
        if(!iswin){
            this.playerDie(player);
            if(this.guard_team == player){
                this.guard_team = null;
                let p2 = PlayerMgr.shared.getPlayerByOnlyId(source);
                this.fight.guard_team = p2;
                this.fight.guard_time = GameUtil.gameTime;
                this.sendAll('s2c_notice', {
                    strRichText: `[${p2.name}]战胜了[${player.name}]夺取了龙神大炮的控制权`
                })
                this.fight.playerDragonPrepare(p2);
            }
        }
    }

    //玩家点击龙炮开始计时
    playerDragonPrepare(player: Player){
        this.guard_team = player;
        this.guard_time = GameUtil.gameTime;
        let bang = BangMgr.shared.getBang(player.bangid);
        let data = {
            roleid: this.guard_team.roleid,
            name: `[${bang.name}]${player.name}`,
            fireTime: new Date().getTime() + BangZhan.shared.dragon_cd,
        };
        player.cantmove=true;
        SKLogger.info(`[${bang.name}]${player.name}占领龙炮`);
        this.sendAll('s2c_bangzhan_dragon_prepare', data);
    }
    //龙炮开火
    playerDragonFire(){
        this.guard_time = GameUtil.gameTime;
        let atk = GameUtil.random(BangZhan.shared.dragonATK[0], BangZhan.shared.dragonATK[1]);
        this.fight.door_hp -= atk;
        this.fire_num++;
        let msg = `[${this.bang.name}]对[${this.fight.bang.name}]的城门造成${atk}点伤害`;
        this.sendAll('s2c_notice', {strRichText: msg});
        SKLogger.info(msg);
        if(this.fight.door_hp <= 0){
            this.WIN();
            this.fight.FAIL();
            return;
        }
        let data = {
            dir: this.pos == 1 ? 3 : 1,
            atk: atk,
            doorA: this.pos==1 ? this.door_hp : this.fight.door_hp,
            doorB: this.pos==1 ? this.fight.door_hp : this.door_hp,
            fireTime: new Date().getTime() + BangZhan.shared.dragon_cd,
        };
        this.sendAll('s2c_bangzhan_dragon_fire', data);
    }

    sendInfo(){
        let num1 = Object.keys(this.role_list).length;
        let num2 = Object.keys(this.fight.role_list).length;
        let data = {
            doorA: this.pos==1 ? this.door_hp : this.fight.door_hp,
            doorB: this.pos==1 ? this.fight.door_hp : this.door_hp,
            numA: this.pos==1 ? num1 : num2,
            numB: this.pos==1 ? num2 : num1,
            state: BangZhan.shared.state,
        };
        this.send('s2c_bangzhan_battle_info', data);
    }

    send(event: string, ojb: any){
        for (const id in this.role_list)
            this.role_list[id] ? this.role_list[id].send(event, ojb) : delete this.role_list[id];
    }
    sendAll(event: string, ojb: any){
        for (const id in this.role_list)
            this.role_list[id] ? this.role_list[id].send(event, ojb) : delete this.role_list[id];
        for (const id in this.fight.role_list)
            this.fight.role_list[id] ? this.fight.role_list[id].send(event, ojb) : delete this.fight.role_list[id];
    }


    toWait(player:Player){
        let pos = BangZhan.shared.getPos(this.pos, 1);
        if(player.mapid == 3001){
            player.send('s2c_bangzhan_gofight', pos);
            player.playerMove(pos);
        }else{
            player.changeMap({
                mapid: 3001,
                x: pos.x,
                y: pos.y,
            });
            player.send('s2c_change_map', {
                mapid: 3001,
                pos: SKDataUtil.toJson(pos)
            });
        }
    }

    toFight(player:Player){
        let pos = BangZhan.shared.getPos(this.pos, 2);
        if(player.mapid == 3001){
            player.send('s2c_bangzhan_gofight', pos);
            player.playerMove(pos);
        }else{
            player.send('s2c_change_map', {
                mapid: 3001,
                pos: SKDataUtil.toJson(pos)
            });
            player.changeMap({
                mapid: 3001,
                x: pos.x,
                y: pos.y,
            });
        }
    }

    //击杀奖励
    killReward(conf: any){
        for (const p in this.record) {
            let player = PlayerMgr.shared.getPlayerByRoleId(p, false);
            let win = this.record[p].win;
            if(player && win>0){
                this.addReward(player, conf, '帮战击杀奖励', win);
            }
        }

    }


    addReward(player:Player, conf:any, msg:string = '', multiple:number = 1): any{
        let gift: any = {};
        conf.exp && (gift.exp = conf.exp);
        conf.money && (gift.money = conf.money);
        conf.jade && (gift.jade = conf.jade);
        conf.item && (gift.item = conf.item);


        gift.exp && player.addExp(gift.exp *= multiple);
        gift.money && player.addMoney(GameUtil.goldKind.Money, gift.money *= multiple, msg);
        gift.jade && player.addMoney(GameUtil.goldKind.Jade, gift.jade *= multiple, msg);
        if(gift.item){
            for (let i of gift.item){
                player.addItem(i.id, i.count *= multiple, false, msg);
                let item = ItemUtil.getItemData(i.id);
                i.name = item.name || i.id;
            }
        }
        return gift;
    }


    //帮战胜利
    WIN(){
        if(this.end || !this.bang){
            return;
        }
        this.end = true;
        this.bang.fight_win++;
        this.save();
        this.bang.save();

        NoticeMgr.shared.sendNotice({
            type: 2,
            text: `[${this.bang.name}]战胜了[${this.fight.bang.name}]，让我们一起祝贺他们吧！`,
        });

        for (let obj of this.bang.rolelist) {
            let player = PlayerMgr.shared.getPlayerByRoleId(obj.roleid, false);
            if(!player) continue;

            this.cleckPlayerRecord(player.roleid);
            let money = 0;
            let jade = 0;
            let exp = 0;
            let item = [];
            let kill = [];

            if(this.record[player.roleid] && this.record[player.roleid].win>0){
                let s = this.addReward(player, BangZhan.shared.winKillReward, '帮战胜利击杀奖励', this.record[player.roleid].win);
                money += s.money || 0;
                jade += s.jade || 0;
                exp += s.exp || 0;
                kill = s.item || [];
            }
            let s:any = {};
            if(player.roleid == this.bang.masterid){
                s = this.addReward(player, BangZhan.shared.winRewardMaster, '帮主胜利奖励');
            }else{
                 s = this.addReward(player, BangZhan.shared.winReward, '帮战胜利奖励'); 
            }
            money += s.money || 0;
            jade += s.jade || 0;
            exp += s.exp || 0;
            item = s.item || [];
            
            player.send('s2c_bangzhan_fight_end', {
                iswin: 1,
                name: this.bang.name,
                pkill: this.record[player.roleid].win,
                pdie: this.record[player.roleid].fail,
                money: money,
                jade: jade,
                exp: exp,
                item: item,
                kill: kill,
            });
        }
    }
    //帮战失败
    FAIL(){
        if(this.end || !this.bang){
            return;
        }
        this.end = true;
        this.bang.fight_fail++;
        this.save();
        this.bang.save();

        for (let obj of this.bang.rolelist) {
            let player = PlayerMgr.shared.getPlayerByRoleId(obj.roleid, false);
            if(!player) continue;

            this.cleckPlayerRecord(player.roleid);
            let money = 0;
            let jade = 0;
            let exp = 0;
            let item = [];
            let kill = [];
            if(this.record[player.roleid] && this.record[player.roleid].win>0){
                let s = this.addReward(player, BangZhan.shared.failKillReward, '帮战失败击杀奖励', this.record[player.roleid].win);
                money += s.money || 0;
                jade += s.jade || 0;
                exp += s.exp || 0;
                kill = s.item || [];
            }
            let s:any = this.addReward(player, BangZhan.shared.failReward, '帮战失败奖励'); 
            money += s.money || 0;
            jade += s.jade || 0;
            exp += s.exp || 0;
            item = s.item || [];
            player.send('s2c_bangzhan_fight_end', {
                iswin: 2,
                name: this.bang.name,
                pkill: this.record[player.roleid].win,
                pdie: this.record[player.roleid].fail,
                money: money,
                jade: jade,
                exp: exp,
                item: item,
                kill: kill,
            });
        }
    }
    //帮战平局
    DRAW(){
        if(this.end || !this.bang){
            return;
        }
        this.end = true;
        this.save();
        
        for (let obj of this.bang.rolelist) {
            let player = PlayerMgr.shared.getPlayerByRoleId(obj.roleid, false);
            if(!player) continue;

            this.cleckPlayerRecord(player.roleid);
            let money = 0;
            let jade = 0;
            let exp = 0;
            let item = [];
            let kill = [];

            if(this.record[player.roleid] && this.record[player.roleid].win>0){
                let s = this.addReward(player, BangZhan.shared.failKillReward, '帮战平局击杀奖励', this.record[player.roleid].win);
                money += s.money || 0;
                jade += s.jade || 0;
                exp += s.exp || 0;
                kill = s.item || [];
            }
            let s:any = this.addReward(player, BangZhan.shared.failReward, '帮战平局奖励'); 
            money += s.money || 0;
            jade += s.jade || 0;
            exp += s.exp || 0;
            item = s.item || [];
            
            player.send('s2c_bangzhan_fight_end', {
                iswin: 0,
                name: this.bang.name,
                pkill: this.record[player.roleid].win,
                pdie: this.record[player.roleid].fail,
                money: money,
                jade: jade,
                exp: exp,
                item: item,
                kill: kill,
            });
        }

    }

}