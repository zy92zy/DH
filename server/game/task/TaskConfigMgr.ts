import GameUtil from "../core/GameUtil";
import Task from "./Task";
import EventTalkNpc from "./EventTalkNpc";
import GatherNpc from "./GatherNpc";
import DoActionInArea from "./DoActionInArea";
import ArriveArea from "./ArriveArea";
import KillDynamicNpc from "./KillDynamicNpc";
import FailEventPlayerDead from "../event/FailEventPlayerDead";
import FailEventTimeOut from "../event/FailEventTimeOut";
import GiveNpcItem from "../event/GiveNpcItem";
import { EEventType } from "../role/EEnum";

export default class TaskConfigMgr {
    static shared = new TaskConfigMgr();
    mapConfigTask: any;

    constructor() {
        this.mapConfigTask = {};
    }

    GetTaskEventCreateNpc(vecString: any): any {
        let vecData = [];
        for (let it in vecString) {
            let strData = vecString[it];
            let vecTmp = strData.split(",");
            if (vecTmp.length != 4)
                continue;
            vecData.push({ nNpc: vecTmp[0], nMap: vecTmp[1], nX: vecTmp[2], nY: vecTmp[3] });
        }
        return vecData;
    }

    GetDailyMaxCnt(group: any): number {
        if (group == 2 || group == 3) {
            return 20;
        }
        if (group == 4) {
            return 15;
        }
        if (group == 5) {
            return 5;
        }
        if (group == 6) {
            return 120;
        }
        if (group == 7) {
            return 120;
        }
        if (group == 8 || group == 12) {
            return 20;
        }
        if (group == 13) {
            return 2;
        }
        return 0;

    }

    StringVecorToDataVector(vecString: any): any {
        let vecData = [];

        for (let it in vecString) {
            let strData = vecString[it];

            let vecTmp = strData.split(":");
            if (vecTmp.length != 2)
                continue;

            vecData.push({ nKey: vecTmp[0], nValue: vecTmp[1] });
        }

        return vecData;
    }

    AddTask(nKind: any, stTask: any) {
        if (this.mapConfigTask.hasOwnProperty(nKind) == false)
            this.mapConfigTask[nKind] = [];

        this.mapConfigTask[nKind].push(stTask);
    }

