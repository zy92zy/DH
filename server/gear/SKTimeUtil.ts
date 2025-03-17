export default class SKTimeUtil{
    //延迟执行一次
    static delay(block:()=>void,delay:number=15000,handle:number=0):NodeJS.Timeout{
        if(handle!=0){
            return null;
        }
        let result=setTimeout(block,delay);
        return result;
    }
    //清理定时任务
    static cancelDelay(handle:NodeJS.Timeout):NodeJS.Timeout{
        if(handle != null){
            clearTimeout(handle);
        }
        return handle;
    }
    //定时循环执行
    static loop(block:()=>void,timeout:number,handle:number=0):NodeJS.Timeout{
        this.cancelLoop(handle);
        let result=setInterval(block,timeout);
        return result;
    }
    //清除定时循环任务
    static cancelLoop(handle:number):number{
        if(handle!=0){
            clearInterval(handle);
        }
        return 0;
    }
    //判断是否有任务在执行
    static hasRun(handle:number):boolean{
        if(handle==0){
            return false;
        }
        return true;
    }
}