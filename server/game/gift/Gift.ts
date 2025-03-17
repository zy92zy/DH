import GameUtil from "../core/GameUtil";
import GTimer from "../../common/GTimer";
import ActivityBase from "../activity/ActivityBase";
import ActivityDefine from "../activity/ActivityDefine";
import Http from "../../utils/Http";
import Player from "../object/Player";
import ChargeSum from "../core/ChargeSum";
import SKDataUtil from "../../gear/SKDataUtil";
import SKLogger from "../../gear/SKLogger";

export default class Gift{
    static shared=new Gift();
    //礼包码
    gift_ids:any = {
 
        '新区礼包': 1,
        '补偿礼包': 3,
        //'云霄直上': 3,
        '修复礼包': 5,
        '维护礼包': 4,
		'重启礼包': 2,
		'1227': 6,
		//'我玩金箍棒': 11,
		//'顶天立地': 12,
		//'维护礼包': 13,
		//'喜迎国庆': 14,
		//'繁荣昌盛': 15,
		//'欢迎新人': 16,
		//'欢送国庆': 17,


    };

    gift_data:any = {
        // 99: function(player:Player){
        //     Gift.shared.playerCharge(player, 10000, 1000000)
        // },
       1: [
            {itemid: 10006,num: 10},
            {itemid: 10007,num: 10},
        ],
        2: [
            {itemid: 10006,num: 10},
        ],
        3: [
            {itemid: 10006,num: 10},
           
        ],
        4: [
            {itemid: 10006,num: 28},
        ],
        5: [
            {itemid: 10006,num: 10},
            {itemid: 10007,num: 20},			
        ],
		6: [
            {itemid: 10006,num: 10},
			{itemid: 10007,num: 10},
        ],
		7: [
            {itemid: 10006,num: 20},
			
        ],
		8: [
            {itemid: 10006,num: 10},
			{itemid: 10007,num: 10},
        ],
		9: [
            {itemid: 10006,num: 20},
			{itemid: 10007,num: 20},
        ],
		10: [
            {itemid: 10006,num: 10},
			{itemid: 90002,num: 40000000},
			{itemid: 90002,num: 40000000},
			{itemid: 90002,num: 40000000},
			{itemid: 90002,num: 40000000},
			{itemid: 90002,num: 40000000},
			{itemid: 90002,num: 40000000},
			{itemid: 90002,num: 40000000},
			{itemid: 90002,num: 40000000},
			{itemid: 90002,num: 40000000},
			{itemid: 90002,num: 40000000},
			
			
        ],
		11: [
            {itemid: 10006,num: 18},
        ],
		12: [
            {itemid: 10006,num: 10},
			{itemid: 10007,num: 10},
        ],
		14: [
            {itemid: 10006,num: 10},
			{itemid: 10007,num: 10},
			{itemid: 98074,num: 10},
			{itemid: 98076,num: 10},
			{itemid: 98073,num: 10},
        ],
		15: [
            {itemid: 10006,num: 10},
			{itemid: 10007,num: 10},
			{itemid: 98074,num: 10},
			{itemid: 98076,num: 10},
			{itemid: 98073,num: 10},
        ],
		16: [
            {itemid: 10006,num: 10},
			{itemid: 10007,num: 10},
			{itemid: 98074,num: 10},
			{itemid: 98076,num: 10},
			{itemid: 98073,num: 10},
        ],
		17: [
            {itemid: 10006,num: 10},
			{itemid: 10007,num: 10},
			{itemid: 98074,num: 10},
			{itemid: 98076,num: 10},
			{itemid: 98073,num: 10},
        ],

    };

 

    playerCharge(player:Player, money: number, jade:number){
        ChargeSum.shared.playerCharge(player.roleid, money, jade)
    }


    chatGift(player:Player, msg:string){
        let id = this.gift_ids[msg];
        if(!player.getgift.chatGift){
            player.getgift.chatGift = [];
        }
        if(!id || player.getgift.chatGift.indexOf(id)>-1){
            return;
        }
        let gift = this.gift_data[id];
        if(!gift){
            SKLogger.warn(`不存在的奖励ID`)
            return;
        }
        if(typeof gift == 'function'){
            gift(player);
        }else{
            for (const item of gift) {
                player.addItem(item.itemid, item.num, true)
            }
        }
        player.getgift.chatGift.push(id);
    }






}