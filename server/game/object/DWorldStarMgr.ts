import WorldStar from "./WorldStar";
import GTimer from "../../common/GTimer";
import NpcMgr from "../core/NpcMgr";
import PlayerMgr from "./PlayerMgr";
import DWorldStar from "./DWorldStar";

export default class DWorldStarMgr {
    vecStar: any[];
    refresh_timer: any;
    constructor() {
        this.vecStar = [];
        this.init();
        this.refresh_timer = 0;
    }

    init() {
        //天元盛典-大唐境内
        this.vecStar.push(new WorldStar(810016, 1004, 1));
        this.vecStar.push(new WorldStar(810017, 1004, 1));
        this.vecStar.push(new WorldStar(810018, 1004, 1));
        this.vecStar.push(new WorldStar(810019, 1004, 1));
        this.vecStar.push(new WorldStar(810020, 1004, 1));
        this.vecStar.push(new WorldStar(810021, 1004, 1));
        this.vecStar.push(new WorldStar(810016, 1004, 1));
        this.vecStar.push(new WorldStar(810017, 1004, 1));
        this.vecStar.push(new WorldStar(810018, 1004, 1));
        this.vecStar.push(new WorldStar(810019, 1004, 1));
        this.vecStar.push(new WorldStar(810020, 1004, 1));
        this.vecStar.push(new WorldStar(810021, 1004, 1));
        this.vecStar.push(new WorldStar(810016, 1004, 1));
        this.vecStar.push(new WorldStar(810017, 1004, 1));
        this.vecStar.push(new WorldStar(810018, 1004, 1));
        this.vecStar.push(new WorldStar(810019, 1004, 1));
        this.vecStar.push(new WorldStar(810020, 1004, 1));
        this.vecStar.push(new WorldStar(810021, 1004, 1));
                
        //天元盛典-东海渔村
        this.vecStar.push(new WorldStar(810016, 1010, 1));
        this.vecStar.push(new WorldStar(810017, 1010, 1));
        this.vecStar.push(new WorldStar(810018, 1010, 1));
        this.vecStar.push(new WorldStar(810019, 1010, 1));
        this.vecStar.push(new WorldStar(810020, 1010, 1));
        this.vecStar.push(new WorldStar(810021, 1010, 1));
        this.vecStar.push(new WorldStar(810016, 1010, 1));
        this.vecStar.push(new WorldStar(810017, 1010, 1));
        this.vecStar.push(new WorldStar(810018, 1010, 1));
        this.vecStar.push(new WorldStar(810019, 1010, 1));
        this.vecStar.push(new WorldStar(810020, 1010, 1));
        this.vecStar.push(new WorldStar(810021, 1010, 1));
        this.vecStar.push(new WorldStar(810016, 1010, 1));
        this.vecStar.push(new WorldStar(810017, 1010, 1));
        this.vecStar.push(new WorldStar(810018, 1010, 1));
        this.vecStar.push(new WorldStar(810019, 1010, 1));
        this.vecStar.push(new WorldStar(810020, 1010, 1));
        this.vecStar.push(new WorldStar(810021, 1010, 1));
        this.vecStar.push(new WorldStar(810016, 1010, 1));
                        
        //天元盛典-长安
        this.vecStar.push(new DWorldStar(810016, 1011, 1));
        this.vecStar.push(new DWorldStar(810017, 1011, 1));
        this.vecStar.push(new DWorldStar(810018, 1011, 1));
        this.vecStar.push(new DWorldStar(810019, 1011, 1));
        this.vecStar.push(new DWorldStar(810020, 1011, 1));
        this.vecStar.push(new DWorldStar(810021, 1011, 1));
        this.vecStar.push(new DWorldStar(810016, 1011, 1));
        this.vecStar.push(new DWorldStar(810017, 1011, 1));
        this.vecStar.push(new DWorldStar(810018, 1011, 1));
        this.vecStar.push(new DWorldStar(810019, 1011, 1));
        this.vecStar.push(new DWorldStar(810020, 1011, 1));
        this.vecStar.push(new DWorldStar(810021, 1011, 1));
        this.vecStar.push(new DWorldStar(810016, 1011, 1));
        this.vecStar.push(new DWorldStar(810017, 1011, 1));
        this.vecStar.push(new DWorldStar(810018, 1011, 1));
        this.vecStar.push(new DWorldStar(810019, 1011, 1));
        this.vecStar.push(new DWorldStar(810020, 1011, 1));
        this.vecStar.push(new DWorldStar(810021, 1011, 1));
        this.vecStar.push(new DWorldStar(810016, 1011, 1));
        this.onCreateWorldStart();
    }

