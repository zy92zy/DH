import GameUtil from "../core/GameUtil";
import PlayerMgr from "../object/PlayerMgr";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import Log from "../../utils/Log";
import Player from "../object/Player";
import GFile from "../../utils/GFile";
import Marry from "./Marry";
import GTimer from "../../common/GTimer";
import DB from "../../utils/DB";

export default class MarryMgr {
    static shared = new MarryMgr();
    config: any;
    child_config: any;
    marry_list: any = {};

    /**结婚申请
     * {申请人id : {
     *      roleid: 申请人id,
     *      tager: 结婚对象ID,
     *      level: 婚戒等级 1-3,
     *      
     * 
     *      }
     * }
     * 
     * player.marry = {
     *      roleid: 结婚对象ID,
     *      name: 结婚对象昵称,
     *      level: 婚戒等级 1-3,
     * }
     * 
     */
    marry_apply:any = {};

    marry_level:any = {
        1: {
            itemid: 10014,
            name: '以爱之名（戒指）',
        },
        2: {
            itemid: 10015,
            name: '绝伦挚爱（戒指）',
        },
        3: {
            itemid: 10016,
            name: '山盟海誓（戒指）',
        },

    };
    childres: any = {
        1: [6158, 6160],
        2: [6159, 6161],
    }



    static saveAll(callback: (msg: string) => void){
        MarryMgr.shared.saveAll(),
        callback && callback('保存结婚信息')
    }


    constructor() {

    }


    init() {
		this.config = GameUtil.require_ex('../../conf/prop_data/prop_marry.json');
		this.child_config = GameUtil.require_ex('../../conf/prop_data/prop_child.json');

    }



    addMarryInfo(player:Player, data:any){
        if(!player.marryid || player.marryid == 0 || !data){
            return null;
        }
        if(this.marry_list[player.marryid]){
            return this.marry_list[player.marryid];
        }else{
            return this.marry_list[player.marryid] = new Marry(data);
        }
    }
    getMarryInfo(player:Player) :Marry{
        return player&&player.marryid>0 ? this.marry_list[player.marryid] : null;
    }

    saveMarryInfo(player:Player){}

    saveAll(){
        for (const key in this.marry_list) {
            if (Object.prototype.hasOwnProperty.call(this.marry_list, key)) {
                this.marry_list[key].save();
            }
        }

    }

    updatePlayerInfo(player:Player){
        let marry = this.getMarryInfo(player);
        if(!marry) {
            return;
        }
        if(player.roleid == marry.roleid1){
            marry.name1 = player.name;
            marry.resid1 = player.resid;
        }else{
            marry.name2 = player.name;
            marry.resid2 = player.resid;
        }
        marry.save();
    }

    /**结婚申请
     * data={
     *  roleid: 对象ID
     *  level: 婚礼等级
     *  type: 1=求婚  2=回应通过 3=拒绝
     * }
     * 
     */
    playerApply(player:Player, data: any){
        if(data.type==1){
            if(data.roleid == player.roleid){
                player.send('s2c_notice', {
                    strRichText: `不能和自己结婚哦`
                });
                return;
            }
            let tager = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
            if(!tager){
                player.send('s2c_notice', {
                    strRichText: `ID错误或玩家不在线`
                });
                return;
            }
            if(this.getMarryInfo(player)){
                player.send('s2c_notice', {
                    strRichText: `您已结婚`
                });
                return;
            }
            if(this.getMarryInfo(tager)){
                player.send('s2c_notice', {
                    strRichText: `对方已结婚`
                });
                return;
            }
            if(tager.battle_id>0){
                player.send('s2c_notice', {
                    strRichText: `对方正在战斗中`
                });
                return;
            }
            if(player.mapid != tager.mapid){
                player.send('s2c_notice', {
                    strRichText: `双方不在同一地图`
                });
                return;
            }
            if(player.sex == tager.sex){
                player.send('s2c_notice', {
                    strRichText: `同性是没办法结婚的哦!`
                });
                return;
            }
            let conf = this.marry_level[data.level];
            if(!conf){
                SKLogger.warn(`婚礼等级配置异常lv=${data.level}`);
                return;
            }
            if(player.getBagItemNum(conf.itemid) < 1){
                player.send('s2c_notice', {
                    strRichText: `缺少物品 ${conf.name}`
                });
                return;
            }
            player.addItem(conf.itemid, -1, true, "结婚");
            this.marry_apply[player.roleid] = data;
            player.send('s2c_marry_apply', {
                roleid: player.roleid,
                type: 1,
                msg: `向[${tager.name}]献上${conf.name}求婚，等待对方的答复吧`
            });
            tager.send('s2c_marry_apply', {
                roleid: player.roleid,
                type: 1,
                msg: `[${player.name}]向您求婚并献上了${conf.name},是否同意他的求婚?`
            });
        }else if(data.type==2){
            let tager = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
            if(!tager){
                player.send('s2c_marry_apply', {
                    roleid: player.roleid,
                    type: 1,
                    msg: `对方现在不在线啊，要不喊一下他`
                });
                return;
            }
            let marry_data = this.marry_apply[data.roleid];
            if(!marry_data || marry_data.roleid != player.roleid){
                player.send('s2c_marry_apply', {
                    roleid: player.roleid,
                    type: 1,
                    msg: `未找到求婚记录，他(她)是不是也跟其他人求婚了？`
                });
                return;
            }
            player.sex == 1 ? this.marryAgree(player, tager, marry_data.level) : this.marryAgree(tager, player, marry_data.level)
        }else if(data.type==3){
            let tager = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
            tager&&tager.send('s2c_marry_apply', {
                roleid: tager.roleid,
                type: 1,
                msg: `对方拒绝了您的求婚`
            });

        }
    }


