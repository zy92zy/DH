import TaskState from "../object/TaskState";
import GameUtil from "./GameUtil";
import TaskConfigMgr from "../task/TaskConfigMgr";
import TeamMgr from "./TeamMgr";
import NpcMgr from "./NpcMgr";
import SKDataUtil from "../../gear/SKDataUtil";
import Player from '../object/Player';
import SKLogger from '../../gear/SKLogger';
import { EEventType, ETaskKind, ETaskState } from "../role/EEnum";

export default class RoleTaskMgr {
    player: Player;
    vecRecord: any;
    mapTaskState: any;
    nTimeCnt: any;
    mapDailyCnt: any;
    mapDailyStart: any;
    mapFuBenCnt: any;
    mapActiveScore: any;
    szBeenTake: any;
    szActivePrize: any;
    bCanAutoFight: any;

    constructor(player: Player) {
        this.player = player;
        this.vecRecord = [];
        this.mapTaskState = {};
        this.nTimeCnt = 0;
        this.mapDailyCnt = {}; 
        this.mapDailyStart = {};
        this.mapFuBenCnt = {};
        this.mapActiveScore = {};
        this.szBeenTake = [0, 0, 0, 0, 0, 0];
        this.szActivePrize = ['50004,10', '50004,50', '50004,100', '90004,100000000', '10007,5', '10006,10'];
        this.bCanAutoFight = 0;
    }

    OnTimer(nIndex?: any) { //一秒一次
        this.nTimeCnt += 1;
        if (this.nTimeCnt % 2 == 0) {
            this.OnGameEvent(EEventType.PlayerArriveArea, {
                mapid: this.player.mapid,
                x: this.player.x,
                y: this.player.y
            });
        }
        if (this.nTimeCnt % 5 == 0)
            this.OnFailEvent(EEventType.FailEventTimeOut, GameUtil.getTime());
    }

    //新的一天重置
    OnNewDay() {
        this.mapDailyStart = {};

        let vecTask = [];
        //每日和副本重置
        for (var it in this.mapTaskState) {
            if (this.mapTaskState[it].nKind == GameUtil.ETaskKind.EDaily || this.mapTaskState[it].nKind == GameUtil.ETaskKind.EFuBen) {
                vecTask.push(this.mapTaskState[it].nTaskID)
            }
        }
        //放弃所有每日和副本
        for (var it in vecTask) {
            this.abortTask(vecTask[it]);
        }

        this.mapDailyCnt = {}; //放弃任务会增加计数，所以放到放弃后面
        this.mapFuBenCnt = {};

        this.mapActiveScore = {};
        this.szBeenTake = [0, 0, 0, 0, 0, 0];
        this.updateTaskStateToClient();
    }


    GetTaskStepState(nTaskID: any, nStep: any) {
        if (this.mapTaskState.hasOwnProperty(nTaskID) == false)
            return null;

        if (nStep < 0 || nStep >= this.mapTaskState[nTaskID].vecEventState.length)
            return null;

        return this.mapTaskState[nTaskID].vecEventState[nStep];
    }

    //初始化任务状态
    Init(vecDBTask: any, vecRecord: any, mapDailyCnt: any, mapFuBenCnt: any, mapDailyStart: any, mapActiveScore: any, szBeenTake: any) {
        this.vecRecord = vecRecord.slice(0);
        this.mapTaskState = {};
        this.mapDailyCnt = mapDailyCnt;
        this.mapFuBenCnt = mapFuBenCnt;
        this.mapDailyStart = mapDailyStart;
        this.mapActiveScore = mapActiveScore;
        this.szBeenTake = szBeenTake;
        this.LoadCurTaskFromDB(vecDBTask);
        this.CheckAndDeleteFinishedTask();
    }

    IsAlreadyDoneThisTask(nTaskID: any) {
        for (var it in this.vecRecord) {
            if (this.vecRecord[it] == nTaskID)
                return true;
        }
        return false;
    }

