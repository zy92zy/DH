import DB from "../../utils/DB";
import GameUtil from "./GameUtil";

export default class Exchange {
    roleId: number;
    list: string[];

    constructor(roleId: number) {
        this.roleId = roleId;
    }

    readDB() {
        DB.getExchange(this.roleId, (list) => {
            this.list = list || [];
        })
    }
    // 是否已兑换
    hasCode(msg: string): boolean {
        for (let k in this.list) {
            let code = this.list[k];
            if (msg == code) {
                return true;
            }
        }
        return false;
    }
    // 检查是否有兑换
    checkCode(msg: string): any {
        if (!msg || msg.length < 1) {
            return null;
        }
        if (this.hasCode(msg)) {
            return null;
        }
        let data = GameUtil.game_conf.exchange;
        for (let key in data) {
            let item = data[key];
            if (item.code == msg && (item.sid == 0 || item.sid == GameUtil.serverId)) {
                return item;
            }
        }
        return null;
    }
}