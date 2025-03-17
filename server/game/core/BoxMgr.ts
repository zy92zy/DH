import SKLogger from "../../gear/SKLogger";
import PlayerMgr from "../object/PlayerMgr";
import GameUtil from "./GameUtil";
import ItemUtil from "./ItemUtil";

export default class BoxMgr {

    static shared = new BoxMgr();
    boxs: any;

    init() {
        let conf = GameUtil.game_conf.boxs;
        this.boxs = {};
        for (let key in conf) {
            let item = conf[key];
            let box_id = item.box_id;
            if (this.boxs[box_id] == null) {
                this.boxs[box_id] = [];
            }
            this.boxs[box_id].push(item);
        }
    }

    canUseItem(data: any): boolean {
        let player = PlayerMgr.shared.getPlayerByRoleId(data.roleid);
        if (player == null) {
            return false;
        }
        let itemData = ItemUtil.getItemData(data.itemid);
        if (itemData == null) {
            return false;
        }
        let boxData = null;
        let keyData = null;
        if (itemData.type == 13) { // 如果是宝箱
            boxData = itemData;
            keyData = ItemUtil.getItemData(itemData.num);
            if (keyData) {
                let keyCount = ItemUtil.getBagItemCount(player, keyData.id);
                if (keyCount < 1) {
                    player.send('s2c_notice', {
                        strRichText: `您需要至少一把[color=#0fffff][${keyData.name}][/color]才能打开[color=#0fffff][${keyData.name}][/color]!`
                    });
                    return false;
                }
            }
        } else if (itemData.type == 14) { // 如果是钥匙
            boxData = ItemUtil.getItemData(itemData.num);
            keyData = itemData;
            if (boxData) {
                let boxCount = ItemUtil.getBagItemCount(player, boxData.id);
                if (boxCount < 1) {
                    player.send('s2c_notice', {
                        strRichText: `您需要至少一个[color=#0fffff][${boxData.name}][/color]才能使用[color=#0fffff][${keyData.name}][/color]!`
                    });
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
        if (boxData == null) {
            return false;
        }
        SKLogger.debug(`玩家[${player.name}(${player.roleid})]使用宝箱[${boxData.name}]`);
        let select = this.randomSelect(boxData.id);
        if (select == null) {
            return false;
        }
        if ((player.getBagItemAllKindNum() + select.count) >= GameUtil.limitBagKindNum) {
            player.send('s2c_notice', {
                strRichText: `背包空间不足，无法打开宝箱[color=#0fffff][${boxData.name}][/color]`
            });
            return false;
        }
        let rewardData = ItemUtil.getItemData(select.item_id);
        SKLogger.debug(`玩家[${player.name}(${player.roleid})]打开宝箱[${boxData.name}]得到[${rewardData.name}]${select.count}个`);
        player.addItem(boxData.id, -1, false, "打开宝箱");
        if (keyData) {
            player.addItem(keyData.id, -1, false, `消耗钥匙`);
            player.send('s2c_notice', {
                strRichText: `你使用一把[color=#0fffff][${keyData.name}][/color]打开了[color=#0fffff][${boxData.name}][/color],里面有[color=#0fffff][${rewardData.name}][/color]${select.count}个`
            });
        } else {
            player.send('s2c_notice', {
                strRichText: `你打开了[color=#0fffff][${boxData.name}][/color],里面有[color=#0fffff][${rewardData.name}][/color]${select.count}个`
            });
        }
        player.addItem(rewardData.id, select.count, true);
        return true;
    }

    randomSelect(id: number): any {
        let total = 0;
        let list = this.boxs[id];
        for (let item of list) {
            total += item.rate;
        }
        let temp = GameUtil.random(0, total);
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            temp -= item.rate;
            if (temp <= 0)
                return item;
        }
        return null;
    }
}