    IsMatchLimit(stTask: any) {
        for (var itLimit in stTask.vecLimit) {
            if (stTask.vecLimit[itLimit].nKey == 'nPreTask') //前置任务
            {
                let nPreTask = parseInt(stTask.vecLimit[itLimit].nValue);
                if (this.IsAlreadyDoneThisTask(nPreTask) == false)
                    return false;
            }

            if (stTask.vecLimit[itLimit].nKey == 'nBang') {
                if (this.player.bangid == 0)
                    return false;
            }

            if (stTask.vecLimit[itLimit].nKey == 'nRace') {
                let nNeedRace = parseInt(stTask.vecLimit[itLimit].nValue);
                if (this.player.race != nNeedRace)
                    return false;
            }

        }
        return true;
    }

    LoadCurTaskFromDB(vecData: any) {
        for (var it in vecData) {
            this.AddTaskState(vecData[it].nTaskID, parseInt(vecData[it].nCurStep));
        }
    }

    AddTaskState(nTaskID: any, nCurStep: any) {
        let stTaskConfig = TaskConfigMgr.shared.GetTaskInfo(nTaskID);
        if (!stTaskConfig) {
            return;
        }
        if (TaskConfigMgr.shared.isTeamTask(nTaskID) && this.player.teamid == 0)
            return;

        let stTaskState = new TaskState();
        stTaskState.player = this.player;
        stTaskState.InitState(stTaskConfig, nCurStep);
        this.mapTaskState[stTaskState.nTaskID] = stTaskState;
    }

    IsAlreadyHasThisKindDailyTask(nTaskGrop: any) {
        for (var it in this.mapTaskState) {
            let pConfig = TaskConfigMgr.shared.GetTaskInfo(it);
            if (null == pConfig)
                continue;

            if (pConfig.nTaskGrop == nTaskGrop)
                return true;
        }

        return false;
    }
    //获取每日任务计数
    GetKindTaskCnt(nTaskGrop: any) {
        if (this.mapDailyCnt.hasOwnProperty(nTaskGrop) == false)
            return 0;

        return this.mapDailyCnt[nTaskGrop];
    }

    GetGroupTask(): any {
        let vecDailyTask = TaskConfigMgr.shared.mapConfigTask[GameUtil.ETaskKind.EDaily];
        if (null == vecDailyTask)
            return {};

        let mapTmp: any = {};
        for (var it in vecDailyTask) {
            let nGroup = vecDailyTask[it].nTaskGrop;
            if (mapTmp.hasOwnProperty(nGroup) == false)
                mapTmp[nGroup] = [];
            mapTmp[nGroup].push(vecDailyTask[it]);
        }
        return mapTmp;
    }

    GetEnableDailyTask(mapDailyTask: any, nGroup: any) {
        let vecGroupDaily = mapDailyTask[nGroup];
        let vecRaceDaily = [];
        for (var it in vecGroupDaily) {
            let pTaskInfo = vecGroupDaily[it];
            if (this.IsMatchLimit(pTaskInfo) == false)
                continue;

            vecRaceDaily.push(pTaskInfo);
        }
        return vecRaceDaily;
    }
    //检查接受任务
    CheckAndInceptTask() {
        let vecStoryTask = GameUtil.getDefault(TaskConfigMgr.shared.mapConfigTask[GameUtil.ETaskKind.EStory], []);

        for (var itStory in vecStoryTask) {
            let pTaskConfig = vecStoryTask[itStory];
            if (this.IsAlreadyDoneThisTask(pTaskConfig.nTaskID))
                continue;

            if (this.mapTaskState.hasOwnProperty(pTaskConfig.nTaskID))
                continue;

            if (this.IsMatchLimit(pTaskConfig) == false)
                continue;

            this.AddTaskState(pTaskConfig.nTaskID, 0);
            break;
        }

        let mapDailyTask = this.GetGroupTask();

        for (var itGroup in mapDailyTask) {
            if (this.mapDailyStart.hasOwnProperty(itGroup) == false) //未开启
                continue;

            if (TaskConfigMgr.shared.IsTeamDaily(itGroup) && this.player.isleader == false)
                continue;

            if (this.IsAlreadyHasThisKindDailyTask(itGroup)) //已有该类型的每日的任务
                continue;

            let vecGroupTask = this.GetEnableDailyTask(mapDailyTask, itGroup);
            let nRand = Math.floor(Math.random() * 100) % vecGroupTask.length;
            let pTaskConfig = vecGroupTask[nRand];
            if (pTaskConfig) {
                if (this.GetKindTaskCnt(itGroup) >= pTaskConfig.nDailyCnt) //这个类型的每日任务做完了
                    continue;
                if (this.IsMatchLimit(pTaskConfig) == false)
                    continue;
                this.AddTaskState(pTaskConfig.nTaskID, 0);
            }
        }
    }


