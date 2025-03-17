import GameUtil from "../core/GameUtil";
import TalkEventState from "../event/TalkEventState";
import GatherNpcState from "../event/GatherNpcState";
import KillDynamicNpcState from "../event/KillDynamicNpcState";
import ActionAreaEventState from "../event/ActionAreaEventState";
import ArriveAreaState from "../event/ArriveAreaState";
import GatherItemToNpcEventState from "../event/GatherItemToNpcEventState";
import FailEventPlayerDeadState from "../event/FailEventPlayerDeadState";
import FailEventTimeOutState from "../event/FailEventTimeOutState";
import TaskConfigMgr from "../task/TaskConfigMgr";
import NpcMgr from "../core/NpcMgr";
import DynamicNpc from "../core/DynamicNpc";
import TeamMgr from "../core/TeamMgr";
import Player from "./Player";
import SKLogger from "../../gear/SKLogger";
import { EEventType } from "../role/EEnum";

export default class TaskState {
    nTaskID:any;
    nKind:any;
    nTaskGrop :any;
    nTaskFinish:any;
    vecEventState:any;
    vecFailEvent:any;
    player:any;
    constructor() {
        this.nTaskID = 0;
        this.nKind = 0;
        this.nTaskGrop = 0;
        this.nTaskFinish = 0;
        this.vecEventState = [];
        this.vecFailEvent = [];
        this.player = null;
    }

    //初始化任务状态
    InitState(stConfig:any, nCurStep:any) {
        this.nTaskID = stConfig.nTaskID;
        this.nKind = stConfig.nKind;
        this.nTaskGrop = stConfig.nTaskGrop;


        for (let it = 0; it < stConfig.vecEvent.length; it++) {
            let stEventState = null;

            if (stConfig.vecEvent[it].nEventType == EEventType.PlayerTalkNpc) {
                stEventState = new TalkEventState();
                stEventState.vecRemainNpc = [];
            }

            if (stConfig.vecEvent[it].nEventType == EEventType.PlayerGatherNpc) {
                stEventState = new GatherNpcState();
                stEventState.vecRemainNpc = [];
            }

            if (stConfig.vecEvent[it].nEventType == EEventType.PlayerKillNpc) {
                stEventState = new KillDynamicNpcState();
                stEventState.vecRemainNpc = [];
            }

            if (stConfig.vecEvent[it].nEventType == EEventType.PlayerDoAction) {
                stEventState = new ActionAreaEventState();
            }

            if (stConfig.vecEvent[it].nEventType == EEventType.PlayerArriveArea) {
                stEventState = new ArriveAreaState();
                stEventState.nMap = stConfig.vecEvent[it].nMap;
                stEventState.nX = stConfig.vecEvent[it].nX;
                stEventState.nY = stConfig.vecEvent[it].nY;
            }

            if (stConfig.vecEvent[it].nEventType == EEventType.PlayerGiveNpcItem) {
                stEventState = new GatherItemToNpcEventState();
            }

            if (stEventState) {
                stEventState.nEventType = stConfig.vecEvent[it].nEventType;
                stEventState.nState = GameUtil.EState.ELock;

                if (it < nCurStep)
                    stEventState.nState = GameUtil.EState.EDone;

                this.vecEventState.push(stEventState);
            }
        }

        for (let it = 0; it < stConfig.vecFailEvent.length; it++) {
            let stFailEvent = null;

            if (stConfig.vecFailEvent[it].nEventType == EEventType.FailEventPlayerDead) {
                stFailEvent = new FailEventPlayerDeadState();
                stFailEvent.nDeadCnt = 0;
            }

            if (stConfig.vecFailEvent[it].nEventType == EEventType.FailEventTimeOut) {
                stFailEvent = new FailEventTimeOutState();
                stFailEvent.nStartTime = GameUtil.getTime();
            }

            if (stFailEvent) {
                this.vecFailEvent.push(stFailEvent);
            }
        }

        this.ReconCurEvent();
    }


