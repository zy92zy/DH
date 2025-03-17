import { MsgCode } from "../game/role/EEnum";
import DB from "../utils/DB";
import IpInfo from "./IpInfo"
import SKLogger from "../gear/SKLogger";
import GTimer from "../common/GTimer";

export default class FrozenIPMgr {
	static shared=new FrozenIPMgr();
	frozenlist:string[];

	ips:{[key:string]:IpInfo} = {};

	ip_list:any = {};
	ban_list:any = {};
	time_limit:number = 20 * 1000;
	ban_time:number = 10 * 60 * 1000;
	
	constructor(){
		this.frozenlist = [];
		this.ip_list = {};
		this.ban_list = {};
	}

	init(){
		DB.getFrozenList((ret:any, rows:any)=>{
			if (ret == MsgCode.SUCCESS) {
				for (const row of rows) {
					let fip = row.frozen_ip;
					this.addFrozenIP(fip);
				}
			}
		});
		setInterval(this.checkip_loop, 10 * 1000);
	}

	addFrozenIP(fip:any){
		if (this.frozenlist.indexOf(fip) == -1) {
			this.frozenlist.push(fip);
		}
	}

	removeFrozenIP(value:string){
		let index=this.frozenlist.indexOf(value);
		if(index != -1){
			this.frozenlist.splice(index,1);
		}
	}

	checkIP(ip:any):boolean{
		return this.frozenlist.indexOf(ip) == -1
	}

	checkip_loop(){
		let time = new Date().getTime();
		let base = FrozenIPMgr.shared;
		for (const ip in base.ip_list) {
			let item = base.ip_list[ip];
			if(item === undefined || item === null) continue;
			if(item.length > 25){
				//base.ban_list[ip] = time;
				//SKLogger.warn(ip + "被加入黑名单");
			}
			for (const i of item) {
				let index = item.indexOf(i)
				index>-1 && i < time - base.time_limit && (item = item.splice(index, 1));
			}
			item.length > 0 ? (base.ip_list[ip] = item) : (delete base.ip_list[ip]);
		}
		for (const ip in base.ban_list) {
			let item = base.ban_list[ip];
			item && item < time-base.ban_time && (delete base.ban_list[ip]);
		}
	}

	isbanip(ip:string):string{
		return null;

		let time = this.ban_list[ip];
		return time ? GTimer.dateFormat(time) : null
	}

	checkip(ip:string):boolean{
		this.ip_list[ip] || (this.ip_list[ip] = []);
		this.ip_list[ip].push(new Date().getTime());
		return this.ip_list[ip].length < 20;
		return !this.ban_list[ip] && this.ip_list[ip].length < 15;
	}

	issafeip(ip:string,count:number = 3){
		let ipInfo:IpInfo = this.ips[ip];
		if(!ipInfo){
			this.ips[ip] = ipInfo = new IpInfo(ip,20000);
		}
		// 如果在黑名单
		if(ipInfo.isinbacktime()){
			SKLogger.debug(ip + "在黑名单中...");
			return false;
		}
		// 请求数加1
		ipInfo.retain();
		// 20秒请求60次
		if(ipInfo.times.length > 20){
			ipInfo.setbacktime();
			SKLogger.warn(ip + "加入黑名单");
			return false;
		}
		SKLogger.debug( ip + "请求Http次数(一秒内):" + ipInfo.count);

		return true;
		return ipInfo.issafe(count);
	}
}