    StartGroupTask(nTaskGrop: number): any {
        let current=this.GetKindTaskCnt(nTaskGrop);
        let max=TaskConfigMgr.shared.GetDailyMaxCnt(nTaskGrop);
        /* if(current >= max){
            return "次数已满";
        } */
        if (TaskConfigMgr.shared.IsTeamDaily(nTaskGrop) && this.player.teamid == 0 && this.player.isleader == false) {
            return '只有队长才能接这个任务';
        }
        if (this.mapDailyStart.hasOwnProperty(nTaskGrop)) {
            return '你已经领过这个任务了';
        }
        this.mapDailyStart[nTaskGrop] = true;
        this.CheckAndInceptTask();
        this.updateTaskStateToClient();
        return '';
    }

    CheckAndInceptFuBenTask(nTaskID: any) {
        let pTaskConfig = TaskConfigMgr.shared.GetTaskInfo(nTaskID);
        if (null == pTaskConfig || pTaskConfig.nKind != ETaskKind.FUBEN)
            return 'syserr';

        /*
        if (this.GetFuBenCnt(nTaskID) >= 1)
            return '次数已满';
        */
        if (this.player.teamid == 0 || this.player.isleader == false)
            return '只有队长才能接这个任务';

        if (this.mapTaskState.hasOwnProperty(pTaskConfig.nTaskID))
            return '你已经有这个任务';

        if (this.IsMatchLimit(pTaskConfig) == false)
            return '不满足条件';

        this.AddTaskState(pTaskConfig.nTaskID, 0);
        this.updateTaskStateToClient();
        return '';
    }

    //游戏事件
    OnGameEvent(nEventType: any, stData: any) {
        //组队状态下非队长跳过
        if (this.player.teamid > 0 && this.player.isleader == false)
            return;
        let bChange = false;
        //遍历任务状态
        for (let it in this.mapTaskState) {
            if (this.mapTaskState[it].TaskOnGameEvent(nEventType, stData) == true)
                bChange = true;
        }
        if (bChange) {
            //检查并删除完成的任务
            this.CheckAndDeleteFinishedTask();
            //刷新任务状态到客户端
            this.updateTaskStateToClient();
        }
    }

