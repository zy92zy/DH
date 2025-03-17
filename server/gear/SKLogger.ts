import GameUtil from "../game/core/GameUtil";
import GTimer from "../common/GTimer";
const fs = require("fs");
const log_path = __dirname + "/../log/";

export default class SKLogger{

    static isDebug:boolean=true;
    static log:boolean=false;
    static logfile:boolean=true;

    static warn(msg:any){
        console.warn(msg);
        this.logfile && this.writelog(' [warn] ' + msg);
    }

    static error(msg:string = null){
        msg && console.error(msg);
        let ex = new Error().stack.split("\n");
        console.error(ex);
        this.logfile && this.writelog(' [error] ' + msg + "\r\n" + ex);
    }

    static info(msg:any){
        console.log(msg);
        //this.logfile && this.writelog(' [info] ' + msg);
    }

    static debug(msg:any){
        this.isDebug && this.log && (console.debug(msg)
        //, this.logfile && this.writelog(' [info] ' + msg)
        );
    }

    static writelog(msg: string){
        if(!GameUtil.serverType) return;
        let str =  GTimer.format();
        let path = log_path + GameUtil.serverType + (GameUtil.serverType=='game'?GameUtil.serverId:'') + '.log';
        fs.appendFile(path, str + msg + "\r\n", (error:any)=>{
            error&&console.error(error)
        });
    }

}