import GTimer from "../../common/GTimer";
import PlayerMgr from "../object/PlayerMgr";
import DB from "../../utils/DB";
import ActivityBase from "./ActivityBase";
import ActivityDefine from "./ActivityDefine";
import TeamMgr from "../core/TeamMgr";
import PaiHangMgr from "../core/PaiHangMgr";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import { BattleType, MsgCode } from "../role/EEnum";
import Player from "../object/Player";
import GameUtil from "../core/GameUtil";

export default class JueZhanChangAn extends ActivityBase {

    SLDHState: any = {
        Sign: 1,
        Open: 2,
        Close: 3,
    }

    defaultOpenTime = [1900, 2000];
    signTime = 60;

    die_player:any = {};
    fight_list:any = {};
    kill_num:any = {};
    wait_time = 60 * 1000;

    config: any = {};
    open_day = [0,1,3,4,5,6,7];//每周开放日期

    constructor() {
        super();
        this.name = '决战长安';
        this.open_notice = `${this.name}开启，前往长安NPC进入战场！`;

        this.activity_id = ActivityDefine.activityKindID.JueZhanChangAn;
        this.open_type = ActivityDefine.openType.EveryDay;
        this.is_ready_notice = true;
        this.open_type_list = this.defaultOpenTime;
        this.player_list = {};
        this.init();
    }

    init() {
        super.init();
		this.config = GameUtil.require_ex('../../conf/prop_data/prop_jzca.json');
    }

    
    /**
     * 活动开始
     */
     open() {   
        if(this.open_day.indexOf(new Date().getDay()) == -1){
            return;
        }


        if (this.activity_state == ActivityDefine.activityState.Opening) {
            return;
        }
        super.open();
        this.player_list = {};
        this.die_player = {};
        this.fight_list = {};
        this.kill_num = {};

        SKLogger.info(`决战长安状态改变 当前状态：开始报名`);
    }

    close(){
        super.close();
        for (const roleid in this.player_list) {
            let player = PlayerMgr.shared.getPlayerByRoleId(roleid);
            
            player&&this.offline(player);
        }
        this.player_list = {};
        this.die_player = {};
        this.fight_list = {};
        this.kill_num = {};
    }

    fightEnd(player: Player, iswin: boolean){
        if(iswin){
            let kill = this.kill_num[player.roleid] = this.kill_num[player.roleid] ? this.kill_num[player.roleid]+1 : 1;
            let conf = this.getConfig(kill);
            if(conf){
                if(conf.item){
                    for (const item of conf.item) {
                        player.addItem(item.itemid, item.num, true, `决战长安${kill}杀`)
                    }
                }
                if(conf.jifen){
                    player.addShuiluScore(0, conf.jifen, iswin);
                }
                if(conf.exp){
                    player.addExp(conf.exp);
                }
                if(player.isTeamLeader() && conf.notice){
                    let player2 = PlayerMgr.shared.getPlayerByRoleId(this.fight_list[player.roleid]);
                    if(player2){
                        let msg = conf.notice.replace('[NAME1]', player.name);
                        msg = msg.replace('[NAME2]', player2.name);
                        msg = msg.replace('[KILL]', kill);
                        this.send('s2c_notice', {
                            strRichText: msg
                        });
                    }
                }
            }
        }else{
            let time = new Date().getTime() + this.wait_time;
            this.die_player[player.roleid] = time;
            this.send('s2c_jzca_die', {list: [{ onlyid: player.onlyid, time: time}]});
        } 
    }

    offline(player: Player){
        if(player.mapid==5001){
            player.changeMap({
                mapid: 1011, x: 137, y : 74
            });
            player.send('s2c_change_map', {
                mapid: 1011, pos: SKDataUtil.toJson({x: 137, y : 74})
            });
        }
    }

    goMap(player: Player){
        if(player.teamid == 0){
            player.send('s2c_notice', {
				strRichText: `必须组队进入`
			});
            return;
        }
        if(!player.isTeamLeader()){
            player.send('s2c_notice', {
				strRichText: `您不是对长`
			});
            return;
        }
         let menber = TeamMgr.shared.getTeamPlayer(player.teamid);
        if(menber.length < 2){
            player.send('s2c_notice', {
				strRichText: `队伍不足三人`
			});
            return;
        } 
        if (this.activity_state != ActivityDefine.activityState.Opening) {
            player.send('s2c_notice', {
				strRichText: `活动已结束`
			});
            return;
        }
        player.changeMap({
            mapid: 5001, x: 137, y : 74
        });
        player.send('s2c_change_map', {
            mapid: 5001, pos: SKDataUtil.toJson({x: 137, y : 74})
        });
        let time = new Date().getTime() + this.wait_time;
        this.die_player[player.roleid] = time;

        let list = [];
        for (const key in this.die_player) {
            list.push({ onlyid: player.onlyid, time: this.die_player[key]})
        }
        player.send('s2c_jzca_die', {list: list, type:1});
        this.send('s2c_jzca_die', {list: [{ onlyid: player.onlyid, time: time}]});
        this.player_list[player.roleid] = player.onlyid;
    }


    playerFight(player:Player , player2:Player){
        if (this.activity_state != ActivityDefine.activityState.Opening) {
            player.send('s2c_notice', {
				strRichText: `活动已结束`
			});
            return;
        }
        if(player.battle_id>0 || player2.battle_id>0){
            player.send('s2c_notice', {
				strRichText: `玩家战斗中`
			});
            return;
        }
        if(!player.isTeamLeader()){
            player.send('s2c_notice', {
				strRichText: `您不是对长`
			});
            return;
        }
        if(player.teamid ==0 || player2.teamid ==0){
            player.send('s2c_notice', {
				strRichText: `只能攻击组队玩家`
			});
            return;
        }
        if(!this.canFight(player)){
            let time = Math.floor((this.die_player[player.roleid]-new Date().getTime())/1000);
            player.send('s2c_notice', {
				strRichText: `${time}秒后可以攻击其他玩家`
			});
            return;
        }
        if(!this.canFight(player2)){
            player.send('s2c_notice', {
				strRichText: `暂时无法攻击目标`
			});
            return;
        }
        let team = TeamMgr.shared.getTeamInfo(player.teamid);
        let eteam = TeamMgr.shared.getTeamInfo(player2.teamid);
        if (team && eteam) {
            let eonlyid = eteam.leader.onlyid;

            this.fight_list[player.roleid] = eteam.leader.roleid;
            this.fight_list[eteam.leader.roleid] = player.roleid;
            team.leader.playerBattle(eonlyid, BattleType.ChangAn);
        }
    }


    send(event: string, data: any){
        for (const roleid in this.player_list) {
            let player = PlayerMgr.shared.getPlayerByRoleId(roleid);
            player && player.send(event, data)
        }
    }

    canFight(player: Player): boolean{
        let time = this.die_player[player.roleid];
        return !time || new Date().getTime() > time
    }


    getConfig(kill: number){
        if(this.config[kill]){
            return this.config[kill]
        }
        let keys:any = Object.keys(this.config);
        let max = Math.max(keys);
        if(kill > max){
            return this.config[max]
        }
        return null
    }


}