    IsStar(nOnlyID: any): boolean {
        for (var it in this.vecStar) {
            let pStar = this.vecStar[it];
            if (pStar.nOnlyID == nOnlyID)
                return true;
        }
        return false;
    }

    onCreateWorldStart() {
        let date = GTimer.getCurDate();
        let cur_m = date.getMinutes();
        let cur_s = date.getSeconds();
        if (cur_m >= 30) {
            cur_m = cur_m - 30;
        }
        let t = (29 - cur_m) * 60 + (60 - cur_s);
        this.refresh_timer = setTimeout(() => {
            this.refresh_timer = 0;
            this.checkAndCreateWordStar();
        }, t * 1000);
        this.checkAndCreateWordStar();
    }

    FindStar(nOnlyID: any): any {
        for (let it in this.vecStar) {
            if (this.vecStar[it].nOnlyID == nOnlyID)
                return this.vecStar[it];
        }
        return null;
    }

    ApplyChallenge(nNpcOnlyID: any, level: any, roleId: any, starlevel: any): number {
        let pBomb = this.FindStar(nNpcOnlyID);
        if (null == pBomb) {
            return 1;
        }
        if (pBomb.vecApply.length > 0) {
            return 2;
        }
        //星级打怪不限制星级
        // if (pBomb.level > starlevel) {
        //     return 3;
        // }
        pBomb.vecApply.push(roleId);
        let pSelf = this;
        setTimeout(() => {
            pSelf.trigleStarBattle(nNpcOnlyID, roleId);
        }, 5000);
        return 0;
    }

    ChallengeFail(npc_onlyid: any) {
        let pBomb = this.FindStar(npc_onlyid);
        if (null == pBomb) {
            return;
        }
        pBomb.Reset();
    }

    checkAndCreateWordStar() {
        if (this.refresh_timer == 0) {
            this.refresh_timer = setTimeout(() => {
                this.refresh_timer = 0
                this.checkAndCreateWordStar();
            }, 60 * 30 * 1000);
        }
        for (let it in this.vecStar) {
            let pWBomb = this.vecStar[it];
            pWBomb.Reset();
            if (pWBomb.nOnlyID > 0) {
                continue;
            }
            let stPos = pWBomb.GetPos();
            pWBomb.nOnlyID = NpcMgr.shared.CreateNpc(pWBomb.nNpc, stPos.map, stPos.x, stPos.y, {
                nKind: 0,
                nID: 0
            }, 0);
        }
    }


    trigleStarBattle(nNpcOnlyID: any, roleId: any) {
        let pStar = this.FindStar(nNpcOnlyID);
        if (null == pStar)
            return;

        if (pStar.vecApply.length <= 0)
            return;

        let pNpc = NpcMgr.shared.FindNpc(nNpcOnlyID);
        if (null == pNpc)
            return;

        let pPlayer = PlayerMgr.shared.getPlayerByRoleId(roleId);
        if (null == pPlayer)
            return;

        let pBattle = pPlayer.monsterBattle(pNpc.monster_group);
        if (null == pBattle)
            return;

        pBattle.source = nNpcOnlyID;
    }

    CheckWorldStarDead(nOnlyID: any) {
        for (let it in this.vecStar) {
            let pWBomb = this.vecStar[it];
            if (pWBomb.nOnlyID != nOnlyID)
                continue;

            pWBomb.nOnlyID = 0;
            NpcMgr.shared.DeleteNpc(nOnlyID);
            break;
        }
    }
}