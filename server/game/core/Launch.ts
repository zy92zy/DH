/**
 * 启动模块
 *      起始模块，初始化各个管理器，启动游戏主逻辑循环
 */

import GameUtil from "./GameUtil";
import PlayerMgr from "../object/PlayerMgr";
import Signal from "./Signal";
import NoticeMgr from "./NoticeMgr";
import AgentMgr from "../network/AgentMgr";
import LotteryMgr from "./LotteryMgr";
import ActivityMgr from "../activity/ActivityMgr";
import BangMgr from "../bang/BangMgr";
import BangZhan from "../bang/BangZhan";
import RobotMgr from "../robot/RobotMgr";
import ChargeSum from "./ChargeSum";
import RelationMgr from "../object/RelationMgr";
import PalaceFight from "../activity/PalaceFight";
import MapMgr from "./MapMgr";
import LevelMgr from "../object/LevelMgr";
import GoodsMgr from "../item/GoodsMgr";
import EquipMgr from "../object/EquipMgr";
import EffectMgr from "../skill/core/EffectMgr";
import Shop from "../object/Shop";
import World from "../object/World";
import NpcMgr from "./NpcMgr";
import MonsterMgr from "./MonsterMgr";
import MallMgr from "./MallMgr";
import ZhenbukuiMgr from "../activity/ZhenbukuiMgr";
import PaiHangMgr from "./PaiHangMgr";
import PetMgr from "./PetMgr";
import PartnerConfigMgr from "../object/PartnerConfigMgr";
import TaskConfigMgr from "../task/TaskConfigMgr";
import NpcConfigMgr from "./NpcConfigMgr";
import SkillUtil from '../skill/core/SkillUtil';
import ShuiLuDaHui from '../activity/ShuiLuDaHui';
import SKLogger from '../../gear/SKLogger';
import BoxMgr from './BoxMgr';
import DugMgr from '../role/DugMgr';
import { MsgCode } from "../role/EEnum";
import ChargeEverDayMgr from "./ChargeEverDayMgr";
import DayReward from "./DayReward";
import WorldQA from "../activity/WorldQA";
import Skin from "../role/Skin";
import GFile from "../../utils/GFile";
import MarryMgr from "../marry/MarryMgr";
import DingZhi from "../dingzhi/DingZhi";
import Title from "../title/Title";
import Bagua from "../bagua/Bagua";
import TianceMgr from "../tiance/TianceMgr";
import Bianshen from "../bianshen/Bianshen";
import GiftBox from "../gift/GiftBox";
import YuanShen from "../yuanshen/YuanShen";



export default class Launch {
    static shared = new Launch();

    completeList: any = {
        ["BangMgr"]: false,
        ["PetMgr"]: false,
        ["EquipMgr"]: false,
        ["PaiHangMgr"]: false,
        ["ChargeMgr"]: false,
        //["SKData"]: false,
    };

    saveList: any = [
        Shop,
        PlayerMgr,
        MarryMgr,
    ];

    saved: number = 0;
    dt: number;

    constructor() {
        // 每秒4帧
        GameUtil.frameTime = 1000 / 4;
        // 主逻辑循环
        this.dt = 0;
    }

    mainloop() {
        if (isNaN(this.dt)) {
            // 每秒4帧
            GameUtil.frameTime = 1000 / 4;
            // 主逻辑循环
            this.dt = 0;
        }
        this.dt += GameUtil.frameTime;
        // 内部通信循环
        Signal.shared.update(this.dt);
        AgentMgr.shared.update(this.dt);
        NoticeMgr.shared.update(GameUtil.frameTime);
        PlayerMgr.shared.update(this.dt);
        LotteryMgr.shared.update(this.dt);
        ActivityMgr.shared.update(this.dt);
        PalaceFight.shared.update(GameUtil.frameTime);
        RelationMgr.shared.update(this.dt);
        GameUtil.gameTime += GameUtil.frameTime;
        // 1分钟校正
        if (this.dt % (1 * 60 * 1000) == 0) {
            GameUtil.gameTime = Date.now();
        }
    };

