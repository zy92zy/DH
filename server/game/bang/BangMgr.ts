import Bang from "./Bang";
import GTimer from "../../common/GTimer";
import PlayerMgr from "../object/PlayerMgr";
import DB from "../../utils/DB";
import PaiHangMgr from "../core/PaiHangMgr";
import Launch from "../core/Launch";
import GameUtil from "../core/GameUtil";
import SKLogger from "../../gear/SKLogger";
import { MsgCode } from "../role/EEnum";
import Player from "../object/Player";
import SKDataUtil from "../../gear/SKDataUtil";
import BangZhan from "./BangZhan";

export default class BangMgr {
    static shared = new BangMgr();
    bangList: any;
    createList: any;
    biddingList: any[];
    allbid: number;
    loadComplete: any;
    bangDBTimer: any;
    bang_limit: number;
    level_config: any;

    constructor() {
        this.bangList = {};
        this.createList = {};
        this.biddingList = [];
        this.allbid = 0;
        this.bang_limit = 0;
        this.level_config = {};

        this.loadComplete = {
            brole: false,
            maxid: false,
        }
    }
    // 全部存档
    static saveAll(callback:(msg:string)=>void){
        this.shared.saveAll(callback);
    }

    init() {
        //载入帮派等级配置
		this.level_config = GameUtil.require_ex('../../conf/prop_data/prop_bangpai.json');
        let self = this;
        DB.getBangList((code: any, list: any) => {
            if (code == MsgCode.SUCCESS) {
                for (let k in list) {
                    let info = list[k];
                    let bang = new Bang();
                    bang.id = info.bangid;
                    bang.name = info.name;
                    bang.masterid = info.masterid;
                    bang.mastername = info.mastername;
                    bang.bidding = info.bidding;
                    bang.fight_fail = info.fight_fail;
                    bang.fight_win = info.fight_win;
                    self.bangList[info.bangid] = bang;
                }
                if (list.length > 0) {
                    self.checkBangRoles();
                    self.initBidding();
                } else {
                    self.initComplete();
                }
            }
            // 帮战模块
            BangZhan.shared.init();
        });

        
    }

    checkBangRoles() {
        DB.getBangRoles((errorcode: any, list: any) => {
            if (errorcode == MsgCode.SUCCESS) {
                for (const bid in list) {
                    if (list.hasOwnProperty(bid)) {
                        const memberlist = list[bid];
                        let bang: Bang = this.bangList[bid];
                        if (bang) {
                            for (const info of memberlist) {
                                bang.addMember(info)
                            }
                            bang.isinit = true;
                        } else {
                            continue;
                        }
                    }
                }
                for (const bid in this.bangList) {
                    if (this.bangList.hasOwnProperty(bid)) {
                        const bang: Bang = this.bangList[bid];
                        if (bang.isinit == false) {
                            this.delBang(bid);
                            SKLogger.debug(`帮派人数为0，帮派[${bid}]删除`);
                        }
                    }
                }
                this.complete('brole');
            }
            list = null;
            
        });
    }

    complete(key: any) {

        this.loadComplete[key] = true;
        if (/*this.loadComplete.maxid && */this.loadComplete.brole) {
            this.initComplete()
        }
    }

    onNewDay() {
        this.bang_limit = 0;
    }

    makeBangId() {
        // server id + 年（2019 = 0） + 月 + 日 + 自增数0~999
        let sid = GameUtil.serverId % 1000 + 1;
        let nowdate = GTimer.getCurDate();
        // 1111111111
        // 11 0 05 10 000 
        let year = nowdate.getFullYear() - 2022;
        let month = nowdate.getMonth() + 1;
        let smonth = "" + month;
        if (month < 10) {
            smonth = '0' + month;
        }
        let day = nowdate.getDate();
        let sday = "" + day;
        if (day < 10) {
            sday = '0' + day;
        }
        let mbangid = '' + sid + year + smonth + sday + '000';
        let bid = parseInt(mbangid);
        return bid;
    }

