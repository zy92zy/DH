import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import Player from "../object/Player";
import { EEquipIndex } from "../role/EEnum";
import GameUtil from "./GameUtil";

export default class ItemUtil {
    // 获得道具定义
    static getItemName(itemId: any): string {
        let result = this.getItemData(itemId);
        if (result) {
            return result.name;
        }
        SKLogger.warn(`$警告:找不到道具名称定义:${itemId}`);
        return "";
    }
    // 获得道具定义
    static getItemData(itemId: any): any {
        if (itemId == null) {
            return null;
        }
        let conf = GameUtil.game_conf;
        if (!conf) {
            return null;
        }
        let items = conf.item;
        if (!items) {
            return null;
        }
        let result = items[itemId];
        if (!result) {
            return null;
        }
        return result;
    }
    // 能否合成
    static canSynthesis(itemId: number): Boolean {
        // 如果配置不存在则返回不能合成
        if (!GameUtil.game_conf) {
            return false;
        }
        let list = GameUtil.game_conf.synthesis;
        for (let key in list) {
            let item = list[key];
            // 如果是合成物品则能合成
            if (itemId == item.id) {
                return true;
            }
            // 如果在合成列表中能合成
            if (item.list.indexOf(itemId) != -1) {
                return true;
            }
        }
        return false;
    }

    // 获得合成表
    static getSynthesisItem(index: number): string {
        let result: any = GameUtil.game_conf;
        if (result == null) {
            return "";
        }
        result = result.synthesis;
        if (result == null) {
            return "";
        }
        result = result[index];
        if (result == null) {
            return "";
        }
        result = result.map;
        return result;
    }
    // 获得玩家背包里道具数量
    static getBagItemCount(player: Player, itemId: number): number {
        if (player == null) {
            return 0;
        }
        // 玩家背包里无此道具
        if (!player.bag_list.hasOwnProperty(itemId)) {
            return 0;
        }
        // 玩家背包里此道具数量为0
        let count = player.bag_list[itemId];
        return count;
    }
    // 是否为佩饰
    static isBaldric(index: number): boolean {
        if(SKDataUtil.atRange(index,[EEquipIndex.CAPE,EEquipIndex.PENDANT,EEquipIndex.BELT,EEquipIndex.RING_LEFT,EEquipIndex.RING_RIGHT])){
            return true;
        }
        return false;
    }

    static getBaldricSuit(suitId:number):any{
        let conf=GameUtil.game_conf.baldric_suit;
        let data=SKDataUtil.valueForKey(conf,suitId);
        return data;
    }
    // 能否分解
    static canResolve(data:any):number{
        if(SKDataUtil.atRange(data.id,[20011,20012,20013,20014,20015])){
            return 200;
        }
        if(SKDataUtil.atRange(data.id,[21011,21012,21013,21014,21015])){
            return 500;
        }
        return 0;
    }
    // 二阶仙器分解为50个八荒,三阶分解为80，四阶160，五阶320
    static getEquipResolve(grade: number): number {
        if (grade == 2) {
            return 50;
        }
        if (grade == 3) {
            return 80;
        }
        if (grade == 4) {
            return 160;
        }
        if (grade == 5) {
            return 320;
        }
        return 0;
    }

    // 获得佩饰颜色
    static getBaldricColor(grade:number): string {
        if (grade == 1) {
            return "#60d566";
        } else if (grade == 2) {
            return "#5fd5d6";
        } else if (grade == 3) {
            return "#b94bd1";
        }
        return "#ff0000";
    }
}