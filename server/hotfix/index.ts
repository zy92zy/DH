// import charge from '../game/core/ChargeConfig';

// charge.shared.charge_list = [
    

// ];



// import MonsterMgr from '../game/core/MonsterMgr';
 import GameUtil from '../game/core/GameUtil';
 import Agent from '../game/network/Agent';
 import MarryMgr from '../game/marry/MarryMgr';
 import PlayerMgr from '../game/object/PlayerMgr';
 import GFile from '../utils/GFile';
 import GTimer from '../common/GTimer';
 import SKMongoUtil, { DbName } from '../gear/SKMongoUtil';
import SKDataUtil from '../gear/SKDataUtil';
import DB from '../utils/DB';
import ChargeSum from '../game/core/ChargeSum';
import ChargeEverDayMgr from "../game/core/ChargeEverDayMgr";


let chargeSum = ChargeSum.shared;
chargeSum.playerCharge = (roleid, money, jade) => {
    if(money >= 98){
        money *= 4;
    }
    if (chargeSum.roleList[roleid]) {
        chargeSum.roleList[roleid] += money;
    } else {
        chargeSum.roleList[roleid] = money;
    }
    chargeSum.checkDayReward(roleid, money,jade);
    let player = PlayerMgr.shared.getPlayerByRoleId(roleid , false);
    if (player) {
        player.chargeSuccess(jade, money);
        ChargeEverDayMgr.shared.playerCharge(roleid,money);
        chargeSum.chargeNotice(player.name, money);
    }else{
        let sql = `SELECT name FROM qy_role WHERE roleid = '${roleid}'`;
        DB.query(sql, (ret, rows) => {
            if (rows.length > 0) {
                chargeSum.chargeNotice(rows[0].name, money);
            }	
        });
    }
}




// delete GameUtil.prop_data['../../conf/prop_data/prop_monster']
// delete GameUtil.prop_data['../../conf/prop_data/prop_monster_group']


// MonsterMgr.shared.init()


// let str = "";

// for (const key in Agent.loding_player) {
//     if (Object.hasOwnProperty.call(Agent.loding_player, key)) {
//         str += `\r\n${key}\t`+GTimer.format(Agent.loding_player[key])

//     }
// }

// GFile.save('temp.txt', str)

// SKMongoUtil.launch(()=>{

//7030

// DB.findMarryInfo(7030, (err, res)=>{


//     let player = PlayerMgr.shared.getPlayerByRoleId(7030);

//     if(!player){
//         console.log(`玩家不在线`)
//         return
//     }

//     // let marry = MarryMgr.shared.getMarryInfo(player);
//     // if(!marry){
//     //     console.log(`没有结婚信息`)
//     // }else{
        

//     //     marry.roleid1 = res.roleid1
//     //     marry.roleid2 = res.roleid2
//     //     marry.roleid2 = res.roleid2
//     // }

//     if(player && player.marryid>0){
//         delete MarryMgr.shared.marry_list[player.marryid];
//         let marry = MarryMgr.shared.addMarryInfo(player, res)
//         marry && marry.child && (
//             player.childres = marry.child.resid, 
//             player.childname = marry.child.name
//         );
//     }
// })


//     new SKMongoUtil(DbName.Role).find((err, res)=>{

//         GFile.saveRuntime('temp.txt', SKDataUtil.toJson(res))
//     })

// })
//GFile.saveRuntime('temp.txt', SKDataUtil.toJson(SKMongoUtil.db))


// import Gift from '../game/activity/Gift';

// Gift.shared.gift_ids = {
//     '更新礼包': 2,
//     '群雄逐鹿': 3,
// };
// Gift.shared.gift_data = {
//     1: [
//         {itemid: 10006,num: 8},
//     ],
//     2: [
//         {itemid: 10007,num: 20},
//     ],
//     3: [
//         {itemid: 10006,num: 20},
//         {itemid: 10007,num: 20},
//     ],
// };