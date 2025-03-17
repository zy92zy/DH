import PlayerMgr from "../object/PlayerMgr";
import NoticeMgr from "../core/NoticeMgr";
import WorldReward from "./WorldReward";

let hongbao_seed = 1000;

export default class WorldRewardMgr {

    static shared=new WorldRewardMgr();
    rewardList:any;

    constructor() {
        this.rewardList = {};
    }

    /**
     * 
     * @param {*} roleId 
     * @param {仙玉数量} num 
     * @param {红包数量} rewardNum 
     */
    sendReward(roleId:any, num:any, rewardNum:any) {
        return;
        let player:any = PlayerMgr.shared.getPlayerByRoleId(roleId);
        player.send('s2c_notice', {
             strRichText: '世界红包稍后开放',
        });
        // 扣除手续费后的数量
        let numYu = Math.floor(num - (num * 0.10));
        player = PlayerMgr.shared.getPlayerByRoleId(roleId);
        let str = player.CostFee(1, num, '发世界红包', false);
        if (str != '') {
            player.send('s2c_notice', {
                strRichText: str,
            });
        } else { // 成功
            let reward = new WorldReward(hongbao_seed);
            reward.role_name = player.name;
            reward.num = rewardNum;
            reward.jade_count = numYu;
            reward.init();

            this.rewardList[hongbao_seed] = reward;
            hongbao_seed++;
            //聊天框内  提示一下
            NoticeMgr.shared.sendNotice({
                type: 2,
                text: `${player.name} 发了一个世界红包，大家快来抢红包`,
            });
        }
    }
    /**
     *   请求 红包UI界面
     */
    getRewardList(player:any) {
        let rewardList:any = {};
         let list = this.rewardList;
        rewardList.list = [];
        for (const rewardid in this.rewardList) {
            if (this.rewardList.hasOwnProperty(rewardid)) {
                const reward = this.rewardList[rewardid];
                let state = 0;
                if(reward.isVaild()){
                    if(reward.hasReward(player.roleid)){
                        state = 1;
                    }
                }else{
                    state =2;
                    //可进行移除已领取完的红包
                    setTimeout(()=>{
                        delete this.rewardList[rewardid];
                    },7200*1000);
                }
                rewardList.list.push({
                    count:reward.jade_count,
                    num:reward.num,
                    tagid:reward.tagid,
                    state:state,
                    rolename:reward.role_name,
                })
            }
        }
        player.send('s2c_world_reward_list',rewardList);
    }
    /**
     *  领取红包
     */
    toReceive(tagID:any, roleId:any) {
        let player = PlayerMgr.shared.getPlayerByRoleId(roleId);
        if(!player){
            return;
        }
        let reward = this.rewardList[tagID];
        if(reward == null){
            return;
        }

        if(!reward.isVaild()){
            return;
        }

        if(reward.hasReward(roleId)){
            return;
        }
        
        let jade = reward.getReward(roleId);
        player.addMoney(1, jade, '世界红包'); 
        let noticejade = Math.floor((reward.jade_count / reward.num) * 1.5);
        if(jade >= noticejade){
            NoticeMgr.shared.sendNotice({
                type:2,
                text: `${player.name} 从 ${reward.role_name} 世界红包中获得, ${jade}仙玉`
            });
        }
        
        this.getRewardList(player)
    }

}