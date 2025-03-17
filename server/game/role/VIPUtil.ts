import SKDataUtil from "../../gear/SKDataUtil";
import GameUtil from "../core/GameUtil";
import ItemUtil from "../core/ItemUtil";

export default class VIPUtil {
    // 根据充值金额换算VIP等级
    static getVipLevel(chargeSum: number): number {
        let conf = GameUtil.game_conf.vip;
        let vipLevel = 0;
        for (let k in conf) {
            let item = conf[k];
            if (chargeSum >= item.money) {
                vipLevel = item.level;
            }
        }
        return vipLevel;
    }

    static getNextMoney(vipLevel: number, current: number): number {
        let conf = GameUtil.game_conf.vip;
        if (vipLevel == conf.length - 1) {
            return 0;
        }
        let total = conf[vipLevel + 1].money;
        return total - current;
    }
    // 获得VIP等级每日福利
    static getVipReward(vipLevel: number): any[] {
        let conf = GameUtil.game_conf.vip;
        if (vipLevel == conf.length) {
            return null;
        }
        let result: any[] = [];
        let data = conf[vipLevel];
        if (data == null) {
            return result;
        }
        let reward: String = data.day_reward;
        if (reward == null) {
            return result;
        }
        let list = reward.split(",");
        for (let item of list) {
            let itemList = item.split(":");
            if (itemList.length < 2) {
                continue;
            }
            let itemId = itemList[0];
            let count = SKDataUtil.toNumber(itemList[1]);
            let itemData = ItemUtil.getItemData(itemId);
            if (itemData) {
                itemData.count = count;
                result.push(itemData);
            }
        }
        return result;
    }
}