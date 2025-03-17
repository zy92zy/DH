import GameUtil from "../core/GameUtil";
import PlayerMgr from "../object/PlayerMgr";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import Log from "../../utils/Log";
import Player from "../object/Player";
import GFile from "../../utils/GFile";
import DB from "../../utils/DB";
import MarryMgr from "./MarryMgr";
import { EAttrTypeL1, EAttrTypeL2 } from "../role/EEnum";
import SKTimeUtil from "../../gear/SKTimeUtil";

export default class Marry {
    id:number;
    roleid1: number;
    roleid2: number;
    level: number = 1;
    marry_lv: number = 1;
    exp: number = 0;
    name1: string;
    name2: string;
    status: number = 1;
    resid1: number = 0;
    resid2: number = 0;
    point: any = {};
    child: any;
    timer: any;
    divorce_time: any = "";

    constructor(data: any) {
        this.id = data.id;
        this.roleid1 = data.roleid1;
        this.roleid2 = data.roleid2;
        this.marry_lv = data.marry_lv || 1;
        this.name1 = data.name1;
        this.name2 = data.name2;
        this.resid1 = data.resid1;
        this.resid2 = data.resid2;
        data.point && (this.point = SKDataUtil.jsonBy(data.point));
        data.exp && (this.exp = data.exp);
        data.level && (this.level = data.level);
        data.status && (this.status = data.status);

        data.child_name && (this.child = {
            name: data.child_name,
            exp: data.child_exp,
            level: data.child_lv,
            point: SKDataUtil.jsonBy(data.child_point),
            sex: data.child_sex,
            resid: data.child_resid,
        });
    }
    

    send(event:string, data: any){
        let p1 = PlayerMgr.shared.getPlayerByRoleId(this.roleid1, false);
        p1&&p1.send(event, data);
        let p2 = PlayerMgr.shared.getPlayerByRoleId(this.roleid2, false);
        p2&&p2.send(event, data);
    }


    addExp(exp:number){
        let conf = this.getConfig();
        this.exp += exp;
        if(this.exp >= conf.exp){
            let next = this.getConfig(true);
            if(!next){
                this.exp = conf.exp;
                return;
            }
            this.level ++;
            this.exp -= conf.exp;
        }
    }

    getPlayer2(player: Player){
        let player2 = PlayerMgr.shared.getPlayerByRoleId(this.getPlayer2Roleid(player), false);
        return player2;
    }
    getPlayer2Roleid(player: Player){
        return this.roleid1 == player.roleid ? this.roleid2 : this.roleid1
    }

    sendInfo(){
        this.send('s2c_marry_info', this.toObj());
    }


    toObj(){
        let conf = this.getConfig();
        let data:any = {
            id: this.id,
            roleid1: this.roleid1,
            roleid2: this.roleid2,
            marrylv: this.marry_lv,
            exp: this.exp,
            level: this.level,
            name1: this.name1,
            name2: this.name2,
            resid1: this.resid1,
            resid2: this.resid2,
            point: SKDataUtil.toJson(this.point),
            maxexp: conf.exp,
        };
        return data
    }



    save(){
        let data:any = {
            exp: this.exp,
            level: this.level,
            name1: this.name1,
            name2: this.name2,
            status: this.status, 
            resid1: this.resid1,
            resid2: this.resid2,
            point: SKDataUtil.toJson(this.point),
        };
        if(this.child){
            data.child_name = this.child.name;
            data.child_exp = this.child.exp;
            data.child_lv = this.child.level;
            data.child_point = SKDataUtil.toJson(this.child.point),
            data.child_sex = this.child.sex;
            data.child_resid = this.child.resid;
        }
        this.divorce_time && (data.divorce_time=this.divorce_time);
        DB.saveMarry(this.id, data);
    }



    getConfig(next = false){
        let conf = MarryMgr.shared.config[`lv${this.marry_lv}`];
        if(!conf)
            return null;
        return conf[ next ? this.level + 1 : this.level];
    }

    addPoint(player:Player ,data:any){
        if(!data || !data.info){
            if(player.jade < 200000){
                player.send('s2c_notice', {
                    strRichText: `重置需要20W仙玉,您有${player.jade}`
                });
                return;
            }
            player.CostFee(GameUtil.goldKind.jade, 200000, '重置结婚修炼');
            this.point = {};
        }else{
            let point = SKDataUtil.jsonBy(data.info);
            if(!point){
                player.send('s2c_notice', {
                    strRichText: `数据异常`
                });
                return;
            }
            let max = this.marry_lv * this.level;
            for (const key in point) {
                if (Object.prototype.hasOwnProperty.call(point, key)) {
                    max -= point[key]
                }
            }
            if(max < 0){
                player.send('s2c_notice', {
                    strRichText: `超出修炼点数`
                });
                return;
            }

            this.point = point;
        }
        
        let player2 = this.getPlayer2(player);
        player.calculateAttr();
        player.getPlayerData();
        player.send('s2c_notice', {
            strRichText: `更新修炼成功`
        });
        if(player2){
            player2.calculateAttr();
            player2.getPlayerData();
            player2.send('s2c_notice', {
                strRichText: `[${player.name}]更新了结婚修炼点数`
            });
        }
        this.send('s2c_marry_info', this.toObj());
    }


