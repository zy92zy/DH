import PlayerMgr from "./PlayerMgr";
import GameUtil from "../core/GameUtil";
import DB from "../../utils/DB";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import { MsgCode } from "../role/EEnum";


export default class Relation{
    relationId: number;
    relationName: string;
    members: any[];
    memberIds: any[];        //保存成员RoleID，用于成员检测
    newMembersIds: any[];    //新加入的成员ID
    createTime: any;
    maxMembersCount: number;
    relationType: number;
    leader: any;
    status: number;        //-1，待确认，0，已创建，未入库 1，正常，已入库，2，修改，3，删除
    relationMgr: any;

    constructor(relationMgr: any) {
        this.relationId = -1;
        this.relationName = '';
        this.members = [];
        this.memberIds = [];        //保存成员RoleID，用于成员检测
        this.newMembersIds = [];    //新加入的成员ID
        this.createTime = '';
        this.maxMembersCount = 5;
        this.relationType = -1;
        this.leader = null;
        this.status = -1;        //-1，待确认，0，已创建，未入库 1，正常，已入库，2，修改，3，删除
        this.relationMgr = relationMgr;
    }


    //发起关系申请
    applyRelation(player: any, relationId: any, members: any, relationName: any, relationType: any, operateType: number = 1) {

        this.relationId = relationId;
        this.relationName = relationName;
        this.leader = player;
        //this.members = members;
        this.maxMembersCount = GameUtil.relationTypeMembersCount[relationType];
        this.relationType = relationType;

        if (operateType == 2) {
            this.newMembersIds = this.memberIds.concat(members).filter(function (e, i, arr) {
                return arr.indexOf(e) === arr.lastIndexOf(e);
            });
        }

        if (operateType == 1) {
            this.status = -1;
            this.members = [];
            this.memberIds = [];

            for (var i = 0; i < members.length; i++) {
                let member = PlayerMgr.shared.getPlayerByRoleId(members[i]);
                let isLeader = members[i] == player.roleid ? true : false;
                this.members.push({ playerid: member.roleid, onlyid: member.onlyid, resid: member.resid, name: member.name, agree: isLeader, isLeader: isLeader, jointime: new Date().format("yyyy-MM-dd hh:mm:ss") });
                this.memberIds.push(member.roleid);
            }
        } else if (operateType == 2) {

            this.members.forEach((e:any)=>{
                if (!e.isLeader) {
                    e.agree = false;
                } else {
                    e.agree = true;
                }
            });

            for (var i = 0; i < this.newMembersIds.length; i++) {
                let member = PlayerMgr.shared.getPlayerByRoleId(this.newMembersIds[i]);
                this.members.push({ playerid: member.roleid, onlyid: member.onlyid, resid: member.resid, name: member.name, agree: false, isLeader: false, jointime: new Date().format("yyyy-MM-dd hh:mm:ss") });
                this.memberIds.push(member.roleid);
            }

            this.status = 2;
        }


        for (var i = 0; i < members.length; i++) {
            let member = PlayerMgr.shared.getPlayerByRoleId(members[i]);

            member.send('s2c_relation_apply_info', {
                relationType: relationType,
                playersInfo: SKDataUtil.toJson(this.members),
                leaderId: player.roleid,
                relationId: this.relationId,
                relationName: this.relationName
            });
        }

        player.send('s2c_relation_apply_res', {
            ecode: MsgCode.SUCCESS,
            errorMsg: '成功发起关系申请'
        });
    }


    //其他玩家对申请关系的操作（同意/拒绝）
    confirmRelationApply(player:any, agree:any) {
        agree = agree == 1 ? true : false;
        this.members.some((e:any)=>{
            if (e.playerid == player.roleid) {
                e.agree = agree;
            }
        });
        for (const pid in this.members) {
            let member = PlayerMgr.shared.getPlayerByRoleId(this.members[pid].playerid);

            member.send('s2c_relation_apply_answer', {
                playerId: player.roleid,
                agree: agree,
                relationId: this.relationId
            });
        }

        let res = this.members.every((e:any)=>{
            return e.agree;
        });

        //如果所有人都已经同意
        if (res) {

            if (this.status == 2) {
                this.status = 2
            } else {
                this.status = 0;
            }
            for (const pid in this.members) {
                let member = PlayerMgr.shared.getPlayerByRoleId(this.members[pid].playerid);
                member.send('s2c_relation_created', {
                    ecode: MsgCode.SUCCESS,
                    msg: '',
                    relationType: this.relationType,
                    members: SKDataUtil.toJson(this.members),
                });

                let titleInfo = this.getTitleInfo();
                member.addTitle(titleInfo.titleType, titleInfo.titleId, this.relationName);
                member.CostFee(0, GameUtil.brotherMoney, '与他人结拜');
            }

            this.createTime = new Date();

        }
    }

    getTitleInfo() {
        let titleType = GameUtil.titleType.BroTitle;
        let titleId = GameUtil.titleBangType.Brother;
        if (this.relationType == GameUtil.relationType.Couple) {
            titleType = GameUtil.titleType.CoupleTitle;
            titleId = GameUtil.titleBangType.Couple;
        }
        return { titleType: titleType, titleId: titleId };
    }

    hasMember(playerId:any) {
        return this.members.some((e:any)=>{
            return e.playerid == playerId;
        });
    }

    //关系群内操作
    doRelation() {

    }

