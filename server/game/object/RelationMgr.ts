import DB from "../../utils/DB";
import GameUtil from "../core/GameUtil";
import PlayerMgr from "./PlayerMgr";
import Relation from "./Relation";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import { MsgCode } from "../role/EEnum";

export default class RelationMgr {
    static shared = new RelationMgr();
    localRelationId: number;
    relationsList: any;
    relationDBTimer: any;

    constructor() {
        this.localRelationId = 8060;          //用于关系在未入库时标识用
        this.relationsList = [];
    }

    init() {
        DB.queryAllRelations((errorcode: any, list: any) => {
            if (errorcode == MsgCode.SUCCESS) {
                for (let rItem of list) {
                    let relation = new Relation(this);
                    relation.relationId = rItem.relationId;
                    try {
                        relation.members = SKDataUtil.jsonBy(rItem.members);
                    } catch (error) {
                        SKLogger.warn(`${relation.relationId}${error}`);
                        continue;
                    }
                    relation.members.forEach((e: any) => {
                        relation.memberIds.push(e.playerid);
                    });
                    relation.createTime = rItem.createTime;
                    relation.relationType = rItem.relationType;
                    relation.relationName = rItem.relationName;
                    relation.status = 1;
                    this.relationsList.push(relation);//[rItem.relationId] = relation;
                }
            }
        });

        /*DB.getRelationMaxId((errorcode: any, relationId: any) => {
            if (errorcode == MsgCode.SUCCESS) {
                this.localRelationId = relationId;
                if (this.relationDBTimer != null) {
                    clearInterval(this.relationDBTimer);
                    this.relationDBTimer = null;
                }
            }
        });
        this.relationDBTimer = setInterval(() => {
            DB.getRelationMaxId();
        }, 60 * 1000);*/

    }

    //关系群内操作
    doRelations() {
    }

    getRelationByMembers(data: any) {
    }

    //创建关系
    applyRelation(player: any, data: any) {
        let checkRes = this.checkRelation(player, data.relationType, data.relationName, data.members);
        if (checkRes == 0) {
            this.localRelationId ++;
            let relation = new Relation(this);
            relation.applyRelation(player, this.localRelationId, data.members, data.relationName, data.relationType, 1);
            this.relationsList.push(relation);
        } else {
            player.send('s2c_relation_apply_res', {
                ecode: MsgCode.FAILED,
                errorMsg: checkRes + ''
            });
        }
    }

    //添加关系成员
    addRelationMember(player: any, data: any) {
        let checkRes = this.checkRelation(player, data.relationType, data.relationName, data.members, data.relationId, 2);
        if (checkRes == 0) {
            let relation = this.relationsList.find((e: any) => {
                return e.relationId = data.relationId;
            })
            if (relation) {
                relation.applyRelation(player, relation.relationId, data.members, relation.relationName, relation.relationType, 2);
            }
        } else {
            player.send('s2c_relation_apply_res', {
                ecode: MsgCode.FAILED,
                errorMsg: checkRes + ''
            });
        }
    }
    /*
     * operateType: 1,新建关系 2,新人加入
     * return 0，成功，1,重名  2，重复创建相同关系 3,人数超过限制 4，成员超过关系人数限制
     */
    checkRelation(player: any, relation_Type: any, relationName: string = '', members: any = [], relationId: number = -1, operateType: number = 1) {
        if (operateType == 1 && relationName != '') {
            //如果是新关系，需要判断是否已经重名
            let relationIndex = this.relationsList.findIndex((e: any) => {
                return e.relationName == relationName && e.doShow();
            })
            if (relationIndex != -1) {
                //已经有相同的名字了
                return 1;
            }
        }
        //判断是否是重复创建
        let reCreate = this.relationsList.some((e: any) => {
            return e.memberIds.sort().toString() == members.sort().toString();
        });

        if (reCreate)
            return 2;

        //判断人数是否超过限制
        if (members.length > GameUtil.relationTypeMembersCount[relation_Type]) {
            //人数超过上限
            return 3;
        }

        //判断成员已拥有的结拜关系数量
        let checkMaxJoin = members.some((e: any) => {
            let broCount = 0;
            for (var i = 0; i < this.relationsList.length; i++) {
                let relation = this.relationsList[i];
                if (relation.relationId == relationId && relation.doShow()) {
                    //已经加入过该关系
                    return false;
                } else if (relation_Type == GameUtil.relationType.Brother && relation.hasMember(e) && relation.relationType == GameUtil.relationType.Brother && relation.doShow()) {
                    broCount = ++broCount;
                }
            }

            if (broCount >= 3)
                return true;
            return false;

        })

        if (checkMaxJoin)
            return 4;   //每人最多同时拥有三个结拜关系

        //判断是否在线
        members.forEach((e: any): number => {
            let player = PlayerMgr.shared.getPlayerByRoleId(e.playerid);
            if (!player) {
                return 5;       //所有成员必须在线
            }
            return 0;
        });

        //判断成员身上携带银两数
        let lessMoney = members.some((e: any): boolean => {
            let player = PlayerMgr.shared.getPlayerByRoleId(e.playerid);
            if (player) {
                let money = player.GetMoney(0);
                if (money < GameUtil.brotherMoney)
                    return true
            }
            return false;
        })
        if (lessMoney) {
            return 6;
        }
        return 0;

    }

