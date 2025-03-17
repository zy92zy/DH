import DB from "../../utils/DB";
import GameUtil from "../core/GameUtil";
import Player from "../object/Player";
import SKLogger from "../../gear/SKLogger";
import Horse from "./Horse";
import SKDataUtil from "../../gear/SKDataUtil";
import ItemUtil from "../core/ItemUtil";
import { MsgCode } from "../role/EEnum";
import SKTimeUtil from "../../gear/SKTimeUtil";

export default class HorseList {
    owner: Player;
    horseIndex: number;
    dict: { [key: number]: Horse } = {};
    times: any;

    constructor(owner: Player) {
        this.owner = owner;
        this.horseIndex = 0;
    }

    changeRace(race:number){
        for(let position in this.dict){
            let horse:Horse=this.dict[position];
            horse.setRace(race);
        }
    }

    // 读数据库
    setDB(rows: any) {
        if (rows && rows.length > 0) {
            for (let row of rows) {
                let horse = new Horse(row.position, row.name, row.level, row.exp,this.owner.race);
                this.dict[horse.position] = horse;
            }
        }
        let hasFixed = false;
        // 修正
        for (let position = 1; position <= 4; position++) {
            let horse = this.dict[position];
            if (horse == null) {
                let horse = new Horse(position, "", 1, 0,this.owner.race);
                this.dict[position] = horse;
                hasFixed = true;
            }
        }
    }

    saveDB(callback?: (code: number,msg:string) => void) {
        DB.saveHorseList(this.owner.roleid, this.dict, (error: any, rows: any[]) => {
            if (callback) {
                if(error){
                    callback(MsgCode.FAILED,error.sqlMessage);
                    return;
                }
                callback(MsgCode.SUCCESS,"");
            } else {
                if (error != null) {
                    SKLogger.warn(`存档:玩家[${this.owner.roleid}:${this.owner.name}]坐骑列表存档失败[${error.sqlMessage}]!`);
                } else {
                    SKLogger.debug(`存档:玩家[${this.owner.roleid}:${this.owner.name}]坐骑列表存档成功!`);
                }
            }
        });
    }
	/**
	 * 存档
	 * @param sleep 是否延迟存档
	 * @param source 存档原因
	 */
     save(sleep: boolean = false, source = ''){
		let self = this;
		if(sleep){
			//延迟5s存档
			if(this.times != 0){
				SKTimeUtil.cancelDelay(this.times);
				this.times = 0;
			}
			this.times = SKTimeUtil.delay(()=>{
				self.save(false,source);
			},5 * 1000);
			return;
		}
		this.saveDB();
	}
    // 升级
    addExp(itemId:number,position: number) {
        let horse: Horse = this.dict[position];
        if (horse == null) {
            return;
        }
        let expList = GameUtil.game_conf.horse_exp;
        let max = expList[expList.length-1].exp;
        if (horse.exp >= max) {
            this.owner.send('s2c_notice', {
                strRichText: `坐骑[${horse.showName}]已满级!`
            });
            return;
        }
        let itemData = ItemUtil.getItemData(itemId);
        let exp = itemData.num;
        if (exp < 1) {
            return;
        }
        let currentExp = SKDataUtil.clamp(horse.exp + exp, 0, max.exp);
        if (horse.exp == currentExp) {
            return;
        }
        let count = ItemUtil.getBagItemCount(this.owner, itemData.id);
        if (count < 1) {
            this.owner.send('s2c_notice', {
                strRichText: `您需要至少1个[${itemData.name}]才能升级坐骑!`
            });
            return;
        }
        horse.exp = currentExp;
        horse.resetLevel();
        this.owner.addItem(itemData.id, -1, false, "升级坐骑");
        SKLogger.debug(`玩家[${this.owner.roleid}:${this.owner.name}]升级坐骑[${horse.showName}]到${horse.level}级`);
        this.owner.updatePetControl(position);
        let params = { horseList: this.toObj() };
        this.owner.send("s2c_horse_list", params);
        this.save(true,"坐骑获得经验");
    }
    // 获得管制坐骑
    getHorse(control: number): any {
        if (control < 1) {
            return null;
        }
        let result = this.dict[control];
        return result;
    }
    // 转换输出
    toObj(): any {
        let result: any = {};
        result.horseIndex = this.horseIndex;
        result.list = [];
        for (let position in this.dict) {
            let horse: Horse = this.dict[position];
            if (horse) {
                result.list.push(horse.toObj());
            }
        }
        return result;
    }
}