    joinRelations() {

    }
    //退出关系
    leaveRelation(data:any) {
        let m_index = -1;
        let member = this.members.find((e, index) => {
            if (e.playerid == data.roleId) {
                m_index = index;
                return true;
            }
            return false;
        })

        let titleInfo = this.getTitleInfo();
        if (member && m_index != -1) {
            this.members.every((e:any)=>{
                let p = PlayerMgr.shared.getPlayerByRoleId(e.playerid);
                if (p) {
                    p.send('s2c_relation_leave', {
                        ecode: MsgCode.SUCCESS,
                        leaveRoleId: member.playerid,
                        relationId: this.relationId,
                        titleId: titleInfo.titleId,
                        relationName: this.relationName
                    });
                }
                return true;
            });

            this.members.splice(m_index, 1);
            let index = this.memberIds.indexOf(data.roleId);
            if (index != -1)
                this.memberIds.splice(index, 1);

            //删除相关称谓
            let player = PlayerMgr.shared.getPlayerByRoleId(member.playerid);
            if (player) {
                player.delTitle(titleInfo.titleType, titleInfo.titleId, this.relationName);
                player.CostFee(0, GameUtil.brotherMoney, '与他人结拜');
            }

            this.status = 2;

        }

        if (this.members.length <= 1) {
            this.members.every((e:any)=>{
                let player = PlayerMgr.shared.getPlayerByRoleId(e.playerid);
                if (player) {
                    player.send('s2c_relation_destroy', {
                        ecode: MsgCode.SUCCESS,
                        relationId: this.relationId,
                        titleId: titleInfo.titleId
                    });
                    player.delTitle(titleInfo.titleType, titleInfo.titleId, this.relationName);
                }
                return true;
            });
            this.status = 3;
        }


    }

    destroyRelation() {

    }

    doShow() {
        return this.status == 0 || this.status == 1 || this.status == 2;
    }

    doDB() {
        return this.status == 0 || this.status == 2 || this.status == 3;
    }

    saveData() {
        let that = this;
        if (this.status == 0) {
            //创建新的关系

            let membersData:any = [];
            this.members.forEach((e:any)=>{
                let m = { playerid: e.playerid, onlyid: e.onlyid, resid: e.resid, name: e.name, isLeader: e.isLeader, jointime: e.jointime };
                membersData.push(m);
            })

            let sqlData = {
                relationId: this.relationId,
                members: SKDataUtil.toJson(membersData),
                relationType: this.relationType,
                relationName: this.relationName,
                status: 0           //status用于数据库标志是否删除，与this.status不同
            }

            DB.createRelation(sqlData, (errorcode:any, relationId:any) => {
                if (errorcode == MsgCode.SUCCESS) {
                    that.relationId = relationId;
                    DB.getRelationById(relationId, (errorcode:any, rows:any) => {
                        if (rows.length > 0) {
                            let relation = rows[0];
                            that.createTime = relation.createTime;
                        }
                    });
                    that.status = 1;
                    SKLogger.debug(that.relationName + `DB关系创建成功`);
                } else {
                    SKLogger.debug(that.relationName + `DB关系创建失败`);
                }
            });
        } else if (this.status == 2) {
            //修改关系(成员变更)

            let membersData:any = [];
            this.members.forEach((e:any)=>{
                let m = { playerid: e.playerid, onlyid: e.onlyid, resid: e.resid, name: e.name, isLeader: e.isLeader, jointime: e.jointime };
                membersData.push(m);
            })

            let params = {
                relationId: this.relationId,
                members: SKDataUtil.toJson(membersData),
                relationType: this.relationType,
                relationName: this.relationName,
                status: 0           //status用于数据库标志是否删除，与this.status不同
            };
            DB.updateRelationMembersById(params, (errorcode:any, list:any) => {
                if (errorcode == MsgCode.SUCCESS) {
                    SKLogger.debug(that.relationName + `DB关系成员更新成功`);
                    that.status = 1;
                } else {
                    SKLogger.debug(that.relationName + `DB关系成员更新失败`);
                }
            });

        } else if (this.status == 3) {
            //删除关系
            //如果成员退出后，只剩下一个人，则自动解散
            let membersData:any = [];
            this.members.forEach((e:any)=>{
                let m = { playerid: e.playerid, onlyid: e.onlyid, resid: e.resid, name: e.name, isLeader: e.isLeader, jointime: e.jointime };
                membersData.push(m);
            })

            let sqlData = {
                relationId: this.relationId,
                members: SKDataUtil.toJson(membersData),
                relationType: this.relationType,
                relationName: this.relationName,
                status: -1           //status用于数据库标志是否删除，与this.status不同
            }

            DB.deleteRelationById(sqlData, (errorcode:any, list:any) => {
                if (errorcode == MsgCode.SUCCESS) {
                    SKLogger.debug(that.relationName + `DB关系删除成功`);
                    if (that.relationMgr) {
                        let delIndex = -1;
                        let item = that.relationMgr.relationsList.find((e:any, index:any):boolean => {
                            if (e.relationId == this.relationId) {
                                delIndex = index;
                                return true;
                            }
                            return false;
                        })
                        if (item && delIndex != -1) {
                            that.relationMgr.relationsList.splice(delIndex, 1);
                            item = null;
                        }
                    }
                } else {
                    SKLogger.debug(that.relationName + `DB关系删除失败`);
                }
            });
        }
    }
}