/*
 * 双倍充值活动
 * 此活动只能GM打开
 */

import GameUtil from "../core/GameUtil";
import GTimer from "../../common/GTimer";
import ActivityBase from "./ActivityBase";
import ActivityDefine from "./ActivityDefine";
import Http from "../../utils/Http";

export default class ChongZhi extends ActivityBase
{
	scale:number;
	name:string;
	open_notice:string;
	activity_id:number;
	is_gm_open:boolean;

	constructor () {
		super();
		this.scale           = 2; // 活动充值的倍数
		this.name            = '双倍充值';
		this.open_notice     = `${this.name}开启！`;
		this.activity_id     = ActivityDefine.activityKindID.ChongZhi;
		this.is_ready_notice = true;
		this.is_gm_open      = false;
	}

	/*
	 * gm设置活动时间
	 * @param begin 开始时间
	 * @param end 结束时间
	 */
	setActivityTm (begin:any, end:any) {
		this.is_gm_open = true;
		this.open_time = begin;
		this.close_time = end;
	}

	/*
	 * 活动开启
	 */
	open () {
		Http.sendget(
			GameUtil.serverConfig.GAME.GATE_IP,
			GameUtil.serverConfig.GAME.GATE_PORT,
			'/openChargeActivity',
			{ 
				serverid: GameUtil.serverId,
			},
			(ret:any, data:any) => {
				// console.log('openChargeActivity', ret, data);
			}
		);
		let start_time = GTimer.dateFormat(this.open_time);
		let end_time = GTimer.dateFormat(this.close_time);
		this.open_notice = `双倍充值活动已经开始，活动时间为${start_time}到${end_time}！`;
		console.log(this.open_notice);
		super.open();
	}

	/*
	 * 活动关闭
	 * @param notify 是否通知http服务器
	 */
	close (notify?:any) {
		let start_time = GTimer.dateFormat(this.open_time);
		let end_time = GTimer.dateFormat(this.close_time);
		console.log(`双倍充值活动已经结束，活动时间为${start_time}到${end_time}！`);
		this.is_gm_open = false;
		if (notify) {
			Http.sendget(
				GameUtil.serverConfig.GAME.GATE_IP,
				GameUtil.serverConfig.GAME.GATE_PORT,
				'/closeChargeActivity',
				{
					serverid: GameUtil.serverId,
					isend: true,
				},
				(ret:any, data:any) => {
					// console.log('closeChargeActivity', ret, data);
				}
			);
		}
		super.close();
	}

	/*
	 * 活动是否开启
	 */
	getIsOpen () {
		return (this.activity_state == ActivityDefine.activityState.Opening);
	}

	/*
	 * 充值倍数
	 */
	getChargeScale () {
		return this.scale;
	}

	update () {
		if (!this.is_gm_open) {
			return;
		}
		let date = (new Date()).getTime();
		if (this.activity_state != ActivityDefine.activityState.Opening) {
			if (date >= this.open_time && date <= this.close_time) {
				this.open();
			}
		}
		else {
			if (date > this.close_time) {
				this.close(true);
			}
		}
	}
}

module.exports = ChongZhi;