    /**
     * player.marry = {
     *      roleid: 结婚对象ID,
     *      name: 结婚对象昵称,
     *      level: 婚戒等级 1-3,
     * }
     * 
     * @param player1 新郎
     * @param player2 新娘
     * @param level 婚戒等级
     */
    marryAgree(player1:Player, player2:Player, level: any){
        let data:any = {
            roleid1: player1.roleid,
            roleid2: player2.roleid,
            name1: player1.name,
            name2: player2.name,
            marry_lv: level,
            time: GTimer.format(),
            resid1: player1.resid,
            resid2: player2.resid,
        };
        let self = this;
        DB.createMarry(data, (error, id)=>{
            if(error){
                SKLogger.warn(`[${player1.roleid}:${player1.name}][${player2.roleid}:${player2.name}][lv=${level}]结婚失败`);
                return;
            }
            player1.marryid = player2.marryid = data.id = id;
            let marry = self.marry_list[id] = new Marry(data);

            player1.getPlayerData();
            player2.getPlayerData();
            marry.sendInfo();
        });

        player1.addTitle(GameUtil.titleType.CoupleTitle, GameUtil.relationType.Couple);
        player2.addTitle(GameUtil.titleType.CoupleTitle, GameUtil.relationType.Couple);
    }

    //离婚
    marryRemove(player: Player){
        let marryid = player.marryid;
        let marry = this.getMarryInfo(player);
        if(!marry){
            player.send('s2c_notice', {
                strRichText: `您还未结婚`
            });
            return;
        }
        let player2 = marry.getPlayer2(player);
        if(player2){
            player2.marryid = 0;
            player2.save(false, '离婚');
            DB.marryRemove(marryid);
        }else{
            DB.marryRemove(marryid, marry.getPlayer2Roleid(player));
        }
        player.marryid = 0;
        player.save(false, '离婚');
        marry.send('s2c_notice', {
            strRichText: `离婚成功`
        });
        marry.status = 0;
        marry.divorce_time = GTimer.format();
        marry.save();

        marry = null;
        delete this.marry_list[marryid]; 
    }

    addPoint(player:Player, data:any){
        let marry = this.getMarryInfo(player);
        marry && marry.addPoint(player, data)
    }


    getAttr(player:Player){
        let marry = this.getMarryInfo(player);
        return marry ? marry.getAttr() : {};
    }

    addExp(player:Player){
        let marry = this.getMarryInfo(player);
        marry.roleid1 == player.roleid && marry.addExp(1);
    }


    getInfo(player:Player, data:any){
        if(!data.roleid || data.roleid==player.roleid){
            let marry = this.getMarryInfo(player);
            if(!marry){
                player.send('s2c_notice', {
                    strRichText: `结婚后才能使用此功能`
                });
                return;
            }
            player.send('s2c_marry_info', marry.toObj());
        }else{
            let tager = PlayerMgr.shared.getPlayerByRoleId(data.roleid, false);
            if(tager){
                if(tager.marryid==0){
                    player.send('s2c_notice', {
                        strRichText: `该玩家现在单身`
                    });
                    return;
                }
                let marry = this.getMarryInfo(tager);
                if(!marry){
                    player.send('s2c_notice', {
                        strRichText: `未找到结婚信息`
                    });
                    return;
                }
                player.send('s2c_marry_info', marry.toObj());
            }else{
                DB.findMarryInfo(data.roleid, (error, data)=>{
                    if(error){
                        return;
                    }
                    if(!data){
                        player.send('s2c_notice', {
                            strRichText: `该玩家现在单身`
                        });
                        return;
                    }
                    let marry = new Marry(data);
                    player.send('s2c_marry_info', marry.toObj());
                    marry = null;
                })

            }
        }


        


    }


    updateChild(player:Player, data:any){
        let marry = this.getMarryInfo(player);
        if(!marry){
            player.send('s2c_notice', {
                strRichText: `请先结婚`
            });
            return;
        }
        marry.updateChild(player, data);
    }






}