    BuildCreaterInfo() {
        if (TaskConfigMgr.shared.isTeamTask(this.nTaskID))
            return {
                nKind: GameUtil.ENpcCreater.ETeam,
                nID: this.player.teamid
            }
        else
            return {
                nKind: GameUtil.ENpcCreater.EPlayer,
                nID: this.player.roleid
            }
    }

    IsBangMap(nMap:any) {
        if (nMap == 3002)
            return true;

        return false;
    }
    //侦测当前事件
    ReconCurEvent() {
        for (let i = 0; i < this.vecEventState.length; i++) {
            if (this.vecEventState[i].nState == GameUtil.EState.EDone)
                continue;

            if (this.vecEventState[i].nState == GameUtil.EState.EDoing)
                break;

            this.vecEventState[i].nState = GameUtil.EState.EDoing;

            let stStepConfig = TaskConfigMgr.shared.GetTaskStepInfo(this.nTaskID, i);
            if (stStepConfig.hasOwnProperty('vecCreateNpc') && stStepConfig.vecCreateNpc.length > 0) {
                for (let itCreate in stStepConfig.vecCreateNpc) {
                    let stData = stStepConfig.vecCreateNpc[itCreate];
                    let nOnlyID = NpcMgr.shared.CreateNpc(stData.nNpc, stData.nMap, stData.nX, stData.nY, this.BuildCreaterInfo(), this.IsBangMap(stData.nMap) ? this.player.bangid : 0);
                    let npc:DynamicNpc=new DynamicNpc(nOnlyID, stData.nNpc);
                    this.vecEventState[i].vecRemainNpc.push(npc);
                }
            } else {
                for (let itCreate in stStepConfig.vecNpc) {
                    let pWorldNpc = NpcMgr.shared.FindNpcByConfigID(stStepConfig.vecNpc[itCreate]);
                    if (null == pWorldNpc)
                        continue;

                    this.vecEventState[i].vecRemainNpc.push(new DynamicNpc(pWorldNpc.onlyid, pWorldNpc.configid));
                }

            }

            if (stStepConfig.nEventType == EEventType.PlayerKillNpc &&
                stStepConfig.bAutoTrigle == 1 &&
                this.vecEventState[i].vecRemainNpc.length > 0 &&
                this.player.GetTaskMgr().bCanAutoFight == 1) {

                let pNpc = NpcMgr.shared.FindNpc(this.vecEventState[i].vecRemainNpc[0].nOnlyID);
                if (null == pNpc)
                    return;

                let pBattle = this.player.monsterBattle(pNpc.monster_group);
                if (null == pBattle)
                    return;
                pBattle.source = this.vecEventState[i].vecRemainNpc[0].nOnlyID;
            }
            break;
        }
    }

