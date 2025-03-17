
import { MsgCode } from "../game/role/EEnum";
import DB from "../utils/DB";

export default class FrozenMACMgr
{
	static shared=new FrozenMACMgr();
	frozenlist:any[];

	constructor(){
		this.frozenlist = [];
	}

	init(){
		DB.getFrozenMacList((ret:any, rows:any)=>{
			if (ret == MsgCode.SUCCESS) {
				for (const row of rows) {
					let mac = row.mac;
					this.addFrozenMAC(mac);
				}
			}
		});
	}
	// 加入Mac
	addFrozenMAC(mac:any){
		if (this.frozenlist.indexOf(mac) == -1) {
			this.frozenlist.push(mac);
		}
	}
	// 删除Mac
	removeFrozenMAC(mac:string){
		let index=this.frozenlist.indexOf(mac);
		if(index==-1){
			return;
		}
		this.frozenlist.splice(index,1);
	}

	checkMAC(mac:any){
		if (this.frozenlist.indexOf(mac) == -1) {
			return true;
		}
		return false;
	}
}