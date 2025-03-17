import GameUtil from "../game/core/GameUtil";
import Launch from "../game/core/Launch";
import * as readline from "readline";
import SKLogger from "../gear/SKLogger";
import PlayerMgr from "../game/object/PlayerMgr";
import BangZhan from "../game/bang/BangZhan";
import WorldQA from "../game/activity/WorldQA";
import ActivityMgr from "../game/activity/ActivityMgr";
import ActivityDefine from "../game/activity/ActivityDefine";
import ShuiLuDaHui from "../game/activity/ShuiLuDaHui";
import JueZhanChangAn from "../game/activity/JueZhanChangAn";


export default class Command{

    static shared=new Command();
    rl:any;

    constructor(){
    }

    init(){
        this.rl=readline.createInterface({
            input:process.stdin,
            output:process.stdout
        });
        let base = this;
        let val: any;
        this.rl.on('line', function (line:any) {
            let cmd=line.trim();
            switch (cmd&&cmd.match(/[a-zA-z]+/)[0]) {
                case 'hello':
                    SKLogger.info('您好!');
                    break;
                case 'mem':
                    let rss = process.memoryUsage().rss;
                    let rssf = (rss / (1024 * 1024)).toFixed(2) + 'm';
                    SKLogger.info(`内存使用:${rss},${rssf}`);
                    break;
                case 'close':
                    base.quit(10);
                    break;
                case 'num':
                    let num = PlayerMgr.shared.getPlayerNum();
                    let offling = PlayerMgr.shared.getPlayerOfflingNum();
                    SKLogger.info(`当前玩家数: ${num}, 离线玩家数: ${offling}`);
                    break;
                case "save":
                case "saveDB":
                    Launch.shared.saveAll(()=>{
                        SKLogger.info('服务器保存数据');
                    })
                    break;
                case "help":
                    SKLogger.info('[save]服务器保存数据');
                    SKLogger.info('[shutdown]立即关闭服务器');
                    SKLogger.info('[quit]倒计时30秒关闭');
                    break;
                case "quit":
                    val = cmd.match(/[0-9]+/);
                    (!val||val[0]<0||val[0]>300)&&(val = 30);
                    base.quit(val);
                    break;
                case "shutdown":
                    base.quit(0);
                    break;
                case "restart":
                    val = cmd.match(/[0-9]+/);
                    (!val||val[0]<0||val[0]>300)&&(val = 60);
                    base.quit(val,1);
                    break;
                case "logoff":
                    SKLogger.log = false;
                    SKLogger.info("关闭日志显示成功 使用[logon]开启");
                    break;
                case "logon":
                    SKLogger.log = true;
                    SKLogger.info("关闭日志显示成功 使用[logoff]关闭");
                    break;
                case "logfileon":
                    SKLogger.logfile = true;
                    break;
                case "logfileoff":
                    SKLogger.logfile = false;
                    break;
                case "newday":
                    val = cmd.match(/[0-9]+/);
                    (!val)&&(val = 0);
                    if(val > 0){
                        let player = PlayerMgr.shared.getPlayerByRoleId(val);
                        if(player){
                            player.OnNewDay();
                            SKLogger.info("玩家跨天");
                        }else{
                            SKLogger.info("找不到玩家");
                        }
                    }else{
                        PlayerMgr.shared.OnNewDay();
                        SKLogger.info("服务器跨天");
                    }
                    break;
                case "buchang":

                break;
                case "reload":
                    base.reload();
                break;
                case "hotfix":
                    base.hotfix();
                break;
                case "mem":
                case "memory":
                    base.memory();
                break;
                case "memoryTest":
                    base.test();
                break;
                case "bangzhanOpen":
                    val = cmd.match(/[0-9]+/);
                    (!val||val[0]<0||val[0]>30)&&(val = 10);
                    BangZhan.shared.GmBangzhanOpen(val);
                break;
                case "bangzhanClose":
                    BangZhan.shared.BangzhanEnd();
                break;
                case "bangzhanList":
                    BangZhan.shared.showFightList();
                break;
                case "datiOpen":
                    WorldQA.shared.gmOpen();
                break;
                case "datiClose":
                    WorldQA.shared.gmClose();
                break;
                case "shuiluOpen":
                    let shuilu:ShuiLuDaHui = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.ShuiLuDaHui);
                    shuilu.open();
                break;
                case "shuiluClose":
                    let shuilu2:ShuiLuDaHui = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.ShuiLuDaHui);
                    shuilu2.close();
                break;
                case "datiOne":
                    WorldQA.shared.gmOne();
                break;
                case "loadPlayer":
                    val = cmd.match(/[0-9]+/);
                    (!val||val[0]<0)&&(val = 100);
                    PlayerMgr.shared.loadOfflinePlayer(val);
                break;
                case "changanOpen":
                    let changan:JueZhanChangAn = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.JueZhanChangAn);
                    changan.open();
                break;
                case "changanClose":
                    let changan2:JueZhanChangAn = ActivityMgr.shared.getActivity(ActivityDefine.activityKindID.JueZhanChangAn);
                    changan2.close();
                break;
                default:
                    SKLogger.info(`无效的命令:[${cmd}]!`);
                    break;
            }
        });
        
        
        this.rl.on('close', function () {
            SKLogger.info('命令行关闭');
            process.exit(0);
        });
    }

    quit(time: number, mod=0){
        let base = this;
        if (GameUtil.serverType == 'game'){
            Launch.shared.close(time, () => {
                base.rl.close();
            }, mod)
        }else if (GameUtil.serverType == 'gate') {
            base.rl.close();
        }
    }


    // 重新加载配置文件
    reload(){
        let errorlist = GameUtil.reloadPropData();
        console.log(`热更新完成`);
        if (errorlist && errorlist.length > 0) {
            for (let filename of errorlist) {
                console.log(`文件加载错误:[${filename}]`);
            }
        }
    }

    hotfix() {
        let full_path = '../hotfix';
        let old = require.cache[require.resolve(full_path)];
        delete require.cache[require.resolve(full_path)];
        try {
            require(`${full_path}`);
            console.log('hot fix complete !');
        } catch (error) {
            require.cache[require.resolve(full_path)] = old;
            console.error('hot fix  Error Catch!');
            console.error(error.stack);
        }
    }

    memory() {
        let t = process.memoryUsage()
        console.log(`\r\n rss: ${t.rss}\r\n heapTotal: ${t.heapTotal}\r\n heapUsed: ${t.heapUsed}\r\n external: ${t.external}\r\n`);
    }

    test(){
        // 格式化内存使用情况
        var showMem = function () {
            var mem = process.memoryUsage();
            var format = function (bytes) {
                //toFixed 四舍五入number值
                return (bytes / 1024 / 1024).toFixed(2) + ' MB';
            };
            console.log('Process: heapTotal ' + format(mem.heapTotal) +
            ' heapUsed ' + format(mem.heapUsed) + ' rss ' + format(mem.rss));
            console.log('-----------------------------------------------------------');
        };

        // 不停地分配内存但不释放内存
        var useMem = function () {
            var size = 20 * 1024 * 1024;
            var arr = new Array(size);
            for (var i = 0; i < size; i++) {
                arr[i] = 0;
            }
            return arr;
        };
        var total = [];
        for (var j = 0; j < 100; j++) {
            showMem();
            total.push(useMem());
        }
        showMem();


    }

}