    OnEventDone(nStep:any) {
        let stTaskInfo = TaskConfigMgr.shared.GetTaskInfo(this.nTaskID);
        let vecPrize = stTaskInfo.vecEvent[nStep].vecPrize;

        let vecPlayer = [];

        if (TaskConfigMgr.shared.isTeamTask(this.nTaskID) && this.player.isleader) {
            vecPlayer = TeamMgr.shared.getTeamPlayer(this.player.teamid);
        } else {
            vecPlayer.push(this.player);
        }

        for (var it in vecPlayer) {
            let member:Player = vecPlayer[it];
            if (null == member || member.GetTaskMgr() == null)
                continue;

            if (stTaskInfo.nKind == GameUtil.ETaskKind.EFuBen && member.GetTaskMgr().GetFuBenCnt(this.nTaskID) > nStep) {
                member.send('s2c_notice', {
                    strRichText: '此关卡已完成，无法再次获得任务奖励'
                });
                SKLogger.debug(`玩家[${member.roleid}:${member.name}][${stTaskInfo.strTaskName}:${this.nTaskID}:步骤:${nStep}]此关卡已完成，无法再次获得任务奖励,跳过`);
                continue;
            }

//            if (stTaskInfo.nKind == GameUtil.ETaskKind.EDaily && member.GetTaskMgr().GetKindTaskCnt(stTaskInfo.nTaskGrop) >= TaskConfigMgr.shared.GetDailyMaxCnt(stTaskInfo.nTaskGrop)) {
  //              member.send('s2c_notice', {
 //                   strRichText: `您的任务[${stTaskInfo.strTaskName}]次数已满，无法再次获得任务奖励!`
  //              });
  //              SKLogger.debug(`玩家[${member.roleid}:${member.name}][${stTaskInfo.strTaskName}:${this.nTaskID}:grop ${stTaskInfo.nTaskGrop}]次数已满，无法再次获得任务奖励!`);
    //            continue;
  //          }

            for (let it in vecPrize) {
                if (vecPrize[it].nKey == 'exp') {
                    member.addExp(parseInt(vecPrize[it].nValue));
                } else if (vecPrize[it].nKey == 'petexp') {
                    if (member.curPet) {
                        let nExp = parseInt(vecPrize[it].nValue);
                        if (nExp > 0) {
                            member.curPet.addExp(nExp);
                            member.send('s2c_notice', {
                                strRichText: `获得  ${nExp} 宠物经验`
                            });
                        }
                    }
                } else if (vecPrize[it].nKey == 'money') {
                    member.addMoney(0, parseInt(vecPrize[it].nValue), '任务奖励');
                } else if (vecPrize[it].nKey == 'active') {
                    member.GetTaskMgr().AddActive(this.GetThisTaskActiveScoreKind(), parseFloat(vecPrize[it].nValue));
                } else {
                    member.addItem(vecPrize[it].nKey, vecPrize[it].nValue, true, '任务奖励');
                }
            }
        }
        this.vecEventState[nStep].nState = GameUtil.EState.EDone;
        if (this.nKind == GameUtil.ETaskKind.EFuBen) {
            if (this.player.GetTaskMgr()) {
                let nCurStep = GameUtil.getDefault(this.player.GetTaskMgr().mapFuBenCnt[this.nTaskID], 0);
                this.player.GetTaskMgr().mapFuBenCnt[this.nTaskID] = Math.max(nCurStep, parseInt(nStep) + 1);
            }
        }
    }

    GetThisTaskActiveScoreKind() {
        let pTaskConfig = TaskConfigMgr.shared.GetTaskInfo(this.nTaskID);
        if (null == pTaskConfig)
            return 0;

        if (pTaskConfig.nKind == GameUtil.ETaskKind.EDaily) {
            return pTaskConfig.nTaskGrop;
        }

        if (pTaskConfig.nKind == GameUtil.ETaskKind.EFuBen) {
            return pTaskConfig.nTaskID;
        }
    }

    TaskOnFialEvent(nEventType:any, stData:any):boolean{
        for (let it in this.vecFailEvent) {
            if (this.vecFailEvent[it].nEventType != nEventType)
                continue;

            let pInfo = TaskConfigMgr.shared.GetFailEventInfo(this.nTaskID, it);
            if (null == pInfo)
                continue;

            if (this.vecFailEvent[it].nEventType == EEventType.FailEventPlayerDead) {
                this.vecFailEvent[it].nDeadCnt += 1;
                if (this.vecFailEvent[it].nDeadCnt >= pInfo.nDeadCnt) {
                    this.nTaskFinish = GameUtil.EState.EFaild;
                    return true;
                }
            }

            if (this.vecFailEvent[it].nEventType == EEventType.FailEventTimeOut) {
                if (stData - this.vecFailEvent[it].nStartTime > pInfo.nMaxTime) {
                    this.nTaskFinish = GameUtil.EState.EFaild;
                    return true;
                }
            }
        }

        return false;
    }

