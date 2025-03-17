import SKDataUtil from "../../gear/SKDataUtil";
import GameUtil from "../core/GameUtil";
import NoticeMgr from "../core/NoticeMgr";
import Player from "../object/Player";

export default class Skin {
    static shared = new Skin();

    config: any;



    type_name:any = {
        1: '时装',
        2: '特效',
        3: '称号',
        4: '足迹',
        5: '光环',
        6: '战魂',
    };

    init() {
        this.config = GameUtil.require_ex('../../conf/prop_data/prop_skin');
    }


    getSkin(id:any){
        return this.config[id]

    }

    hasSkin(player:Player, id:any){
        return player.skins.has.indexOf(id) > -1
    }

    useSkin(player:Player, itemData:any): boolean{
        let stData = itemData.json;
        if(this.hasSkin(player, stData.skinid)){
            player.send('s2c_notice', {
                strRichText: `您已激活此外观`
            });
            return false;
        }
        if(!this.getSkin(stData.skinid)){
            player.send('s2c_notice', {
                strRichText: `外观不存在`
            });
            return false;
        }
        player.skins.has.push(stData.skinid);
        player.send('s2c_notice', {
            strRichText: `您激活了外观[${itemData.name}]`
        });

        // NoticeMgr.shared.sendNotice({
        //     type: 2,
        //     text: `玩家[${player.name}]激活装扮[${itemData.name}]，成为了全服最靓的仔！`,
        // });
        return true;
    }



    getInfo(player:Player, data: any){
        if(data && data.use && data.use.length > 0){
            for (let i = 0; i < data.use.length; i++) {
                let id = data.use[i];
                if(id == 0){
                    continue
                }
                if(!this.hasSkin(player, id)){
                    player.send('s2c_notice', {
                        strRichText: `您没有此${this.type_name[i+1]}`
                    });
                    return;
                }
                let conf = this.getSkin(id);
                if(!this.getSkin(id)){
                    player.send('s2c_notice', {
                        strRichText: `id异常`
                    });
                    return;
                }
                if(conf.sex && player.sex != conf.sex){
                    player.send('s2c_notice', {
                        strRichText: `性别不符`
                    });
                    return;
                }
                if(conf.race && player.race != conf.race){
                    player.send('s2c_notice', {
                        strRichText: `种族不符`
                    });
                    return;
                }
            }
            player.skins.use = data.use;
            this.syncSkin(player);
            player.calculateAttr();
			player.send('s2c_player_data', player.getData());
        }
        player.send('s2c_skin_info', player.skins);
    }

    syncSkin(player:Player) {
		let playerList = player.getWatcherPlayer();
		if (playerList) {
			for (const key in playerList) {
				let p = playerList[key];
				if (p.isPlayer()) {
					p.send("s2c_sync_skin", {
						onlyId: player.onlyid,
						skins: player.skins.use,
					});
				}
			}
		}
	}


    playerRecharge(player:Player, money:number){
        for (const key in this.config) {
            let conf = this.getSkin(key);
            if(conf.free_recharge && money >= conf.free_recharge && !this.hasSkin(player, key)){
                player.skins.has.push(key)
            }
        }

    }

    playerLevelUp(player: Player){
        for (const key in this.config) {
            let conf = this.getSkin(key);
            if(conf.free_level && player.level >= conf.free_level && !this.hasSkin(player, key)){
                player.skins.has.push(key)
            }
        }
    }


    getAttr(player: Player){
        let baseInfo: any = {};
        for (let i = 0; i < player.skins.use.length; i++) {
            let conf = this.getSkin(player.skins.use[i]);
            if(conf){
                let baseAttr = conf.attr.split(';');
                for (const item of baseAttr) {
                    let itemAttr = item.split(':');
                    let id:any = null;
                    if (itemAttr.length == 2 && (id = GameUtil.attrEquipTypeStr[itemAttr[0]])) {
                        if(baseInfo[id]){
                            baseInfo[id] += Number(itemAttr[1]);
                        }else{
                            baseInfo[id] = Number(itemAttr[1]);
                        }
                    }
                }
            }
        }
        return baseInfo;
    }
    

}