    start() {

        GFile.exists('./runtime', (has)=>{
            has || GFile.mkdir('./runtime')
        })


        GameUtil.gameTime = Date.now();
        setInterval(this.mainloop, GameUtil.frameTime);
        // 通知模块
        NoticeMgr.shared.init();
        SKLogger.info('通知模块初始化完毕!');
        // 地图模块
        MapMgr.shared.init();
        SKLogger.info('地图模块加载完毕!');
        // 任务配置
        TaskConfigMgr.shared.init();
        SKLogger.info('任务配置模块加载完毕!');
        // 地煞天元模块
        World.shared.init();
        // DWorld.shared.init();
        SKLogger.info('地煞天元模块加载完毕！');
        // NPC配置
        NpcConfigMgr.shared.init();
        SKLogger.info('Npc配置模块加载完毕！');
        // NPC
        NpcMgr.shared.init();
        SKLogger.info('Npc模块加载完毕！');

        // 玩家模块
        PlayerMgr.shared.init();
        SKLogger.info('角色属性模块加载完毕！');
        GoodsMgr.shared.init();
        SKLogger.info('物品模块加载完毕！');
        // 经验模块
        LevelMgr.shared.init();
        SKLogger.info('经验模块加载完毕！');
        // 技能模块
        SkillUtil.launch();
        SKLogger.info('技能模块加载完毕！');
        // 技能效果模块
        EffectMgr.shared.init();
        SKLogger.info('技能效果模块加载完毕！');
        // 装备模块
        EquipMgr.shared.init();
        // 帮派模块
        BangMgr.shared.init();
        // 怪物模块
        MonsterMgr.shared.init();
        SKLogger.info('怪物模块加载完毕！');

        // 商城模块
        MallMgr.shared.init();
        SKLogger.info('商城模块加载完毕!');

        //甄不亏模块
        ZhenbukuiMgr.shared.init();
        SKLogger.info('甄不亏模块加载完毕!');

        // 摆摊模块
        Shop.shared.init();
        SKLogger.info('摆摊模块加载完毕!');

        // 排行榜模块
        PaiHangMgr.shared.init();
        // 宠物模块
        PetMgr.shared.init();
        // 充值总额模块
        ChargeSum.shared.init();
        // 伙伴模块
        PartnerConfigMgr.shared.init();
        SKLogger.info('伙伴管理模块加载完毕！');
        // 活动模块
        ActivityMgr.shared.init();
        SKLogger.info('活动模块加载完毕!');
        // 开箱模块
        BoxMgr.shared.init();
        SKLogger.info(`开箱模块加载完毕`);
        // 挖宝模块
        DugMgr.shared.init();
        SKLogger.info(`挖宝模块加载完毕`);
        // 彩票模块
        LotteryMgr.shared.init();
        SKLogger.info('彩票模块加载完毕!');
        // 每日充值模块
        ChargeEverDayMgr.shared.init();
        SKLogger.info('每日充值模块加载完毕!');
        //关系模块
        RelationMgr.shared.init();
        SKLogger.info(`关系模块加载完毕`);
        //登陆奖励
        DayReward.shared.init();
        SKLogger.info(`登陆奖励模块加载完毕`);
        RobotMgr.shared.init();
        SKLogger.info(`机器人加载完毕`);
        WorldQA.shared.init();
        SKLogger.info(`答题活动加载完毕`);
        Skin.shared.init();
        MarryMgr.shared.init();
        Title.shared.init();
        Bagua.shared.init();
        TianceMgr.shared.init();
        Bianshen.shared.init();
        GiftBox.shared.init();
		YuanShen.shared.init();
    };

    checkAllComplete() {
        for (let key in this.completeList) {
            if (this.completeList[key] == false) {
                return false;
            }
        }
        return true;
    }

    complete(mod: any) {
        this.completeList[mod] = true;
        SKLogger.info(`模块:${mod}加载完成!`);
        if (this.checkAllComplete()) {
            // 连接代理模块
            AgentMgr.shared.start();
            // 向Gate服注册
            Signal.shared.registerServer();
            SKLogger.info('游戏服务器启动完毕，等待命令');
        }
    }
    // 全部存档
    saveAll(callback: (code: string) => void) {
        this.saved = 0;
        let self = this;
        PlayerMgr.shared.saveAll((msg: string) => {
            //SKLogger.info(msg);
            for (let key in self.saveList) {
                let mgr = self.saveList[key];
                mgr.saveAll((msg: string) => {
                    SKLogger.info(`全部存档:${msg}`);
                    self.saved++;
                    if (self.saved == self.saveList.length) {
                        callback(msg);
                    }
                });
            }
        });
    };
    // 关服
    close(time: number = 10, callback: (code: number) => void, mod:number=0) {
        this.saved = 0;
        PlayerMgr.shared.readyToCloseServer(time, mod);
        let self = this;
        setTimeout(() => {
            for (let key in this.saveList) {
                let mgr = this.saveList[key];
                mgr.saveAll((msg:string) => {
                    SKLogger.info(msg);
                    self.saved++;
                    if (self.saved == self.saveList.length) {
                        callback(MsgCode.SUCCESS);
                    }
                });
            }
            AgentMgr.shared.close();
            ActivityMgr.shared.close();
        }, (time+2) * 1000);
    };
    // 是否关闭
    isClose(): boolean {
        if (this.saved == this.saveList.length) {
            return true;
        }
        return false;
    }
}