   //获取任务信息及进度
   getTaskStepByNpcOnlyid(npcOnlyid:number) {
        for (let it in this.vecEventState) {
            if (this.vecEventState[it].nEventType == EEventType.PlayerKillNpc) {
                for (let nIndex in this.vecEventState[it].vecRemainNpc) {
                    if (this.vecEventState[it].vecRemainNpc[nIndex].nOnlyID == npcOnlyid) {
                    return it;
                    }
                }
            }
        }
        return null;
    }
    //游戏任务事件
    TaskOnGameEvent(nEventType:any, stData:any):boolean{
        //初始化变更状态
        let bStepChange = false;
        //遍历事件状态列表
        for (let it in this.vecEventState) {
            //正在做跳过
            if (this.vecEventState[it].nState != GameUtil.EState.EDoing)
                continue;

            //如果事件类型不符 跳过
            if (this.vecEventState[it].nEventType != nEventType)
                continue;
            //如果为NPC对话事件 且NPC ID符合要求 且事件步骤相同
            if (this.vecEventState[it].nEventType == EEventType.PlayerTalkNpc && stData.nTaskID == this.nTaskID && stData.nStep == it) {
                //完成当前事件
                this.OnEventDone(it);
                //变更状态
                bStepChange = true;
            }
            //如果是收集事件
            if (this.vecEventState[it].nEventType == EEventType.PlayerGatherNpc) {
                for (let nIndex in this.vecEventState[it].vecRemainNpc) {
                    if (this.vecEventState[it].vecRemainNpc[nIndex].nOnlyID == stData) {
                        this.vecEventState[it].vecRemainNpc.splice(nIndex, 1);
                        bStepChange = true;
                        break;
                    }
                }
                if (this.vecEventState[it].vecRemainNpc.length == 0) {
                    this.OnEventDone(it);
                    bStepChange = true;
                }
            }
            //如果是行动事件
            if (this.vecEventState[it].nEventType == EEventType.PlayerDoAction) {
                this.OnEventDone(it);
                bStepChange = true;
            }
            //如果是到达区域事件
            if (this.vecEventState[it].nEventType == EEventType.PlayerArriveArea) {
                if (stData.mapid == this.vecEventState[it].nMap && GameUtil.getDistance({
                    x: stData.x,
                    y: stData.y
                }, {
                        x: this.vecEventState[it].nX,
                        y: this.vecEventState[it].nY
                    }) < 10) {
                    this.OnEventDone(it);
                    bStepChange = true;
                }
            }
            //如果是提交物品给NPC事件
            if (this.vecEventState[it].nEventType ==  EEventType.PlayerGiveNpcItem) {
                this.OnEventDone(it);
                bStepChange = true;
            }
            //如果是击败NPC事件
            if (this.vecEventState[it].nEventType == EEventType.PlayerKillNpc) {
                //遍历事件NPC列表
                for (let nIndex in this.vecEventState[it].vecRemainNpc) {
                    //如果ID相等
                    if (this.vecEventState[it].vecRemainNpc[nIndex].nOnlyID == stData) {
                        //移除NPC
                        this.vecEventState[it].vecRemainNpc.splice(nIndex, 1);
                        //设定变更状态
                        bStepChange = true;
                        break;
                    }
                }
                //如果NPC列表为空
                if (this.vecEventState[it].vecRemainNpc.length == 0) {
                    //事件完成
                    this.OnEventDone(it);
                    bStepChange = true;
                }
            }
        }
        //没有变更状态则返回
        if (bStepChange == false)
            return false;

        //变更可自动战斗状态
        this.player.GetTaskMgr().bCanAutoFight = 1;
        //侦测当前事件
        this.ReconCurEvent();
        //检查是否完成
        this.CheckAndFinish();

        return true;
    }

    //检查是否完成
    CheckAndFinish() {
        //初始化全部完成状态
        let bAllOK = true;
        //遍历事件状态列表
        for (let it in this.vecEventState) {
            //如果事件状态不等于完成则停止遍历
            if (this.vecEventState[it].nState != GameUtil.EState.EDone) {
                bAllOK = false;
                break;
            }
        }
        //全部完成则变更任务状态为完成
        if (bAllOK == true) {
            this.nTaskFinish = GameUtil.EState.EDone;
        }
        return bAllOK;
    }

}