    getAttr(){
        let baseInfo: any = {};
        for (const key in this.point) {
            if(!this.point[key]) {
                continue;
            }
            if(key == EAttrTypeL1.S_GOLD.toString() || 
                key == EAttrTypeL1.S_WOOD.toString() || 
                key == EAttrTypeL1.S_WATER.toString() || 
                key == EAttrTypeL1.S_FIRE.toString()
            ){  
                baseInfo[key] = this.point[key] * 2;
            }else if(key == EAttrTypeL1.BONE.toString() ||
                    key == EAttrTypeL1.SPIRIT.toString() 
            ){
                baseInfo[key] = this.point[key] * 4;
            }else if(
                key == EAttrTypeL1.STRENGTH.toString() || 
                key == EAttrTypeL1.DEXTERITY.toString()
                ){

                baseInfo[key] = this.point[key] * 4;
            }
        }



        if(this.child){
            for (const key in this.child.point) {
                baseInfo[key] = this.child.point[key] * 10;
            }
        }
        return baseInfo;
    }

    updateChild(player:Player, data:any){
        let player2 = this.getPlayer2(player);
        if(!this.child){
            if(!player2){
                player.send('s2c_notice', {
                    strRichText: `您的配偶目前不在线`
                });
                return;
            }
            if(data.new==1){
                this.newChild();
            }else if(data.new==2){
                player2.send('s2c_notice', {
                    strRichText: `对方不想和您一起生孩子`
                });
            }else{
                player.send('s2c_notice', {
                    strRichText: `已邀请您的配偶和您一起生个孩子,请等待对方回应`
                });
                player2.send('s2c_marry_child', {})
            }
            return;
        }

        if(data.name){
            if(!SKDataUtil.CheckName(data.name)){
                player.send('s2c_notice', {
                    strRichText: '请填写2-8个汉字！'
                });
                return;
            }
            player.childname = this.child.name = data.name;
            player2 && (player2.childname = data.name);
            player.CostFee(GameUtil.goldKind.jade, 600, '孩子改名');
        }
        if(data.repoint){
            if(player.jade < 200000){
                player.send('s2c_notice', {
                    strRichText: `重置需要20W仙玉,您有${player.jade}`
                });
                return;
            }
            player.CostFee(GameUtil.goldKind.jade, 200000, '重置孩子修炼');
            this.child.point = {};

            player.calculateAttr(), 
            player.getPlayerData(), 
            player.send('s2c_notice', {
                strRichText: `重置修炼成功`
            });
            player2 && (player2.calculateAttr(), player2.getPlayerData(), player2.send('s2c_notice', {
                strRichText: `[${player.name}]重置了结婚修炼点数`
            }));
        }
        if(data.addexp){
            if(player.getBagItemNum(10006) < 1){
                player.send('s2c_notice', {
                    strRichText: `缺少物品`
                });
                return;
            }
            let conf = MarryMgr.shared.child_config[this.child.level];
            this.child.exp += 10;
            if(this.child.exp >= conf.exp){
                let next = MarryMgr.shared.child_config[this.child.level+1];
                if(!next){
                    this.child.exp = conf.exp;
                    player.send('s2c_notice', {
                        strRichText: `已升至满级`
                    });
                    return;
                }
                this.child.level ++;
                this.child.exp -= conf.exp;
            }
            player.addItem(10006, -1, true, "升级孩子");
        }
        if(data.point){
            let point = SKDataUtil.jsonBy(data.point);
            let max = this.child.level;
            for (const key in point) {
                if (Object.prototype.hasOwnProperty.call(point, key)) {
                    max -= point[key]
                }
            }
            if(max < 0){
                player.send('s2c_notice', {
                    strRichText: `超出修炼点数`
                });
                return;
            }
            this.child.point = point;
            
            player.calculateAttr(), 
            player.getPlayerData(), 
            player.send('s2c_notice', {
                strRichText: `重置修炼成功`
            });
            player2 && (player2.calculateAttr(), player2.getPlayerData(), player2.send('s2c_notice', {
                strRichText: `[${player.name}]重置了结婚修炼点数`
            }));
        }
        let self = this;
        if(!this.timer){
            this.timer = SKTimeUtil.delay(()=>{
                self.save();
                self.timer = null;
            },5 * 1000);
        }
        this.sendChildInfo();
    }

    newChild(){
        let sex = GameUtil.random(1, 2);

        this.child = {
            name: sex ==1 ? '健康的男孩子' : '健康的女孩子',
            exp: 0,
            level: 1,
            point: {},
            sex: sex,
            resid: MarryMgr.shared.childres[sex][0],
        };
        this.send('s2c_notice', {
            strRichText: `恭喜您获得了一个${sex==1?'男':'女'}孩子`
        });
        let p1 = PlayerMgr.shared.getPlayerByRoleId(this.roleid1, false);
        let p2 = PlayerMgr.shared.getPlayerByRoleId(this.roleid2, false);
        p1 && (p1.childres = this.child.resid, p1.synInfoToWatcher());
        p2 && (p2.childres = this.child.resid, p2.synInfoToWatcher());
        this.save();
        this.sendChildInfo();
    }


    

    sendChildInfo(){
        let conf = MarryMgr.shared.child_config[this.child.level];
        this.send('s2c_marry_child', {
            level: this.child.level,
            exp: this.child.exp,
            maxexp: conf.exp,
            sex: this.child.sex,
            name: this.child.name,
            resid: this.child.resid,
            point: SKDataUtil.toJson(this.child.point),
        })
    }


    // getAttr(){
    //     let baseInfo: any = {};
    //     let conf = this.getConfig();
    //     if(!conf || !conf.attr)
    //         return baseInfo;
    //     let baseAttr = conf.attr.split(';');
    //     for (const item of baseAttr) {
    //         let itemAttr = item.split(':');
    //         if (itemAttr.length == 2 && GameUtil.attrEquipTypeStr[itemAttr[0]] != null) {
    //             baseInfo[GameUtil.attrEquipTypeStr[itemAttr[0]]] = Number(itemAttr[1]);
    //         }
    //     }
    //     return baseInfo;
    // }


}