
export default class IpInfo {
    ip:string;
    count=0;
    time:number;
    total:number=0;
    starttime:number;

    times:number[] = [];
    intervaltime:number;

    blacktime:number=0;

    constructor(ip:string,intervaltime:number = 2000){
        this.ip = ip;
        this.time = new Date().getTime();
        this.starttime = this.time;

        this.times.push(this.time);
        this.intervaltime = intervaltime;
    }

    retain(){
        this.total++;
        let curTime = new Date().getTime();
        this.checktime();
        this.times.push(curTime);
        if(curTime-this.time > 1000){
            this.time = curTime;
            this.count=1;
        }
        else{
            this.count++;
        }
    }

    checktime(){
        let curTime = new Date().getTime();
        let count=0;
        let time:any;
        for(time in this.times){
            if(curTime-time<=this.intervaltime){
                break;
            }
            count++;
        }
        this.times.splice(0,count);

        if(this.blacktime != 0 && !this.isinbacktime()){
            this.blacktime=0;
        }
    }

    setbacktime(){
        let curTime = new Date().getTime();
        this.blacktime = curTime;
    }

    isinbacktime():boolean{
        if(this.blacktime == 0){
            return false;
        }
        let curTime = new Date().getTime();
        return (curTime - this.blacktime) < 3600000
    }

    issafe(count:number):boolean{
        return this.count < count;
    }
}