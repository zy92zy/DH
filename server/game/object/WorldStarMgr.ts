import WorldStar from "./WorldStar";
import GTimer from "../../common/GTimer";
import NpcMgr from "../core/NpcMgr";
import PlayerMgr from "./PlayerMgr";
import TeamMgr from "../core/TeamMgr";

export default class WorldStarMgr {
    vecStar: any[];
    refresh_timer: any;
    constructor() {
        this.vecStar = [];
        this.init();
        this.refresh_timer = 0;
    }

    //世界BOSS 初始化
    init() {
        //地狗星-大唐边境
        this.vecStar.push(new WorldStar(30168, 1007, 1));
        this.vecStar.push(new WorldStar(30169, 1007, 1));
        this.vecStar.push(new WorldStar(30170, 1007, 1));
        this.vecStar.push(new WorldStar(30169, 1007, 1));
        this.vecStar.push(new WorldStar(30170, 1007, 1));
        this.vecStar.push(new WorldStar(30169, 1007, 1));
        this.vecStar.push(new WorldStar(30170, 1007, 1));
        this.vecStar.push(new WorldStar(30169, 1007, 1));
        this.vecStar.push(new WorldStar(30170, 1007, 1));
        //地平星-方寸山
        this.vecStar.push(new WorldStar(30171, 1005, 2));
        this.vecStar.push(new WorldStar(30172, 1005, 2));
        this.vecStar.push(new WorldStar(30173, 1005, 2));
        this.vecStar.push(new WorldStar(30172, 1005, 2));
        this.vecStar.push(new WorldStar(30173, 1005, 2));
        this.vecStar.push(new WorldStar(30172, 1005, 2));
        this.vecStar.push(new WorldStar(30173, 1005, 2));
        this.vecStar.push(new WorldStar(30172, 1005, 2));
        this.vecStar.push(new WorldStar(30173, 1005, 2));
        //地悠星-普陀山
        this.vecStar.push(new WorldStar(30174, 1001, 3));
        this.vecStar.push(new WorldStar(30175, 1001, 3));
        this.vecStar.push(new WorldStar(30176, 1001, 3));
        this.vecStar.push(new WorldStar(30175, 1001, 3));
        this.vecStar.push(new WorldStar(30176, 1001, 3));
        this.vecStar.push(new WorldStar(30175, 1001, 3));
        this.vecStar.push(new WorldStar(30176, 1001, 3));
        this.vecStar.push(new WorldStar(30175, 1001, 3));
        this.vecStar.push(new WorldStar(30176, 1001, 3));
        //地异星-地府
        this.vecStar.push(new WorldStar(30177, 1002, 4));
        this.vecStar.push(new WorldStar(30178, 1002, 4));
        this.vecStar.push(new WorldStar(30179, 1002, 4));
        this.vecStar.push(new WorldStar(30178, 1002, 4));
        this.vecStar.push(new WorldStar(30179, 1002, 4));
        //地微星-大唐境内
        this.vecStar.push(new WorldStar(30180, 1004, 5));
        this.vecStar.push(new WorldStar(30181, 1004, 5));
        this.vecStar.push(new WorldStar(30182, 1004, 5));
        this.vecStar.push(new WorldStar(30181, 1004, 5));
        this.vecStar.push(new WorldStar(30182, 1004, 5));
        //地奇星-天宫
        this.vecStar.push(new WorldStar(30183, 1012, 6));
        this.vecStar.push(new WorldStar(30184, 1012, 6));
        this.vecStar.push(new WorldStar(30184, 1012, 6));
        this.vecStar.push(new WorldStar(30184, 1012, 6));
        this.vecStar.push(new WorldStar(30184, 1012, 6));
        //地查星-天宫
        this.vecStar.push(new WorldStar(30186, 1012, 7));
        this.vecStar.push(new WorldStar(30187, 1012, 7));
        this.vecStar.push(new WorldStar(30188, 1012, 7));
        this.vecStar.push(new WorldStar(30187, 1012, 7));
        this.vecStar.push(new WorldStar(30188, 1012, 7));
        //地稽星-东海渔村
        this.vecStar.push(new WorldStar(30189, 1010, 8));
        this.vecStar.push(new WorldStar(30190, 1010, 8));
        this.vecStar.push(new WorldStar(30191, 1010, 8));
        this.vecStar.push(new WorldStar(30190, 1010, 8));
        this.vecStar.push(new WorldStar(30191, 1010, 8));
        //地慧星-长安
        this.vecStar.push(new WorldStar(30192, 1011, 9));
        this.vecStar.push(new WorldStar(30193, 1011, 9));
        this.vecStar.push(new WorldStar(30194, 1011, 9));
        this.vecStar.push(new WorldStar(30193, 1011, 9));
        this.vecStar.push(new WorldStar(30194, 1011, 9));
        //地魁星-大唐境内
        this.vecStar.push(new WorldStar(30195, 1004, 10));
        this.vecStar.push(new WorldStar(30196, 1004, 10));
        this.vecStar.push(new WorldStar(30197, 1004, 10));
        this.vecStar.push(new WorldStar(30196, 1004, 10));
        this.vecStar.push(new WorldStar(30197, 1004, 10));
        //地灵星-方寸山
        this.vecStar.push(new WorldStar(30198, 1005, 11));
        this.vecStar.push(new WorldStar(30199, 1005, 11));
        this.vecStar.push(new WorldStar(30200, 1005, 11));
        this.vecStar.push(new WorldStar(30199, 1005, 11));
        this.vecStar.push(new WorldStar(30200, 1005, 11));
        //地隐星-普陀山
        this.vecStar.push(new WorldStar(30201, 1001, 12));
        this.vecStar.push(new WorldStar(30202, 1001, 12));
        this.vecStar.push(new WorldStar(30203, 1001, 12));
        this.vecStar.push(new WorldStar(30202, 1001, 12));
        this.vecStar.push(new WorldStar(30203, 1001, 12));
        //地佑星-白骨山
        this.vecStar.push(new WorldStar(70001, 1008, 13));
        this.vecStar.push(new WorldStar(70001, 1008, 13));
        this.vecStar.push(new WorldStar(70001, 1008, 13));
        this.vecStar.push(new WorldStar(70001, 1008, 13));
        this.vecStar.push(new WorldStar(70001, 1008, 13));
        //地文星-白骨山
        this.vecStar.push(new WorldStar(81001, 1008, 14));
        this.vecStar.push(new WorldStar(81002, 1008, 14));
        this.vecStar.push(new WorldStar(81003, 1008, 14));
        this.vecStar.push(new WorldStar(81001, 1008, 14));
        this.vecStar.push(new WorldStar(81002, 1008, 14));
        //地煞星-龙宫
        this.vecStar.push(new WorldStar(81004, 1009, 15));
        this.vecStar.push(new WorldStar(81005, 1009, 15));
        this.vecStar.push(new WorldStar(81006, 1009, 15));
        this.vecStar.push(new WorldStar(81004, 1009, 15));
        this.vecStar.push(new WorldStar(81005, 1009, 15));
		this.vecStar.push(new WorldStar(81004, 1009, 15));
        this.vecStar.push(new WorldStar(81005, 1009, 15));
        this.vecStar.push(new WorldStar(81006, 1009, 15));
        this.vecStar.push(new WorldStar(81004, 1009, 15));
        this.vecStar.push(new WorldStar(81005, 1009, 15));
        //地雄星-龙宫
        this.vecStar.push(new WorldStar(81007, 1009, 15));
        this.vecStar.push(new WorldStar(81008, 1009, 15));
        this.vecStar.push(new WorldStar(81009, 1009, 15));
        this.vecStar.push(new WorldStar(81007, 1009, 15));
        this.vecStar.push(new WorldStar(81008, 1009, 15));
		this.vecStar.push(new WorldStar(81007, 1009, 15));
        this.vecStar.push(new WorldStar(81008, 1009, 15));
        this.vecStar.push(new WorldStar(81009, 1009, 15));
        this.vecStar.push(new WorldStar(81007, 1009, 15));
        this.vecStar.push(new WorldStar(81008, 1009, 15));
        //地杰星-兰若寺
        this.vecStar.push(new WorldStar(81010, 1013, 17));
        this.vecStar.push(new WorldStar(81011, 1013, 17));
        this.vecStar.push(new WorldStar(81012, 1013, 17));
		this.vecStar.push(new WorldStar(81010, 1013, 17));
        this.vecStar.push(new WorldStar(81011, 1013, 17));
        this.vecStar.push(new WorldStar(81012, 1013, 17));
		this.vecStar.push(new WorldStar(81010, 1013, 17));
        this.vecStar.push(new WorldStar(81011, 1013, 17));
        this.vecStar.push(new WorldStar(81012, 1013, 17));
        this.vecStar.push(new WorldStar(81022, 1013, 17));
        this.vecStar.push(new WorldStar(81023, 1013, 17));
        //地飞星-兰若寺
        this.vecStar.push(new WorldStar(81013, 1013, 17));
        this.vecStar.push(new WorldStar(81014, 1013, 17));
        this.vecStar.push(new WorldStar(81015, 1013, 17));
        this.vecStar.push(new WorldStar(81013, 1013, 17));
        this.vecStar.push(new WorldStar(81014, 1013, 17));
        this.vecStar.push(new WorldStar(81015, 1013, 17));	
        this.vecStar.push(new WorldStar(81013, 1013, 17));
        this.vecStar.push(new WorldStar(81014, 1013, 17));
        this.vecStar.push(new WorldStar(81015, 1013, 17));
        this.vecStar.push(new WorldStar(81022, 1013, 17));
        this.vecStar.push(new WorldStar(81023, 1013, 17));
        //地刑星-蓬莱
        this.vecStar.push(new WorldStar(81016, 1212, 17));
        this.vecStar.push(new WorldStar(81017, 1212, 17));
        this.vecStar.push(new WorldStar(81018, 1212, 17));
        this.vecStar.push(new WorldStar(81019, 1212, 17));
        this.vecStar.push(new WorldStar(81020, 1212, 17));
        this.vecStar.push(new WorldStar(81021, 1212, 17));	
        this.vecStar.push(new WorldStar(81016, 1212, 17));
        this.vecStar.push(new WorldStar(81017, 1212, 17));
        this.vecStar.push(new WorldStar(81018, 1212, 17));			
        this.vecStar.push(new WorldStar(810115, 1212, 17));			
        this.vecStar.push(new WorldStar(810115, 1212, 17));			
        this.vecStar.push(new WorldStar(810115, 1212, 17));			
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
        this.vecStar.push(new WorldStar(810016, 1011, 1));
        this.vecStar.push(new WorldStar(810017, 1011, 1));
        this.vecStar.push(new WorldStar(810018, 1011, 1));
        this.vecStar.push(new WorldStar(810019, 1011, 1));
        this.vecStar.push(new WorldStar(810020, 1011, 1));
        this.vecStar.push(new WorldStar(810021, 1011, 1));
        this.vecStar.push(new WorldStar(810016, 1011, 1));
        this.vecStar.push(new WorldStar(810017, 1011, 1));
        this.vecStar.push(new WorldStar(810018, 1011, 1));
        this.vecStar.push(new WorldStar(810019, 1011, 1));
        this.vecStar.push(new WorldStar(810020, 1011, 1));
        this.vecStar.push(new WorldStar(810021, 1011, 1));
        this.vecStar.push(new WorldStar(810016, 1011, 1));
        this.vecStar.push(new WorldStar(810017, 1011, 1));
        this.vecStar.push(new WorldStar(810018, 1011, 1));
        this.vecStar.push(new WorldStar(810019, 1011, 1));
        this.vecStar.push(new WorldStar(810020, 1011, 1));
        this.vecStar.push(new WorldStar(810021, 1011, 1));
        this.vecStar.push(new WorldStar(810016, 1011, 1));
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

    FindStar(onlyID: number): any {
        for (let key in this.vecStar) {
            let item = this.vecStar[key];
            if (item.nOnlyID == onlyID) {
                return item;
            }
        }
        return null;
    }
    //挑战BOSS
    ApplyChallenge(nNpcOnlyID: any, roleId: any, starlevel: any): number {
        let bomb = this.FindStar(nNpcOnlyID);
        if (bomb == null) {
            return 1;
        }
        if (bomb.vecApply.length > 0) {
            return 2;
        }
        //星级打怪不限制星级
        //if (bomb.level > starlevel) {
        //    return 3;
        //}
        bomb.vecApply.push(roleId);
        let self = this;
        setTimeout(() => {
            self.trigleStarBattle(nNpcOnlyID, roleId);
        }, 5000);
        return 0;
    }

    ChallengeFail(npc_onlyid: any) {
        let pBomb = this.FindStar(npc_onlyid);
        if (null == pBomb) {
            return;
        }
        pBomb.Reset();//.push(nAccountID);
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
    // 触发星战斗
    trigleStarBattle(npcOnlyID: any, roleId: any) {
        let star = this.FindStar(npcOnlyID);
        if (star == null) {
            return;
        }
        if (star.vecApply.length <= 0) {
            return;
        }
        let npc = NpcMgr.shared.FindNpc(npcOnlyID);
        if (npc == null) {
            return;
        }
        let player = PlayerMgr.shared.getPlayerByRoleId(roleId);
        if (player == null) {
            return;
        }
        let battle = player.monsterBattle(npc.monster_group);
        if (battle == null) {
            return;
        }
        battle.source = npcOnlyID;
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