    OnTeamTaskState(mapLeaderTaskState: any) {
        for (var it in mapLeaderTaskState) {
            if (TaskConfigMgr.shared.isTeamTask(it) == false)
                continue;

            if (this.mapTaskState.hasOwnProperty(it))
                delete this.mapTaskState[it];

            let pInfo = mapLeaderTaskState[it];

            let pTaskState = new TaskState();

            pTaskState.nTaskID = pInfo.nTaskID;
            pTaskState.nKind = pInfo.nKind;
            pTaskState.nTaskGrop = pInfo.nTaskGrop;
            pTaskState.nTaskFinish = pInfo.nTaskFinish;
            pTaskState.vecEventState = pInfo.vecEventState.slice(0);
            pTaskState.vecFailEvent = pInfo.vecFailEvent.slice(0);
            pTaskState.player = this.player;

            this.mapTaskState[it] = pTaskState
        }
        this.updateTaskStateToClient();
    }
    // 放弃任务
    abortTask(taskId: number) {
        let taskState = this.mapTaskState[taskId];
        if (taskState==null){
            SKLogger.debug(`放弃任务:找不到任务[${taskId}]状态!`);
            return;
        }
        let taskInfo = TaskConfigMgr.shared.GetTaskInfo(taskId);
        if (taskInfo==null){
            SKLogger.warn(`放弃任务:找不到任务[${taskId}]信息!`);
            return;
        }
        if (taskInfo.nKind==ETaskKind.STORY) {
            this.player.send('s2c_notice', {
                strRichText: '剧情任务无法取消'
            });
            SKLogger.debug(`放弃任务:剧情任务[${taskId}]不能取消!`);
            return;
        }
        taskState.nTaskFinish = ETaskState.FALIED;
        this.CheckAndDeleteFinishedTask();
        this.updateTaskStateToClient();
        SKLogger.debug(`玩家[${this.player.roleid}:${this.player.name}]取消任务[${taskInfo.strTaskName}]`);
    }
    // 玩家离队
    leaveTeam() {
        // 找到所有的组队任务
        let list = [];
        for (let key in this.mapTaskState) {
            if (TaskConfigMgr.shared.isTeamTask(key) == false){
                continue;
            }
            list.push(SKDataUtil.toNumber(key));
        }
        //放弃任务 
        for (let key in list) {
            this.abortTask(list[key]);
        }
    }
    // 任务失败
    OnFailEvent(nEventType: any, stData: any) {
        let bChange = false;
        for (let it in this.mapTaskState) {
            if (this.mapTaskState[it].TaskOnFialEvent(nEventType, stData) == true)
                bChange = true;
        }
        if (bChange) {
            this.CheckAndDeleteFinishedTask();
            this.updateTaskStateToClient();
        }
    }
    // 检查所有完成或失败的任务
    CheckAndDeleteFinishedTask() {
        for (let key in this.mapTaskState) {
            if (this.mapTaskState[key].nTaskFinish == ETaskState.DONE) {
                this.onTaskFinish(this.mapTaskState[key], true);
                delete this.mapTaskState[key];
                continue;
            }
            if (this.mapTaskState[key].nTaskFinish == ETaskState.FALIED) {
                this.onTaskFinish(this.mapTaskState[key], false);
                delete this.mapTaskState[key];
                continue;
            }
        }
        this.CheckAndInceptTask();
    }
    // 任务完成
    onTaskFinish(taskState:TaskState, isFinish: any) {
        let playerList = [];
        if (this.player.teamid == 0) {
            playerList.push(this.player);
        }
        if (this.player.teamid > 0 && this.player.isleader) {
            playerList = TeamMgr.shared.getTeamPlayer(this.player.teamid);
        }
        let taskInfo = TaskConfigMgr.shared.GetTaskInfo(taskState.nTaskID);
        if (taskInfo==null){
            console.warn(`玩家[${this.player.roleid}:${this.player.name}]任务[${taskState.nTaskID}]找不到!`);
            return;
        }
        for (let member of playerList) {
            if (member==null){
                continue;
            }
            if (isFinish && taskInfo.nKind == ETaskKind.STORY) {
                member.GetTaskMgr().vecRecord.push(taskState.nTaskID);
            }
            member.GetTaskMgr().OnDeleteTask(taskState, true);
            member.send('s2c_notice', {
                strRichText: isFinish ? `${taskInfo.strTaskName}   完成` : `${taskInfo.strTaskName}   失败`
            });
        }
    }
    // 删除任务
    OnDeleteTask(taskState:TaskState, isSuccess: boolean) {
        let nNewStep = taskState.vecEventState.length;
        for (let it in taskState.vecEventState) {
            let pStepState = taskState.vecEventState[it];
            if (pStepState.nState != ETaskState.DOING){
                continue;
            }
            nNewStep = it;
            if (typeof (pStepState.vecRemainNpc) == "undefined"){
                continue;
            }
            for (let npc in pStepState.vecRemainNpc) {
                NpcMgr.shared.CheckAndDeleteNpc(pStepState.vecRemainNpc[npc].nOnlyID, this.player);
            }
        }
        if (isSuccess) {
            if (taskState.nKind == ETaskKind.DAILY) {
                this.mapDailyCnt[taskState.nTaskGrop] = GameUtil.getDefault(this.mapDailyCnt[taskState.nTaskGrop], 0) + 1;
            }
            if (taskState.nKind == ETaskKind.FUBEN) {
                let nCurStep = GameUtil.getDefault(this.mapFuBenCnt[taskState.nTaskID], 0);
                this.mapFuBenCnt[taskState.nTaskID] = Math.max(nCurStep, parseInt(nNewStep));
            }
        }
    }
    // 更新任务状态给客户端
    updateTaskStateToClient() {
        let vecData = [];
        for (let it in this.mapTaskState) {
            let stTask = this.mapTaskState[it];
            let vecJson = [];
            for (let itStep in stTask.vecEventState) {
                let strJson = SKDataUtil.toJson(stTask.vecEventState[itStep]);
                vecJson.push(strJson);
            }
            vecData.push({
                nTaskID: stTask.nTaskID,
                vecStep: vecJson
            });
        }
        this.player.send('s2c_role_task_list', {
            vecTask: vecData,
            strJsonDaily: SKDataUtil.toJson(this.mapDailyCnt)
        });
        if (this.player.teamid > 0 && this.player.isleader == true) {
            this.SynchroTaskToTeam();
        }
    }

