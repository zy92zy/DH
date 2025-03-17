import SKDataUtil from "../../gear/SKDataUtil";
import GameUtil from "../core/GameUtil";

export default class DugMgr {

    static shared = new DugMgr();
    // 10万仙玉刷新1次
    static updateJade:number=100000;
    // 默认开启
    static enabled:boolean=true;
    list: any;

    init() {
        let conf = GameUtil.game_conf.dug;
        this.list = {};
        for (let key in conf) {
            let item = conf[key];
            let level = item.level;
            if (this.list[level] == null) {
                this.list[level] = [];
            }
            this.list[level].push(item);
        }
    }
    // 更新挖宝列表
    update(type: number): any[] {
        let result: any = {};
        result.count = -1;
        let list = SKDataUtil.shuffle(this.list[`1`]);
        list = list.slice(0, 31);
        let high = SKDataUtil.shuffle(this.list[`2`]);
        high = high.slice(0, 1);
        list = SKDataUtil.shuffle(list.concat(high));
        result.list = list;
        return result;
    }
    // 开始挖宝
    start(type: number, data?: any): any {
        if (data == null) {
            data = this.update(type);
        }
        data.count = 0;
        data.list = SKDataUtil.shuffle(data.list);
        return data;
    }
    // 获得挖宝所需仙玉
    getJade(count: number): number {
        let conf = GameUtil.game_conf.dug_jade;
        let data = conf[count];
        if (data == null || data.jade == null) {
            return 90000;
        }
        return data.jade;
    }
}