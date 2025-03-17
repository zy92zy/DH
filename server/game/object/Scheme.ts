import Player from "./Player";
import GameUtil from "../core/GameUtil";
import SKDataUtil from "../../gear/SKDataUtil";
import { MsgCode } from "../role/EEnum";
import RolePracticeMgr from "./RolePracticeMgr";

export default class Scheme {
    schemeItemList: any;
    schemeId: any;
    roleId: any;
    status: number;
    schemeName: any;
    player: Player;
    content: any;
    isSave: boolean;

    constructor(player: any, schemeMgr: any, name: any) {
        this.schemeItemList = {};
        this.schemeId = schemeMgr.localSchemeId;
        this.roleId = player.roleid;
        this.status = 0;    //-1 未开放，0，已开放未激活 1，已激活
        this.schemeName = name;
        this.player = player;
        this.content = {};
        this.isSave = false;
    }

    //初始默认伙伴数据
    initDefaultData() {
        let partnerData = SKDataUtil.jsonBy(SKDataUtil.toJson(this.player.partnerMgr.vecChuZhan))
        let xlevel = this.player.xiulevel;
        for (const key in this.player.addattr1) {
            if (this.player.addattr1.hasOwnProperty(key)) {
                xlevel = xlevel - this.player.addattr1[key];
            }
        }
        this.content = {
            curEquips: {},
            attribute: {
                //baseQianNeng:this.player.qianneng,
                qianNeng: this.player.qianneng,//this.player.qianneng,
                addPoint: SKDataUtil.jsonBy(SKDataUtil.toJson(this.player.addattr2))
            },
            defense: {
                //baseXiuLevel:this.player.xiulevel,
                xiuLevel: xlevel,
                xiuPoint: SKDataUtil.jsonBy(SKDataUtil.toJson(this.player.addattr1))

            },
            partner: partnerData
        };
        this.isSave = true;
    }

    //变更套装名称
    changeSchemeName(data: any) {
        this.schemeName = data;
        this.player.send('s2c_scheme_changeName', {
            ecode: MsgCode.SUCCESS,
            schemeId: this.schemeId,
            newName: this.schemeName
        });
        this.isSave = true;
        if (this.status == 1) {
            this.checkEquipExist();
            this.player.activateScheme();
        }
    }

    //同步伙伴
    syncPartner() {
        let partnerData = SKDataUtil.jsonBy(SKDataUtil.toJson(this.player.partnerMgr.vecChuZhan))
        this.content.partner = partnerData

    }

    //同步装备
    syncEquipsData(curEquipsData: boolean) {
        this.content.curEquips = curEquipsData;
        this.isSave = true;
    }

    //更新装备
    updateEquips(equipId: any, type: any) {
        let equip = this.player.equipObjs[equipId];
        if (equip) {

            let result = false;
            let curEquips = this.content.curEquips;
            let unloadEquipId = -1;
            if (curEquips.hasOwnProperty(equip.EIndex)) {
                if (curEquips[equip.EIndex] == equipId) {
                    unloadEquipId = equipId;
                    delete curEquips[equip.EIndex];
                    result = true;
                } else {
                    unloadEquipId = curEquips[equip.EIndex];
                    if (this.checkEquips(equipId)) {
                        curEquips[equip.EIndex] = equipId;
                        result = true;
                    }
                }
            } else {
                if (this.checkEquips(equipId)) {
                    curEquips[equip.EIndex] = equipId;
                    result = true;
                }
            }
            if (result) {
                this.player.send('s2c_scheme_updateEquip', {
                    ecode: MsgCode.SUCCESS,
                    schemeId: this.schemeId,
                    curEquips: SKDataUtil.toJson(curEquips),
                    type: type,
                    unloadEquipId: unloadEquipId,
                });
                this.isSave = true;
                if (this.status == 1) {
                    this.checkEquipExist();
                    this.player.activateScheme();
                }

            }
        }
    }

    //同步加点
    syncPoint() {
        if (this.status == 1) {
            //激活，则同步所有加点数据
            this.content.attribute.qianNeng = this.player.qianneng;
            this.content.attribute.addPoint = SKDataUtil.jsonBy(SKDataUtil.toJson(this.player.addattr2));
            this.content.defense.xiuPoint = SKDataUtil.jsonBy(SKDataUtil.toJson(this.player.addattr1));
            this.content.defense.xiuLevel = this.player.xiulevel;
            for (var key in this.content.defense.xiuPoint) {
                if (this.content.defense.xiuPoint.hasOwnProperty(key)) {
                    this.content.defense.xiuLevel -= this.content.defense.xiuPoint[key];
                }
            }
        } else {
            //未激活，如果潜能和修炼点数据总值发生变化，则同步数据
            let curXLevel = this.content.defense.xiuLevel;
            for (var key in this.content.defense.xiuPoint) {
                if (this.content.defense.xiuPoint.hasOwnProperty(key)) {
                    curXLevel += this.content.defense.xiuPoint[key];
                }
            }
            let diffXiu = this.player.xiulevel - curXLevel;
            this.content.defense.xiuLevel += (diffXiu >= 0 ? diffXiu : 0);

            let curQianneng = this.content.attribute.qianNeng;
            for (var key in this.content.attribute.addPoint) {
                if (this.content.attribute.addPoint.hasOwnProperty(key)) {
                    curQianneng += this.content.attribute.addPoint[key];
                }
            }
            let diffValue = this.player.getTotalQianneng() - curQianneng;
            this.content.attribute.qianNeng += (diffValue >= 0 ? diffValue : 0);
        }
        this.isSave = true;

    }

