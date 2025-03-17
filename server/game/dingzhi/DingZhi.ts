import GameUtil from "../core/GameUtil";
import DB from "../../utils/DB";
import Launch from "../core/Launch";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";
import Player from "../object/Player";
import { EAttrTypeL1 } from "../role/EEnum";
import Equip from "../object/Equip";
import ItemUtil from "../core/ItemUtil";

export default class DingZhi {
    static shared = new DingZhi();

    needItem:any = {
        1: 10008,
        2: 10011,
        3: 10009,
        4: 10010,
        5: 10012,
        6: 10013,
        7: 10013,
        8: 10013,
        9: 10013,
        10: 10013,
        11: 10013,
        12: 10013,
        13: 95239,
    };

    attrConfig: any = {
        [EAttrTypeL1.HK_DETER]: 50,
        [EAttrTypeL1.KB_THUNDER]: 100,
        [EAttrTypeL1.KB_FIRE]: 100,
        [EAttrTypeL1.KB_WIND]: 100,
        [EAttrTypeL1.KB_WATER]: 100,
        [EAttrTypeL1.KB_WATER]: 100,
        [EAttrTypeL1.KB_HENGSAO]: 100,
        [EAttrTypeL1.KB_ZHENJI]: 100,
        [EAttrTypeL1.KB_POJIA]: 100,
		[EAttrTypeL1.KB_BLOODRETURN]: 150,
		[EAttrTypeL1.KB_WILDFIRE]: 150,
        [EAttrTypeL1.HK_WIND]: 150,
        [EAttrTypeL1.HK_FIRE]: 150,
        [EAttrTypeL1.HK_WATER]: 150,
        [EAttrTypeL1.HK_THUNDER]: 150,
        [EAttrTypeL1.HK_POISON]: 150,
        [EAttrTypeL1.HK_BLOODRETURN]: 150,
        [EAttrTypeL1.HK_WILDFIRE]: 150,
        [EAttrTypeL1.HK_CONFUSION]: 100,
        [EAttrTypeL1.HK_SEAL]: 80,
        [EAttrTypeL1.HK_SLEEP]: 80,
        [EAttrTypeL1.HK_FORGET]: 80,
        [EAttrTypeL1.S_GOLD]: 200,
        [EAttrTypeL1.S_WOOD]: 200,
        [EAttrTypeL1.S_WATER]: 200,
        [EAttrTypeL1.S_FIRE]: 200,
        [EAttrTypeL1.S_SOIL]: 200,
        [EAttrTypeL1.BONE]: 50,
        [EAttrTypeL1.SPIRIT]: 50,
        [EAttrTypeL1.STRENGTH]: 50,
        [EAttrTypeL1.DEXTERITY]: 50,


		[EAttrTypeL1.PHY_MULTIPLE_PROB]: 100,
		[EAttrTypeL1.PHY_MULTIPLE]: 1,
		[EAttrTypeL1.PHY_COMBO]: 2,
		[EAttrTypeL1.PHY_COMBO_PROB]: 100,
		[EAttrTypeL1.PHY_DEADLY]: 50,
    }

    init() {


    }

    creatEquip(player:Player, data:any){
		let equip: Equip = player.equipObjs[data.equipid];
        if(!equip){
            player.send('s2c_notice', {
                strRichText: '装备不存在'
            });
            return;
        }
        let item = this.needItem[equip.EIndex];
        if(player.getBagItemNum(item) < 1){
            let name = ItemUtil.getItemName(item);
            player.send('s2c_notice', {
                strRichText: `缺少物品[${name}]`
            });
            return;
        }
        let attrObj:any = [];
        let attr = data.attrs.split(',');
        if(attr.length>5){
            player.send('s2c_notice', {
                strRichText: `最多选择5条属性`
            });
            return;
        }
        for (const key of attr) {
            let e = this.attrConfig[key];
            if(!e){
                player.send('s2c_notice', {
                    strRichText: `未配置的属性ID${key}`
                });
                return;
            }
            let obj:any = {};
            obj[key] = e;
            attrObj.push(obj);
        }
        player.addItem(item, -1, true, `精炼装备id=${data.equipid}`);
        
        equip.LianhuaAttr = attrObj.slice(0);
        equip.refine = null;
        equip.save(false, "装备精炼");
        equip.calculateAttribute();
        player.sendEquipInfo(data.equipid);
        player.calculateAttr();
        player.send('s2c_player_data', player.getData());
        player.send('s2c_notice', {
            strRichText: `精炼装备成功`
        });
    }

    creatGm(data:any){






    }



}