import GameUtil from "../game/core/GameUtil";


declare global {
    interface Date {
        format(fmt: any):any;
    }
}

Date.prototype.format = function (fmt: any  = "yyyy-MM-dd hh:mm:ss") :string { //author: meizz   
    let o:any = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? String(o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}




export default class GTimer{
	static offsetTime:number=0;

	static getCurTime(){
		let curtime = Date.now();
		curtime += GTimer.offsetTime;
		return curtime;
	}
	
	static getCurDate() {
		let cuttime = GTimer.getCurTime()
		return new Date(cuttime);
	}
	
	static dateFormat(time:number) {
		let date = new Date(time);
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		let sm = m < 10 ? ('0' + m) : m;
		let d = date.getDate();
		let sd = d < 10 ? ('0' + d) : d;
		let h = date.getHours();
		let sh = h < 10 ? ('0' + h) : h;
		let mi = date.getMinutes();
		let smi = mi < 10 ? ('0' + mi) : mi;
		let s = date.getSeconds();
		let ss = s < 10 ? ('0' + s) : s;
		return y + '-' + sm + '-' + sd + ' ' + sh + ':' + smi + ':' + ss;
	}



	static getTimeFormat() {
		return GTimer.dateFormat(GameUtil.gameTime);
	}
	
	static getWeekDay() {
		let date = GTimer.getCurDate();
		let t = date.getDay(); // 
		return t + 1;
	}
	
	static getYearDay(date:any) {
		// 构造1月1日
		let lastDay:any = new Date(date);
		lastDay.setMonth(0);
		lastDay.setDate(1);
		// 获取距离1月1日过去多少天
		var days = Math.ceil(date - lastDay) / (1000 * 60 * 60 * 24);
		return days;
	}
	
	static getYearWeek(date:any):number{
		let days = GTimer.getYearDay(date);
		let num = Math.ceil(days / 7);
		return num;
	}

	static getDay(){
		return new Date().getDay()
	}


	static format(date: any = null, fmt = "yyyy-MM-dd hh:mm:ss"):string {
		if(date == null){
			date = new Date();
		}else if(!isNaN(date)){
			date = new Date(date);
		}else if(typeof date == 'string'){
			fmt = date;
			date = new Date();
		}
        return date.format(fmt);
    }



}


