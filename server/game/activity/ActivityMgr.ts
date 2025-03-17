import GameUtil from "../core/GameUtil";
import ShuiLuDaHui from "./ShuiLuDaHui";
import LingHou from "./LingHou";
import Zhenbukui from "./Zhenbukui";
import JueZhanChangAn from "./JueZhanChangAn";
import ActivityBase from "./ActivityBase";

export default class ActivityMgr {
    static shared = new ActivityMgr();
    log_time: any;
    activity_list: any;
    activity_list2: any;

    constructor() {
        this.log_time = {};
        this.activity_list = {};
        this.activity_list2 = {};
    }

    init() {
        let nDay = Math.floor((GameUtil.gameTime / 1000) / 86400);
        let nHour = Math.floor((GameUtil.gameTime / 1000) / 3600);
        let nMinute = Math.floor((GameUtil.gameTime / 1000) / 60);

        this.log_time = {
            curDay: nDay,
            curHour: nHour,
            curMinute: nMinute,
        };

        let ActShuiLu = new ShuiLuDaHui();
        this.addActivity(ActShuiLu);

        let ActLingHou = new LingHou();
        this.addActivity(ActLingHou);

        let ActZhenbukui = new Zhenbukui();
        this.addActivity(ActZhenbukui);

        let juezhan = new JueZhanChangAn();
        this.addActivity(juezhan);
    }

    addActivity(activity: any) {
        this.activity_list[activity.activity_id] = activity;
    }

    delActivity(activityid: any) {
        delete this.activity_list[activityid];
    }

    getActivity(actid: any) {
        return this.activity_list[actid];
    }

    checkActivity(dt?: number) {
        for (let activity_id in this.activity_list) {
            let activity: ActivityBase = this.activity_list[activity_id];
            activity.update(dt);
        }
    }

    close() {
        for (let activity_id in this.activity_list) {
            let activity: ActivityBase = this.activity_list[activity_id];
            activity.close();
        }
    }

    update(dt: number) {
        if (dt % (10 * 1000) == 0) {
            this.checkActivity(dt);
            let nDay = Math.floor((GameUtil.gameTime / 1000) / 86400);
            let nHour = Math.floor((GameUtil.gameTime / 1000) / 3600);
            let nMinute = Math.floor((GameUtil.gameTime / 1000) / 60);
            if (this.log_time.curDay != nDay) {
                for (const activity_id in this.activity_list) {
                    this.activity_list[activity_id].onNewDay();
                }
            }
            if (this.log_time.curHour != nHour) {
                for (const activity_id in this.activity_list) {
                    this.activity_list[activity_id].onNewHour();
                }
            }
            this.log_time.curDay = nDay;
            this.log_time.curHour = nHour;
            this.log_time.curMinute = nMinute;
        }
    }
}