    initComplete() {
        SKLogger.info('帮派模块加载完毕!');
        PaiHangMgr.shared.initBangRank();
        Launch.shared.complete("BangMgr");
    }
    // 创建帮派
    createBang(player: Player, createdata: any) {
        if (this.bang_limit >= 990) {
            player.send('s2c_notice', {
                strRichText: '今天无法创建帮派，请明天再次尝试'
            });
            return;
        }
        let cost = 1000;
        if (player.bangid != 0) {
            player.send('s2c_notice', {
                strRichText: '请先退出帮派'
            });
            return;
        }
		if(!SKDataUtil.CheckName(createdata.name)){
			player.send('s2c_notice', {
				strRichText: '请填写2-8个汉字！'
			});
			return;
		}
        for (let ln of GameUtil.limitWordList) {
            if (createdata.name.indexOf(ln) != -1) {
				player.send('s2c_notice', {
					strRichText: '非法名称！'
				});
				return;
            }
        }
        let checkname = GameUtil.checkLimitWord(createdata.name);
        if (!checkname) {
            player.send('s2c_notice', {
                strRichText: '帮派已经存在，请换个名字'
            });
            return;
        }
        let b = this.getBangByName(createdata.name);
        if (b) {
            player.send('s2c_notice', {
                strRichText: '帮派已经存在，请换个名字'
            });
            return;
        }
        
        if (this.createList[player.roleid] != null) {
            return;
        }
        this.createList[player.roleid] = 1;
        let strErr = player.CostFee(1, cost, '创建帮派');
        if (strErr != '') {
            player.send('s2c_notice', {
                strRichText: strErr
            });
            return;
        }
        let bang = new Bang();
        bang.name = createdata.name;
        bang.masterid = player.roleid;
        bang.mastername = createdata.mastername;
        bang.rolelist = [];
        createdata.aim = createdata.aim || '';
        createdata.serverid = GameUtil.serverId;
        
        DB.createBang(createdata, (ret: any, bangid: any) => {
            if (ret == MsgCode.SUCCESS) {
                bang.id = bangid;
                this.bangList[bang.id] = bang;
                delete this.createList[player.roleid];
                bang.addMember(player);
                player.bangid = bang.id;
                player.bangname = bang.name;
                player.bangpost = GameUtil.bangPost.BangZhu;
                player.addTitle(GameUtil.titleType.CommonTitle, GameUtil.titleBangType.BangZhu);
                player.GetTaskMgr().CheckAndInceptTask();
                player.GetTaskMgr().updateTaskStateToClient();
                this.playerGetBangInfo(player);
                SKLogger.info(`[${player.name}]创建帮派[${bang.name}]成功`);
            } else {
                delete this.createList[player.roleid];
                //SKLogger.warn(`[${player.name}]创建帮派[${bang.name}]失败`);
            }
        });
    }

    getBangList() {
        let templist = [];
        let allbid = this.allbid;
        for (let index = 0; index < this.biddingList.length; index++) {
            if (templist.length >= 10) {
                break;
            }

            const info = this.biddingList[index];
            if (index < 3) {
                let bang: Bang = this.getBang(info.bangid);
                if (bang) {
                    templist.push(bang.toObj());
                }
            } else {
                let r = GameUtil.random(0, allbid);
                for (let k = index; k < this.biddingList.length; k++) {
                    const t = this.biddingList[k];
                    r -= t.bidding;
                    if (r <= 0) {
                        let bang: Bang = this.getBang(t.bangid);
                        if (bang) {
                            templist.push(bang.toObj());
                            allbid -= t.bidding;
                        }
                    }
                }
            }
        }
        let keylist = Object.keys(this.bangList);
        for (let i = templist.length; i < 30; i++) {
            let r = GameUtil.random(0, keylist.length - 1);
            let bang: Bang = this.bangList[keylist[r]];
            if (bang) {
                templist.push(bang.toObj());
                keylist.splice(r, 1);
            }
        }

        return templist;
    }

    getBang(bangid: any): Bang {
        return this.bangList[bangid];
    }

    getBangName(bangid: any): string {
        let bang:Bang = this.bangList[bangid];
        return bang ? bang.name : '';
    }

    getBangByMasterid(masterid: any): Bang {
        for (const key in this.bangList) {
            if (this.bangList.hasOwnProperty(key)) {
                let bang: Bang = this.bangList[key];
                if (bang.masterid == masterid) {
                    return bang;
                }
            }
        }
        return null;
    }

    getBangByName(name: any) {
        for (const key in this.bangList) {
            if (this.bangList.hasOwnProperty(key)) {
                let bang: Bang = this.bangList[key];
                if (bang.name == name) {
                    return bang;
                }
            }
        }
        return null;
    }

    playerGetBangInfo(player: any) {
        let bang: Bang = this.getBang(player.bangid);
        if (bang) {
            player.send('s2c_getbanginfo', bang.getBangInfo());
        } else {
            player.send('s2c_getbanglist', { list: this.getBangList() });
        }
    }

    searchBang(info: any) {
        let templist = [];
        for (const key in this.bangList) {
            if (this.bangList.hasOwnProperty(key)) {
                let bang: Bang = this.bangList[key];
                if (bang.name.indexOf(info.data) > -1 || bang.id == info.data) {
                    templist.push(bang.toObj());
                }
            }
        }
        return templist;
    }