    //删除装备
    deleteEquips(delId: any) {
        for (var it in this.content.curEquips) {
            if (this.content.curEquips.hasOwnProperty(it)) {
                let equipId = this.content.curEquips[it]
                if (equipId == delId)
                    delete this.content.curEquips[it]
            }
        }
    }

    //检查装备
    checkEquips(checkId: any) {
        let result = false;
        for (var it in this.content.curEquips) {
            if (this.content.curEquips.hasOwnProperty(it)) {
                let equipId = this.content.curEquips[it]
                if (equipId == checkId)
                    result = true;
            }
        }
        result = this.player.checkSchemeEquip(checkId);
        return result;
    }

    addCustomPoint(data: any) {
        this.content.attribute.addPoint = SKDataUtil.jsonBy(data.addPoint);
        this.content.attribute.qianNeng = data.qianNeng;
        this.isSave = true;
        if (this.status == 1) {
            this.checkEquipExist();
            this.player.activateScheme();
        }
    }
    //帮派修炼加点
    addXiulianPoint(data: any) {
        let addpoint = SKDataUtil.jsonBy(data.xiulianPoint);
        let sumpoint = 0;
        for (const key in addpoint) {
            let max = RolePracticeMgr.shared.GetMaxXiulianPoint(this.player.relive,key);
            if(max && max > 0){
                let total = this.player.addattr1[key] + addpoint[key];
                if(total > max){
                    this.player.send('s2c_notice', {
                        strRichText: '超出最大可加点'
                    });
                    return;
                }
            }
            sumpoint += addpoint[key];
        }
        if (sumpoint > this.player.xiulevel) {
            return;
        }
        this.content.defense.xiuPoint = addpoint;
        this.content.defense.xiuLevel = data.xiulevel;
        this.isSave = true;
        if (this.status == 1) {
            this.checkEquipExist();
            this.player.activateScheme();
        }
    }

    //重置修炼加点
    resetXiulianPoint(data: any, isCostFee: boolean = true) {
        if(isCostFee){
            let strErr = this.player.CostFee(GameUtil.goldKind.Money, 200000);
            if (strErr != "") {
                this.player.send('s2c_scheme_resetXiulianPoint', {
                    ecode: MsgCode.FAILED,
                    errorMsg: strErr
                })
                return;
            }
        }


        this.content.defense.xiuLevel = this.player.xiulevel;
        for (var key in this.content.defense.xiuPoint) {
            if (this.content.defense.xiuPoint.hasOwnProperty(key)) {
                this.content.defense.xiuPoint[key] = 0;
            }
        }
        this.isSave = true;
        if (this.status == 1) {
            this.checkEquipExist();
            this.player.activateScheme();
        }

        this.player.send('s2c_scheme_resetXiulianPoint', {
            ecode: MsgCode.SUCCESS,
            errorMsg: ''
        })
    }

    //变更伙伴
    changePartner(data: any) {
        this.content.partner[data.order] = data.partnerId;
        this.isSave = true;
        if (this.status == 1) {
            this.checkEquipExist();
            this.player.activateScheme();
        }
    }

    //检查装备是否存在
    checkEquipExist() {
        for (var key in this.content.curEquips) {
            if (this.content.curEquips.hasOwnProperty(key)) {
                if (!this.player.checkEquipExist(this.content.curEquips[key])) {
                    delete this.content.curEquips[key];
                }
            }
        }
    }

    //激活套装
    activateScheme(status: any) {
        //如果方案里的装备已经不存在，则从方案中删除
        this.checkEquipExist();
        this.status = status;
        this.isSave = true;
        if (this.status == 1) {
            let strErr = this.player.CostFee(GameUtil.goldKind.Money, 100000);
            if (strErr != '') {
                this.status = 0;
                return;
            }
            this.player.send('s2c_scheme_activate', {
                ecode: MsgCode.SUCCESS,
                schemeId: this.schemeId
            });
            this.player.activateScheme();
        }
    }

    //使用方案
    onUse() {
        let strErr = this.player.CostFee(GameUtil.goldKind.Money, 10000000);
        if (strErr != "") {
            return;
        }
        this.player.send('s2c_scheme_use', {
            ecode: MsgCode.SUCCESS,
            schemeId: this.schemeId
        });
        this.status = 0;
        this.isSave = true;
    }


    toObj() {
        let obj: any = {};
        obj.schemeId = this.schemeId;
        obj.roleId = this.roleId;
        obj.status = this.status;
        obj.schemeName = this.schemeName;
        obj.content = SKDataUtil.toJson(this.content);
        return obj;
    }
}