
import Player from "../object/Player";
import ItemUtil from "./ItemUtil";
import SKDataUtil from "../../gear/SKDataUtil";
import GameUtil from "./GameUtil";
import { MsgCode } from "../role/EEnum";
import GTimer from "../../common/GTimer";
import NoticeMgr from "./NoticeMgr";

export default class DayReward {
	static shared = new DayReward();
	day_reward: any = {};


	constructor() {
		
	}

	init() {
		this.day_reward = GameUtil.require_ex('../../conf/prop_data/prop_day_reward.json');
	}
	

	getInfo(player: Player){
		let data = {
			day: player.getgift.day || 1,
			receive: player.getgift.time < parseInt(GTimer.format('yyyyMMdd')) ? 1 : 0,
		};
		player.send('s2c_day_login_reward_info', data);
	}


	getGift(player: Player): any{
		let time: number = parseInt(GTimer.format('yyyyMMdd'));
		let gift = this.day_reward[player.getgift.day];
		if(player.getgift.day<1){
			player.getgift.day=1;
		}
		if(!gift){
			player.send('s2c_notice', {
				strRichText: '没有可领取的礼包'
			});
			return;
		}
		if(player.getgift.time >= time){
			player.send('s2c_notice', {
				strRichText: '今日已经领过'
			});
			return;
		}
		gift.item&&player.addItem(gift.item.itemid, gift.item.num, false, '每日奖励');

		if(gift.ex_item && gift.ex_item.length>0){
			for (const item of gift.ex_item) {
				player.addItem(item.itemid, item.num, false, '每日奖励');
			}
		}
		if(gift.notice){
			let msg: string = gift.notice;
			msg = msg.replace('[DAY]', player.getgift.day);
			msg = msg.replace('[NAME]', gift.name);
			msg = msg.replace('[PLAYER]', player.name);
			NoticeMgr.shared.sendNotice({
                type: 2,
                text: msg,
            });
		}
		player.getgift.day += 1;
		player.getgift.time = time;
	}

}