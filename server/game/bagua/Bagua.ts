import SKDataUtil from "../../gear/SKDataUtil";
import GameUtil from "../core/GameUtil";
import ItemUtil from "../core/ItemUtil";
import Player from "../object/Player";


export default class Bagua {
    static shared = new Bagua();
    config: any;
    level_config: any;
    def: any = { attr: [], level: 1 };

    init() {

        this.config = GameUtil.require_ex('../../conf/prop_data/prop_bagua_item.json');
        this.level_config = GameUtil.require_ex('../../conf/prop_data/prop_bagua_level.json');

    }


    levelup(player: Player, index: number) {
        if (!index || index < 1 || index > 8) {
            player.send('s2c_notice', {
                strRichText: `Index异常`
            });
            return;
        }
        let obj = player.bagua[index];
        let conf = this.level_config[obj.level];
        let next_conf = this.level_config[obj.level + 1];
        if (!next_conf) {
            player.send('s2c_notice', {
                strRichText: `已升至满级`
            });
            return;
        }
        if (player.getBagItemNum(conf.itemid) < conf.itemnum) {
            let name = ItemUtil.getItemName(conf.itemid);
            if (!name) {
                player.send('s2c_notice', {
                    strRichText: `物品配置异常`
                });
                return;
            }
            player.send('s2c_notice', {
                strRichText: `升级八卦需要${conf.itemnum}个[${name}]`
            });
            return;
        }
        obj.level++;
        player.addItem(conf.itemid, -conf.itemnum, true, "升级八卦");
        this.sendInfo(player);
        player.calculateAttr();
        player.getPlayerData();
        player.send('s2c_notice', {
            strRichText: `升级成功`
        });
        player.save(true, '八卦升级');
    }

    sendInfo(player: Player) {
        for (let index = 1; index <= 8; index++) {
            if (!player.bagua[index]) {
                player.bagua[index] = SKDataUtil.clone(this.def);
            }
        }
        player.send('s2c_bagua_info', {
            info: SKDataUtil.toJson(player.bagua)
        });
    }

    /** 八卦炼化
     * data.type : 1 = 生成属性, 2 = 替换属性
     * data.id: 素材id
     * data.index: 位置
     */
    refine(player: Player, data: any) {
        if (!data.index || data.index < 1 || data.index > 8) {
            player.send('s2c_notice', {
                strRichText: `Index异常`
            });
            return;
        }
        if (data.type == 1) {
            let conf = this.config[data.id];
            if (!conf) {
                player.send('s2c_notice', {
                    strRichText: `素材异常`
                });
                return;
            }

            let name = ItemUtil.getItemName(conf.itemid);
            if (!name) {
                player.send('s2c_notice', {
                    strRichText: `物品配置异常`
                });
                return;
            }
            if (player.getBagItemNum(conf.itemid) < 1) {
                player.send('s2c_notice', {
                    strRichText: `炼化属性需要1个[${name}]`
                });
                return;
            }
            player.addItem(conf.itemid, -1, false, "炼化八卦");
            if (!player.bagua[data.index]) {
                player.bagua[data.index] = SKDataUtil.clone(this.def);
            }
            let obj = player.bagua[data.index];
            obj.temp = [];
            let attrNum = 1;
            let ran = SKDataUtil.random(0, 100);
            if (conf.attrNum) {
                for (const iterator of conf.attrNum.split(',')) {
                    let a = iterator.split(':');
                    if (a.length == 2) {
                        if (ran <= a[0]) {
                            attrNum = a[1]
                        }
                    }
                }
            }
            let attrs = [];
            if (conf.attrList) {
                let attrList = conf.attrList.split(',');
                while (attrNum > 0 && attrList.length > 0) {
                    attrNum--;
                    let index = SKDataUtil.random(0, attrList.length - 1);
                    let arrt = attrList.splice(index, 1)[0];
                    let a = arrt.split(':');
                    let data = {};
                    if (a.length == 2) {
                        let id = GameUtil.attrEquipTypeStr[a[0]];
                        data[id] = Number(a[1]);
                        attrs.push(data);
                    } else if (a.length == 3) {
                        let id = GameUtil.attrEquipTypeStr[a[0]];
                        data[id] = SKDataUtil.random(Number(a[1]), Number(a[2]));
                        attrs.push(data);
                    }
                }
            }



            obj.temp = attrs;
            obj.tempid = conf.itemid;

            player.send('s2c_bagua_refine', {
                id: data.id,
                index: data.index,
                attr: SKDataUtil.toJson(obj.attr),
                temp: SKDataUtil.toJson(attrs)
            });
            return;
        } else {
            let obj = player.bagua[data.index];
            if (!obj || !obj.temp) {
                player.send('s2c_notice', {
                    strRichText: `请先炼化属性`
                });
                return;
            }

            obj.attr = SKDataUtil.clone(obj.temp);
            obj.itemid = obj.tempid;
            delete obj.temp;
            delete obj.tempid;
            player.send('s2c_notice', {
                strRichText: `替换属性成功`
            });
            player.send('s2c_bagua_refine', {
                id: data.id,
                index: data.index,
                attr: SKDataUtil.toJson(obj.attr),
            });
            this.sendInfo(player);
            player.calculateAttr();
            player.getPlayerData();
            player.send('s2c_notice', {
                strRichText: `升级成功`
            });
            player.save(true, '八卦炼化');
        }
    }


    /**
     * {
     *      1: {attr: {} , level: 1, temp: {}, id:素材ID},
     *      2: {attr: {} , level: 1, temp: {}, id:素材ID},
     * }
     */
    getAttr(player: Player) {
        let baseAttr = {};
        if (!player.bagua) {
            return baseAttr;
        }
        for (const key in player.bagua) {
            const item = player.bagua[key];
            if (item.attr) {
                for (const iterator of item.attr) {
                    for (const key in iterator) {
                        let lv = this.level_config[item.level || 1];
                        let num = iterator[key];
                        if (num > 0) {
                            num = Math.floor((lv.gain / 100 + 1) * num);
                            baseAttr[key] ? baseAttr[key] += num : baseAttr[key] = num;
                        }
                    }
                }
            }
        }
        return baseAttr;
    }






}