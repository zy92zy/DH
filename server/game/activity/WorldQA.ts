import ActivityBase from "./ActivityBase";
import ActivityDefine from "./ActivityDefine";
import PlayerMgr from "../object/PlayerMgr";
import GameUtil from "../core/GameUtil";
import SKLogger from "../../gear/SKLogger";
import GTimer from "../../common/GTimer";
import Player from "../object/Player";
import DB from "../../utils/DB";
import SKTimeUtil from "../../gear/SKTimeUtil";
import ActivityMgr from "./ActivityMgr";
import SKDataUtil from "../../gear/SKDataUtil";
import NoticeMgr from "../core/NoticeMgr";

/**世界答题 */
export default class WorldQA{
    static shared=new WorldQA();

    open_day: number[] = [
        1,2,3,4,5,6,0
    ];
    open_time: number[][] = [
        [2100, 2310],
    ];

    isopen: boolean = false;
    isopenday: boolean = false;

    question: any;
    handle: any = 0;
    players: any[] = [];
    

    id: any = 1;
    idrandom: boolean = true;
    //倒计时
    time: number = 0;
    //间隔
    interval: number = 5;
    next_time: number = 0;

    msg_list:string[] = [];

    msg_data_list: any[] = [];

    activity_id = ActivityDefine.activityKindID.DaTi;
    loop_handle:any;

    init(){
        //ActivityMgr.shared.addActivity(this);
        this.onNewDay();
    }


    gmOpen(){
        SKLogger.info('启动答题，输入[datiClose]关闭');
        this.startQA()
    }
    gmClose(){
        SKLogger.info('关闭答题');
        this.isopen = false;
    }

    gmOne(){
        this.startQA();
        setTimeout(()=>{
            WorldQA.shared.gmClose()
        }, 1000);
    }



    //玩家发言
    playerAnswer(player:Player, msg:string){
        if(!this.isopen || !this.question)
            return;
        msg = msg.replace(/(^\s*)|(\s*$)/g, "");
        if(this.question.type == 1){
            msg = msg.toLowerCase();
            this.question.answer = this.question.answer.toLowerCase();
        }
        if(this.question.answer != msg){
            return;
        }
        this.players.push(player.roleid);

        if(this.question.type==1){
            this.nextQuestion();
        }
    }

    nextQuestion(){
        let items = SKDataUtil.jsonBy(this.question&&this.question.item);
        let names = [];
        if(this.players.length>0 && this.question.type==2){
            let roleid = this.players[GameUtil.random(0, this.players.length-1)];
            this.players = [roleid];
        }
        
        if(items){
            for (const roleid of this.players) {
                    for (const item of items) {
                        let player = PlayerMgr.shared.getPlayerByRoleId(roleid, false);
                        player&&player.addItem(item.itemid, item.num, false, '世界答题');
                    }
            }
        }
        for (const roleid of this.players) {
            let player = PlayerMgr.shared.getPlayerByRoleId(roleid, false);
            player&&names.push(player.name);
        }
        if(names.length > 3){
            names = names.slice(0,3);
        }
        if(this.players.length == 0){
            this.msg_list.push(`本题没有人答对, 答对问题可以获得奖励!`)
        }else if(this.players.length == 1){
            this.msg_list.push(`恭喜${names.join(', ')}答对问题, 获得奖励!`)
        }else{
            this.msg_list.push(`恭喜${names.join(', ')}等${this.players.length}位玩家答对问题, 获得奖励!`)
        }
        this.question = null;
        this.players = [];

        if(this.isopen){
            // setTimeout(()=>{
            //     WorldQA.shared.getQuestion()
            // } , 10 * 1000)
            this.next_time = this.interval * 60 * 1000 + GameUtil.gameTime;
            this.msg_list.push(`下次答题将在${this.interval}分钟后开始!`);
        }else{
            NoticeMgr.shared.sendNotice({
                type: 2,
                text: '本次答题活动已结束，谢谢各位的参与。祝您游戏愉快！',
            });
            this.stopQA();
        }

    }

    startQA(){
        this.isopen = true;
        this.players = [];
        this.msg_data_list = [];
        this.handle = SKTimeUtil.loop(()=>{
            WorldQA.shared.loopQA()
        }, 1000)
        NoticeMgr.shared.sendNotice({
            type: 2,
            text: '现在开始世界答题活动， 参加活动的玩家打开世界聊天频道根据问题回答答案即可获得奖励！',
        });
        //this.getQuestion();
        SKLogger.info('答题活动启动');
    }

    stopQA(){
        SKTimeUtil.cancelLoop(this.handle);
        SKLogger.info('答题活动结束');
    }

    loopQA(){
        if(!this.question && GameUtil.gameTime>=this.next_time){
            //this.next_time = this.interval * 60 * 1000 + GameUtil.gameTime;
            WorldQA.shared.getQuestion();
        }

        this.time--;
        if(this.time <= -10 && this.question){
            this.nextQuestion()
        }
        if(this.msg_list.length>0){
            this.sendMsg(this.msg_list.shift())
        }
    }

    sendMsg(msg: string){
        SKLogger.info(`答题: ${msg}`);
        PlayerMgr.shared.broadcast('s2c_game_chat', {
            scale: 0,
            msg: msg,
            name: '答题小助手',
            resid: 1102,
            teamid: 0,
            horn:1,
            time: GameUtil.gameTime + 1000 * 60,
            //nochat:1,
        });
    }


    getQuestion(){
        let sql = `SELECT * FROM qy_question WHERE id=${this.id} LIMIT 1`;
        if(this.idrandom){
            sql = `SELECT * FROM qy_question ORDER BY RAND() LIMIT 1`;
        }
        DB.query(sql, (error, rows)=>{
            if(error){
                SKLogger.warn('SQL错误 '+sql);
                return;
            }
            if(rows.length == 0){
                this.id=1;
                this.getQuestion();
                return;
            }
            this.question = rows[0];
            this.time = this.question.wait_time||10;
            let msg = `本题限时${this.time}秒`;
            if(this.question.type == 1){
                msg += '，第一个答对的人可以获得奖励。';
            }else{
                msg += '，从答对的玩家中抽取1人获得奖励。';
            }
            this.msg_list.push(msg+'。');
            this.msg_list.push(this.question.question);
            this.question.msg&& (this.msg_list.push(this.question.msg));
        });
        this.id++;
    }

    update(dt: number){

        if(!this.isopenday) 
            return;
        let time = Number(GTimer.format("hhmm"));
        for (const t of this.open_time) {
            if(time >= t[0] && time < t[1]){
                this.isopen||this.startQA();
                return;
            }
        }
        this.isopen = false;
    }

    close(dt: number){}
    onNewDay(){
        this.isopenday = this.open_day.indexOf(new Date().getDay()) > -1;
    }
    onNewHour(){}


}