    init() {
        let mapData = GameUtil.require_ex('../../conf/prop_data/prop_task');
        for (let itTask in mapData) {
            if (itTask == 'datatype')
                continue;
            const stData = mapData[itTask];
            let stTask = new Task();
            stTask.nTaskID = parseInt(itTask);
            stTask.nKind = stData.nKind;
            stTask.strTaskName = stData.strName;
            stTask.nTaskGrop = GameUtil.getDefault(stData.nTaskGrop, 0);
            stTask.nDailyCnt = GameUtil.getDefault(stData.nDailyCnt, 0);

            for (let nIndex in stData.vecEvent) {
                if (stData.vecEvent[nIndex].nEventType == EEventType.PlayerTalkNpc)  //对话
                {
                    let stTalk = new EventTalkNpc();
                    stTalk.nEventType = EEventType.PlayerTalkNpc;
                    stTalk.vecPrize = this.StringVecorToDataVector(stData.vecEvent[nIndex].vecPrize);
                    stTalk.strTip = stData.vecEvent[nIndex].strTip;
                    stTalk.vecCreateNpc = this.GetTaskEventCreateNpc(stData.vecEvent[nIndex].vecCreateNpc);
                    stTalk.vecNpc = stData.vecEvent[nIndex].vecNpc.slice(0);
                    stTalk.vecSpeak = this.StringVecorToDataVector(stData.vecEvent[nIndex].vecSpeak);
                    stTalk.bAutoTrigle = GameUtil.getDefault(stData.vecEvent[nIndex].bAutoTrigle, 0);
                    stTask.vecEvent.push(stTalk);
                }

                if (stData.vecEvent[nIndex].nEventType == EEventType.PlayerGatherNpc) {
                    let stGather = new GatherNpc();
                    stGather.nEventType = EEventType.PlayerGatherNpc;
                    stGather.strTip = stData.vecEvent[nIndex].strTip;
                    stGather.vecPrize = this.StringVecorToDataVector(stData.vecEvent[nIndex].vecPrize);
                    stGather.vecCreateNpc = this.GetTaskEventCreateNpc(stData.vecEvent[nIndex].vecCreateNpc);
                    stGather.vecNpc = stData.vecEvent[nIndex].vecNpc.slice(0);
                    stTask.vecEvent.push(stGather);
                }

                if (stData.vecEvent[nIndex].nEventType == EEventType.PlayerDoAction) {
                    let stAction = new DoActionInArea();
                    stAction.nEventType = EEventType.PlayerDoAction;
                    stAction.vecPrize = this.StringVecorToDataVector(stData.vecEvent[nIndex].vecPrize);
                    stAction.strTip = stData.vecEvent[nIndex].strTip;
                    stAction.nMap = stData.vecEvent[nIndex].nMap;
                    stAction.nX = stData.vecEvent[nIndex].nX;
                    stAction.nY = stData.vecEvent[nIndex].nY;
                    stAction.strAction = stData.vecEvent[nIndex].strAction;
                    stAction.strTalk = stData.vecEvent[nIndex].strTalk;
                    stTask.vecEvent.push(stAction);
                }

                if (stData.vecEvent[nIndex].nEventType == EEventType.PlayerArriveArea) {
                    let stAction = new ArriveArea();
                    stAction.nEventType = EEventType.PlayerArriveArea;
                    stAction.vecPrize = this.StringVecorToDataVector(stData.vecEvent[nIndex].vecPrize);
                    stAction.strTip = stData.vecEvent[nIndex].strTip;
                    stAction.nMap = stData.vecEvent[nIndex].nMap;
                    stAction.nX = stData.vecEvent[nIndex].nX;
                    stAction.nY = stData.vecEvent[nIndex].nY;
                    stTask.vecEvent.push(stAction);
                }

                if (stData.vecEvent[nIndex].nEventType == EEventType.PlayerGiveNpcItem) {
                    let stAction = new GiveNpcItem();
                    stAction.nEventType = EEventType.PlayerGiveNpcItem;
                    stAction.vecPrize = this.StringVecorToDataVector(stData.vecEvent[nIndex].vecPrize);
                    stAction.strTip = stData.vecEvent[nIndex].strTip;
                    stAction.nItemID = stData.vecEvent[nIndex].nItemID;
                    stAction.nNum = stData.vecEvent[nIndex].nNum;
                    stAction.nFromNpc = stData.vecEvent[nIndex].nFromNpc;
                    stAction.nNpcConfigID = stData.vecEvent[nIndex].nToNpc;
                    stAction.strTip2 = stData.vecEvent[nIndex].strTip2;
                    stTask.vecEvent.push(stAction);
                }

                if (stData.vecEvent[nIndex].nEventType == EEventType.PlayerKillNpc) {
                    let stEvent = new KillDynamicNpc();
                    stEvent.nEventType = EEventType.PlayerKillNpc;
                    stEvent.vecPrize = this.StringVecorToDataVector(stData.vecEvent[nIndex].vecPrize);
                    stEvent.strTip = stData.vecEvent[nIndex].strTip;
                    stEvent.vecCreateNpc = this.GetTaskEventCreateNpc(stData.vecEvent[nIndex].vecCreateNpc);
                    stEvent.vecNpc = stData.vecEvent[nIndex].vecNpc.slice(0);
                    stEvent.bAutoTrigle = stData.vecEvent[nIndex].bAutoTrigle;
                    stTask.vecEvent.push(stEvent);
                }
            }

            for (let nIndex in stData.vecFailEvent) {
                if (stData.vecFailEvent[nIndex].nEventType == EEventType.FailEventPlayerDead) {
                    let stEvent = new FailEventPlayerDead();
                    stTask.vecFailEvent.push(stEvent);
                }

                if (stData.vecFailEvent[nIndex].nEventType == EEventType.FailEventTimeOut) {
                    let stEvent = new FailEventTimeOut();
                    stTask.vecFailEvent.push(stEvent);
                }
            }
            stTask.vecLimit = this.StringVecorToDataVector(stData.vecLimit);
            this.AddTask(stTask.nKind, stTask);
        }
    }

    GetTaskInfo(nTaskID: any): any {
        for (let nKind in this.mapConfigTask) {
            let vecTask = this.mapConfigTask[nKind];
            for (let nIndex in vecTask) {
                if (vecTask[nIndex].nTaskID == nTaskID)
                    return vecTask[nIndex];
            }
        }
        return null;
    }

    GetTaskStepInfo(nTaskID: any, nStep: any): any {
        let stTaskConfig = this.GetTaskInfo(nTaskID);
        if (null == stTaskConfig)
            return null;

        if (nStep < 0 || nStep >= stTaskConfig.vecEvent.length)
            return null;

        return stTaskConfig.vecEvent[nStep];
    }

    GetFailEventInfo(nTaskID: any, nStep: any) {
        let stTaskConfig = this.GetTaskInfo(nTaskID);
        if (null == stTaskConfig)
            return null;

        if (nStep < 0 || nStep >= stTaskConfig.vecFailEvent.length)
            return null;

        return stTaskConfig.vecFailEvent[nStep];
    }
    // 是否为组队任务
    isTeamTask(taskId: any): boolean {
        if (taskId >= 500) {
            return true;
        }
        return false;
    }

    IsTeamDaily(group: any): boolean {
        if (GameUtil.isDataInVecter(group, [5, 6, 7, 8, 12, 2015, 2016]))
            return true;
        return false;
    }
}