    SynchroTaskToTeam() {
        let pTeamInfo = TeamMgr.shared.teamList[this.player.teamid];
        if (null == pTeamInfo) {
            return;
        }

        for (let index = 1; index < pTeamInfo.playerlist.length; index++) {
            let pMember = pTeamInfo.playerlist[index];
            if (null == pMember || pMember.roleid == this.player.roleid || pMember.isleader) {
                continue;
            }
            if (pMember.GetTaskMgr() == null) {
                continue;
            }
            pMember.GetTaskMgr().OnTeamTaskState(this.mapTaskState);
        }

    }

    AddActive(nKind: any, nNum: any) {
        if (this.mapActiveScore.hasOwnProperty(nKind) == false)
            this.mapActiveScore[nKind] = 0;

        this.mapActiveScore[nKind] = Math.min(this.mapActiveScore[nKind] + nNum, 140);
        this.SendDailyActive();
    }

    //发送每日活动进度
    SendDailyActive() {
        let tmpData: any = {};
        tmpData.mapActiveScore = this.mapActiveScore;
        tmpData.szBeenTake = this.szBeenTake;
        tmpData.szActivePrize = this.szActivePrize;
        tmpData.mapDailyStart = this.mapDailyStart;
        tmpData.mapDailyCnt = this.mapDailyCnt;
        tmpData.mapFuBenCnt = this.mapFuBenCnt;
        this.player.send('s2c_daily_info', {
            strJson: SKDataUtil.toJson(tmpData)
        });
    }

    GetFuBenCnt(nTaskID: any) {
        if (this.mapFuBenCnt.hasOwnProperty(nTaskID) == false)
            return 0;

        return this.mapFuBenCnt[nTaskID];
    }

    //获取任务信息
    getTaskStateByNpcOnlyid(npcOnlyid: any): { taskID: any, step: any } {
        for (let it in this.mapTaskState) {
            let step = this.mapTaskState[it].getTaskStepByNpcOnlyid(npcOnlyid);
            if (step)
                return { taskID: this.mapTaskState[it].nTaskID, step: step };
        }
        return null;
    }
}