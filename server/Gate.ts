import ChargeConfig from "./game/core/ChargeConfig";
import GameUtil from "./game/core/GameUtil";
import FrozenIPMgr from "./gate/FrozenIPMgr";
import FrozenMacMgr from "./gate/FrozenMacMgr";
import GateAgentMgr from "./gate/GateAgentMgr";
import HttpGate from "./gate/HttpGate";
import ServerMgr from "./gate/ServerMgr";
import SKLogger from "./gear/SKLogger";
import Command from "./common/Command";
import DB from "./utils/DB";
import DBForm from "./utils/DBForm";

// 未知异常捕获
process.on('uncaughtException', function (err: any) {
    console.error('An uncaught error occurred!');
    console.error(err.stack);
});

export default class Gate {
    mod_list: any = {};
    private complete() {
        SKLogger.info('网关服务器启动完毕，等待命令');
    }
    init(mod: any) {
        this.mod_list[mod] = 0;
        return () => {
            this.mod_list[mod] = 1;
            let allcomplete = true;
            for (const mkey in this.mod_list) {
                if (this.mod_list.hasOwnProperty(mkey)) {
                    const value = this.mod_list[mkey];
                    if (value == 0) {
                        allcomplete = false;
                        break;
                    }
                }
            }
            if (allcomplete) {
                this.complete();
            }
        }
    }

    lanuch() {
        let config = require("./etc/gate_config");
        GameUtil.serverName=config.serverName;
        GameUtil.serverConfig=config;
        // 加载配置
        GameUtil.launch(()=>{
            GameUtil.serverType = 'gate';
            GameUtil.localIP = GameUtil.getIPAdress();
            GameUtil.serverId = 1000;
            SKLogger.info(GameUtil.serverName+"V1.4.0 启动...");
            // 启动命令行管理
            Command.shared.init();
            SKLogger.info('1.命令行模块启动完毕');
            //启动http模块
            HttpGate.shared.start(config.HTTP.PORT);
            SKLogger.info(`2.HTTP模块启动完毕，开始监听${config.HTTP.LOCAL}:${config.HTTP.PORT}`);
            DB.init();
            DBForm.shared.init();
            SKLogger.info(`3.数据库管理模块启动完毕`);
            //启动服务器管理模块
            ServerMgr.shared.init();
            SKLogger.info(`4.服务器管理模块启动完毕`);
            //充值配置模块启动完毕
            ChargeConfig.shared.init();
            SKLogger.info(`5.充值配置模块启动完毕`);
            GateAgentMgr.shared.init();
            SKLogger.info("5.网关连接管理器连接启动!");
            //启动封禁IP管理模块
            FrozenIPMgr.shared.init();
            SKLogger.info(`6.封禁IP管理模块启动完毕`);
            //启动封禁设备管理模块
            FrozenMacMgr.shared.init();
            SKLogger.info(`7.封禁设备管理模块启动完毕`);
        })
    }
}

new Gate().lanuch();