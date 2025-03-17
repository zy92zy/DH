
import GameUtil from "./GameUtil";
import NpcConfigMgr from "./NpcConfigMgr";
import Npc from "./Npc";

export default class NpcMgr{
    static shared=new NpcMgr();

    mapNpc:any;

    constructor() {
        this.mapNpc = {};
    }

    InitNpcByMapId(mapid:any, nFuBenID:any) {
        for (let it in NpcConfigMgr.shared.mapConfig) {
            let stData = NpcConfigMgr.shared.mapConfig[it];
            if (stData.auto_create == null)
                continue;

            if (stData.auto_create.map == mapid) {
                this.CreateNpc(it, stData.auto_create.map, stData.auto_create.x, stData.auto_create.y, {
                    nKind: 0,
                    nID: 0
                }, nFuBenID);
            }

        }
    }

    init() {
        for (let it in NpcConfigMgr.shared.mapConfig) {
            let stData = NpcConfigMgr.shared.mapConfig[it];
            if (stData.auto_create == null)
                continue;

            this.CreateNpc(it, stData.auto_create.map, stData.auto_create.x, stData.auto_create.y, {
                nKind: 0,
                nID: 0
            }, 0)

        }
    }

    deletePlayersNpc(roleId:any) {
        for (let it in this.mapNpc) {
            let stCreater = this.mapNpc[it].stCreater;
            if (stCreater.nKind != GameUtil.ENpcCreater.EPlayer || stCreater.nID != roleId)
                continue;

            this.mapNpc[it].destroy();
            delete this.mapNpc[it];
        }
    }

    deleteTeamsNpc(nTeamID:any) {
        for (let it in this.mapNpc) {
            let stCreater = this.mapNpc[it].stCreater;
            if (stCreater.nKind != GameUtil.ENpcCreater.ETeam || stCreater.nID != nTeamID)
                continue;

            this.mapNpc[it].destroy();
            delete this.mapNpc[it];
        }
    }

    GetMaxID():number{
        let nCurMax:any = 0;
        for (let it in this.mapNpc) {
            if (Number(it) > nCurMax)
                nCurMax = Number(it);
        }
        return Math.max(nCurMax, 1000000);
    }

    CreateNpc(nNpc:any, nMap:any, nX:number, nY:number, stCreater = {nKind: 0, nID: 0}, nFuBenID = 0):any{
        let npc = new Npc(nNpc);
        npc.x = nX;
        npc.y = nY;
        npc.mapid = nMap;
        npc.stCreater = stCreater;
        npc.nFuBenID = nFuBenID;
        this.mapNpc[npc.onlyid] = npc;
        npc.onEnterGame();
        return npc.onlyid;
    }

    FindNpc(nOnlyID:any):any{
        if (this.mapNpc.hasOwnProperty(nOnlyID) == false)
            return null;

        return this.mapNpc[nOnlyID];
    }

    FindNpcByConfigID(nConfigID:any):any{
        for (var it in this.mapNpc) {
            if (this.mapNpc[it].configid == nConfigID)
                return this.mapNpc[it];
        }
        return null;
    }

    CheckAndDeleteNpc(nOnlyID:any, pPlayer:any) {
        let pNpc = this.FindNpc(nOnlyID);
        if (null == pNpc)
            return;

        if (pNpc.stCreater.nKind == GameUtil.ENpcCreater.ESystem)
            return;

        //        if (pPlayer.CanPlayerSeeNpc(pNpc))

        if ((pNpc.stCreater.nKind == GameUtil.ENpcCreater.ETeam && pPlayer.isleader) || (pNpc.stCreater.nKind == GameUtil.ENpcCreater.EPlayer && pNpc.stCreater.nID == pPlayer.roleid))
            this.DeleteNpc(nOnlyID);
    }

    DeleteNpc(nOnlyID:any) {
        if (this.mapNpc.hasOwnProperty(nOnlyID) == false)
            return;

        this.mapNpc[nOnlyID].destroy();
        delete this.mapNpc[nOnlyID];
    }


    deleteTeamsNpc2(nTeamID:any){
        let vecNpc = [];

        for (var it in this.mapNpc) {
            let pNpc = this.mapNpc[it];
            if (pNpc.stCreater.nKind == GameUtil.ENpcCreater.ETeam && pNpc.stCreater.nID == nTeamID) {
                vecNpc.push(it);
            }
        }

        for (var it2 in vecNpc) {
            this.DeleteNpc(vecNpc[it2]);
        }

    }

}