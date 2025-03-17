import DB from "../../utils/DB";
import Player from "./Player";
import Scheme from "./Scheme";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import { MsgCode } from "../role/EEnum";
import RolePracticeMgr from "./RolePracticeMgr";

export default class SchemeMgr {
    player: Player;
    localSchemeId: number;
    schemeList: any;
    schemeDBTimer: any;

    constructor(player: Player) {
        this.player = player;
        this.localSchemeId = 8060;          //用于属性方案在未入库时标识用
        this.schemeList = {};
    }

    init() {
        DB.getSchemesByRoleId(this.player.roleid, (errorcode: any, list: any) => {
            if (errorcode == MsgCode.SUCCESS) {
                for (let k in list) {
                    let item = list[k];
                    let scheme = new Scheme(this.player, this, item.schemeName);
                    scheme.content = SKDataUtil.jsonBy(item.content);
                    scheme.status = item.status;
                    scheme.roleId = item.roleId;
                    scheme.schemeId = item.schemeId;
                    this.schemeList[scheme.schemeId] = scheme;
                    //非法加点检测
                    let sumpoint = 0;
                    for(let key in scheme.content.defense.xiuPoint){
                        let max = RolePracticeMgr.shared.GetMaxXiulianPoint(this.player.relive,key);
                        if(max && max > 0){
                            if(this.player.addattr1[key] > max){
                                scheme.resetXiulianPoint(null,false);
                                break;
                            }
                        }
                        sumpoint += this.player.addattr1[key];
                    }
                    if (sumpoint > this.player.xiulevel) {
                        scheme.resetXiulianPoint(null,false);
                    }
                    //================================================================
                    if (scheme.status == 1) {
                        this.player.setActivateSchemeName(item.schemeName);
                    }
                }
            }
        });
        /*DB.getSchemeMaxId((errorcode: any, schemeId: any) => {
            if (errorcode == MsgCode.SUCCESS) {
                if (schemeId)
                    this.localSchemeId = schemeId;
                if (this.schemeDBTimer != null) {
                    clearInterval(this.schemeDBTimer);
                    this.schemeDBTimer = null;
                }
                this.initDefaultScheme();
            }
        });
        this.schemeDBTimer = setInterval(() => {
            DB.getSchemeMaxId();
        }, 60 * 1000);*/
    }

    initDefaultScheme() {
        //每个玩家系统默认两个方案
        DB.getSchemesByRoleId(this.player.roleid, (errorcode: any, list: any) => {
            if (errorcode == MsgCode.SUCCESS) {
                if (list.length < 1) {
                    for (var i = 0; i < 2; i++) {
                        this.localSchemeId++;
                        let name = `套装方案 ${i + 1}`
                        let scheme = new Scheme(this.player, this, name);
                        scheme.initDefaultData();
                        if (i == 1) {
                            scheme.status = -1;
                        }
                        if (scheme) {
                            DB.updateSchemeById(scheme.toObj(),(code:number,schemeId:number)=>{
                                if(code == MsgCode.SUCCESS){
                                    scheme.schemeId = schemeId;
                                    this.schemeList[scheme.schemeId] = scheme;
                                    SKLogger.debug(`套装方案创建成功 ${schemeId}`);
                                    return;
                                }
                                SKLogger.warn(`套装方案创建失败 ${this.player.roleid}`);
                            });
                        }
                    } 
                }
            }
        });
    }

    getActivateScheme() {
        for (let key in this.schemeList) {
            let scheme = this.schemeList[key];
            if (scheme && scheme.status == 1)
                return scheme;
        }
        return null;
    }

    addScheme(name: any) {
        let check = true;
        for (let key in this.schemeList) {
            if (this.schemeList.hasOwnProperty(key) && this.schemeList[key].schemeName == name) {
                check = false;
                break;
            }
        }
        if (check) {
            this.localSchemeId++;
            let scheme = new Scheme(this.player, this, name);
            scheme.initDefaultData();
            if (scheme) {
                this.schemeList[scheme.schemeId] = scheme;
            }
            this.player.send('s2c_scheme_create', {
                ecode: MsgCode.SUCCESS,
                newSchemeInfo: JSON.stringify(scheme, function (key, val) {
                    if (key == 'player')
                        return undefined;
                    return val;

                })
            });
        } else {
            this.player.send('s2c_scheme_create', {
                ecode: MsgCode.FAILED,
                newSchemeInfo: ''
            });
        }
    }

    updateScheme(schemeId: any, data: any, type: any) {
        if (this.schemeList.hasOwnProperty(schemeId)) {
            let scheme = this.schemeList[schemeId];
            scheme.updateScheme(type, data);
        }

    }

    deleteScheme(schemeId: any) {
        if (this.schemeList.hasOwnProperty(schemeId)) {
            delete this.schemeList[schemeId];
        }
    }

    getSchemeNameList() {
        let schemeList = [];
        for (var key in this.schemeList) {
            if (this.schemeList.hasOwnProperty(key)) {
                let scheme = { schemeId: key, schemeName: this.schemeList[key].schemeName, status: this.schemeList[key].status }
                schemeList.push(scheme);
            }
        }
        this.player.send('s2c_scheme_List', {
            schemeList: SKDataUtil.toJson(schemeList)
        })
    }

