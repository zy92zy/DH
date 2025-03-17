import GameUtil from "../core/GameUtil";
import PartnerConfigMgr from "./PartnerConfigMgr";
import Partner from "./Partner";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";

export default class PartnerMgr {
    static shared = new PartnerMgr();
    mapPartner: any;
    vecChuZhan: any;
    player: any;

    constructor(pPlayer?: any) {
        this.mapPartner = {};
        this.vecChuZhan = [0, 0, 0, 0];
        this.player = pPlayer;
    }

    init(partnerData: any) {
        // let partnerData = SKDataUtil.jsonBy(strJson);
        for (var it in partnerData) {
            if (it == 'vecChuZhan') {
                this.vecChuZhan = partnerData[it].slice(0);
                continue;
            }
            let stData = partnerData[it];
            let nID = stData.nID;
            let nRelive = GameUtil.getDefault(stData.nRelive, 0);
            let stPartner = new Partner(nID, nRelive, stData.nLevel, stData.nExp);
            stPartner.setOwner(this.player);

            this.mapPartner[nID] = stPartner
        }
        if (GameUtil.getMapLen(this.mapPartner) == 0)  //zzzErr
            this.AddPartner(5051, 1);
    }


    AddPartner(nID: any, nLevel: any) {
        let stPartner = new Partner(nID, 0, nLevel, 0);
        stPartner.setOwner(this.player);
        this.mapPartner[nID] = stPartner
    }

    IsPartnerChuZhan(nPartnerID: any) {
        for (var it in this.vecChuZhan) {
            if (this.vecChuZhan[it] == nPartnerID)
                return true;
        }
        return false;
    }

    //变更出战伙伴
    ChangeChuZhanPos(nPos: any, nPartnerID: any) {
        if (nPos < 0 || nPos > 3)
            return;
        if (nPartnerID > 0) {
            for (var it in this.vecChuZhan) {
                if (this.vecChuZhan[it] == nPartnerID)
                    return;
            }
        }
        this.vecChuZhan[nPos] = nPartnerID;
        this.ReplaceChuZhanPos();
        this.player.save(true,"变更出战伙伴");
    }

    //替换出战伙伴
    ReplaceChuZhanPos() {
        let vecTmp = this.vecChuZhan.slice(0);
        this.vecChuZhan = [0, 0, 0, 0];
        let nPos = -1;
        for (var it in vecTmp) {
            if (vecTmp[it] == 0)
                continue;
            nPos++;
            this.vecChuZhan[nPos] = vecTmp[it];
        }
        this.player.save(true,"替换出战伙伴");
    }

    //序列化伙伴存储数据
    toJson(): string {
        let mapValue: any = {};
        for (let it in this.mapPartner) {
            let stPartner = this.mapPartner[it];
            mapValue[it] = { nID: stPartner.id, nRelive: stPartner.relive, nLevel: stPartner.level, nExp: stPartner.exp };
        }
        mapValue['vecChuZhan'] = this.vecChuZhan;
        let result = SKDataUtil.toJson(mapValue);
        return result;
    }


    //获取伙伴
    GetPartner(nID: any): Partner {
        if (this.mapPartner.hasOwnProperty(nID) == false)
            return null;

        return this.mapPartner[nID];
    }

    GetActivePartnerCnt(): any {
        let nCnt = 0;
        for (var it in this.vecChuZhan) {
            if (this.vecChuZhan[it] > 0)
                nCnt++;
        }
        return nCnt;
    }

    addPartnerExp(nID: number, nExp: number): boolean {
        let partner: Partner = this.GetPartner(nID);
        if (!partner) {
            return false;
        }
        //伙伴转大于玩家
        if (partner.relive > this.player.relive) {
            return false;
        }
        //伙伴和玩家同转，判断等级
        if (partner.relive == this.player.relive && partner.level >= this.player.level) {
            SKLogger.debug(`玩家和伙伴同转情况下,${partner.name}的等级${partner.level}不能大于${this.player.name}的等级${this.player.level}`);
            return false;
        }
        let nErr = partner.addExp(nExp);
        if (nErr == 2) {
            return true;
        }
        if (nErr != 0)
            return false
        this.player.save(true,"伙伴加经验");
        return true;
    }


    SendPartnerInfoToClient(nPartnerID: any) {
        let pPartner = this.GetPartner(nPartnerID);
        if (null == pPartner)
            return;

        let strJson = GameUtil.getPartnerJson(pPartner);
        this.player.send('s2c_partner_info', { strJson: strJson });
    }
    // 检查加入伙伴
    checkAndAddPartner() {
        if (this.player == null) {
            return;
        }
        for (let key in PartnerConfigMgr.shared.mapPartner) {
            let pConfig = PartnerConfigMgr.shared.mapPartner[key];
            if (pConfig.unlock > this.player.level)
                continue;

            if (this.mapPartner.hasOwnProperty(pConfig.partnerid))
                continue;

            this.AddPartner(pConfig.partnerid, 1);
        }
    }

    UpdatePartnerLevelAsPlayer() {
        if (null == this.player)
            return;

        for (let it in this.mapPartner) {
            let pPartner = this.mapPartner[it];

            if (pPartner.relive > 0 || pPartner.level >= GameUtil.limitPartnerLevel)
                continue;

            pPartner.level = Math.min(this.player.level, GameUtil.limitPartnerLevel);
        }
    }
}