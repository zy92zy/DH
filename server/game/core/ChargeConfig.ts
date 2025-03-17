import GameUtil from "./GameUtil";

export default class ChargeConfig
{
	static shared=new ChargeConfig();
	
	charge_list:any;
	reward_list:any;
	reward_list2:any;

	constructor(){
	}

	get(money: any){
		for (const item of this.charge_list) {
			if(item.money == money)
				return item;
		}
		return null;
	}

	init(){
		this.charge_list=[];
		let charge_list=GameUtil.require_ex('../../conf/prop_data/prop_charge.json');
		let reward_list=GameUtil.require_ex('../../conf/prop_data/prop_charge_reward.json');
		let reward_list2=GameUtil.require_ex('../../conf/prop_data/prop_charge_reward2.json');
		for(let key in charge_list){
			this.charge_list.push(charge_list[key]);
		}
		this.reward_list = this.loadConfig(reward_list);
		this.reward_list2 = this.loadConfig(reward_list2);

	}

	loadConfig(reward_list:any){

		let array = [];
		for(let key in reward_list){
			let data=reward_list[key];
			let item:any = {
				id: data.id,
				money: data.money,
				reward:[],
			};
			if (data.gid1 && data.gid1>0 && data.count1 && data.count1>0) {
				item.reward.push({
					gid: data.gid1,
					count: data.count1
				});
			}
			if (data.gid2 && data.gid2>0 && data.count2 && data.count2>0) {
				item.reward.push({
					gid: data.gid2,
					count: data.count2
				});
			}
			if (data.gid3 && data.gid3>0 && data.count3 && data.count3>0) {
				item.reward.push({
					gid: data.gid3,
					count: data.count3
				});
			}
			if (data.gid4 && data.gid4>0 && data.count4 && data.count4>0) {
				item.reward.push({
					gid: data.gid4,
					count: data.count4
				});
			}
			if (data.gid5 && data.gid5>0 && data.count5 && data.count5>0) {
				item.reward.push({
					gid: data.gid5,
					count: data.count5
				});
			}
			if (data.gid6 && data.gid6>0 && data.count6 && data.count6>0) {
				item.reward.push({
					gid: data.gid6,
					count: data.count6
				});
			}
			array.push(item);
		}
		return array
	}



}