    addCustomPoint(data: any) {
        if (this.schemeList.hasOwnProperty(data.schemeId)) {
            let scheme = this.schemeList[data.schemeId];
            if (scheme) {
                scheme.addCustomPoint(data);
            }
        }
    }
    //修炼加点
    addXiulianPoint(data: any) {
        if (this.schemeList.hasOwnProperty(data.schemeId)) {
            let scheme = this.schemeList[data.schemeId];
            if (scheme) {
                scheme.addXiulianPoint(data);
            }
        }
    }

    resetXiulianPoint(data: any) {
        if (this.schemeList.hasOwnProperty(data.schemeId)) {
            let scheme = this.schemeList[data.schemeId];
            if (scheme) {
                scheme.resetXiulianPoint(data);
            }
        }
    }

    changePartner(data: any) {
        if (this.schemeList.hasOwnProperty(data.schemeId)) {
            let scheme = this.schemeList[data.schemeId];
            if (scheme) {
                scheme.changePartner(data);
            }

        }
    }


    getSchemeInfo(schemeId: any) {
        if (this.schemeList.hasOwnProperty(schemeId)) {
            let scheme = this.schemeList[schemeId];
            if (scheme) {
                this.player.send('s2c_scheme_info', {
                    ecode: MsgCode.SUCCESS,
                    schemeInfo: JSON.stringify(scheme, function (key, val) {
                        if (key == 'player')
                            return undefined;
                        return val;

                    })
                });
            }
        }
    }

    updateSchemeEquip(data: any) {
        if (this.schemeList.hasOwnProperty(data.schemeId)) {
            let scheme = this.schemeList[data.schemeId];
            if (scheme) {
                scheme.updateEquips(data.equipId, data.type);
            }
        }
    }

    deleteCurEquips(delId: any) {
        for (var it in this.schemeList) {
            if (this.schemeList.hasOwnProperty(it)) {
                let scheme = this.schemeList[it];
                scheme.deleteEquips(delId);
            }
        }
    }

    activateScheme(data: any) {
        if (this.schemeList.hasOwnProperty(data.schemeId)) {
            for (var it in this.schemeList) {
                if (this.schemeList.hasOwnProperty(it)) {
                    let scheme = this.schemeList[it];
                    if (scheme.status == 1)
                        scheme.status = 0;

                    if (scheme.schemeId == data.schemeId) {
                        scheme.activateScheme(1);

                    }
                }
            }
        }
    }

    changeScheneName(data: any) {
        if (this.schemeList.hasOwnProperty(data.schemeId)) {
            let scheme = this.schemeList[data.schemeId];
            if (scheme) {
                scheme.changeSchemeName(data.name);
            }
        }

    }

    useSchene(data: any) {
        if (this.schemeList.hasOwnProperty(data.schemeId)) {
            let scheme = this.schemeList[data.schemeId];
            if (scheme) {
                scheme.onUse();

            }
        }
    }


    syncSchemePoint() {
        for (var it in this.schemeList) {
            if (this.schemeList.hasOwnProperty(it)) {
                let scheme = this.schemeList[it];
                if (scheme) {
                    scheme.syncPoint();
                }
            }
        }
    }


    syncSchemeEquips(curEquipsData: any) {
        for (let key in this.schemeList) {
            let scheme = this.schemeList[key];
            if (scheme && scheme.status == 1) {
                scheme.syncEquipsData(curEquipsData);
                break;
            }
        }
    }

    syncSchemePartner() {
        for (let key in this.schemeList) {
            let scheme = this.schemeList[key];
            if (scheme && scheme.status == 1) {
                scheme.syncPartner();
                break;
            }
        }
    }

    saveDBData(callback?: (code: number, msg: string) => void) {
        let that = this;
        let saveTotal = 0;
        let props: string[] = [];
        for (let it in this.schemeList) {
            if (this.schemeList.hasOwnProperty(it)) {
                if (that.schemeList[it].isSave) {
                    props.push(it);
                }
            }
        }
        let prefix = ``;
        if (this.player) {
            prefix = `玩家[${this.player.roleid}:${this.player.name}]`;
        }
        saveTotal = props.length;
        if (saveTotal < 1) {
            let info = `存档:${prefix}套装为空，无需存档!`;
            if (callback) {
                callback(MsgCode.SUCCESS, info);
            }
            return;
        }
        for (let it of props) {
            let scheme = that.schemeList[it];
            let data = scheme.toObj();
            DB.updateSchemeById(data, (code: number, schemeId: number) => {
                if(schemeId > 0){
                    that.schemeList[it].schemeId = schemeId;
                }
                saveTotal--;
                if (saveTotal == 0) {
                    let info = `存档:${prefix}套装[${data.schemeName}]保存完成!`
                    SKLogger.info(info);
                    if (callback) {
                        callback(code, info);
                    }
                }
            });
        }
    }
}
