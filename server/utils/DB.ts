import GameUtil from '../game/core/GameUtil';
import EquipMgr from "../game/object/EquipMgr";
import PetMgr from "../game/core/PetMgr";
import DBFrom from "./DBForm";
import GateAgentMgr from "../gate/GateAgentMgr";
import SKDataUtil from "../gear/SKDataUtil";
import SKLogger from '../gear/SKLogger';
import Pet from '../game/object/Pet';
import SKDBUtil from '../gear/SKDBUtil';
import SkillBase from "../game/skill/core/SkillBase";
import Horse from '../game/horse/Horse';
import { MsgCode } from '../game/role/EEnum';
import Sql from './Sql';
import BangZhanInfo from '../game/bang/BangZhanInfo';
import SKMongoUtil, { DbName } from '../gear/SKMongoUtil';
import GTimer from '../common/GTimer';
import SKTimeUtil from '../gear/SKTimeUtil';


export default class DB {

    static init() {
    };

    static query(sql: string, callback: (error: any, rows: any[]) => void) {
        if (SKDataUtil.isEmptyString(sql)) {
            SKLogger.warn(`$SQL错误:SQL不能为空!`);
            return;
        }
        DBFrom.shared.query(sql, callback);
    };
    // 更新登录信息  TODO 加入 version
    static updateLoginInfo(accountid: any, ip: any, mac: any) {
        let sql = `UPDATE qy_account SET last_login_time=now(),login_ip='${ip}',mac='${mac}' WHERE accountid =${accountid};`;
        DB.query(sql, (error: any, rows: any) => {
        })
    }
    // 帐号登录
    static accountLogin(logininfo: any, callback: (code: number, msg: string, data: any) => void) {
        let account = logininfo.account;
        let password = logininfo.password;
        let ip = logininfo.ip == null ? "" : logininfo.ip;
        let mac = logininfo.mac;
        if (account == null || password == null) {
            SKLogger.warn(`$警告:[${account}:${password}]帐号或密码不能为空!`);
            callback(MsgCode.FAILED, "帐号或密码不能为空", null);
            return;
        }
        account.replace("\'", "\\\'");
        password.replace("\"", "\\\"");
        let sql = `SELECT * FROM qy_account WHERE account = "${account}";`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, "登录数据库错误!", null);
                return;
            }
            if (rows.length > 0) {
                let data = rows[0];
                if (password == data.password) {
                    callback(MsgCode.SUCCESS, "登录成功", data);
                    SKLogger.debug(`用户[${account}:${password}]登录帐号成功!`);
                    data.login_ip = ip;
                    data.mac = mac;
                    DB.updateLoginInfo(data.accountid, ip, mac);
                } else {
                    SKLogger.warn(`$警告:[${account}:${password}]登录帐号密码错误!`);
                    callback(MsgCode.LOGIN_ACCOUNT_PWD_ERROR, "登录帐号密码错误", null);
                }
            } else {
                SKLogger.warn(`$警告:[${account}:${password}]登录帐号不存在!`);
                let msg = `登录帐号不存在`
                callback(MsgCode.LOGIN_ACCOUNT_PWD_ERROR, msg, null);
            }
        })
    }
    // 帐号注册
    static accountRegister(register_info: any, callback: (code: number, msg: string) => void) {
        let account = register_info.account;
        let password = register_info.password;
        let invitecode = register_info.invitecode;
        
        var sql = `SELECT * FROM qy_account WHERE account = "${account}";`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, `注册帐号SQL错误,请稍候重试!`);
                return;
            }
            if (rows.length > 0) {
                callback(MsgCode.FAILED, `帐号[${account}]已注册,请更换!`);
                return;
            } else {
                sql = `INSERT INTO qy_account(account, password,invite, register_time) VALUES('${account}', '${password}','${invitecode}', NOW() );`;
                DB.query(sql, (error: any, rows: any) => {
                    if (error) {
                        callback(MsgCode.FAILED, `注册帐号插入失败,请稍候重试!`);
                        return;
                    }
                    callback(MsgCode.SUCCESS, `帐号${account}注册成功!`);
                });
            }
        });
    }
    // 修改帐号密码
    static async accountChangePassword(data: any, callback: (code: number, msg: string) => void) {
        let account = data.account;
        let safecode = data.safecode;
        let password = data.password;
        let sql = `UPDATE qy_account SET password = '${password}' WHERE account = '${account}' and safecode like '_:${safecode}';`;
        DB.query(sql, (error: any) => {
            if (error) {
                callback(MsgCode.FAILED, `修改密码数据库错误,请稍候重试!`);
                return;
            } else {
                callback(MsgCode.SUCCESS, `修改密码成功!`);
            }
        });
    };

    static getRoleid(accountid: number, callback: (code: number, roleid: number[]) => void){
        let sql = `SELECT roleid FROM qy_role WHERE serverid=${GameUtil.serverId} AND accountid = '${accountid}';`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, []);
                return;
            }
            if (rows.length == 0) {
                callback(MsgCode.FAILED, []);
                return;
            }
            let list = [];
            for (const i of rows) {
                list.push(i['roleid']);
            }
            callback(MsgCode.SUCCESS, list);
        });
    }

    static getAccountid(roleid: number, callback: (code: number, account: number) => void){
        let sql = `SELECT accountid FROM qy_role WHERE roleid = '${roleid}';`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, null);
                return;
            }
            if (rows.length == 0) {
                callback(MsgCode.FAILED, null);
                return;
            }
            callback(MsgCode.SUCCESS, rows[0].accountid);
        });
    }

    static getFrozenList(callback: (code: number, rows: any) => void) {
        let sql = `SELECT frozen_ip FROM ip_frozen;`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, []);
                return;
            }
            if (rows.length == 0) {
                callback(MsgCode.FAILED, []);
                return;
            }
            callback(MsgCode.SUCCESS, rows);
        });
    }

    static getFrozenIpRoleid(ip: any, callback: (code: number, rows: any) => void) {
        var sql = `SELECT accountid FROM qy_account WHERE login_ip = '${ip}';`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, []);
                return;
            }
            if (rows.length == 0) {
                callback(MsgCode.FAILED, []);
                return;
            }
            let accounts = '';
            for (const id of rows) {
                accounts = accounts + id.accountid + ',';
            }
            accounts = accounts.substr(0, accounts.length - 1);
            sql = `SELECT roleid FROM qy_role WHERE accountid IN (${accounts});`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    SKLogger.warn(`SQL错误[${sql}]:${error}`);
                    callback(MsgCode.FAILED, []);
                    return;
                }
                if (rows.length == 0) {
                    callback(MsgCode.FAILED, []);
                    return;
                }
                callback(MsgCode.SUCCESS, rows);
            });
        });
    }

    static freezeIP = (accountid: any, callback: any) => {
        var sql = `SELECT login_ip FROM qy_account WHERE accountid = '${accountid}';`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED);
                return;
            }
            if (rows.length == 0) {
                callback(MsgCode.FAILED);
                return;
            }
            let fip = rows[0].login_ip;
            sql = `SELECT * FROM ip_frozen WHERE frozen_ip = '${fip}';`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback(MsgCode.FAILED);
                    return;
                }
                if (rows.length > 0) {
                    callback(MsgCode.SUCCESS, 0);
                    return;
                }
                sql = `INSERT INTO ip_frozen(account_id, frozen_ip, frozen_time) VALUES('${accountid}', '${fip}', NOW());`;
                DB.query(sql, (error: any, rows: any) => {
                    if (error) {
                        SKLogger.warn(`SQL错误[${sql}]:${error}`);
                        callback(MsgCode.FAILED);
                        return;
                    }
                    callback(MsgCode.SUCCESS, fip);
                });
            });
        });
    }

    static getFrozenMacList = (callback: any) => {
        let sql = `SELECT mac FROM mac_frozen;`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, []);
                return;
            }
            if (rows && rows.length == 0) {
                callback(MsgCode.FAILED, []);
                return;
            }
            callback(MsgCode.SUCCESS, rows);
        });
    }

    static clearFrozenMacTabel(callback: (code: number, rows: any) => void) {
        let sql = `TRUNCATE mac_frozen;`
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, null);
                return;
            }
            callback(MsgCode.SUCCESS, rows);
        });
    };

    static getFrozenMacRoleid(mac: string, callback: (code: number, rows: any) => void) {
        var sql = `SELECT accountid FROM qy_account WHERE mac = '${mac}';`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                SKLogger.warn(`SQL错误[${sql}]:${error}`);
                callback(MsgCode.FAILED, []);
                return;
            }
            if (rows.length == 0) {
                callback(MsgCode.FAILED, []);
                return;
            }
            let accounts = '';
            for (const id of rows) {
                accounts = accounts + id.accountid + ',';
            }
            accounts = accounts.substr(0, accounts.length - 1); //.splice(-1);
            sql = `SELECT roleid FROM qy_role WHERE accountid in (${accounts});`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback(MsgCode.FAILED, []);
                    return;
                }
                if (rows.length == 0) {
                    callback(MsgCode.FAILED, []);
                    return;
                }
                callback(MsgCode.SUCCESS, rows);
            });
        });
    }
    // 封设备
    static freezeMAC = (info: any, callback: (code: number, msg: string, mac: string) => void) => {
        let account_id = info.account_id;
        let gm_role_id = info.gm_role_id;
        let sql = `SELECT mac FROM qy_account WHERE accountid = '${account_id}';`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, `帐号${account_id}查询封禁MacSQL错误!`, "");
                return;
            }
            if (rows.length < 1) {
                callback(MsgCode.FAILED, `帐号${account_id}已被封禁Mac!`, "");
                return;
            }
            let mac = rows[0].mac;
            sql = `SELECT * FROM mac_frozen WHERE mac = '${mac}';`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback(MsgCode.FAILED, `帐号${account_id}查询封禁Mac已存在!`, "");
                    return;
                }
                if (rows.length > 0) {
                    callback(MsgCode.FAILED, `帐号${account_id}已封禁Mac!`, mac);
                    return;
                }
                sql = `INSERT INTO mac_frozen(account_id,mac,gm_role_id) VALUES('${account_id}','${mac}','${gm_role_id}');`;
                DB.query(sql, (error: any, rows: any) => {
                    if (error) {
                        callback(MsgCode.FAILED, `帐号${account_id}插入封禁Mac,SQL错误!`, mac);
                        return;
                    }
                    callback(MsgCode.SUCCESS, `帐号${account_id}封禁Mac成功!`, mac);
                });
            });
        });
    }
    // 解封帐号
    static unfreezeMAC = (info: any, callback: (code: number, msg: string, mac: string) => void) => {
        let account_id = info.account_id;
        let sql = `SELECT mac FROM qy_account WHERE accountid = '${account_id}';`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, `帐号${account_id}解封Mac,SQL错误!`, "");
                return;
            }
            if (rows.length < 1) {
                callback(MsgCode.FAILED, `帐号${account_id}已解封!`, "");
                return;
            }
            let mac = rows[0].mac;
            let sql = `DELETE FROM mac_frozen WHERE account_id = '${account_id}';`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback(MsgCode.FAILED, `帐号${account_id}解禁Mac,SQL错误!`, mac);
                    return;
                }
                callback(MsgCode.SUCCESS, `帐号${account_id}解禁Mac成功!`, mac);
            });
        });
    }

    static getServerListByAccountId(accountid: any, callback: (code: number, rows: any) => void) {
        let sql = `SELECT * FROM qy_role WHERE accountid = ${accountid};`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, null);
                return;
            }
            callback(MsgCode.SUCCESS, rows);
        });
    }
    // 插入角色
    static insertRole(roleInfo: any, callback: (code: number, roleId: number) => void) {
        let roleName = SKDataUtil.checkMYSQL(roleInfo.name);
        let sql = `SELECT * FROM qy_role WHERE (accountid = '${roleInfo.accountid}' OR hex(name) = hex('${roleName}')) AND serverid = '${roleInfo.serverid}';`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, 0);
                return;
            }
            if (rows.length > 0) {
                if (rows[0].name == roleInfo.name) {
                    SKLogger.warn(`创建角色:[${roleInfo.accountid}:${roleInfo.name}]已存在`);
                    callback(MsgCode.ROLE_NAME_EXIST, rows[0].roleid);
                    return;
                } else {
                    SKLogger.warn(`创建角色:[${roleInfo.accountid}:${rows[0].name}]最多一个角色`);
                    callback(MsgCode.FAILED, rows[0].roleid);
                    return;
                }
            }
            if (rows.length == 0) {
                let titles = `{"onload":false,"titles":[{"type":"0","titleid":"30","value":"","onload":true}]}`;
                sql = `INSERT INTO qy_role(name, race, day_count, sex, level, resid, mapid, x, y, create_time, accountid,serverid,money,taskstate,title) VALUES('${roleInfo.name}', '${roleInfo.race}', '{}', '${roleInfo.sex}',1,'${roleInfo.resid}',1010,-1,-1, NOW(),'${roleInfo.accountid}','${roleInfo.serverid}',0,'[]','${titles}');`;
                DB.query(sql, function (error: any, rows: any) {
                    if (error) {
                        callback(MsgCode.FAILED, 0);
                        return;
                    }
                    if (rows.length < 1) {
                        SKLogger.warn(`创建角色:[${roleInfo.accountId}:${roleInfo.name}]不能多于一个!`);
                        callback(MsgCode.FAILED, 0);
                        return;
                    }
                    let role = Sql.getrole(roleInfo);
                    role.title = titles;
                    role.roleid = rows.insertId;
                    sql = `SELECT safecode FROM qy_account WHERE accountid = '${roleInfo.accountid}'`;
                    DB.query(sql,(error: any, rows: any)=>{
                        if(error == MsgCode.SUCCESS){
                            if(rows.length > 0){
                                role.safecode = rows[0].safecode;
                            }
                        }
                    });
                    callback(MsgCode.SUCCESS, role.roleid);
                });
            }
        })
    }
    // 改名
    static changeName(info: any, callback: any) {
        let sql = `SELECT * FROM qy_role WHERE hex(name) = hex('${info.name}');`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED);
                return;
            }
            if (rows.length > 0) {
                callback(MsgCode.ROLE_NAME_EXIST);
                return;
            }
            if (rows.length == 0) {
                //new SKMongoUtil(DbName.Role).where({roleid: info.roleid}).data({$set:{name: info.name}}).updateOne();
                let sql = `UPDATE qy_role SET name='${info.name}' WHERE roleid=${info.roleid};`;
                DB.query(sql, (error: any, rows: any) => {
                    if(error){
                        callback(MsgCode.FAILED);
                    }
                    callback(MsgCode.SUCCESS);
                });
            }
        })
    }
    // 更新最新登录时间
    static updateLastOnlineTime(roleid: any) {
        //new SKMongoUtil(DbName.Role).where({roleid: roleid}).data({$set:{lastonline: GTimer.format()}}).updateOne((err,res)=>{
           // err && SKLogger.warn(`更新玩家登录时间失败roleid=${roleid}`)
       // });
        let sql = `UPDATE qy_role SET lastonline=NOW() WHERE roleid=${roleid};`;
        DB.query(sql, (error: any, rows: any) => {
            error && SKLogger.warn(`更新玩家登录时间失败roleid=${roleid}`)
        })
    }

    static loginByRoleidMini(roleid: any, callback: (code: number, data: any) => void) {
        let sql = `SELECT qy_account.safecode, qy_role.* FROM qy_account, qy_role WHERE qy_role.roleid = ${roleid} AND qy_account.accountid = qy_role.accountid;`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, null);
                return;
            }
            if (rows.length > 0) {
                callback(MsgCode.SUCCESS, rows[0])
            } else {
                callback(MsgCode.FAILED, null);
            }
        });
    }

    // 登录角色
    static loginByRoleid(roleid: any, callback: (code: number, data: any) => void) {
        // new SKMongoUtil(DbName.Role).where({roleid: roleid}).find((err, res)=>{
        //     if(!err && res){
        //         let data = res;
        //         let step = 0;
        //         let times = SKTimeUtil.delay(()=>{
        //             SKLogger.warn(`[Mongo]玩家加载数据超时, 清理缓存`);
        //             DB.removePlayerMongo(roleid);
        //         },5 * 1000);
        //         let next = ()=>{
        //             if(++step >= 6){
        //                 SKTimeUtil.cancelDelay(times);
        //                 callback(MsgCode.SUCCESS, data);
        //             }
        //         };
        //         new SKMongoUtil(DbName.Equip).where({RoleID: roleid, state: 1}).findArray((err, res)=>{
        //             if(err){
        //                 SKLogger.warn(`[Mongo]玩家加载装备失败`);
        //                 return;
        //             }else{
        //                 data.equipRows = res;
        //             }
        //             next();
        //         });
        //         new SKMongoUtil(DbName.Hose).where({role_id: roleid}).findArray((err, res)=>{
        //             if(err){
        //                 SKLogger.warn(`[Mongo]玩家加载坐骑失败`);
        //                 return;
        //             }
        //             data.horseRows = res;
        //             next();
        //         });
        //         new SKMongoUtil(DbName.HoseSkill).where({role_id: roleid}).findArray((err, res)=>{
        //             if(err){
        //                 SKLogger.warn(`[Mongo]玩家加载坐骑技能失败`);
        //                 return;
        //             }
        //             data.horseSkillRows = res;
        //             next();
        //         });
        //         new SKMongoUtil(DbName.Pet).where({roleid: roleid, state: 1}).findArray((err, res)=>{
        //             if(err){
        //                 SKLogger.warn(`[Mongo]玩家加载宠物失败`);
        //                 return;
        //             }
        //             data.petRows = res;
        //             next();
        //         });
        //         new SKMongoUtil(DbName.Marry).where({id: data.marryid, status:1}).find((err, res)=>{
        //             if(err){
        //                 SKLogger.warn(`[Mongo]玩家加载结婚失败`);
        //                 return;
        //             }
        //             res && res.status && (data.marry = res);
        //             next();
        //         });
        //         new SKMongoUtil(DbName.Tiance).where({roleid: roleid, state: 1}).findArray((err, res)=>{
        //             if(err){
        //                 SKLogger.warn(`[Mongo]玩家加载天策失败`);
        //                 return;
        //             }
        //             res && (data.tiancedata = res);
        //             next();
        //         });
        //         return;
        //     }


            let sql = `SELECT qy_account.safecode, qy_role.* FROM qy_account, qy_role WHERE qy_role.roleid = ${roleid} AND qy_account.accountid = qy_role.accountid;`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback(MsgCode.FAILED, null);
                    return;
                }
                if (rows.length > 0) {
                    let data = rows[0];
                   // new SKMongoUtil(DbName.Role).data(data).insertOne();

                    sql = `SELECT * FROM qy_equip WHERE RoleID=${roleid} AND state='1';`;
                    sql += `SELECT * FROM dhxy_horse WHERE role_id=${roleid};`;
                    sql += `SELECT * FROM dhxy_horse_skill WHERE role_id=${roleid};`;
                    sql += `SELECT * FROM qy_pet WHERE roleid=${roleid} and state=1;`;
                    sql += `SELECT * FROM qy_marry WHERE status=1 AND id=${data.marryid};`;
                    sql += `SELECT * FROM qy_tiance WHERE roleid=${roleid} AND state=1;`;
                    DB.query(sql, (error: any, rows: any) => {
                        if (error) {
                            SKLogger.warn(`角色读档错误 ${roleid}  ${error}`);
                            callback(MsgCode.FAILED, data);
                            return;
                        }
                        data.equipRows = rows[0];
                        data.horseRows = rows[1];
                        data.horseSkillRows = rows[2];
                        data.petRows = rows[3];
                        let marry = rows[4];
                        data.tiancedata = rows[5];

                       // new SKMongoUtil(DbName.Equip).data(data.equipRows).insertMany();
                       // new SKMongoUtil(DbName.Hose).data(data.horseRows).insertMany();
                       // new SKMongoUtil(DbName.HoseSkill).data(data.horseSkillRows).insertMany();
                       // new SKMongoUtil(DbName.Pet).data(data.petRows).insertMany();
                      //  new SKMongoUtil(DbName.Tiance).data(data.tiancedata).insertMany();
                        if(marry && marry.length>0){
                            data.marry = rows[4][0];
                            //new SKMongoUtil(DbName.Marry).data(data.marry).insertOne();
                        }
                        callback(MsgCode.SUCCESS, data);
                    });
                } else {
                    callback(MsgCode.FAILED, null);
                }
            });
       // })
    };

    //获取角色
    static getRoleByRoleId(roleid: any, callback: any) {
        //new SKMongoUtil(DbName.Role).where({roleid: roleid}).find((err, res)=>{
            //if(!err && res){
               // callback(MsgCode.SUCCESS, res);
               // return;
           // }
            let sql = `SELECT * FROM qy_role WHERE roleid = ${roleid};`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback(MsgCode.FAILED);
                    return;
                }
                if (rows.length <= 0) {
                    callback(MsgCode.FAILED);
                    return;
                }
                let roleinfo = rows[0];
                callback(MsgCode.SUCCESS, roleinfo);
            });
        //})
    }
    static savePlayerInfo(roleid: any, roleInfo: any, callback: (code: number, msg: string) => void) {
        roleInfo.addpoint = SKDataUtil.toJson(roleInfo.addpoint);
        roleInfo.bagitem = SKDataUtil.toJson(roleInfo.bagitem);
        roleInfo.taskstate = SKDataUtil.toJson(roleInfo.taskstate);
        roleInfo.lockeritem = SKDataUtil.toJson(roleInfo.lockeritem);
        roleInfo.skill = SKDataUtil.toJson(roleInfo.skill);
        roleInfo.relivelist = SKDataUtil.toJson(roleInfo.relivelist);
        roleInfo.xiupoint = SKDataUtil.toJson(roleInfo.xiupoint);
        roleInfo.shuilu = SKDataUtil.toJson(roleInfo.shuilu);
        roleInfo.color = SKDataUtil.toJson(roleInfo.color);
        roleInfo.friendlist = SKDataUtil.toJson(roleInfo.friendlist);
        roleInfo.day_count = SKDataUtil.toJson(roleInfo.day_count);
        roleInfo.skins = SKDataUtil.toJson(roleInfo.skins);
        roleInfo.tiance = SKDataUtil.toJson(roleInfo.tiance);
        roleInfo.bagua = SKDataUtil.toJson(roleInfo.bagua);
        roleInfo.getgift = SKDataUtil.toJson(roleInfo.getgift);
        roleInfo.bianshen = SKDataUtil.toJson(roleInfo.bianshen);
        roleInfo.roleid = roleid;

        // new SKMongoUtil(DbName.Role).where({roleid: roleid}).data({$set: roleInfo}).updateOne((err, res)=>{
        //     if (err) {
        //         SKLogger.warn(`[Mongo]保存用户数据失败roleid=${roleInfo}`)
        //     }
        // });

        let tables = [
            'name','resid','race','sex','relive','relivelist','level','level_reward','exp','day_count','money',
            'jade','mapid','x','y','bangid','color','star','shane','addpoint','xiupoint','xiulevel','title',
            'skill','bagitem','lockeritem','partner','pet','getpet','equiplist','taskstate','partnerlist',
            'chargesum','rewardrecord','getgift','shuilu','active_scheme_name','friendlist','horse_index',
            'day_gift','lastonlinew','skins', 'marryid', 'tiance', 'bagua', 'bianshen', 'yuanshenlevel'
        ];
        let vals:any = [];
        for (const key of tables) {
            if(roleInfo[key]){
                vals.push(`${key}='${roleInfo[key]}'`)
            }
        }
        vals = vals.join(',');
        let sql = `UPDATE qy_role SET ${vals} WHERE roleid=${roleInfo.roleid};`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, `roleid=[${roleInfo.roleid}] 保存到mysql失败 ${sql}`);
                return;
            }
            if(rows.affectedRows == 0){
                callback(MsgCode.FAILED, '');
                return;
            }
            callback(MsgCode.SUCCESS, '');
        });
    }


    // 更新帮派数据
    static updateBang(bangInfo: any, callback: (code: MsgCode) => void) {
        //new SKMongoUtil(DbName.Bang).where({bangid: bangInfo.bangid}).data({$set: {rolenum: bangInfo.rolenum}}).updateOne((err, res)=>{
            //callback(err ? MsgCode.FAILED : MsgCode.SUCCESS)
       // })
       let sql = `UPDATE qy_bang SET rolenum=${bangInfo.rolenum} WHERE bangid=${bangInfo.bangid};`
       DB.query(sql, (error, _rows) => {
           if (error) {
               callback(MsgCode.FAILED);
               return;
           }
           callback(MsgCode.SUCCESS);
       });
    }

    //更新帮派权重  redis
    static updateBangBidding(bangid: any, bidding: any) {
        //new SKMongoUtil(DbName.Bang).where({bangid: bangid}).data({$set: {bidding: bidding}}).updateOne((err, res)=>{
           // err && SKLogger.warn(`bangid=[${bangid}] 更新帮派权重失败`);
      //  });
        let sql = `UPDATE qy_bang SET bidding = ${bidding} WHERE bangid =${bangid};`;
        DB.query(sql, (error: any, rows: any) => {});
    }

    //删除帮派  redis
    static deleteBang(bangid: any) {
        //new SKMongoUtil(DbName.Bang).where({bangid: bangid}).deleteOne((err, res)=>{
           // err && SKLogger.warn(`[Mongo]删除帮派失败`);
       // });
       let sql = `DELETE FROM qy_bang WHERE bangid =${bangid};`;
        DB.query(sql, (error: any, _rows: any) => {
            error && SKLogger.warn(`bangid=[${bangid}] 保存到mysql失败 ${sql}`);
        });
    }

    //获取帮派列表  redis
    static getBangList(callback: any) {
        let sql = `SELECT * FROM qy_bang WHERE state = 1 and serverid = ${GameUtil.serverId};`;
        DB.query(sql, (error, rows) => {
            if (error) {
                callback(MsgCode.FAILED);
                return;
            }
            callback(MsgCode.SUCCESS, rows);
        });
        // let ids:any = [];
        // let db = new SKMongoUtil(DbName.Bang);
        // db.where({serverid: GameUtil.serverId, state:1}).findArray((err, res)=>{
        //     if(err){
        //         SKLogger.warn(`[Mongo]读取帮派列表失败`);
        //         callback(MsgCode.FAILED);
        //         return;
        //     }
        //     if(res && res.length>0){
        //         for (let bang of res) {
        //             ids.push(bang.bangid)
        //         }
        //     }
        //     let sql = `SELECT * FROM qy_bang WHERE serverid = ${GameUtil.serverId} AND state=1`;
        //     ids.length>0 && (sql+=` AND bangid NOT IN (${ids.join(',')})`);
        //     DB.query(`${sql};`, (error: any, rows: any) => {
        //         if (error) {
        //             callback(MsgCode.FAILED);
        //             return;
        //         }
        //         db.data(rows).insertMany();
        //         callback(MsgCode.SUCCESS, res && res.length>0 ? rows.concat(res) : rows);
        //     });
        // });
    }

    //获取帮派角色  查redis和mysql
    static getBangRoles(callback: any) {
        // let tlist: any = {};
        // let ids: any[] = [];
        // new SKMongoUtil(DbName.Role).where({serverid: GameUtil.serverId, bangid: {$gt: 0}}).findArray((err, res)=>{
        //     if (err) {
        //         SKLogger.debug(err);
        //         callback(MsgCode.FAILED);
        //         return;
        //     }
        //     for (const info of res) {
        //         tlist[info.bangid] || (tlist[info.bangid]=[]);
        //         tlist[info.bangid].push(info);
        //         ids.push(info.bangid);
        //     }
        //     let sql = `SELECT roleid, name, resid, relive, level, race, sex, bangid FROM qy_role WHERE bangid > 0 AND serverid = ${GameUtil.serverId} `;
        //     ids.length>0 && (sql += `AND roleid NOT IN (${ids.join(',')})`);
        //     DB.query(sql + `;`, (error: any, rows: any) => {
        //         if (error) {
        //             SKLogger.debug(error.sqlMessage);
        //             callback(MsgCode.FAILED);
        //             return;
        //         }
        //         for (const info of rows) {
        //             tlist[info.bangid] || (tlist[info.bangid]=[]);
        //             tlist[info.bangid].push(info);
        //         }
        //         callback(MsgCode.SUCCESS, tlist);
        //     });
        // });
        let sql = `SELECT roleid, name, resid, relive, level, race, sex, bangid FROM qy_role WHERE bangid > 0 AND serverid = ${GameUtil.serverId} `;
            DB.query(sql, (error, rows) => {
                if (error) {
                    callback(MsgCode.FAILED);
                    return;
                }
                let tlist = {};
                for (const info of rows) {
                    if (tlist[info.bangid] == null) {
                        tlist[info.bangid] = [];
                    }
                    tlist[info.bangid].push(info);
                }
                callback(MsgCode.SUCCESS, tlist);
            });
    }

    //更新玩家帮派id redis
    static updatePlayerBangID(roleid: any, bangid: any, callback: any) {
        // new SKMongoUtil(DbName.Role).where({roleid: roleid}).data({$set:{bangid: bangid}}).updateOne((err, res)=>{
        //     if(err){
        //         SKLogger.warn(`[Mongo]更新玩家帮派ID失败`);
        //         callback(MsgCode.FAILED);
        //         return
        //     }
        //     callback(MsgCode.SUCCESS);
        // })
        let sql = `UPDATE qy_role SET bangid = ${bangid} WHERE roleid = ${roleid}`;
        DB.query(sql, (error: any, _rows: any) => {
            if (error) {
                callback(MsgCode.FAILED);
                return;
            }
        });
    }

    //创建帮派  redis
    static createBang(bangInfo: any, callback: (code: number, rows: any) => void) {
        bangInfo.serverid = GameUtil.serverId;
        let sql = `INSERT INTO qy_bang(name, aim, masterid, mastername, createtime, state, serverid) 
            VALUES('${bangInfo.name}', '${bangInfo.aim}','${bangInfo.masterid}','${bangInfo.mastername}', NOW(), 1, ${bangInfo.serverid});`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                SKLogger.warn(`创建帮派失败${error.sqlMessage}`);
                SKLogger.warn(sql);
                callback(MsgCode.FAILED, null);
                return;
            }
            if (rows.length == 0) {
                callback(MsgCode.FAILED, null);
                return;
            }
            bangInfo.bangid = rows.insertId;
            bangInfo.state = 1;
            //new SKMongoUtil(DbName.Bang).data(bangInfo).insertOne();
            callback(MsgCode.SUCCESS, rows.insertId);
        });
    }

    //创建宠物  redis
    static createPet(petInfo: any, callback: any) {
        let sql = `INSERT INTO qy_pet(name, shenskill, skill, locks, resid, dataid, grade, roleid, rate, hp, mp, atk, spd, wuxing, create_time) VALUES('${petInfo.name}', '${petInfo.shenskill}', '${petInfo.skill}', '${petInfo.lock}', ${petInfo.resid}, ${petInfo.dataid}, ${petInfo.grade}, ${petInfo.roleid}, ${petInfo.rate}, ${petInfo.hp}, ${petInfo.mp}, ${petInfo.atk}, ${petInfo.spd}, '${petInfo.wuxing}', NOW());`;
        DB.query(sql, async (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED,{});
                return;
            }
            let pet = Sql.getpet(petInfo);
            pet.petid = rows.insertId;
            pet.state = 1;

           // new SKMongoUtil(DbName.Pet).data(pet).insertOne();
            callback(MsgCode.SUCCESS,pet.petid);
        });
    }
    // 获得召唤兽列表   redis
    static getPetList(roleid: any, callback: (code: number, rows: any[]) => void) {
       // new SKMongoUtil(DbName.Pet).where({roleid:roleid, state:1}).limit(GameUtil.limitPetNum).findArray((err, res)=>{
          //  if(res && res.length>0){
              //  callback(MsgCode.SUCCESS, res);
                //return;
           // }
            let sql = `SELECT * FROM qy_pet WHERE roleid = ${roleid} and state = 1 limit ${GameUtil.limitPetNum};`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback(MsgCode.FAILED, null);
                    return;
                }
                callback(MsgCode.SUCCESS, rows);
            });
       // });
    }

    // 彻底删除召唤兽   redis
    static removePet(petid: number, roleId: number) {
        let sql = `DELETE FROM qy_pet WHERE petid =${petid} AND roleid=${roleId};`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                SKLogger.warn(`SQL错误[${sql}]:${error}`);
                return;
            }
            //new SKMongoUtil(DbName.Pet).where({roleid:roleId, petid:petid}).deleteOne();
        });
    }
    // 临时删除召唤兽   redis
    static delPet(petid: number, roleId: number, callback: (code: number) => void) {
       // new SKMongoUtil(DbName.Pet).where({roleid:roleId, petid:petid}).deleteOne((err, res)=>{
           // if(err){
              //  SKLogger.warn(`[Mongo]删除宠物失败`)
               // callback(MsgCode.FAILED);
               // return;
           // }
           let sql = `DELETE FROM qy_pet WHERE petid =${petid} AND roleid=${roleId};`;
            DB.query(sql, (error: any, rows: any) => {
                error ? callback(MsgCode.FAILED) : (callback(MsgCode.SUCCESS), SKLogger.warn(`删除宠物失败`))
            });
      //  });
    }

    //保存召唤兽    redis
    static savePet(pet: Pet,callback: (code: number,msg: any) => void){
        let data = pet.toSaveObj();
       // new SKMongoUtil(DbName.Pet).where({petid:pet.petid}).data({$set: data}).updateOne();

        let tables = [
            'name','relive','level','color','grade','fly','qinmi','locks','shenskill','skill','ppoint','dpoint','rate','hp','mp','atk',
            'spd','wuxing','exp','xexp','xlevel','longgu','control','dataid', 'roleid'
        ];
        let vals:any = [];
        for (const key of tables) {
            if(data[key]){
                vals.push(`${key}='${data[key]}'`)
            }
        }
        vals = vals.join(',');
        let sql = `UPDATE qy_pet SET ${vals} WHERE petid=${pet.petid};`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                SKLogger.warn(`宠物=[${pet.petid}] 保存到mysql失败 ${error}`);
                callback&&callback(MsgCode.FAILED, '保存宝宝失败');
                return
            }
            callback&&callback(MsgCode.SUCCESS, '')
        });
    }

    //保存召唤兽    redis
    static savePetMysql(pet: Pet,callback: (code: number,msg: any) => void){
        let data = pet.toSaveObj();
        let tables = [
            'name','relive','level','color','grade','fly','qinmi','locks','shenskill','skill','ppoint','dpoint','rate','hp','mp','atk',
            'spd','wuxing','exp','xexp','xlevel','longgu','control','dataid', 'roleid'
        ];
        let vals:any = [];
        for (const key of tables) {
            if(data[key]){
                vals.push(`${key}='${data[key]}'`)
            }
        }
        vals = vals.join(',');
        let sql = `UPDATE qy_pet SET ${vals} WHERE petid=${pet.petid};`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                SKLogger.warn(`宠物=[${pet.petid}] 保存到mysql失败 ${error}`);
            }
        });
    }

    //创建装备  redis
    static createEquip(roleid: any, equiparr: any, callback: (code: MsgCode,data:any) => void) {
        let equipdata = EquipMgr.shared.getInsertData(equiparr, roleid);
        let sql = `INSERT INTO qy_equip(${equipdata.fieldstr}) VALUES(${equipdata.valuestr});`;
        DB.query(sql, async (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED,{});
                return;
            }
            equiparr.EquipID = rows.insertId;
            equiparr.RoleID = roleid;
            equiparr.state = 1;
            //new SKMongoUtil(DbName.Equip).data(equiparr).insertOne();
            callback(MsgCode.SUCCESS,rows);
        });
    }

    //通过ID获取装备    redis
    static getEquipByEquipID(equipid: any, callback: any) {
        //new SKMongoUtil(DbName.Equip).where({EquipID: equipid}).find((err, res)=>{
            //if(!err && res){
               // callback(MsgCode.SUCCESS, res);
                //return;
           // }
            let sql = `SELECT * FROM qy_equip WHERE EquipID = ${equipid};`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback(MsgCode.FAILED);
                    return;
                }
                if (rows.length == 0) {
                    callback(MsgCode.FAILED);
                    return;
                }
               // new SKMongoUtil(DbName.Equip).data(rows[0]).insertOne();
                callback(MsgCode.SUCCESS, rows[0]);
            });
       // });

    }
    // 删除装备 redis
    static delEquip(equipid: number, roleId: number, callback: (code:any)=>void) {
        //new SKMongoUtil(DbName.Equip).where({EquipID: equipid, RoleID: roleId}).deleteOne((err)=>{
            //if(err){
               // SKLogger.warn(`[Mongo]删除装备失败`);
           // }
       // });
       let sql = `DELETE FROM qy_equip WHERE EquipID = '${equipid}' AND RoleID='${roleId}'`;
        DB.query(sql, (error: any, rows: any) => {
            callback(error ? MsgCode.FAILED : MsgCode.SUCCESS);
        });
    }

    //保存装备信息  redis
    static saveEquipInfo = (equipid: any, roleId: number, savedata: any, callback: any) => {
        savedata.RoleID = roleId;
        savedata.EquipID = equipid;
        //new SKMongoUtil(DbName.Equip).where({EquipID: equipid, RoleID: roleId}).data({$set: savedata}).updateOne((err)=>{
            //if(err){
                //SKLogger.warn(`[Mongo]更新装备失败`);
            //}
        //});
        let tables = ['pos', 'Grade', 'Shuxingxuqiu', 'GemCnt', 'refine', 'LianhuaAttr', 'BaseAttr', 'Type', 'EquipType', 'name', 'EIndex', 'RoleID'];
        let vals:any = [];
        for (const key of tables) {
            if(savedata[key])
                vals.push(`${key}='${savedata[key]}'`);
        }
        vals = vals.join(',');
        let sql = `UPDATE qy_equip SET ${vals} WHERE EquipID = '${equipid}' AND RoleID='${roleId}'`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                SKLogger.warn(`[Mysql]保存装备失败 ${sql}`);
                callback(MsgCode.FAILED);
                return;
            }
            callback(MsgCode.SUCCESS);
        });
    }

    static dbGETWX(callback: any) {
        let sql = `SELECT * FROM qy_wx`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                return
            }
            callback(true, rows);
        });
    }

    static getPet(roleid: any) {
        //new SKMongoUtil(DbName.Role).where({roleid: roleid}).data({$set:{getpet: 1}}).updateOne()
        let sql = `UPDATE qy_role SET getpet = 1 WHERE roleid =${roleid}`;
        DB.query(sql, (error: any, rows: any) => {});
    }

    /*
     * 创建订单
     * @param orderid 订单id
     * @param roleid 角色id
     * @param money 人民币
     * @param jade 仙玉
     * @param count 物品个数
     * @param goodsid 货物id
     * @param activitystates 充值活动的开启状态 
     * @param callback 回调
     */
    static createChargeOrder(orderid: any, roleid: any, money: any, jade: any, count: any, goodsid: any, activitystates: any, callback: any) {
        DB.getRoleByRoleId(roleid, (errcode: any, role: any) => {
            if (errcode == MsgCode.SUCCESS) {
                let server_id = role.serverid;
                if (activitystates[server_id] && activitystates[server_id].state == 1) { // 双倍活动 
                    jade *= 2;
                }
				let sql = `SELECT * FROM qy_account WHERE accountid='${role.accountid}' LIMIT 1`;
				DB.query(sql,(error: number, data: any) => {
					if(error){
						console.log(`读取邀请码失败`);
						callback(false);
						return;
					}
					let invite = data[0].invite;
					let sql = `insert into charge_record (orderid, roleid, money, jade, goodscount, goodsid, create_time, serverid, invite) values ('${orderid}', '${roleid}', '${money}', '${jade}', '${count}', '${goodsid}', NOW(), '${server_id}', '${invite}');`;
					
					DB.query(sql, (error: any, packet: any) => {
						if (error) {
							callback(false);
							return;
						}
						callback(true);
					});
					
				});
            } else
                callback(false);
        });
    };

    /*
     * 是否能完成订单
     * @param orderid 订单号
     */
    static canFinishOrder(sdorderno: string, sdpayno: string, money: string, callback: (code: MsgCode, row: any) => void) {
        let sql = `SELECT * FROM charge_record WHERE orderid='${sdorderno}' AND status=0;`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, null);
                return;
            }
            if (rows.length == 0) {
                SKLogger.warn(`未查询到有效订单${sdorderno}!`);
                callback(MsgCode.FAILED, null);
            } else {
                callback(MsgCode.SUCCESS, rows[0]);
            }
        });
    };

	static getOrderStatus(sdorderno: string, callback: any) {
		DB.query(`select * from charge_record where orderid = '${sdorderno}';`, (error: any, rows: any) => {
			if (error) {
	                callback(false);
	                return;
	            }
	            if (rows.length == 0) {
	                callback(false);
	                return;
	            }
			callback( rows[0].status == 1 )
		})
	};

    /*
     * 完成订单
     * @param orderid 订单号
     */
    static finishOrder(sdorderno: string, sdpayno: string, callback: any) {
        DB.query(`select * from charge_record where finish_time is null and orderid = '${sdorderno}';`, (error: any, rows: any) => {
            if (error) {
                SKLogger.warn(`完成订单${sdorderno}失败，查询订单错误！`);
                callback(false);
                return;
            }
            if (rows.length == 0) {
                SKLogger.warn(`完成订单${sdorderno}失败，未找到订单！`);
                callback(false);
            } else {
                let roleid = rows[0].roleid;
                let jade = rows[0].jade;
                let money = rows[0].money;
                let invite = rows[0].invite;
                DB.query(`update charge_record set finish_time = NOW(), realmoney = money, status = 1,sdpayno=${sdpayno} where orderid = '${sdorderno}' and finish_time is null;`, (error: any, packet: any) => {
                    if (error) {
                        SKLogger.warn(`完成订单${sdorderno}时失败！`);
                        callback(false);
                        return;
                    }
                    if (packet.affectedRows == 0) {
                        console.log(`完成订单${sdorderno}时失败！`);
                        callback(false);
                    } else {
                        let update = `UPDATE agent_admin_user SET todaymoney=todaymoney+'${money}', allmoney=allmoney+'${money}' WHERE invitecode='${invite}';`;
                        DB.query(update, (error: any) => {
                            if (error) {
                                SKLogger.warn(`订单${sdorderno}充值加金币失败！`);
                                callback(false);
                                return;
                            }
                            SKLogger.info(`玩家${roleid}充值${jade}仙玉成功，订单${sdorderno}！`);
                            callback(true);
                        });
                    }
                });
            }
        });
    };

    static setOrderFinish(sdorderno: string, sdpayno: string, total_fee: string, callback: any) {
        DB.query(`select * from charge_record where finish_time is null and orderid = '${sdorderno}';`, (error: any, rows: any) => {
            if (error) {
                SKLogger.warn(`完成订单${sdorderno}失败，查询订单错误！`);
                callback(false);
                return;
            }
            if (rows.length == 0) {
                SKLogger.warn(`完成订单${sdorderno}失败，未找到订单！`);
                callback(false);
            } else {
                let roleid = rows[0].roleid;
                let jade = rows[0].jade;
                let invite = rows[0].invite;
                let sql = `UPDATE charge_record SET finish_time = NOW(),realmoney =${total_fee},status=1,sdpayno='${sdpayno}' WHERE orderid = '${sdorderno}';`;
                DB.query(sql, (error: any, packet: any) => {
                    if (error) {
                        SKLogger.warn(`完成订单${sdorderno}时失败！`);
                        callback(false);
                        return;
                    }
                    if (packet.affectedRows == 0) {
                        console.log(`完成订单${sdorderno}时失败！`);
                        callback(false);
                    } else {
                        let update = `UPDATE agent_admin_user SET todaymoney=todaymoney+'${total_fee}', allmoney=allmoney+'${total_fee}' WHERE invitecode='${invite}';`;
                        DB.query(update, (error: any) => {
                            if (error) {
                                SKLogger.warn(`订单${sdorderno}充值加金币失败！`);
                                callback(false);
                                return;
                            }
                            SKLogger.info(`玩家${roleid}充值${jade}仙玉成功，订单${sdorderno}！`);
                            callback(true);
                        });
                    }
                });
            }
        });
    };

    static setNotice(text: any) {
        let sql = `UPDATE qy_info SET comment = '${text}';`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                return;
            }
        });
    }

    static setGuideServerID(id: any) {
        let sql = `UPDATE qy_info SET guideid = '${id}';`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                return;
            }
        });
    }

    static setShuilu(sid: any, lid: any) {
        let sql = `UPDATE qy_info SET shuilusid = ${sid}, shuilulid = ${lid};`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                return;
            }
        });
    }

    // 游戏内通知
    static getScrollNotice(serverid: number, limit: number, callback: any) {
        let sql = `SELECT text, type FROM qy_notice WHERE serverid = ${serverid} OR serverid = 0 ORDER BY time DESC LIMIT ${limit};`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(false);
                return;
            }
            callback(true, rows);
        });
    };

    static addScrollNotice(serverid: any, type: any, text: any, callback?: (success: boolean) => void) {
        let sql = `insert into qy_notice (text, type, serverid, time) values ('${text}', ${type}, ${serverid}, NOW());`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                if (callback) {
                    callback(false);
                }
                return;
            }
            if (callback) {
                callback(true);
            }
        });
    };
    /*
     * 创建关系（结拜，夫妻等） redis
     */
    static createRelation(sqlData: any, callback: any) {
        let sql = `insert into qy_relation (members, relationType, relationName, createTime,status) values ('${sqlData.members}', ${sqlData.relationType},'${sqlData.relationName}',  NOW(),${sqlData.status});`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED);
                return;
            }
            if (rows.length == 0) {
                callback(MsgCode.FAILED);
                return;
            }
            sqlData.relationId = rows.insertId;
            callback(MsgCode.SUCCESS, sqlData.relationId);
        });
    };

    //查询所有关系  redis
    static queryAllRelations(callback: any) {
        let sql = `SELECT * FROM qy_relation WHERE status=0`;
        DB.query(sql, function (error: any, rows: any) {
            if (error) {
                callback(MsgCode.FAILED, null);
                return;
            }
            callback(MsgCode.SUCCESS, rows);
        });

    }

    //删除关系  redis
    static deleteRelationById(sqlData: any, callback: any) {// status 0 正常 -1 已删除
        sqlData.deleteTime = SKDBUtil.toString(new Date());
        let sql = `insert into qy_relation (relationId, members, relationType, relationName, createTime,status,deleteTime) values (${sqlData.relationId},'${sqlData.members}', ${sqlData.relationType},'${sqlData.relationName}',  NOW(),${sqlData.status}, NOW());`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED);
                return;
            }
            if (rows.length == 0) {
                callback(MsgCode.FAILED);
                return;
            }
            callback(MsgCode.SUCCESS, rows.insertId);
        });
    }

    //更新关系成员  redis
    static updateRelationMembersById(info: any, callback: any) {
        let sql = `INSERT INTO qy_relation (relationId, members, relationType, relationName, createTime,status) VALUES (${info.relationId},'${info.members}', ${info.relationType},'${info.relationName}',  NOW(),${info.status});`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED);
                return;
            }
            if (rows.length == 0) {
                callback(MsgCode.FAILED);
                return;
            }
            callback(MsgCode.SUCCESS, rows.insertId);
        });
    }
    //获取关系  redis
    static getRelationById(id: any, callback: any) {
        let sql = `SELECT * FROM qy_relation WHERE relationId = ${id}`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(false);
                return;
            }
            callback(true, rows);
        });
    }

    //获取角色套装方案  redis
    static getSchemesByRoleId(id: any, callback: any) {
        //new SKMongoUtil(DbName.Scheme).where({roleId: id}).findArray((err, res)=>{
           // if(res && res.length > 0){
               // callback(MsgCode.SUCCESS, res);
               // return;
          //  }
            let sql = `select * from qy_scheme where roleId = ${id}`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback(false);
                    return;
                }
                //new SKMongoUtil(DbName.Scheme).data(rows).insertMany();
                callback(MsgCode.SUCCESS, rows);
            });
        //})
    }
    // 更新套装方案 redis
    static updateSchemeById(info: any, callback:(code:number,schemeId:number)=>void) {
        let sql = `INSERT INTO qy_scheme(roleId,schemeName,content,status) VALUES (${info.roleId},'${info.schemeName}','${info.content}',${info.status});`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED,error.sqlMessage);
                return;
            }
            info.schemeId = rows.insertId;
            //new SKMongoUtil(DbName.Scheme).data(info).insertOne();
            callback(MsgCode.SUCCESS, rows.insertId);
        });
    }

    //设置安全码    redis
    static setSafecode(accountid: any, safecode: any, callback: any) {
        let sql = `update qy_account set safecode = '${safecode}' where accountid = ${accountid};`;
        DB.query(sql, (error: any) => {
            if (error) {
                callback(MsgCode.FAILED);
                return;
            }
            callback(MsgCode.SUCCESS);
        });
    }

    //获取配置信息
    static getConfigInfo2(rows: any) {
        if (rows == null) {
            return;
        }
        let row = rows[0];
        if (row == null) {
            return;
        }
        if (row.comment) {
            GameUtil.serverConfig.comment = row.comment;
        } else {
            GameUtil.serverConfig.comment = '欢迎来到大话西游';
        }
        if (row.guideid) {
            GameUtil.serverConfig.guideServerID = row.guideid;
        }
    };
    // 获得公告
    static getComment(serverId: number, callback: (code: number, text: string) => void) {
        let sql = `SELECT * FROM dhxy_comment WHERE serverId=${serverId}`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED, "");
                return;
            }
            if (rows.length < 1) {
                callback(MsgCode.FAILED, "");
                return;
            }
            let text = rows[0].text;
            callback(MsgCode.SUCCESS, text);
        })
    }
    // 获得角色所在服务器索引
    static serverIdBy(roleId: number, callback: (serverId: number) => void) {
        let sql = `SELECT serverid FROM qy_role WHERE roleid='${roleId}';`;
        DB.query(sql, (error: Error, rows: any) => {
            if (error) {
                callback(-1);
                return;
            }
            let serverId = 1000;
            if (rows.length > 0) {
                let temp = rows[0].serverid;
                if (temp) {
                    serverId = parseInt(temp);
                }
            }
            callback(serverId);
        });
    }
    // 设置公告
    static setComment(serverId: number, text: string, callback: (code: number) => void) {
        let sql = `INSERT INTO dhxy_comment(serverId,text) VALUES(${serverId},'${text}') ON DUPLICATE KEY UPDATE text='${text}';`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED);
                return;
            }
            callback(MsgCode.SUCCESS);
        })
    }
    // 加仙玉   redis
    static addJade(roleId: number, jade: number, callback: Function) {
       // let db = new SKMongoUtil(DbName.Role).where({roleId: roleId});
       // db.find((err, res)=>{
           // if(!err && res){
              //  db.data({$set:{jade: res.jade + jade}}).updateOne();
           // }
      //  })
        let sql = `UPDATE qy_role SET jade=jade+${jade} WHERE roleId=${roleId};`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED);
            } else {
                callback(MsgCode.SUCCESS);
            }
        });
    }
    // 加经验   redis
    static addExp(roleId: number, exp: number, callback: (ret: any) => void) {
        //let db = new SKMongoUtil(DbName.Role).where({roleId: roleId});
       // db.find((err, res)=>{
           // if(!err && res){
               // db.data({$set:{exp: res.exp + exp}}).updateOne();
           // }
       // })
        let sql = `UPDATE qy_role SET exp=exp+${exp} WHERE roleId=${roleId};`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(MsgCode.FAILED);
            } else {
                callback(MsgCode.SUCCESS);
            }
        });
    }

    //代理充值
    static agentCharge(orderid: any, roleid: any, money: any, jade: any, count: number, goodsid: number, activitystates: any, callback: (code: number, msg: string, serverId: any) => void) {
        DB.getRoleByRoleId(roleid, (code: any, role: any, serverId: any) => {
            if (code == MsgCode.SUCCESS) {
                let server_id = role.serverid;
                if (activitystates[server_id] && activitystates[server_id].state == 1) { // 双倍活动 
                    jade *= 2;
                }
                let sql = `INSERT INTO charge_record (orderid,roleid,realmoney,jade,goodscount,goodsid,serverid,create_time,finish_time,status) VALUES ('${orderid}',${roleid}, ${money}, ${jade},${count},${goodsid},${server_id},NOW(),NOW(),1);`;
                DB.query(sql, (error: any, rows: any) => {
                    if (error) {
                        callback(MsgCode.FAILED, `代理充值失败,角色索引:${roleid},订单名:${orderid},钱数:${money},仙玉:${jade}`, server_id);
                        return;
                    }
                    callback(MsgCode.SUCCESS, `代理充值成功,角色索引:${roleid},订单名:${orderid},钱数:${money},仙玉:${jade}`, server_id);
                });
            }
        });
    };
    // 加入称谓 redis
    static addTitle(role_id: number, type: number, title_id: number, callback: (code: number, msg: string) => void) {
        new SKMongoUtil(DbName.Role).where({roleId: role_id}).find((err, res)=>{
            if(err){
                SKLogger.warn(`[Mongo]获取玩家失败`)
                callback(MsgCode.FAILED, `称谓保存失败,角色索引:${role_id},${type},${title_id}`);
                return;
            }
            let data: any = SKDataUtil.jsonBy(res.title);
            if (data) {
                for (let item of data.titles) {
                    if (item.type == type && item.title_id == title_id) {
                        callback(MsgCode.FAILED, `称谓已存在,角色索引:${role_id},${type},${title_id}`);
                        return;
                    }
                }
                let title = { "type": type, "titleid": title_id, "value": "", "onload": false };
                data.titles.push(title);
                let save = SKDataUtil.toJson(data);
                this.saveTitle(role_id, save, callback);
            }
        })
    }

    // 保存称谓 redis
    static saveTitle(role_id: number, titles: string, callback: (code: number, msg: string) => void) {
        let db = new SKMongoUtil(DbName.Role).where({roleId: role_id});
        db.find((err, res)=>{
            if(err){
                SKLogger.warn(`[Mongo]获取玩家失败`)
                callback(MsgCode.FAILED, `[Mongo]获取玩家失败`);
                return;
            }
            if(res){
                db.data({$set:{title: titles}}).updateOne();
                return;
            }
            let sql = `UPDATE qy_role SET title = '${titles}' WHERE roleid = ${role_id};`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback(MsgCode.FAILED, `称谓保存失败,角色索引:${role_id},${titles}`);
                    return;
                }
                callback(MsgCode.FAILED, `称谓保存成功,角色索引:${role_id},${titles}`);
            });
        })
    }
    //获得已兑换的列表  redis
    static getExchange(roleId: number, callback: (list: string[]) => void) {
        let sql = `SELECT * FROM qy_exchange WHERE roleid = ${roleId};`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback([]);
                return;
            }
            if (!rows || rows.length < 1) {
                callback([]);
                return;
            }
            callback(rows);
        });
    }
    // 保存已兑换   redis
    static saveExchange(roleId: number, code: string, callback: (code: number, msg: string) => void) {
        let sql = `INSERT INTO qy_exchange(roleid,code) VALUES('${roleId}','${code}');`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                callback(1, `玩家${roleId}保存兑换码[${code}]失败:${error}!`);
                return;
            }
            callback(0, `玩家${roleId}保存兑换码[${code}]成功!`);
        });
    }
    // 获得坐骑技能 redis
    static async getHorseSkill(roleId: number, callback: (code: number, rows: any) => void) {
       // new SKMongoUtil(DbName.HoseSkill).where({role_id: roleId}).sort({position:1}).findArray((err, res)=>{
            //if(res&&res.length>0){
               // callback(MsgCode.SUCCESS, res);
               // return;
           // }
            let sql = `SELECT * FROM dhxy_horse_skill WHERE role_id='${roleId}' ORDER BY position;`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback(MsgCode.FAILED, null);
                    return;
                }
               // new SKMongoUtil(DbName.HoseSkill).data(rows).insertMany();
                callback(MsgCode.SUCCESS, rows);
            });

      //  });
    }

    // 保存坐骑技能列表 redis
    static saveHorseSkillList(roleId: number, dict: { [key: number]: SkillBase }, callback: (error: any, rows: any[]) => void) {
        let sql = ``;
        for (let position in dict) {
            let skill = dict[position];
            if (skill) {
                let skillId = skill.skill_id;
                let exp = skill.exp;
                sql += `INSERT INTO dhxy_horse_skill(role_id,position,skill_id,exp) VALUES(${roleId},${position},${skillId},${exp}) ON DUPLICATE KEY UPDATE skill_id=${skillId},exp=${exp};`;
            }
        }
        if (sql.length < 1) {
            return;
        }
        DB.query(sql, callback);
        // let db = new SKMongoUtil(DbName.HoseSkill).where({role_id: roleId}).findArray((err, res)=>{
        //     let update = res && res.length>1;
        //     let sql = ``;
        //     for (let position in dict) {
        //         let skill = dict[position];
        //         if (skill) {
        //             let skillId = skill.skill_id;
        //             let exp = skill.exp;
        //             let _data = {
        //                 role_id: roleId,
        //                 position: position,
        //                 skill_id: skillId,
        //                 exp: exp,
        //             };
        //             db.where({role_id: roleId, position: position});
        //             update ? db.data({$set:_data}).updateOne() : db.data(_data).insertOne();
        //         }
        //     }
        // });

        // let sql = ``;
        // for (let position in dict) {
        //     let skill = dict[position];
        //     if (skill) {
        //         let skillId = skill.skill_id;
        //         let exp = skill.exp;
        //         db.where({role_id: roleId, position: position});
        //         sql += `INSERT INTO dhxy_horse_skill(role_id,position,skill_id,exp) VALUES(${roleId},${position},${skillId},${exp}) ON DUPLICATE KEY UPDATE skill_id=${skillId},exp=${exp};`
        //     }
        // }
        // if (sql.length < 1) {
        //     return;
        // }
        // DB.query(sql, callback);


    }
    // 获得坐骑列表 redis
    static async getHorseList(roleId: number, callback: (rows: any) => void) {
        // let db = new SKMongoUtil(DbName.Hose);
        // db.where({role_id: roleId}).findArray((err, res)=>{
        //     if (res&&res.length>0) {
        //         callback(res);
        //         return;
        //     }
            let sql = `SELECT * FROM dhxy_horse WHERE role_id=${roleId};`;
            DB.query(sql, (error: any, rows: any) => {
                if (error) {
                    callback([]);
                    return;
                }
                if (!rows || rows.length < 1) {
                    callback([]);
                    return;
                }
               // db.data(rows).insertMany();
                callback(rows);
            });
       // })
    }
    // 保存坐骑列表 redis
    static saveHorseList(roleId: number, dict: { [key: number]: Horse }, callback: (error: any, rows: any[]) => void) {
        //let db = new SKMongoUtil(DbName.Hose).where({role_id: roleId}).findArray((err, res)=>{
            //let update = res && res.length>1;
            let sql = ``;
            for (let position in dict) {
                let horse = dict[position];
                if (horse) {
                    let name = horse.name;
                    let level = horse.level;
                    let exp = horse.exp;
                    sql += `INSERT INTO dhxy_horse(role_id,position,name,level,exp) VALUES('${roleId}','${position}','${name}','${level}','${exp}') ON DUPLICATE KEY UPDATE name='${name}',level='${level}',exp='${exp}';`
                    let _data = {
                        name: name,
                        level: level,
                        exp: exp,
                        role_id: roleId,
                        position: position,
                    };
                   // db.where({role_id: roleId, position: position});
                   // update ? db.data({$set:_data}).updateOne() : db.data(_data).insertOne();
                }
            }
            if (sql.length < 1) {
                return;
            }
            DB.query(sql, callback);

        //});
    }

    // 写入异常日志
    static report(roleId: number, msg: string, platform: string, ip: string, version: string) {
        let sql = `INSERT INTO dhxy_report(role_id,msg,platform,ip,version) VALUES("${roleId}","${msg}","${platform}","${ip}","${version}");`;
        DB.query(sql, (error: any, rows: any) => {
            if (error) {
                return;
            }
        });
    }


    static FreezePlayer(accountid: any){
        let sql = `update qy_account set state = '1' where accountid = ${accountid}`;
		DB.query(sql, (ret:any, rows:any) => { });
    }


    //查询充值  redis
    static queryCharge( callback:(data: any)=>void ){
        
        let sql = `SELECT roleid, chargesum AS rmb FROM qy_role WHERE serverid = ${GameUtil.serverId};`;
        DB.query(sql + `;`,(error,rows)=>{
            if(error){
                SKLogger.warn(`语句错误 ${sql}`);
                callback([]);
                return;
            }
            callback(rows);
        });
    }

    //查询排行  redis
    static queryPaihang( callback:(data: any)=>void ){
        let sql = `SELECT roleid, name, relive, level, chargesum, jade, shuilu FROM qy_role WHERE serverid = ${GameUtil.serverId};`;
        DB.query(sql, (error,rows)=>{
            if(error){
                SKLogger.warn(`语句错误 ${sql}`);
                callback([]);
                return;
            }
            callback(rows);
        });
    }

    static saveBangZhanInfo(data: any){
        let sql = `INSERT INTO qy_bangzhan (${Object.keys(data).join(',')}) VALUES ('${Object.values(data).join('\',\'')}');`;
        DB.query(sql,(error,rows)=>{
            if(error){
                SKLogger.warn(`语句错误 ${sql}`);
                return;
            }
            SKLogger.info(`储存帮战信息 帮ID[${data.bangid}]`)
        });
    }
    static saveBang(bangid: any, data: any){
       // new SKMongoUtil(DbName.Bang).where({bangid: bangid}).data({$set: data}).updateOne();
        let vals:string[] = [];
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key))
                vals.push(`${key}='${data[key]}'`)
        }
        let sql = `UPDATE qy_bang SET ${vals.join(',')} WHERE bangid=${bangid};`;
        DB.query(sql,(error, rows :any)=>{
            (error || rows.affectedRows!=1) && SKLogger.warn(`更新帮派失败${sql}`);
        });
    }



    static createMarry(data: any, call:(error:any, id: any)=>void ){
        let sql = `INSERT INTO qy_marry (${Object.keys(data).join(',')}) VALUES ('${Object.values(data).join('\',\'')}');`;
        DB.query(sql,(error, rows :any)=>{
            error && SKLogger.warn(`储存结婚信息失败${sql}`);
            data.id = rows.insertId;
           // new SKMongoUtil(DbName.Marry).data(data).insertOne();
            call && call(error, rows.insertId);
        });
    }
    static saveMarry(id: number ,data: any, call:(error:any)=>void = null){
        //new SKMongoUtil(DbName.Marry).where({id: id}).data({$set: data}).updateOne();
        let vals:string[] = [];
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key))
                vals.push(`${key}='${data[key]}'`)
        }
        let sql = `UPDATE qy_marry SET ${vals.join(',')} WHERE id=${id};`;
        DB.query(sql,(error, rows :any)=>{
            (error || rows.affectedRows!=1) && SKLogger.warn(`更新结婚信息失败${sql}`);
            call&&call(error || rows.affectedRows!=1)
        });
    }


    static findMarryInfo(roleid: any, call:(error:any, rows: any)=>void){
       // new SKMongoUtil(DbName.Marry).where({$and:{status:1}, $or:{roleid1: roleid, roleid2: roleid}}).find((err, res)=>{
           // if(res){
               // call(MsgCode.SUCCESS ,res);
               // return;
         //   }
            let sql = `SELECT * FROM qy_marry WHERE status=1 AND (roleid1 = ${roleid} OR roleid2 = ${roleid});`;
            DB.query(sql,(error, rows :any)=>{
                if(error){
                    call(MsgCode.FAILED ,null);
                    return
                }
                if(rows.length == 0){
                    call(MsgCode.SUCCESS ,null);
                    return
                }
                call(MsgCode.SUCCESS ,rows[0])
            });
       // })

    }

    
    //刷新角色在线保存状态
    static updateRole(roleid: any, call?:(err: any, res:any)=>void){
        let db = new SKMongoUtil(DbName.Online).where({roleid: roleid});
        let data = {time: GameUtil.gameTime, roleid: roleid};
        db.find((err, res)=>{
            res ? db.data({$set:data}).updateOne(call) : db.data(data).insertOne(call)
        })
    }


    static getOnlines(time: number, call: (err:any, res:any)=>void){
        new SKMongoUtil(DbName.Online).where({time: {$lt: time}}).findArray(call);
    }

    static removePlayerMongo(roleid: any, call: Function = null){
        new SKMongoUtil(DbName.Role).where({roleid: roleid}).find((err, res)=>{
            if(err || !res){
                return
            }
            SKLogger.info(`[Mongo]释放玩家缓存[${roleid}:${res.name}]`);
            new SKMongoUtil(DbName.Role).where({roleid: roleid}).deleteOne();
            new SKMongoUtil(DbName.Equip).where({RoleID: roleid}).deleteMany();
            new SKMongoUtil(DbName.Hose).where({role_id: roleid}).deleteMany();
            new SKMongoUtil(DbName.HoseSkill).where({role_id: roleid}).deleteMany();
            new SKMongoUtil(DbName.Pet).where({roleid: roleid}).deleteMany();
            new SKMongoUtil(DbName.Scheme).where({roleId: roleid}).deleteMany();
            //new SKMongoUtil(DbName.Marry).where({id: res.marryid}).deleteOne();
            new SKMongoUtil(DbName.Online).where({roleid: roleid}).deleteOne();
        })
    }

    static marryRemove (marryid: number, roleid: any = null){
        if(roleid){
           // nw SKMongoUtil(DbName.Role).where({roleid: roleid}).find((err, res)=>{
                //!err && res && new SKMongoUtil(DbName.Role).where({roleid: roleid}).data({$set:{marryid:0}}).updateOne();
           // });
            let sql = `UPDATE qy_role SET marryid=0 WHERE roleid=${roleid};`;
            DB.query(sql, ()=>{});
        }
      //  new SKMongoUtil(DbName.Marry).where({id: marryid}).deleteOne();
    }



    static addTiance(data:any, call: Function){
        let sql = `INSERT INTO qy_tiance (${Object.keys(data).join(',')}) VALUES ('${Object.values(data).join('\',\'')}');`;
        DB.query(sql, (error, rows:any) => {
            if(error){
                return console.warn(`数据库添加天策符失败 ${sql}`);
            }
            data.id = rows.insertId; 
           // new SKMongoUtil(DbName.Tiance).data(data).insertOne();
            call(data);
        });
    }
    static saveTiance(data:any, call: Function = null){
       // new SKMongoUtil(DbName.Tiance).where({id: data.id}).data({$set: data}).updateOne();
        let vals:string[] = [];
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key))
                vals.push(`${key}='${data[key]}'`)
        }
        let sql = `UPDATE qy_tiance SET ${vals.join(',')} WHERE id=${data.id};`;
        DB.query(sql,(error, rows :any)=>{
            (error || rows.affectedRows!=1) && SKLogger.warn(`更新天策符失败${sql}`);
            call&&call(error || rows.affectedRows!=1)
        });


    }


}