    joinBang(player: Player, bangid: any) {
        let bang: Bang = this.getBang(bangid);
        if (bang == null) {
             //帮派不存在或者帮派满员
            player.send('s2c_operation_result', {
                code: MsgCode.FAILED,
            });
            return false;
        }
        let config = this.level_config[bang.level];
        if(config && bang.getMemberNum() >= config.num){
            player.send('s2c_operation_result', {
                code: "帮派已满员",
            });
            return false;
        }
        player.bangid = bangid;
        player.bangname = bang.name;
        player.bangpost = GameUtil.bangPost.BangZhong;
        player.addTitle(GameUtil.titleType.CommonTitle, GameUtil.titleBangType.BangZhong);
        bang.addMember(player);
        return true;
    }
    // 退出帮派
    leaveBang(leaveInfo: any): any {
        let bang: Bang = this.getBang(leaveInfo.bangid);
        if (bang == null) {
            SKLogger.warn(`帮派[${leaveInfo.bangid}不存在`);
            return false;
        }
        return bang.leave(leaveInfo.roleid);
    }
    // 删除帮派
    delBang(bangid: any) {
        let bang = this.getBang(bangid);
        if (bang == null) {
            SKLogger.warn(`帮派[${bangid}不存在`);
            return; //帮派不存在
        }
        DB.deleteBang(bang.id);
        delete this.bangList[bangid];
        this.initBidding();
    }

    disbandBang(data: any) {
        let bang: Bang = this.getBang(data.bangid);
        if (bang == null) {
            SKLogger.warn(`帮派[${data.bangid}不存在`);
            return false; //帮派不存在
        }
        if (data.roleid == bang.masterid) {
            let player = PlayerMgr.shared.getPlayerByRoleId(bang.masterid);
            SKLogger.debug(`玩家[${player.name}(${player.roleid})]解散了帮派[${bang.name}(${bang.id})]`);
            let list = bang.rolelist;
            DB.deleteBang(bang.id);
            delete this.bangList[data.bangid];
            for (let index = 0; index < list.length; index++) {
                const role = list[index];
                let player = PlayerMgr.shared.getPlayerByRoleId(role.roleid);
                if (player != null) {
                    player.bangid = 0;
                    player.bangname = '';
                    player.bangpost = 0;
                    player.send('s2c_notice', {
                        strRichText: '帮派已解散，请重新加入其它帮派！'
                    });
                    player.send('s2c_getbanglist', {
                        list: this.getBangList()
                    });
                }
            }
            this.initBidding();
            return true;
        }
        return false;
    }
    // 全部存档
    saveAll(callback: (msg:string) => void) {
        let total = Object.keys(this.bangList).length;
        if (total < 1) {
            let msg=`帮派存档:数量少于1个无需存档!`;
            callback(msg);
            return;
        }
        let saved: number = 1;
        let failed:number = 0;
        for (let key in this.bangList) {
            let bang: Bang = this.bangList[key];
            DB.updateBang({
                bangid: bang.id,
                rolenum: bang.rolelist.length
            }, (code:MsgCode) => {
                if(code==MsgCode.FAILED){
                    failed++;
                }
                if (saved >= total) {
                    let msg=`帮派存档:[失败:${failed}/总数:${total}]存档完成!`
                    callback(msg);
                }
            });
            saved++;
        }
    }

    requestBang(player: any, bangid: any, requestInfo?: any) {
        let bang: Bang = this.getBang(bangid);
        if (bang == null) {
            SKLogger.warn(`帮派[${bangid}不存在`);
            return false;
        }
        if (bang.getMemberNum() >= 300) {
            player.send('s2c_notice', {
                strRichText: '帮派满员，请选择其他帮派！'
            });
            return false; //帮派不存在或者帮派满员
        }
        if (bang.getRequestnum() >= 100) {
            player.send('s2c_notice', {
                strRichText: '申请人数过多，请选择其他帮派！'
            });
            return false; //申请入帮人数过多
        }
        for (const info of bang.requestlist) {
            if (info.roleid == player.roleid) {
                player.send('s2c_notice', {
                    strRichText: '已经申请过这个帮派，等待帮主确认！'
                });
                return false;
            }
        }

        bang.addRequest(player);

        player.send('s2c_notice', {
            strRichText: '申请成功，等待帮主确认！'
        });

        let master = PlayerMgr.shared.getPlayerByRoleId(bang.masterid, false);
        if (master) {
            master.send('s2c_join_bang');
        }
        return true;
    }

    initBidding() {
        this.biddingList = [];
        for (const bangid in this.bangList) {
            if (this.bangList.hasOwnProperty(bangid)) {
                const bang: Bang = this.bangList[bangid];
                if (bang.bidding > 0) {
                    this.biddingList.push({
                        bangid: bang.id,
                        bidding: bang.bidding,
                    })
                }
            }
        }

        this.biddingList.sort((a, b) => {
            return b.bidding - a.bidding;
        });

        let allbid = 0;
        for (let i = 0; i < this.biddingList.length; i++) {
            const info = this.biddingList[i];
            if (i > 3) {
                allbid += info.bidding;
            }
        }
        for (let i = 0; i < this.biddingList.length; i++) {
            const info = this.biddingList[i];
            let bang = this.getBang(info.bangid);
            if (bang == null) {
                continue;
            }
            if (i < 3) {
                bang.weight = 100;
            } else {
                bang.weight = Math.ceil(bang.bidding / allbid * 100);
            }
        }
        this.allbid = allbid;
    }
}