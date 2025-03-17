import WorldStarMgr from "./WorldStarMgr";
import WorldMonsterMgr from "./WorldMonsterMgr";
import GameUtil from "../core/GameUtil";
import PlayerMgr from "./PlayerMgr";
import BangMgr from "../bang/BangMgr";
import PaiHangMgr from "../core/PaiHangMgr";
const schedule = require('node-schedule');


// 地煞天元模块
export default class World {
    private static _shared:World;
    starMgr:WorldStarMgr;
    worldMonsterMgr:WorldMonsterMgr;
    nTimeCnt:number;
    logTime:any;
    m_timer:NodeJS.Timeout;

    static get shared():World{
        if(!this._shared){
            this._shared=new World();
        }
        return this._shared;
    }

    constructor() {
        this.starMgr = new WorldStarMgr();
        this.worldMonsterMgr = new WorldMonsterMgr();
        this.ResetTimer(1000);
        this.nTimeCnt = -1;
        this.logTime = null;

        //5点刷新
        schedule.scheduleJob('0 0 5 * * *',()=>{
            this.OnNewDay();
        });
    }

    init() {
        let nCurTime = GameUtil.getTime();
        let nDay = Math.floor(nCurTime / 86400);
        let nHour = Math.floor(nCurTime / 3600);
        this.logTime = {
            nCurDay: nDay,
            nCurHour: nHour,
        }
    }

    OnKillNpc(nAccountID:any, nNpcOnlyID:any) {
        // this.starMgr.playerAddStar(nAccountID);
        this.starMgr.CheckWorldStarDead(nNpcOnlyID);
        this.worldMonsterMgr.CheckWorldMonsterDead(nNpcOnlyID);
    }

    ResetTimer(nValue:any) {
        let pSelf = this;
        clearInterval(this.m_timer);
        this.m_timer = setInterval(function () {
            pSelf.OnTimer();
        }, nValue);
    }

    OnTimer() { //每秒一次
        this.nTimeCnt += 1;
        if (this.nTimeCnt % 60 == 0) {
            this.CheckTimeChange();
        }

        // this.starMgr.OnUpdate(this.nTimeCnt);
    }

    //每分一次
    CheckTimeChange() {
        let nCurTime = GameUtil.getTime();
        let nDay = Math.floor(nCurTime / 86400);
        let nHour = Math.floor(nCurTime / 3600);
        if (this.logTime.nCurDay != nDay) {
            //this.OnNewDay();
            this.logTime.nCurDay = nDay;
        }
        if (this.logTime.nCurHour != nHour) {
            this.OnNewHour();
            this.logTime.nCurHour = nHour;
        }
    }

    OnNewDay() {
        PlayerMgr.shared.OnNewDay();
        PaiHangMgr.shared.onNewDay();
        BangMgr.shared.onNewDay();
    }

    OnNewHour() {
        PlayerMgr.shared.OnNewHour();
    }
}