    confirmRelation(player: any, data: any) {
        let relations = this.relationsList.filter((e: any): boolean => {
            if (e.relationId == data.relationId)
                return true;
            return false;
        });

        let relation = relations[0];
        relation.confirmRelationApply(player, data.agree);
    }

    //获取关系成员
    getRelationListByRoleId(player: any, data: any) {
        let relations = this.relationsList.filter((e: any): boolean => {
            if (e.members.some((e: any) => {
                return e.playerid == data.roleId;
            })) {
                return e.relationType == data.relationType && e.doShow();
            }
            return false;

        });

        let jsonValue = [];

        for (let i = 0; i < relations.length; i++) {
            let relation = relations[i];
            let item = { name: relation.relationName, createTime: relation.createTime, members: SKDataUtil.toJson(relation.members), relationType: relation.relationType, relationId: relation.relationId };
            jsonValue.push(item);

        }
        let str = SKDataUtil.toJson(jsonValue);
        player.send('s2c_relation_List', {
            ecode: MsgCode.SUCCESS,
            relationList: str,
            operationType: data.operationType
        });
    }

    leaveRelation(player: any, data: any) {
        let relation = this.relationsList.find((e: any) => {
            if (e.members.some((e: any) => {
                return e.playerid == data.roleId;
            })) {
                return e.relationId == data.relationId;
            }
            return false;
        });
        if (relation) {
            relation.leaveRelation(data);
        }
    }

    deleteRelation(relation: any, relationList: any) {
        let m_index = -1;
        let relationDel = relationList.find((e: any, index: any) => {
            if (e.relationId == relation.relationId)
                m_index = index;
            return true;
        });

        if (relationDel && m_index != -1) {
            relationList.splice(m_index, 1);
            relationDel = null;
        }
    }


    deleteTempRelationByPlayer(roleid: any) {
        let tempRelationList: any = [];
        this.relationsList.forEach((e: any, index: any): boolean => {
            let r = false;
            if (e.members.some((e: any): boolean => {
                return e.playerid == roleid;
            })) {
                r = (e.status == -1 ? true : false);
                if (r) {
                    let relation = { relation: e, index: index };
                    tempRelationList.push(relation);
                }
                return r;
            } else {
                return r;
            }
        });

        if (tempRelationList.length > 0) {
            tempRelationList.forEach((e: any) => {
                e.relation.members.every((t: any) => {
                    let p = PlayerMgr.shared.getPlayerByRoleId(t.playerid);
                    if (p) {
                        p.send('s2c_relation_reject', {
                            rejectRoleId: roleid,
                            relationId: e.relation.relationId
                        });
                    }
                    return true;
                });

                this.relationsList.splice(e.index, 1);
                e.relation = null;
            });
        }
    }

    rejectRelation(player: any, data: any) {

        let m_index = -1;
        let relationDel = this.relationsList.find((e: any, index: any): boolean => {
            if (e.relationId == data.relationId) {
                m_index = index;
                return true;
            }
            return false;
        });

        if (relationDel) {
            /*
            relationDel.members.array.forEach(e =>{
                let p = PlayerMgr.shared.getPlayerByRoleId(e.playerid);
                if(p){
                    p.send('s2c_relation_reject',{
                        rejectRoleId: data.roldId,
                        relationId:relationDel.relationId
                    });
                }

                if(relationDel.newMembersIds.length > 0){

                }
            });

            */
            let memberList = relationDel.members;
            for (let i = memberList.length - 1; i >= 0; i--) {
                let item = memberList[i];
                let p = PlayerMgr.shared.getPlayerByRoleId(item.playerid);
                if (p) {
                    p.send('s2c_relation_reject', {
                        rejectRoleId: data.roldId,
                        relationId: relationDel.relationId
                    });
                }

                //删除新加的用户
                if (relationDel.newMembersIds.length > 0) {
                    let index = relationDel.newMembersIds.indexOf(item.playerid);
                    if (index != -1) {
                        memberList.splice(i, 1);
                    }
                }
            }

            if (relationDel.newMembersIds.length > 0) {
                let memberIds = relationDel.memberIds;
                for (var i = memberIds.length - 1; i >= 0; i--) {

                    //删除新加的用户
                    if (relationDel.newMembersIds.length > 0) {
                        let index = relationDel.newMembersIds.indexOf(memberIds[i]);
                        if (index != -1) {
                            memberIds.splice(index, 1);
                        }
                    }
                }

                relationDel.newMembersIds = [];

            }

            if (relationDel.status == -1) {
                this.relationsList.splice(m_index, 1);
                relationDel = null;
            }
        }

    }

    update(dt: number) {
        if (dt % (1000 * 60) == 0) {
            this.saveData();
        }
    }

    saveData() {
        let dbList = this.relationsList.filter((e: any) => {
            return e.doDB();
        });

        dbList.forEach((e: any) => {
            e.saveData();
        });
    }

    joinRelation(relationId: any, player: any) {
    }

}
