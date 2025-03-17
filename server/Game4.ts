import ChargeConfig from "./game/core/ChargeConfig";
import GameUtil from "./game/core/GameUtil";
import Launch from "./game/core/Launch";
import NpcConfigMgr from "./game/core/NpcConfigMgr";
import HttpGame from "./game/network/http/HttpGame";
import SKLogger from "./gear/SKLogger";
import Command from "./common/Command";
import DBForm from "./utils/DBForm";
import Log from "./utils/Log";


// 未知异常捕获
process.on('uncaughtException', function (err: any) {
    console.error('An uncaught error occurred!');
    console.error(err.stack);
})

function complete() {
    SKLogger.info('启动游戏模块...');
    Launch.shared.start();
}

let mod_list:any = {};

function init(mod:any) {
    mod_list[mod] = 0;
    return () => {
        mod_list[mod] = 1;
        let allcomplete = true;
        for (const mkey in mod_list) {
            if (mod_list.hasOwnProperty(mkey)) {
                const value = mod_list[mkey];
                if (value == 0) {
                    allcomplete = false;
                    break;
                }
            }
        }
        if (allcomplete) {
            complete();
        }
    }
}

function main() {
    // 加载配置表
    let config = require("./etc/config_4");
    GameUtil.serverType = config.INFO.SERVER_TYPE;
    GameUtil.serverName=config.INFO.SERVER_NAME;
    GameUtil.serverId=config.INFO.SERVER_ID;
    GameUtil.serverConfig = config;
    
    GameUtil.launch(()=>{
        
        GameUtil.localIP = GameUtil.getIPAdress();
        SKLogger.info(GameUtil.serverName+"V1.4.8 启动...");
        SKLogger.info("1.系统配置表加载完毕");
        DBForm.shared.init();
        SKLogger.info('2.数据库模块启动完毕');
        // 启动命令行管理
        Command.shared.init();
        SKLogger.info('3.命令行模块启动完毕');
        // 启动监控系统
        // let cli = require("./common/cli");
        // cli.start(config.CLI.PORT, init('cli'));
        // NPC配置初始化
        NpcConfigMgr.shared.init();
        //充值配置模块启动完毕
        ChargeConfig.shared.init();
        SKLogger.info(`4.充值配置模块启动完毕`);
        //启动http模块
        HttpGame.shared.start(config.HTTP.PORT);
        SKLogger.info(`5.HTTP模块启动完毕，开始监听${config.HTTP.IP}:${config.HTTP.PORT}`);
        Log.init();
        
        SKLogger.info('启动游戏模块...');
        Launch.shared.start();
    });
}

main();