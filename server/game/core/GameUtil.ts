// 游戏工具类
import * as path from "path";
import * as os from "os";
import PartnerConfigMgr from "../object/PartnerConfigMgr";
import Player from "../object/Player";
import SKLogger from "../../gear/SKLogger";
import SKDataUtil from "../../gear/SKDataUtil";
import GameConf from "../../etc/GameConf";
import { EAttrCalType, EAttrTypeL1, EAttrTypeL2, EMagicType, ESkillType, PayType } from "../role/EEnum";
import SKMongoUtil from "../../gear/SKMongoUtil";



export default class GameUtil {
    /**  默认使用益讯支付 */
    static payType: number = PayType.YIXUN;

    /**  REDIS服务是否开启 */
    static redisEnabled: boolean = true;
    /**  渠道 */
    static channel: string = "ccxy";
    /**  游戏配置 */
    static game_conf: any;
    /**  客户端最低版本控制 */
    static loginVersion: string = "2.1.5";
    /**  本地IP地址 */
    static localIP: string;
    /**  服务器配置 */
    static serverConfig: any;
    /**  服务器类型 */
    static serverType: string;
    /**  网络类型 */
    static netType: string;
    /**  服务器索引 */
    static serverId: number;
    /**  服务器名称 */
    static serverName: string;
    /**  世界时间控制 */
    static gameTime: number = 0;
    /**  游戏帧时间 */
    static frameTime: number;
    /**  5分钟后销毁玩家数据 */
    static playerSkipTime: number = 5 * 60 * 1000;
    /** 保留僵尸玩家数量 */
    static playerSkipNum: number = -1;
    /**  30分钟后销毁战斗数据 */
    static battleSkipTime: number = 30 * 60 * 1000;
    /**  每30分钟保存一次玩家数据 */
    static savePlayerTime: number = 30 * 60 * 1000;
    /**  是否关服 */
    static isClose: boolean = false;
    /**  是否全部存档中 */
    static isSave: boolean = false;
    /**  在线玩家人数 */
    static online: number = 0;
    /**  保存玩家人数 */
    static saveCount: number = 0;
    /**  保存玩家总数 */
    static saveTotal: number = 0;
    /**  存档失败纪录 */
    static saveFailed: any[];
    /**  存档成功纪录 */
    static saveRecord: any[];
    /**  坐骑技能升级道具 */
    static horseSkillUpItemId: number = 10607; /**  丹书密卷 */
    /**  坐骑洗炼道具 */
    static horseRefiningItemId: number = 10608; /**  净露玉瓶 */
    /**  炼化锁消耗仙玉 */
    static lockJade = [500000, 1000000, 1500000];
    /** 成就玩法门票 */
    static chengjiuItemId = 10017;
    static raceType: any = {
        Unknow: 0,
        Humen: 1,
        Sky: 2,
        Demon: 3,
        Ghost: 4,
        Dragon: 5,
    }

    static sexType: any = {
        Unknow: 0,
        Male: 1,
        Female: 2,
    }

    static limitPartnerLevel = 35;

    static attrToBaseAttr: any = {
        [EAttrTypeL1.HP_ADD]: {
            cal: EAttrCalType.ADD_PERCENT,
            target: EAttrTypeL1.HP,
        },
        [EAttrTypeL1.SPD_ADD]: {
            cal: EAttrCalType.ADD_PERCENT,
            target: EAttrTypeL1.SPD,
        },
        [EAttrTypeL1.MP_ADD]: {
            cal: EAttrCalType.ADD_PERCENT,
            target: EAttrTypeL1.MP,
        },
        [EAttrTypeL1.ATK_ADD]: {
            cal: EAttrCalType.ADD_PERCENT,
            target: EAttrTypeL1.ATK,
        },
        [EAttrTypeL1.HP_PERC]: {
            cal: EAttrCalType.PERCENT,
            target: EAttrTypeL1.HP,
        },
        [EAttrTypeL1.MP_PERC]: {
            cal: EAttrCalType.PERCENT,
            target: EAttrTypeL1.MP,
        },
        [EAttrTypeL1.ATK_PERC]: {
            cal: EAttrCalType.PERCENT,
            target: EAttrTypeL1.ATK,
        },
        [EAttrTypeL1.SPD_PERC]: {
            cal: EAttrCalType.PERCENT,
            target: EAttrTypeL1.SPD,
        },
    }

    static attrTypeL1Text = {
        /**  抗混乱 */
        'DHUNLUAN': EAttrTypeL1.K_CONFUSION, 
        /**  抗封印 */
        'DFENGYIN': EAttrTypeL1.K_SEAL, 
        /**  抗昏睡 */
        'DHUNSHUI': EAttrTypeL1.K_SLEEP, 
        /**  抗毒 */
        'DDU': EAttrTypeL1.K_POISON, 
        /**  抗风 */
        'DFENG': EAttrTypeL1.K_WIND, 
        /**  抗火 */
        'DHUO': EAttrTypeL1.K_FIRE, 
        /**  抗水 */
        'DSHUI': EAttrTypeL1.K_WATER, 
        /**  抗雷 */
        'DLEI': EAttrTypeL1.K_THUNDER, 
        /**  抗鬼火 */
        'DGUIHUO': EAttrTypeL1.K_WILDFIRE, 
        /**  抗遗忘 */
        'DYIWANG': EAttrTypeL1.K_FORGET, 
        /**  抗三尸 */
        'DSANSHI': EAttrTypeL1.K_BLOODRETURN, 
        /**  抗震慑 */
        'DZHENSHE': EAttrTypeL1.K_DETER, 
        /**  抗物理 */
        'DWULI': EAttrTypeL1.K_PHY_GET, 
        /**  物理吸收 */
        'PXISHOU': EAttrTypeL1.PHY_GET, 
        /**  命中 */
        'PMINGZHONG': EAttrTypeL1.PHY_HIT, 
        /**  闪避 */
        'PSHANBI': EAttrTypeL1.PHY_DODGE, 
        /** 连击 */
        'PLIANJI': EAttrTypeL1.PHY_COMBO, 
        /** 连击率 */
        'PLIANJILV': EAttrTypeL1.PHY_COMBO_PROB, 
        /** 狂暴 */
        'PKUANGBAO': EAttrTypeL1.PHY_DEADLY, 
        /** 破防 */
        'PPOFANG': EAttrTypeL1.PHY_BREAK, 
        /** 破防率 */
        'PPOFANGLV': EAttrTypeL1.PHY_BREAK_PROB, 
        /** 反震 */
        'PFANZHEN': EAttrTypeL1.PHY_REBOUND, 
        /** 反震率 */
        'PFANZHENLV': EAttrTypeL1.PHY_REBOUND_PROB, 
        /** 加防 */
        'ADEFEND': EAttrTypeL1.DEFEND_ADD, 
        /** 加速 */
        'ASPD': EAttrTypeL1.SPD_ADD, 
        /** 加攻 */
        'AATK': EAttrTypeL1.ATK_ADD, 
        /** 加血 */
        'AHP': EAttrTypeL1.HP_ADD, 
        /** 加蓝 */
        'AMP': EAttrTypeL1.MP_ADD, 
        /** 加强魅惑 */
        'AMEIHUO': EAttrTypeL1.CHARM_ADD, 
        /**  忽视抗混乱 */
        'HDHUNLUAN': EAttrTypeL1.HK_CONFUSION, 
        /**  忽视抗封印 */
        'HDFENGYIN': EAttrTypeL1.HK_SEAL, 
        /**  忽视抗昏睡 */
        'HDHUNSHUI': EAttrTypeL1.HK_SLEEP, 
        /**  忽视抗毒 */
        'HDDU': EAttrTypeL1.HK_POISON, 
        /**  忽视抗风 */
        'HDFENG': EAttrTypeL1.HK_WIND, 
        /**  忽视抗火 */
        'HDHUO': EAttrTypeL1.HK_FIRE, 
        /**  忽视抗水 */
        'HDSHUI': EAttrTypeL1.HK_WATER, 
        /**  忽视抗雷 */
        'HDLEI': EAttrTypeL1.HK_THUNDER, 
        /**  忽视抗鬼火 */
        'HDGUIHUO': EAttrTypeL1.HK_WILDFIRE, 
        /**  忽视抗遗忘 */
        'HDYIWANG': EAttrTypeL1.HK_FORGET, 
        /**  忽视抗三尸 */
        'HDSANSHI': EAttrTypeL1.HK_BLOODRETURN, 
        /**  忽视抗震慑 */
        'HDZHENSHE': EAttrTypeL1.HK_DETER, 
        /**  忽视抗物理 */
        'HDWULI': EAttrTypeL1.HK_PHY_GET, 
        /**  生命值 */
        'HP': EAttrTypeL1.HP, 
        /**  最在生命值 */
        'MAXHP': EAttrTypeL1.HP_MAX, 
        /**  魔法值 */
        'MP': EAttrTypeL1.MP, 
        /**  最大魔法值 */
        'MAXMP': EAttrTypeL1.MP_MAX, 
        /**  攻击力 */
        'ATK': EAttrTypeL1.ATK, 
        /**  速度 */
        'SPD': EAttrTypeL1.SPD, 
        /**  生命百分比 */
        'PHP': EAttrTypeL1.HP_PERC, 
        /**  魔法百分比 */
        'PMP': EAttrTypeL1.MP_PERC, 
        /**  攻击百分比 */
        'PATK': EAttrTypeL1.ATK_PERC, 
        /**  速度百分比 */
        'PSPD': EAttrTypeL1.SPD_PERC, 
        /**  水狂暴率 */
        'SHUIKBPRE': EAttrTypeL1.KB_WATER, 
        /**  雷狂暴率 */
        'LEIKBPRE': EAttrTypeL1.KB_THUNDER, 
        /**  火狂暴率 */
        'HUOKBPRE': EAttrTypeL1.KB_FIRE, 
        /**  风狂暴率 */
        'FENGKBPRE': EAttrTypeL1.KB_WIND, 
        /**  三尸狂暴率 */
        'SANSHIKBPRE': EAttrTypeL1.KB_BLOODRETURN, 
        /**  鬼火狂暴率 */
        'GUIHUOKBPRE': EAttrTypeL1.KB_WILDFIRE, 
        /**  水狂暴 */
        'SHUIKB': EAttrTypeL1.Q_WATER, 
        /**  雷狂暴 */
        'LEIKB': EAttrTypeL1.Q_THUNDER, 
        /**  火狂暴 */
        'HUOKB': EAttrTypeL1.Q_FIRE, 
        /**  风狂暴 */
        'FENGKB': EAttrTypeL1.Q_WIND, 
        /**  三尸狂暴 */
        'SANSHIKB': EAttrTypeL1.Q_BLOODRETURN, 
        /**  鬼火狂暴 */
        'GUIHUOKB': EAttrTypeL1.Q_WILDFIRE, 


        /**  加强横扫 */
        'ZHENJI': EAttrTypeL1.PHY_ZHENJI,
        /**  加强横扫 */
        'HENGSAO': EAttrTypeL1.PHY_HENGSAO,
        /**  治愈加强 */
        'ZHIYU': EAttrTypeL1.PHY_ZHIYU,
        /**  破甲加强 */
        'POJIA': EAttrTypeL1.PHY_POJIA,
        /**  破甲狂暴 */
        'POJIAKB': EAttrTypeL1.KB_POJIA,
        /**  横扫狂暴 */
        'HENGSAOKB': EAttrTypeL1.KB_HENGSAO,
        /**  震击狂暴 */
        'ZHENJIKB': EAttrTypeL1.KB_ZHENJI,
    }

    static attrTypeStrL1: any = {
        /**  抗混乱 */
        [EAttrTypeL1.K_CONFUSION]: 'DHUNLUAN', 
        /**  抗封印 */
        [EAttrTypeL1.K_SEAL]: 'DFENGYIN', 
        /**  抗昏睡 */
        [EAttrTypeL1.K_SLEEP]: 'DHUNSHUI', 
        /**  抗毒 */
        [EAttrTypeL1.K_POISON]: 'DDU', 
        /**  抗风 */
        [EAttrTypeL1.K_WIND]: 'DFENG', 
        /**  抗火 */
        [EAttrTypeL1.K_FIRE]: 'DHUO', 
        /**  抗水 */
        [EAttrTypeL1.K_WATER]: 'DSHUI', 
        /**  抗雷 */
        [EAttrTypeL1.K_THUNDER]: 'DLEI', 
        /**  抗鬼火 */
        [EAttrTypeL1.K_WILDFIRE]: 'DGUIHUO', 
        /**  抗遗忘 */
        [EAttrTypeL1.K_FORGET]: 'DYIWANG', 
        /**  抗三尸 */
        [EAttrTypeL1.K_BLOODRETURN]: 'DSANSHI', 
        /**  抗震慑 */
        [EAttrTypeL1.K_DETER]: 'DZHENSHE', 
        /**  抗物理 */
        [EAttrTypeL1.K_PHY_GET]: 'DWULI', 
        /**  物理吸收 */
        [EAttrTypeL1.PHY_GET]: 'PXISHOU', 
        /**  命中 */
        [EAttrTypeL1.PHY_HIT]: 'PMINGZHONG', 
        /**  闪避 */
        [EAttrTypeL1.PHY_DODGE]: 'PSHANBI', 

        /** 连击 */
        [EAttrTypeL1.PHY_COMBO]: 'PLIANJI', 
        /** 连击率 */
        [EAttrTypeL1.PHY_COMBO_PROB]: 'PLIANJILV', 
        /** 狂暴 */
        [EAttrTypeL1.PHY_DEADLY]: 'PKUANGBAO', 
        /** 破防 */
        [EAttrTypeL1.PHY_BREAK]: 'PPOFANG', 
        /** 破防率 */
        [EAttrTypeL1.PHY_BREAK_PROB]: 'PPOFANGLV', 
        /** 反震 */
        [EAttrTypeL1.PHY_REBOUND]: 'PFANZHEN', 
        /** 反震率 */
        [EAttrTypeL1.PHY_REBOUND_PROB]: 'PFANZHENLV', 
        /** 加防 */
        [EAttrTypeL1.DEFEND_ADD]: 'ADEFEND', 
        /** 加速 */
        [EAttrTypeL1.SPD_ADD]: 'ASPD', 
        /** 加攻 */
        [EAttrTypeL1.ATK_ADD]: 'AATK', 
        /** 加血 */
        [EAttrTypeL1.HP_ADD]: 'AHP', 
        /** 加蓝 */
        [EAttrTypeL1.MP_ADD]: 'AMP', 
        /** 加强魅惑 */
        [EAttrTypeL1.CHARM_ADD]: 'AMEIHUO', 

        /**  忽视抗混乱 */
        [EAttrTypeL1.HK_CONFUSION]: 'HDHUNLUAN', 
        /**  忽视抗封印 */
        [EAttrTypeL1.HK_SEAL]: 'HDFENGYIN', 
        /**  忽视抗昏睡 */
        [EAttrTypeL1.HK_SLEEP]: 'HDHUNSHUI', 
        /**  忽视抗毒 */
        [EAttrTypeL1.HK_POISON]: 'HDDU', 
        /**  忽视抗风 */
        [EAttrTypeL1.HK_WIND]: 'HDFENG', 
        /**  忽视抗火 */
        [EAttrTypeL1.HK_FIRE]: 'HDHUO', 
        /**  忽视抗水 */
        [EAttrTypeL1.HK_WATER]: 'HDSHUI', 
        /**  忽视抗雷 */
        [EAttrTypeL1.HK_THUNDER]: 'HDLEI', 
        /**  忽视抗鬼火 */
        [EAttrTypeL1.HK_WILDFIRE]: 'HDGUIHUO', 
        /**  忽视抗遗忘 */
        [EAttrTypeL1.HK_FORGET]: 'HDYIWANG', 
        /**  忽视抗三尸 */
        [EAttrTypeL1.HK_BLOODRETURN]: 'HDSANSHI', 
        /**  忽视抗震慑 */
        [EAttrTypeL1.HK_DETER]: 'HDZHENSHE', 
        /**  忽视抗物理 */
        [EAttrTypeL1.HK_PHY_GET]: 'HDWULI', 



        /////////////////////////////////////////
        [EAttrTypeL1.HP]: 'HP',
        [EAttrTypeL1.HP_MAX]: 'MAXHP',
        [EAttrTypeL1.MP]: 'MP',
        [EAttrTypeL1.MP_MAX]: 'MAXMP',
        [EAttrTypeL1.ATK]: 'ATK',
        [EAttrTypeL1.SPD]: 'SPD',

        [EAttrTypeL1.HP_PERC]: 'PHP',
        [EAttrTypeL1.MP_PERC]: 'PMP',
        [EAttrTypeL1.ATK_PERC]: 'PATK',
        [EAttrTypeL1.SPD_PERC]: 'PSPD',

        [EAttrTypeL1.KB_WATER]: 'SHUIKBPRE',
        [EAttrTypeL1.KB_THUNDER]: 'LEIKBPRE',
        [EAttrTypeL1.KB_FIRE]: 'HUOKBPRE',
        [EAttrTypeL1.KB_WIND]: 'FENGKBPRE',
        [EAttrTypeL1.KB_BLOODRETURN]: 'SANSHIKBPRE',
        [EAttrTypeL1.KB_WILDFIRE]: 'GUIHUOKBPRE',
        [EAttrTypeL1.Q_WATER]: 'SHUIKB',
        [EAttrTypeL1.Q_THUNDER]: 'LEIKB',
        [EAttrTypeL1.Q_FIRE]: 'HUOKB',
        [EAttrTypeL1.Q_WIND]: 'FENGKB',
        [EAttrTypeL1.Q_BLOODRETURN]: 'SANSHIKB',
        [EAttrTypeL1.Q_WILDFIRE]: 'GUIHUOKB',


        [EAttrTypeL1.PHY_ZHENJI]: 'ZHENJI',
        [EAttrTypeL1.PHY_HENGSAO]: 'HENGSAO',
        [EAttrTypeL1.PHY_ZHIYU]: 'ZHIYU',
        [EAttrTypeL1.PHY_POJIA]: 'POJIA',
        [EAttrTypeL1.KB_POJIA]: 'POJIAKBPRE',
        [EAttrTypeL1.KB_HENGSAO]: 'HENGSAOKBPRE',
        [EAttrTypeL1.KB_ZHENJI]: 'ZHENJIKBPRE',

    }

    static normalAtkSkill = 1001;
    static normalDefSkill = 1002;
    static normalDefEffect = 2;

    static mapType: any = {
        Unknow: 0,
        Map: 1,
        Instance: 2,
    }

    static livingType: any = {
        Unknow: 0,
        Player: 1,
        NPC: 2,
        Monster: 3,
        Pet: 4,
        Partner: 5,
    }

    static attrEquipTypeStr: any = {
        /**  致命（狂暴）%        */
        'FatalRate': EAttrTypeL1.PHY_DEADLY, 
        /**  命中%        */
        'HitRate': EAttrTypeL1.PHY_HIT, 
        /**  破防程度%      */
        'PhyDefNef': EAttrTypeL1.PHY_BREAK, 
        /**  破防概率%      */
        'PhyDefNefRate': EAttrTypeL1.PHY_BREAK_PROB, 
        /**  加强攻击%      */
        'AdAtkEhan': EAttrTypeL1.ATK_ADD, 
        /** 攻击（原数增加） */
        'Atk': EAttrTypeL1.ATK, 
        /**  加强速度%      */
        'AdSpdEhan': EAttrTypeL1.SPD_ADD, 
        /**  增加气血上限         */
        'HpMax': EAttrTypeL1.HP_MAX, 
        /**  增加法力上限         */
        'MpMax': EAttrTypeL1.MP_MAX, 
        /**  气血%        */
        'HpPercent': EAttrTypeL1.HP_ADD, 
        /**  法力%        */
        'MpPercent': EAttrTypeL1.MP_ADD, 
        /** 攻击变为% */
        'AtkPercent': EAttrTypeL1.ATK_PERC, 
        /**  速度 （原数增加）      */
        'Speed': EAttrTypeL1.SPD, 
        /**  抗水法%       */
        'RainDef': EAttrTypeL1.K_WATER, 
        /**  抗雷法%       */
        'ThunderDef': EAttrTypeL1.K_THUNDER, 
        /**  抗火法%       */
        'FireDef': EAttrTypeL1.K_FIRE, 
        /**  抗风法%       */
        'WindDef': EAttrTypeL1.K_WIND, 
        /**  忽视水%       */
        'RainDefNeg': EAttrTypeL1.HK_WATER, 
        /**  忽视雷%       */
        'ThunderDefNeg': EAttrTypeL1.HK_THUNDER, 
        /**  忽视火%       */
        'FireDefNeg': EAttrTypeL1.HK_FIRE, 
        /**  忽视风%       */
        'WindDefNeg': EAttrTypeL1.HK_WIND, 
        /**  抗封印%       */
        'SealDef': EAttrTypeL1.K_SEAL, 
        /**  抗混乱%       */
        'DisorderDef': EAttrTypeL1.K_CONFUSION, 
        /**  抗昏睡%       */
        'SleepDef': EAttrTypeL1.K_SLEEP, 
        /**  抗中毒%       */
        'PoisonDef': EAttrTypeL1.K_POISON, 
        /**  忽视封印%      */
        'SealDefNeg': EAttrTypeL1.HK_SEAL, 
        /**  忽视混乱%      */
        'DisorderDefNeg': EAttrTypeL1.HK_CONFUSION, 
        /**  忽视昏睡%      */
        'SleepDefNeg': EAttrTypeL1.HK_SLEEP, 
        /**  忽视毒%       */
        'PoisonDefNeg': EAttrTypeL1.HK_POISON, 
        /**  抗遗忘%       */
        'ForgetDef': EAttrTypeL1.K_FORGET, 
        /**  抗鬼火%       */
        'GfireDef': EAttrTypeL1.K_WILDFIRE, 
        /**  抗三尸%       */
        'SanshiDef': EAttrTypeL1.K_BLOODRETURN, 
        /**  忽视遗忘%      */
        'ForgetDefNeg': EAttrTypeL1.HK_FORGET, 
        /**  忽视鬼火%      */
        'GfireDefNeg': EAttrTypeL1.HK_WILDFIRE, 
        /**  忽视三尸%      */
        'SanshiDefNeg': EAttrTypeL1.HK_BLOODRETURN, 
        /**  忽视抗震慑%         */
        'ShockDefNeg': EAttrTypeL1.HK_DETER, 
        /**  加强魅惑%      */
        'CharmEhan': EAttrTypeL1.CHARM_ADD, 
        /**  物理吸收%      */
        'PhyDef': EAttrTypeL1.PHY_GET, 
        /** 加强加防% */
        'AdDefEhan': EAttrTypeL1.DEFEND_ADD, 
        /** 抗震慑% */
        'ShockDef': EAttrTypeL1.K_DETER, 
        /** 连击次数 */
        'HitCombo': EAttrTypeL1.PHY_COMBO, 
        /** 躲闪% */
        'VoidRate': EAttrTypeL1.PHY_DODGE,

        /**  根骨 */
        'Basecon': EAttrTypeL2.GENGU, 
        /**  灵性 */
        'Wakan': EAttrTypeL2.LINGXING, 
        /**  力量 */
        'Power': EAttrTypeL2.LILIANG, 
        /**  敏捷 */
        'Agility': EAttrTypeL2.MINJIE, 
        /**水狂暴率 */
        'RainFatalRate': EAttrTypeL1.KB_WATER,
        /**雷狂暴率 */
        'ThunderFatalRate': EAttrTypeL1.KB_THUNDER,
        /**火狂暴率 */
        'FireFatalRate': EAttrTypeL1.KB_FIRE,
        /**风狂暴率 */
        'WindFatalRate': EAttrTypeL1.KB_WIND,
        /**三尸狂暴率 */
        'SanshiFatalRate': EAttrTypeL1.KB_BLOODRETURN,
        /**鬼火狂暴率 */
        'GfireFatalRate': EAttrTypeL1.KB_WILDFIRE,
        /**水狂暴 */
        'RainFatalHurt': EAttrTypeL1.Q_WATER,
        /**雷狂暴 */
        'ThunderFatalHurt': EAttrTypeL1.Q_THUNDER,
        /**火狂暴 */
        'FireFatalHurt': EAttrTypeL1.Q_FIRE,
        /**风狂暴 */
        'WindFatalHurt': EAttrTypeL1.Q_WIND,
        /**三尸狂暴 */
        'SanshiFatalHurt': EAttrTypeL1.Q_BLOODRETURN,
        /**鬼火狂暴 */
        'GfireFatalHurt': EAttrTypeL1.Q_WILDFIRE,
        /**强力克金 */
        'Kgold': EAttrTypeL1.S_GOLD,
        /**强力克水 */
        'Kwood': EAttrTypeL1.S_WOOD,
        /**强力克水 */
        'Kwater': EAttrTypeL1.S_WATER,
        /**强力克火 */
        'Kfire': EAttrTypeL1.S_FIRE,
        /**强力克土 */
        'Kearth': EAttrTypeL1.S_SOIL,

        /**加强震击 */
        'AdZhenJi' : EAttrTypeL1.PHY_ZHENJI,
        /**加强横扫 */
        'AdHengSao' : EAttrTypeL1.PHY_HENGSAO,
        /**  治愈加强      */
        'AdZhiYu': EAttrTypeL1.PHY_ZHIYU, 
        /**  破甲加强      */
        'AdPoJia': EAttrTypeL1.PHY_POJIA, 
        /**震击狂暴 */
        'ZhenJiFatalRate': EAttrTypeL1.KB_ZHENJI,
        /**破甲狂暴 */
        'PoJiaFatalRate': EAttrTypeL1.KB_POJIA,
        /**横扫狂暴 */
        'HengSaoFatalRate': EAttrTypeL1.KB_HENGSAO,
        
    }
    
    static equipTypeNumerical = [
        EAttrTypeL1.ATK,
        EAttrTypeL1.SPD,
        // EAttrTypeL1.ADEFEND,
        EAttrTypeL1.PHY_COMBO,
        EAttrTypeL1.HP_MAX,
        EAttrTypeL1.MP_MAX,
        EAttrTypeL1.BONE,
        EAttrTypeL1.SPIRIT,
        EAttrTypeL1.STRENGTH,
        EAttrTypeL1.DEXTERITY,
        // EAttrTypeL1.GOLD,
        // EAttrTypeL1.WOOD,
        // EAttrTypeL1.WATER,
        // EAttrTypeL1.FIRE,
        // EAttrTypeL1.EARTH,
    ];

    static defineSkill = {
        [GameUtil.raceType.Humen]: {
            [GameUtil.sexType.Male]: {
                [ESkillType.JieDaoShaRen]: 0,
                [ESkillType.MiHunZui]: 0,
                [ESkillType.ZuoBiShangGuan]: 0,
                [ESkillType.ShiXinKuangLuan]: 0,
                [ESkillType.BaiRiMian]: 0,
                [ESkillType.SiMianChuGe]: 0,
            },
            [GameUtil.sexType.Female]: {
                [ESkillType.HeDingHongFen]: 0,
                [ESkillType.MiHunZui]: 0,
                [ESkillType.ZuoBiShangGuan]: 0,
                [ESkillType.WanDuGongXin]: 0,
                [ESkillType.BaiRiMian]: 0,
                [ESkillType.SiMianChuGe]: 0,
            }
        },
        [GameUtil.raceType.Demon]: {
            [GameUtil.sexType.Male]: {
                [ESkillType.TianWaiFeiMo]: 0,
                [ESkillType.ShouWangShenLi]: 0,
                [ESkillType.XiaoHunShiGu]: 0,
                [ESkillType.QianKunJieSu]: 0,
                [ESkillType.MoShenFuShen]: 0,
                [ESkillType.YanLuoZhuiMing]: 0,
            },
            [GameUtil.sexType.Female]: {
                [ESkillType.MoShenHuTi]: 0,
                [ESkillType.ShouWangShenLi]: 0,
                [ESkillType.XiaoHunShiGu]: 0,
                [ESkillType.HanQingMoMo]: 0,
                [ESkillType.MoShenFuShen]: 0,
                [ESkillType.YanLuoZhuiMing]: 0,
            }
        },
        [GameUtil.raceType.Ghost]: {
            [GameUtil.sexType.Male]: {
                [ESkillType.XueShaZhiGu]: 0,
                [ESkillType.LuoRiRongJin]: 0,
                [ESkillType.ShiXinFeng]: 0,
                [ESkillType.XiXingDaFa]: 0,
                [ESkillType.XueHaiShenChou]: 0,
                [ESkillType.MengPoTang]: 0,
            },
            [GameUtil.sexType.Female]: {
                [ESkillType.QinSiBingWu]: 0,
                [ESkillType.LuoRiRongJin]: 0,
                [ESkillType.ShiXinFeng]: 0,
                [ESkillType.QianNvYouHun]: 0,
                [ESkillType.XueHaiShenChou]: 0,
                [ESkillType.MengPoTang]: 0,
            }
        },
        [GameUtil.raceType.Sky]: {
            [GameUtil.sexType.Male]: {
                [ESkillType.FengLeiYongDong]: 0,
                [ESkillType.DianShanLeiMing]: 0,
                [ESkillType.JiaoLongChuHai]: 0,
                [ESkillType.XiuLiQianKun]: 0,
                [ESkillType.TianZhuDiMie]: 0,
                [ESkillType.JiuLongBingFeng]: 0,
            },
            [GameUtil.sexType.Female]: {
                [ESkillType.LieHuoJiaoYang]: 0,
                [ESkillType.DianShanLeiMing]: 0,
                [ESkillType.JiaoLongChuHai]: 0,
                [ESkillType.JiuYinChunHuo]: 0,
                [ESkillType.TianZhuDiMie]: 0,
                [ESkillType.JiuLongBingFeng]: 0,
            }
        },
        [GameUtil.raceType.Dragon]: {
            [GameUtil.sexType.Male]: {
                [ESkillType.LingXuYuFeng]: 0,
                [ESkillType.FeiJuJiuTian]: 0,
                [ESkillType.FengLeiWanYun]: 0,
                [ESkillType.ZhenTianDongDi]: 0,
                [ESkillType.FeiRanMoYu]: 0,
                [ESkillType.ZeBeiWanWu]: 0,
                [ESkillType.NiLin]: 1,
            },
            [GameUtil.sexType.Female]: {
                [ESkillType.BaiLangTaoTian]: 0,
                [ESkillType.CangHaiHengLiu]: 0,
                [ESkillType.FengLeiWanYun]: 0,
                [ESkillType.ZhenTianDongDi]: 0,
                [ESkillType.FeiRanMoYu]: 0,
                [ESkillType.ZeBeiWanWu]: 0,
                [ESkillType.NiLin]: 1,
            }
        },
    }

    // 成长值
    static growPre = {
        [GameUtil.raceType.Humen]: {
            [EAttrTypeL2.GENGU]: 1.2,
            [EAttrTypeL2.LINGXING]: 1,
            [EAttrTypeL2.LILIANG]: 1,
            [EAttrTypeL2.MINJIE]: 0.8,
        },
        [GameUtil.raceType.Demon]: {
            [EAttrTypeL2.GENGU]: 1.1,
            [EAttrTypeL2.LINGXING]: 0.6,
            [EAttrTypeL2.LILIANG]: 1.3,
            [EAttrTypeL2.MINJIE]: 1,
        },
        [GameUtil.raceType.Sky]: {
            [EAttrTypeL2.GENGU]: 1,
            [EAttrTypeL2.LINGXING]: 1.3,
            [EAttrTypeL2.LILIANG]: 0.7,
            [EAttrTypeL2.MINJIE]: 1,
        },
        [GameUtil.raceType.Ghost]: {
            [EAttrTypeL2.GENGU]: 1.2,
            [EAttrTypeL2.LINGXING]: 1,
            [EAttrTypeL2.LILIANG]: 0.95,
            [EAttrTypeL2.MINJIE]: 0.85,
        },
        [GameUtil.raceType.Dragon]: {
            [EAttrTypeL2.GENGU]: 1.2,
            [EAttrTypeL2.LINGXING]: 1,
            [EAttrTypeL2.LILIANG]: 0.95,
            [EAttrTypeL2.MINJIE]: 0.85,
        },
    }

   /**  基础一级属性 */
    static baseAttr = {
        [GameUtil.raceType.Humen]: {
            [EAttrTypeL1.HP]: 360,
            [EAttrTypeL1.MP]: 300,
            [EAttrTypeL1.ATK]: 70,
            [EAttrTypeL1.SPD]: 8,
        },
        [GameUtil.raceType.Demon]: {
            [EAttrTypeL1.HP]: 330,
            [EAttrTypeL1.MP]: 210,
            [EAttrTypeL1.ATK]: 80,
            [EAttrTypeL1.SPD]: 10,
        },
        [GameUtil.raceType.Ghost]: {
            [EAttrTypeL1.HP]: 300,
            [EAttrTypeL1.MP]: 390,
            [EAttrTypeL1.ATK]: 60,
            [EAttrTypeL1.SPD]: 10,
        },
        [GameUtil.raceType.Sky]: {
            [EAttrTypeL1.HP]: 270,
            [EAttrTypeL1.MP]: 350,
            [EAttrTypeL1.ATK]: 80,
            [EAttrTypeL1.SPD]: 9,
        },
        [GameUtil.raceType.Dragon]: {
            [EAttrTypeL1.HP]: 300,
            [EAttrTypeL1.MP]: 390,
            [EAttrTypeL1.ATK]: 60,
            [EAttrTypeL1.SPD]: 10,
        },
    }

   /**  转生修正 */
    static reliveFixAttr1 = {
        [GameUtil.raceType.Unknow]: {
            [GameUtil.sexType.Unknow]: {},
            [GameUtil.sexType.Male]: {},
            [GameUtil.sexType.Female]: {},
        },
        [GameUtil.raceType.Humen]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_CONFUSION]: 10,
                [EAttrTypeL1.K_SEAL]: 10,
                [EAttrTypeL1.K_SLEEP]: 10,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_POISON]: 10,
                [EAttrTypeL1.K_SEAL]: 10,
                [EAttrTypeL1.K_SLEEP]: 10,
            },
        },
        [GameUtil.raceType.Demon]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.HP]: 8.2,
                [EAttrTypeL1.MP]: 8.2,
                [EAttrTypeL1.SPD]: 6.15,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.HP]: 8.2,
                [EAttrTypeL1.MP]: 8.2,
                [EAttrTypeL1.K_DETER]: 9.2,
            },
        },
        [GameUtil.raceType.Ghost]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_WILDFIRE]: 10,
                [EAttrTypeL1.K_FORGET]: 10,
                [EAttrTypeL1.K_BLOODRETURN]: 10,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_WILDFIRE]: 10,
                [EAttrTypeL1.K_FORGET]: 10,
                [EAttrTypeL1.K_PHY_GET]: 15.3,
            },
        },
        [GameUtil.raceType.Sky]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_THUNDER]: 10,
                [EAttrTypeL1.K_WATER]: 10,
                [EAttrTypeL1.K_WIND]: 10,
            },
            [GameUtil.sexType.Female]: {
                /**  抗混乱 */
                [EAttrTypeL1.K_THUNDER]: 10, 
                /**  抗封印 */
                [EAttrTypeL1.K_WATER]: 10, 
                /**  抗昏睡 */
                [EAttrTypeL1.K_FIRE]: 10, 
            },
        },
        [GameUtil.raceType.Dragon]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_WILDFIRE]: 10,
                [EAttrTypeL1.K_FORGET]: 10,
                [EAttrTypeL1.K_BLOODRETURN]: 10,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_WILDFIRE]: 10,
                [EAttrTypeL1.K_FORGET]: 10,
                [EAttrTypeL1.K_PHY_GET]: 15.3,
            },
        },
    }

    static attrToBtlAttr: any = {
        [EAttrTypeL1.ATK]: [EAttrTypeL1.ATK_ADD],
        [EAttrTypeL1.K_PHY_GET]: [EAttrTypeL1.DEFEND_ADD, EAttrTypeL1.PHY_GET],
        [EAttrTypeL1.SPD]: [EAttrTypeL1.SPD_ADD],
    }

   /**  转生修正 */
    static reliveFixAttr2 = {
        [GameUtil.raceType.Unknow]: {
            [GameUtil.sexType.Unknow]: {},
            [GameUtil.sexType.Male]: {},
            [GameUtil.sexType.Female]: {},
        },
        [GameUtil.raceType.Humen]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_CONFUSION]: 15,
                [EAttrTypeL1.K_SEAL]: 15,
                [EAttrTypeL1.K_SLEEP]: 15,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_POISON]: 15,
                [EAttrTypeL1.K_SEAL]: 15,
                [EAttrTypeL1.K_SLEEP]: 15,
            },
        },
        [GameUtil.raceType.Demon]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.HP]: 12.3,
                [EAttrTypeL1.MP]: 12.3,
                [EAttrTypeL1.SPD]: 9.23,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.HP]: 12.3,
                [EAttrTypeL1.MP]: 12.3,
                [EAttrTypeL1.K_DETER]: 13.8,
            },
        },
        [GameUtil.raceType.Ghost]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_WILDFIRE]: 15,
                [EAttrTypeL1.K_FORGET]: 15,
                [EAttrTypeL1.K_BLOODRETURN]: 15,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_WILDFIRE]: 15,
                [EAttrTypeL1.K_FORGET]: 15,
                [EAttrTypeL1.K_PHY_GET]: 23,
            },
        },
        [GameUtil.raceType.Sky]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_THUNDER]: 15,
                [EAttrTypeL1.K_WATER]: 15,
                [EAttrTypeL1.K_WIND]: 15,
            },
            [GameUtil.sexType.Female]: {
                /**  抗混乱 */
                [EAttrTypeL1.K_THUNDER]: 15, 
                /**  抗封印 */
                [EAttrTypeL1.K_WATER]: 15, 
                /**  抗昏睡 */
                [EAttrTypeL1.K_FIRE]: 15, 
            },
        },
        [GameUtil.raceType.Dragon]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_WILDFIRE]: 15,
                [EAttrTypeL1.K_FORGET]: 15,
                [EAttrTypeL1.K_BLOODRETURN]: 15,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_WILDFIRE]: 15,
                [EAttrTypeL1.K_FORGET]: 15,
                [EAttrTypeL1.K_PHY_GET]: 23,
            },
        },
    }

   /**  转生修正3 */
    static reliveFixAttr3 = {
        [GameUtil.raceType.Unknow]: {
            [GameUtil.sexType.Unknow]: {},
            [GameUtil.sexType.Male]: {},
            [GameUtil.sexType.Female]: {},
        },
        [GameUtil.raceType.Humen]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_CONFUSION]: 20,
                [EAttrTypeL1.K_SEAL]: 20,
                [EAttrTypeL1.K_SLEEP]: 20,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_POISON]: 20,
                [EAttrTypeL1.K_SEAL]: 20,
                [EAttrTypeL1.K_SLEEP]: 20,
            },
        },
        [GameUtil.raceType.Demon]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.HP]: 16.4,
                [EAttrTypeL1.MP]: 16.4,
                [EAttrTypeL1.SPD]: 12.3,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.HP]: 16.4,
                [EAttrTypeL1.MP]: 16.4,
                [EAttrTypeL1.K_DETER]: 18.5,
            },
        },
        [GameUtil.raceType.Ghost]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_WILDFIRE]: 20,
                [EAttrTypeL1.K_FORGET]: 20,
                [EAttrTypeL1.K_BLOODRETURN]: 20,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_WILDFIRE]: 20,
                [EAttrTypeL1.K_FORGET]: 20,
                [EAttrTypeL1.K_PHY_GET]: 30.6,
            },
        },
        [GameUtil.raceType.Sky]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_THUNDER]: 20,
                [EAttrTypeL1.K_WATER]: 20,
                [EAttrTypeL1.K_WIND]: 20,
            },
            [GameUtil.sexType.Female]: {
                /**  抗混乱 */
                [EAttrTypeL1.K_THUNDER]: 20, 
                /**  抗封印 */
                [EAttrTypeL1.K_WATER]: 20, 
                /**  抗昏睡 */
                [EAttrTypeL1.K_FIRE]: 20, 
            },
        },[GameUtil.raceType.Dragon]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_WILDFIRE]: 20,
                [EAttrTypeL1.K_FORGET]: 20,
                [EAttrTypeL1.K_BLOODRETURN]: 20,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_WILDFIRE]: 20,
                [EAttrTypeL1.K_FORGET]: 20,
                [EAttrTypeL1.K_PHY_GET]: 30.6,
            },
        }
    }
   /**  转生修正4 */
    
    static reliveFixAttr4 = {
        [GameUtil.raceType.Unknow]: {
            [GameUtil.sexType.Unknow]: {},
            [GameUtil.sexType.Male]: {},
            [GameUtil.sexType.Female]: {},
        },
        [GameUtil.raceType.Humen]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_CONFUSION]: 25,
                [EAttrTypeL1.K_SEAL]: 25,
                [EAttrTypeL1.K_SLEEP]: 25,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_POISON]: 25,
                [EAttrTypeL1.K_SEAL]: 25,
                [EAttrTypeL1.K_SLEEP]: 25,
            },
        },
        [GameUtil.raceType.Demon]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.HP]: 22.4,
                [EAttrTypeL1.MP]: 22.4,
                [EAttrTypeL1.SPD]: 24.3,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.HP]: 22.4,
                [EAttrTypeL1.MP]: 22.4,
                [EAttrTypeL1.K_DETER]: 24.5,
            },
        },
        [GameUtil.raceType.Ghost]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_WILDFIRE]: 25,
                [EAttrTypeL1.K_FORGET]: 25,
                [EAttrTypeL1.K_BLOODRETURN]: 25,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_WILDFIRE]: 25,
                [EAttrTypeL1.K_FORGET]: 25,
                [EAttrTypeL1.K_PHY_GET]: 42.6,
            },
        },
        [GameUtil.raceType.Sky]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_THUNDER]: 25,
                [EAttrTypeL1.K_WATER]: 25,
                [EAttrTypeL1.K_WIND]: 25,
            },
            [GameUtil.sexType.Female]: {
                /**  抗混乱 */
                [EAttrTypeL1.K_THUNDER]: 25, 
                /**  抗封印 */
                [EAttrTypeL1.K_WATER]: 25, 
                /**  抗昏睡 */
                [EAttrTypeL1.K_FIRE]: 25, 
            },
        },
        [GameUtil.raceType.Dragon]: {
            [GameUtil.sexType.Male]: {
                [EAttrTypeL1.K_WILDFIRE]: 25,
                [EAttrTypeL1.K_FORGET]: 25,
                [EAttrTypeL1.K_BLOODRETURN]: 25,
            },
            [GameUtil.sexType.Female]: {
                [EAttrTypeL1.K_WILDFIRE]: 25,
                [EAttrTypeL1.K_FORGET]: 25,
                [EAttrTypeL1.K_PHY_GET]: 42.6,
            },
        },
    }
    /** 法系id */
    static EMagicType = { 
        /** 物理 */
        Physics: 0, 
        /** 混乱 */
        Chaos: 1, 
        /** 毒 */
        Toxin: 2, 
        /** 昏睡 */
        Sleep: 3, 
        /** 封印 */
        Seal: 4, 
        /** 风法 */
        Wind: 5, 
        /** 火法 */
        Fire: 6, 
        /** 雷法 */
        Thunder: 7, 
        /** 水法 */
        Water: 8, 
        /**  攻击类法术最大值 */
        AtkSkillMax: 9, 
        /** 加速 */
        Speed: 10, 
        /** 加防 */
        Defense: 11, 
        /** 加攻 */
        Attack: 12, 
        /** 震慑 */
        Frighten: 13, 
        /** 三尸 */
        ThreeCorpse: 14, 
        /** 魅惑 */
        Charm: 15, 
        /** 鬼火 */
        GhostFire: 16, 
        /** 遗忘 */
        Forget: 17, 
        /**  减防 */
        SubDefense: 18, 
        /**  隐身 */
        YinShen: 19, 
        /**  回血技能 */
        Rrsume: 20, 
        /**  飞龙探云手 */
        StealMoney: 21,
        /**  震击 */
        ZhenJi: 22,
        /**  扫击 */
        SaoJi: 23,

    }

    static atkSkills = [
        /** 物理 */
        EMagicType.PHYSICS, 
        /** 混乱 */
        EMagicType.Chaos, 
        /** 毒 */
        EMagicType.Toxin, 
        /** 昏睡 */
        EMagicType.Sleep, 
        /** 封印 */
        EMagicType.Seal, 
        /** 风法 */
        EMagicType.Wind, 
        /** 火法 */
        EMagicType.Fire, 
        /** 雷法 */
        EMagicType.Thunder, 
        /** 水法 */
        EMagicType.Water, 
        /** 震慑 */
        EMagicType.Frighten, 
        /** 三尸 */
        EMagicType.ThreeCorpse, 
        /** 魅惑 */
        EMagicType.Charm, 
        /** 鬼火 */
        EMagicType.GhostFire, 
        /** 遗忘 */
        EMagicType.Forget, 
        /**  减防 */
        EMagicType.SubDefense, 
    ]

    static skillActOn: any = {
        All: 0,
        Enemy: 1,
        Self: 2,
    }

    static defSkills: any = [
        /** 加速 */
        EMagicType.SPEED, 
        /** 加防 */
        EMagicType.Defense, 
        /** 加攻 */
        EMagicType.Attack, 
        /** 隐身 */
        EMagicType.YinShen, 
    ]

    static debuffSkills: any = [
        /** 混乱 */
        EMagicType.Chaos, 
        /** 毒 */
        EMagicType.Toxin, 
        /** 昏睡 */
        EMagicType.Sleep, 
        /** 封印 */
        EMagicType.Seal, 
        /** 魅惑 */
        EMagicType.Charm, 
        /** 遗忘 */
        EMagicType.Forget, 
        /**  减防 */
        EMagicType.SubDefense, 
    ]

    /** 法系id */
    static buffSkillType: any = { 
        /** 物理 */
        [EMagicType.PHYSICS]: 0, 
        /** 混乱 */
        [EMagicType.Chaos]: 2, 
        /** 毒 */
        [EMagicType.Toxin]: 0, 
        /** 昏睡 */
        [EMagicType.Sleep]: 0, 
        /** 封印 */
        [EMagicType.Seal]: 0, 
        /** 风法 */
        [EMagicType.Wind]: 0, 
        /** 火法 */
        [EMagicType.Fire]: 0, 
        /** 雷法 */
        [EMagicType.Thunder]: 0, 
        /** 水法 */
        [EMagicType.Water]: 0, 
        /** 加速 */
        [EMagicType.SPEED]: 1, 
        /** 加防 */
        [EMagicType.Defense]: 1, 
        /** 加攻 */
        [EMagicType.Attack]: 1, 
        /** 震慑 */
        [EMagicType.Frighten]: 0, 
        /** 三尸 */
        [EMagicType.ThreeCorpse]: 0, 
        /** 魅惑 */
        [EMagicType.Charm]: 2, 
        /** 鬼火 */
        [EMagicType.GhostFire]: 0, 
        /** 遗忘 */
        [EMagicType.Forget]: 2, 
        /**  减防 */
        [EMagicType.SubDefense]: 2, 
    }
   /**  抗性列表 */
    static skillTypeKangXing: any = {
        [EMagicType.Chaos]: EAttrTypeL1.K_CONFUSION,
        [EMagicType.Seal]: EAttrTypeL1.K_SEAL,
        [EMagicType.Sleep]: EAttrTypeL1.K_SLEEP,
        [EMagicType.Toxin]: EAttrTypeL1.K_POISON,
        [EMagicType.Wind]: EAttrTypeL1.K_WIND,
        [EMagicType.Fire]: EAttrTypeL1.K_FIRE,
        [EMagicType.Water]: EAttrTypeL1.K_WATER,
        [EMagicType.Thunder]: EAttrTypeL1.K_THUNDER,
        [EMagicType.GhostFire]: EAttrTypeL1.K_WILDFIRE,
        [EMagicType.Forget]: EAttrTypeL1.K_FORGET,
        [EMagicType.ThreeCorpse]: EAttrTypeL1.K_BLOODRETURN,
        [EMagicType.Frighten]: EAttrTypeL1.K_DETER,
        [EMagicType.PHYSICS]: EAttrTypeL1.K_PHY_GET,
    }
   /**  忽视列表 */
    static skillTypeStrengthen: any = {
        /**  忽视抗混乱 */
        [EMagicType.Chaos]: EAttrTypeL1.HK_CONFUSION, 
        [EMagicType.Toxin]: EAttrTypeL1.HK_POISON,
        [EMagicType.Sleep]: EAttrTypeL1.HK_SLEEP,
        [EMagicType.Seal]: EAttrTypeL1.HK_SEAL,
        [EMagicType.Wind]: EAttrTypeL1.HK_WIND,
        [EMagicType.Fire]: EAttrTypeL1.HK_FIRE,
        [EMagicType.Thunder]: EAttrTypeL1.HK_THUNDER,
        [EMagicType.Water]: EAttrTypeL1.HK_WATER,
        [EMagicType.GhostFire]: EAttrTypeL1.HK_WILDFIRE,
        [EMagicType.Forget]: EAttrTypeL1.HK_FORGET,
        [EMagicType.ThreeCorpse]: EAttrTypeL1.HK_BLOODRETURN,
        [EMagicType.Frighten]: EAttrTypeL1.HK_DETER,
        [EMagicType.PHYSICS]: EAttrTypeL1.HK_PHY_GET,
    }

    static wuXingStrengthen: any = {
        /**  金 */
        [EAttrTypeL1.GOLD]: EAttrTypeL1.WOOD, 
        /**  木 */
        [EAttrTypeL1.WOOD]: EAttrTypeL1.SOIL, 
        /**  水 */
        [EAttrTypeL1.WATER]: EAttrTypeL1.FIRE, 
        /**  火 */
        [EAttrTypeL1.FIRE]: EAttrTypeL1.GOLD, 
        /**  土 */
        [EAttrTypeL1.SOIL]: EAttrTypeL1.WATER, 
    }
    static WuXingKeStrengthen: any = {
        /** 强力克金 */
        [EAttrTypeL1.S_GOLD]: EAttrTypeL1.GOLD, 
        /** 强力克木 */
        [EAttrTypeL1.S_WOOD]: EAttrTypeL1.WOOD, 
        /** 强力克水 */
        [EAttrTypeL1.S_WATER]: EAttrTypeL1.WATER, 
        /** 强力克火 */
        [EAttrTypeL1.S_FIRE]: EAttrTypeL1.FIRE, 
        /** 强力克土 */
        [EAttrTypeL1.S_SOIL]: EAttrTypeL1.SOIL, 
    }

   /**  战斗回合类型 */
    
    static BtlActionType: any = {
        /**  主动 */
        Initiative: 1, 
        /**  被动 */
        Passive: 2, 
    }



    static buffType = {
        /** 无buff */
        None: 0, 
        /** 循环伤害 */
        Loop: 1, 
        /**  一次计算 */
        Once: 2, 
    }

   /**  战斗回合内 响应 */
    
    static btlRespone: any = {
        /**  无响应 */
        NoThing: 0, 
        /**  防御 */
        Defense: 1, 
        /**  闪避 */
        Dodge: 2, 
        /**  暴击 */
        CriticalHit: 3, 
        /**  被抓 */
        Catched: 4, 
        /**  不能被抓 */
        NoCatch: 5, 
        /**  捕捉失败 */
        CatchFail: 6, 
        Protect: 7,
        /** 被保护 */
        BeProtected: 8, 
        SummonBack: 9,
        Summon: 10,
        SummonFaild: 11,
        PoFang: 12,
    }

    static skillEffect = {
        /**  人数 */
        cnt: 1, 
        /**  回合 */
        round: 0, 
        /** 伤害 */
        hurt: 0, 
        /** 伤害百分比 */
        hurtpre: 0, 
        /**  加血百分比 */
        hppre: 0, 
        /**  加蓝百分比 */
        mppre: 0, 
        /**  法力减少- */
        smppre: 0, 
        /**  命中增加+ */
        hit: 0, 
        /**  速度增加+ */
        spd: 0, 
        /**  攻击增加+ */
        atk: 0, 
        /**  控制抗性+ */
        kongzhi: 0, 
        /**  法伤抗性+ */
        fashang: 0, 
        /**  防御+ */
        fangyu: 0, 
        /**  增加血量 */
        hp: 0, 
        /**  智能回血（用于吸血类技能） */
        aihp: 0, 
        /**  减少控制抗性 */
        skongzhi: 0, 
        /**  隐身 */
        yinshen: 0, 
        /** 五行 */
        attrtype: 0, 
        /** 五行数值 */
        attrnum: 0, 
    }

    static wuXing = {
        Gold: 1,
        Wood: 2,
        Water: 3,
        Fire: 4,
        Earth: 5,
    }

    static actType = {
        Skill: 1,
        Item: 2,
        /**  召唤 */
        Summon: 3, 
        /**  逃跑 */
        RunAway: 4, 
        /**  保护 */
        Protect: 5, 
        /** 捕捉 */
        Catch: 6, 
        /** 召还 */
        SummonBack: 7, 
    }



    static ENpcKind = {
        ERole: 1,
        EThing: 2,
        EBomb: 3
    }
   /** 人物转职后的等级表 */
    
    static reliveLimit: any = {
        [1]: {
            level: 100,
            tolevel: 80,
            price: 100,
        },
        [2]: {
            level: 120,
            tolevel: 100,
            price: 100,
        },
        [3]: {
            level: 140,
            tolevel: 120,
            price: 100,
        },
        [4]: {
            level: 180,
            tolevel: 150,
            price: 100,
        },
    }

    static cantPKMaps = [
        /**  长安 */
        1011, 
        /**  监狱 */
        1201, 
        /**  天宫 */
        1002, 
        /**  皇宫 */
        1000, 
        /**  金銮殿 */
        1206, 
        /**  地府 */
        1012, 
        /**  白骨洞 */
        1202, 
        /**  斜月三星洞 */
        1203, 
        /**  兜率宫 */
        1208, 
        /**  兰若寺 */
        1013, 
        /**  灵兽村 */
        1014, 
        /**  帮派 */
        3002, 
        /**  家 */
        4001, 
    ];

   /** 宠物技能格子解锁消耗 */
    
    static unlock = [1,1,1,2,2,4,8,16,32,64];

   /** 好友聊天限制 */
    static limitFriendChatLevel = 120;

   /**  帮派聊天充值总额限制 */
    static limitBangChatCharge = 0;

   /**  帮派聊天等级限制 */
    static limitBangChatLevel = 100;

   /**  世界聊天等级限制 */
    static limitWorldChatLevel = 140;
    //static limitWorldChatLevel = 1;

   /**  世界聊天充值总额限制 */
    static limitWorldChatCharge = 30;
    
   /** 宠物数量上限 */
    static limitPetNum = 30;

   /**  创建帮会总额限制 */
    static limitGreateBangChargeCount = 100;

    static login_status = 0;
    static limit = 10;

    static limitBroadcastList: string[] = [
        'qq',
        'QQ',
        '微信',
        '君羊',
        '君.羊',
        '龙马服',
        '残端',
        '私服',
        '回档',
        '１',
        '２',
        '３',
        '４',
        '５',
        '６',
        '７',
        '８',
        '９',
        '０',
    ]
    static addLimitWord(text: string) {
        if (text && text.length > 0) {
            if (this.limitBroadcastList.indexOf(text) == -1)
                this.limitBroadcastList.push(text);
        }
    }

    static limitBagKindNum = 300;
    static limitLockerKindNum = 300;

    static shenBingBroke: number[] = [
        5000,
        2500,
        1000,
        500,
    ]

    static equipPos: any = {
        UNKNOW: 1,
        USE: 2,
        BAG: 3,
        BANK: 4,
    }

    static PKLevelLimit = 120;

    static petGrade: any = {
        Normal: 0,
        High: 1,
        Special: 2,
        Shen: 3,
        SSR: 4,
    }

    static goldKind: any = {
        Money: 0,
        Jade: 1,
        BindJade: 2,
        SLDH_Score: 3,
    }

    static titleType: any = {
        /** 图片类称谓 */
        IMGTitle: 0, 
        /** 普通文字称谓，如帮派类称谓 */
        CommonTitle: 1, 
        /** 结拜类称谓 */
        BroTitle: 2, 
        /** 夫妻类称谓 */
        CoupleTitle: 3, 
    }

    static titleImgType:any = {



    };

    static titleBangType: any = {
        NoTitle: 0,
        ShuiLuZhanShen: 86,
        Shancaitongzi: 43,
        Couple: 200,
        Brother: 201,
        /**  帮主 */
        BangZhu: 227, 
        /**  副帮主 */
        FuBangZhu: 226, 
        /**  左护法 */
        ZuoHuFa: 225, 
        /**  右护法 */
        YouHuFa: 224, 
        /**  长老 */
        ZhangLao: 223, 
        /**  堂主 */
        TangZhu: 222, 
        /**  帮众 */
        BangZhong: 221, 
    }

    static bangPost = {
        /**  未知 */
        Unknow: 0, 
        /**  帮主 */
        BangZhu: 1, 
        /**  副帮主 */
        FuBangZhu: 2, 
        /**  左护法 */
        ZuoHuFa: 3, 
        /**  右护法 */
        YouHuFa: 4, 
        /**  长老 */
        ZhangLao: 5, 
        /**  堂主 */
        TangZhu: 6, 
        /**  帮众 */
        BangZhong: 7, 
    }

    static relationType = {
        /**  结拜 */
        Brother: 0, 
        /**  结婚 */
        Couple: 1, 
    }

    static relationTypeMembersCount = {
        [GameUtil.relationType.Brother]: 5,
        [GameUtil.relationType.Couple]: 2,
    }

    static lingHouMinMoney = 2000;
    static LingHouRetMoney = 10000;
    static brotherMoney = 1000000;
    static schemeUseMoney = 10000000;
    static prop_data: any = {};
    static catch_data: any = {};

    static starList = [
        10051,
        10052,
        10053,
        10054,
        10055,
        10056,
        10057,
        10058,
        10059,
        10060,
        10061,
        10062,
    ];

    static limitWordList: string[] = [
        '系统',
        '官方',
        '测试',
        'gm',
        'Gm',
        'GM',
        '精灵',
        '管理',
        '内测',
        '内部',
        '客服',
        '技术',
        '公告',
        '公测',
        '垃圾',
        '毛泽东',
        '周恩来',
        '刘少奇',
        '习近平',
        '李克强',
        '朱德',
        '丁磊',
        '你妈',
        '共产党',
        '纵横',
    ]

    static numchar: string[] = [
        'q', 'Q', 'O',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        '１', '２', '３', '４', '５', '６', '７', '８', '９', '０',
        '一', '二', '三', '四', '五', '六', '七', '八', '九', '零', '〇',
        '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨',
        '⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹',
        '₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉',
        '⑴', '⑵', '⑶', '⑷', '⑸', '⑹', '⑺', '⑻', '⑼',
        '⒈', '⒉', '⒊', '⒋', '⒌', '⒍', '⒎', '⒏', '⒐',
        'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ',
        '❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾',
        '➊', '➋', '➌', '➍', '➎', '➏', '➐', '➑', '➒', '➓',
        '⓵', '⓶', '⓷', '⓸', '⓹', '⓺', '⓻', '⓼', '⓽',
        '㈠', '㈡', '㈢', '㈣', '㈤', '㈥', '㈦', '㈧', '㈨',
        '壹', '贰', '叁', '叄', '肆', '伍', '陆', '柒', '捌', '扒', '玖',
        '伞', '溜', '君', '羊', '久', '巴',
        '玉', '仙', '裙', '群', '西', '游',
    ]

    static fdump(obj: any) {
        let t = 0;
        let repeat = (str: any, n: any) => {
            return new Array(n).join(str);
        }
        let adump = (object: any) => {
            t++;
            if (object && typeof object === "object") {
                for (const key in object) {
                    if (object.hasOwnProperty(key)) {
                        const value = object[key];
                        if (value && typeof value === "object") {
                            let isa = Array.isArray(value);
                            console.log(repeat('\t', t), key + ':' + (isa ? '[' : '{'));
                            adump(value);
                            t--;
                            console.log(repeat('\t', t), isa ? ']' : '}');
                        } else {
                            console.log(repeat('\t', t), key + ':' + value);
                        }
                    }
                }
            } else {
                console.log(repeat('\t', t), object);
            }
        }
        adump(obj);
    }

    static dump(...args: any[]) {
        for (const arg of args) {
            this.fdump(arg);
        }
    }

    static seed_index: number = 10000;
    static buff_index: number = 10000;

    static getAutoAddId(): number {
        GameUtil.seed_index++;
        return GameUtil.seed_index;
    }

    static getAutoBuffId(): number {
        GameUtil.buff_index++;
        return GameUtil.buff_index;
    }

    static random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static getFlag(nNum: number, nIndex: number): number {
        if (nIndex < 0 || nIndex > 31)
            return 0;
        let nRet = (nNum >> nIndex) & 1;
        return nRet;
    }

    static setFlag(nNum: any, nIndex: number, bValue: number): number {
        if (nIndex < 0 || nIndex > 31)
            return null;
        if (bValue != 0 && bValue != 1)
            return null;

        let bFlag = GameUtil.getFlag(nNum, nIndex);
        if (bFlag > bValue) {
            nNum -= (1 << nIndex);
        }
        if (bFlag < bValue) {
            nNum += (1 << nIndex);
        }
        return nNum;
    }


    static EPlayerFlag = {
        EBanSpeak: 1,
    }


    static ENpcCreater = {
        ESystem: 0,
        EPlayer: 1,
        ETeam: 2
    }

    static checkLimitWord = function (msg: any): boolean {
        let numcount = 0;
        for (let k = 0; k < msg.length; k++) {
            let msgchar: any = msg[k];
            if (GameUtil.numchar.indexOf(msgchar) != -1) {
                numcount++
                if (numcount >= 6) {
                    return false;
                }
            }
        }
        // for (let i = 0; i < GameUtil.limitBroadcastList.length; i++) {
        //     const fword = GameUtil.limitBroadcastList[i];
        //     if (msg.indexOf(fword) != -1) {
        //         return false;
        //     }
        // }
        for (let i = 0; i < GameUtil.limitBroadcastList.length; i++) {
            const fword = GameUtil.limitBroadcastList[i];
            let exp = "[" + fword.split('').join("].*[") + "]";
            let reg = new RegExp(exp, 'im');
            if (reg.test(msg)) {
                return false;
            }
        }
        return true;
    }

    static serverState: any = {
        /**  流畅 */
        lower: 1,   
        /**  拥堵 */
        high: 2,     
        /**  关闭 */
        close: 3,    
    }

    static MonkeyPos: any = [
        // 1007 大唐边境
        { mapid: 1007, x: 133, y: 27 },
        { mapid: 1007, x: 21, y: 111 },
        { mapid: 1007, x: 76, y: 97 },
        { mapid: 1007, x: 5, y: 65 },
        { mapid: 1007, x: 165, y: 95 },
        // 1011 长安 
        { mapid: 1011, x: 256, y: 51 },
        { mapid: 1011, x: 71, y: 5 },
        { mapid: 1011, x: 253, y: 74 },
        { mapid: 1011, x: 176, y: 130 },
        { mapid: 1011, x: 73, y: 138 },
        { mapid: 1011, x: 106, y: 125 },
        { mapid: 1011, x: 7, y: 67 },
        { mapid: 1011, x: 32, y: 69 },
        { mapid: 1011, x: 2, y: 107 },
        { mapid: 1011, x: 28, y: 138 },
        // 1004 大唐境内
        { mapid: 1004, x: 137, y: 90 },
        { mapid: 1004, x: 141, y: 22 },
        { mapid: 1004, x: 88, y: 6 },
        { mapid: 1004, x: 4, y: 74 },
        // 1010 东海渔村
        { mapid: 1010, x: 115, y: 63 },
        { mapid: 1010, x: 52, y: 45 },
        { mapid: 1010, x: 113, y: 97 },
        { mapid: 1010, x: 75, y: 108 },
        { mapid: 1010, x: 24, y: 103 },
        { mapid: 1010, x: 94, y: 133 },
        // 1006 万寿山
        { mapid: 1006, x: 80, y: 149 },
        { mapid: 1006, x: 84, y: 149 },
        { mapid: 1006, x: 88, y: 149 },
        { mapid: 1006, x: 92, y: 149 },
        { mapid: 1006, x: 96, y: 148 },
        { mapid: 1006, x: 96, y: 144 },
        { mapid: 1006, x: 91, y: 144 },
        { mapid: 1006, x: 84, y: 144 },
        { mapid: 1006, x: 78, y: 144 },
        { mapid: 1006, x: 66, y: 139 },
        { mapid: 1006, x: 72, y: 139 },
        { mapid: 1006, x: 76, y: 139 },
        { mapid: 1006, x: 82, y: 139 },
        { mapid: 1006, x: 66, y: 134 },
        { mapid: 1006, x: 75, y: 134 },
        { mapid: 1006, x: 86, y: 134 },
        { mapid: 1006, x: 92, y: 134 },
        { mapid: 1006, x: 15, y: 131 },
        { mapid: 1006, x: 9, y: 35 },
        // 1015 蟠桃园
        { mapid: 1015, x: 41, y: 12 },
        { mapid: 1015, x: 5, y: 19 },
        { mapid: 1015, x: 76, y: 56 },
        { mapid: 1015, x: 102, y: 66 },
        { mapid: 1015, x: 43, y: 67 },
        { mapid: 1015, x: 9, y: 125 },
        { mapid: 1015, x: 4, y: 48 },
        // 1016 御马监
        { mapid: 1016, x: 9, y: 16 },
        { mapid: 1016, x: 137, y: 40 },
        { mapid: 1016, x: 141, y: 65 },
        { mapid: 1016, x: 78, y: 90 },
        { mapid: 1016, x: 86, y: 34 },
        // 1014 灵兽村
        { mapid: 1014, x: 8, y: 97 },
        { mapid: 1014, x: 2, y: 60 },
        { mapid: 1014, x: 148, y: 16 },
        { mapid: 1014, x: 140, y: 6 },
        { mapid: 1014, x: 88, y: 99 },
        // 1017 傲来国
        { mapid: 1017, x: 8, y: 28 },
        { mapid: 1017, x: 8, y: 77 },
        { mapid: 1017, x: 10, y: 75 },
        { mapid: 1017, x: 1, y: 72 },
        { mapid: 1017, x: 34, y: 112 },
        { mapid: 1017, x: 32, y: 97 },
        { mapid: 1017, x: 100, y: 80 },
        { mapid: 1017, x: 56, y: 63 },
        { mapid: 1017, x: 68, y: 33 },
        { mapid: 1017, x: 9, y: 8 },
        { mapid: 1017, x: 27, y: 6 },
        { mapid: 1017, x: 43, y: 6 },
        { mapid: 1017, x: 59, y: 6 },
        { mapid: 1017, x: 113, y: 6 },
        { mapid: 1017, x: 142, y: 20 },
        { mapid: 1017, x: 97, y: 37 },
        { mapid: 1017, x: 137, y: 54 },
        // 1008 白骨山
        { mapid: 1008, x: 105, y: 64 },
        { mapid: 1008, x: 10, y: 40 },
        { mapid: 1008, x: 48, y: 13 },
        // 1005 方寸山
        { mapid: 1005, x: 14, y: 20 },
        { mapid: 1005, x: 49, y: 55 },
        { mapid: 1005, x: 59, y: 70 },
        // 1019 平顶山
        { mapid: 1019, x: 182, y: 7 },
        { mapid: 1019, x: 121, y: 2 },
        { mapid: 1019, x: 147, y: 19 },
        { mapid: 1019, x: 178, y: 9 },
        { mapid: 1019, x: 15, y: 82 },
        { mapid: 1019, x: 2, y: 62 },
        { mapid: 1019, x: 2, y: 29 },
        { mapid: 1019, x: 29, y: 3 },
        { mapid: 1019, x: 47, y: 124 },
        { mapid: 1019, x: 191, y: 97 },
        { mapid: 1019, x: 191, y: 40 },
        { mapid: 1019, x: 175, y: 58 },
        { mapid: 1019, x: 177, y: 77 },
        { mapid: 1019, x: 146, y: 64 },
        // 1003 北俱芦洲
        { mapid: 1003, x: 23, y: 69 },
        { mapid: 1003, x: 51, y: 74 },
        { mapid: 1003, x: 84, y: 6 },
        { mapid: 1003, x: 135, y: 22 },
        { mapid: 1003, x: 139, y: 5 },
        { mapid: 1003, x: 139, y: 45 },
        { mapid: 1003, x: 139, y: 62 },
        { mapid: 1003, x: 138, y: 80 },
    ];


    static EEventType: any = {
        PlayerTalkNpc: 1,
        PlayerKillNpc: 2,
        PlayerGatherNpc: 3,
        PlayerDoAction: 4,
        PlayerArriveArea: 5,
        PlayerGiveNpcItem: 6,
        FailEventPlayerDead: 11,
        FailEventTimeOut: 12,
    };


    static require_ex(file: string,fresh: boolean = false): any {
        if (GameUtil.prop_data[file] && fresh == false) {
            return GameUtil.prop_data[file];
        }
        let data = GameUtil.reloadfile(file);
        if (data == null) {
            SKLogger.warn(`加载配置文件错误:${file}`);
        } else {
            GameUtil.prop_data[file] = data;
        }
        return data;
    }
    // 重新加载配置文件
    static reloadPropData() {
        let errorlist = [];
        for (let filename in GameUtil.prop_data) {
            let fieldata = GameUtil.reloadfile(filename);
            if (fieldata) {
                if (GameUtil.prop_data[filename]) {
                    let data = GameUtil.prop_data[filename];
                    for (const datakey in data) {
                        if (data.hasOwnProperty(datakey)) {
                            data[datakey] = fieldata[datakey];
                        }
                    }
                } else {
                    GameUtil.prop_data[filename] = fieldata;
                }
            } else {
                errorlist.push(filename);
            }
        }
        SKLogger.info('热更新完成');
        if (errorlist.length > 0) {
            for (let filename of errorlist) {
                SKLogger.warn(`文件加载错误:[${filename}]`);
            }
        }
        return errorlist;
    }

    static reloadfile(filename: any): any {
        let full_path = path.join(__dirname, filename);
        let old = require.cache[require.resolve(full_path)];
        if (old != null || old != undefined) {
            GameUtil.catch_data[full_path] = old;
        }
        require.cache[require.resolve(full_path)] = undefined;

        let ret_data = null;
        try {
            let data = require(require.resolve(full_path));
            if (data) {
                ret_data = data;
            } else {
                require.cache[full_path] = GameUtil.catch_data[full_path];
                ret_data = null;
            }
        } catch (error) {
            console.error('load json ERROR, filename:' + full_path);
            console.error(error.message);
            require.cache[full_path] = GameUtil.catch_data[full_path];
            ret_data = null;
        }
        delete GameUtil.catch_data[full_path];
        return ret_data;
    }

    static serviceType = {
        Gate: 1,
        Game: 2,
        IM: 3,
    }

    static getPartnerJson(pPartner: any): string {
        if (null == pPartner) {
            return '{}';
        }
        let stLevelInfo = PartnerConfigMgr.shared.GetPower(pPartner.id, pPartner.relive, pPartner.level);
        if (null == stLevelInfo)
            return '{}';

        let stData: any = {
            id: pPartner.id, level: pPartner.level, exp: pPartner.exp, resid: pPartner.resid, name: pPartner.name, race: pPartner.race,
            dingwei: pPartner.dingwei, relive: pPartner.relive, mapZiZhi: pPartner.mapZiZhi, skill_list: pPartner.skill_list, livingtype: pPartner.living_type
        };

        for (var it2 in stLevelInfo.Attribute) {
            stData[it2] = stLevelInfo.Attribute[it2];
        }

        let strJson = SKDataUtil.toJson(stData);
        return strJson;
    }

    static getMapLen(mapTmp: any): number {
        let nCnt = 0;
        for (const it in mapTmp)
            nCnt++;
        return nCnt;
    }

    static numToString(nNum: number, nLen: number): string {
        return (Array(nLen).join('0') + nNum).slice(-nLen);
    }

    static getTime() {
        let nTime = Date.now();
        let nLocalTime = nTime + 28800 * 1000;
        return Math.floor(nLocalTime / 1000);
    }

    static changeNumToRange(fData: number, fMin: number, fMax: number): number {
        fData = Math.max(fData, fMin);
        fData = Math.min(fData, fMax);
        return fData;
    }

    static isVectorEqual(vec1: any, vec2: any): boolean {
        if (vec1.length != vec2.length)
            return false;

        for (var it in vec1) {
            if (vec1[it] != vec2[it])
                return false;
        }
        return true;
    }

    static isDataInVecter(stData: any, vecData: any): boolean {
        for (let it in vecData) {
            if (stData == vecData[it])
                return true;
        }
        return false;
    }

    static getAttribute(stData: any, strKey: any, stDefault: any): any {
        if (stData.hasOwnProperty(strKey) == false)
            return stDefault;

        return stData[strKey];
    }

    static getDistance(stPosA: any, stPosB: any): number {
        let nXDis = Math.abs(stPosA.x - stPosB.x);
        let nYDis = Math.abs(stPosA.y - stPosB.y);
        let nDis = Math.pow(nXDis * nXDis + nYDis * nYDis, 0.5);
        return nDis;
    }

    static getDefault(stData: any, stDefault?: any): any {
        if (typeof (stData) == "undefined")
            return stDefault;

        return stData;
    }

    static atribKey_IntToString(nKey: any): any {
        for (let it in GameUtil.attrEquipTypeStr) {
            if (GameUtil.attrEquipTypeStr[it] == nKey)
                return it;
        }
        return '';
    }

    static getMapDataByIndex(mapData: any, nIndex: number): any {
        if (nIndex < 0 || nIndex >= this.getMapLen(mapData))
            return null;

        let nCnt = -1;
        for (let it in mapData) {
            nCnt++;
            if (nCnt == nIndex)
                return mapData[it];
        }

        return null;
    }

    static givePlayerPrize(player: Player, strItem: string, count: number,sync: boolean = true) {
        if (player == null)
            return;

        if (strItem == 'exp') {
            player.addExp(count);
        }
        else if (strItem == 'petexp') {
            if (player.curPet) {
                player.curPet.addExp(count);
            }
        }
        else if (strItem == 'money') {
            player.addMoney(0, count, '高级藏宝图');
        }
        else {
            player.addItem(parseInt(strItem), count, true, '高级藏宝图',sync);
        }
    }

    static zhenbukuiMap: any = [
        // 1007 大唐边境
        //{ mapid: 1016, x: 75, y: 49 }, //测试用地点，在御马监小马仙附近
        { mapid: 1007, x: 148, y: 44 },
        { mapid: 1007, x: 100, y: 24 },
        { mapid: 1007, x: 109, y: 5 },
        { mapid: 1007, x: 44, y: 14 },
        { mapid: 1007, x: 84, y: 104 },
        { mapid: 1007, x: 29, y: 83 },
        // 1011 长安 
        { mapid: 1011, x: 49, y: 36 },
        { mapid: 1011, x: 143, y: 66 },
        { mapid: 1011, x: 122, y: 34 },
        { mapid: 1011, x: 223, y: 34 },
        { mapid: 1011, x: 239, y: 113 },
        { mapid: 1011, x: 143, y: 84 },
        { mapid: 1011, x: 40, y: 9 },
        // 1004 大唐境内
        { mapid: 1004, x: 124, y: 74 },
        { mapid: 1004, x: 120, y: 49 },
        { mapid: 1004, x: 119, y: 37 },
        { mapid: 1004, x: 38, y: 47 },
        { mapid: 1004, x: 70, y: 14 },
        // 1010 东海渔村
        { mapid: 1010, x: 129, y: 47 },
        { mapid: 1010, x: 141, y: 34 },
        { mapid: 1010, x: 60, y: 22 },
        { mapid: 1010, x: 24, y: 9 },
        { mapid: 1010, x: 41, y: 53 },
        { mapid: 1010, x: 82, y: 89 },
        { mapid: 1010, x: 42, y: 103 },
        { mapid: 1010, x: 114, y: 114 },
        // 1006 万寿山
        { mapid: 1006, x: 56, y: 73 },
        { mapid: 1006, x: 98, y: 48 },
        { mapid: 1006, x: 93, y: 8 },
        { mapid: 1006, x: 18, y: 30 },
        { mapid: 1006, x: 109, y: 94 },
        { mapid: 1006, x: 74, y: 136 },
        // 1015 蟠桃园
        { mapid: 1015, x: 70, y: 30 },
        { mapid: 1015, x: 37, y: 26 },
        { mapid: 1015, x: 14, y: 57 },
        { mapid: 1015, x: 39, y: 76 },
        { mapid: 1015, x: 53, y: 103 },
        { mapid: 1015, x: 14, y: 120 },
        { mapid: 1015, x: 90, y: 58 },
        // 1016 御马监
        { mapid: 1016, x: 34, y: 63 },
        { mapid: 1016, x: 112, y: 63 },
        { mapid: 1016, x: 96, y: 23 },
        { mapid: 1016, x: 68, y: 23 },
        { mapid: 1016, x: 37, y: 26 },
        // 1014 灵兽村
        { mapid: 1014, x: 50, y: 36 },
        { mapid: 1014, x: 14, y: 55 },
        { mapid: 1014, x: 64, y: 58 },
        { mapid: 1014, x: 113, y: 64 },
        { mapid: 1014, x: 117, y: 42 },
        { mapid: 1014, x: 138, y: 12 },
        // 1017 傲来国
        { mapid: 1017, x: 57, y: 11 },
        { mapid: 1017, x: 20, y: 10 },
        { mapid: 1017, x: 33, y: 42 },
        { mapid: 1017, x: 56, y: 64 },
        { mapid: 1017, x: 80, y: 71 },
        { mapid: 1017, x: 93, y: 90 },
        { mapid: 1017, x: 44, y: 103 },
        { mapid: 1017, x: 12, y: 74 },
        { mapid: 1017, x: 98, y: 29 },
        { mapid: 1017, x: 133, y: 51 },
        // 1008 白骨山
        { mapid: 1008, x: 80, y: 13 },
        { mapid: 1008, x: 79, y: 52 },
        { mapid: 1008, x: 57, y: 70 },
        { mapid: 1008, x: 36, y: 70 },
        { mapid: 1008, x: 30, y: 10 },
        // 1005 方寸山
        { mapid: 1005, x: 34, y: 22 },
        { mapid: 1005, x: 24, y: 65 },
        { mapid: 1005, x: 48, y: 48 },
        { mapid: 1005, x: 68, y: 78 },
        { mapid: 1005, x: 94, y: 89 },
        { mapid: 1005, x: 101, y: 28 },
        // 1019 平顶山
        { mapid: 1019, x: 154, y: 91 },
        { mapid: 1019, x: 112, y: 104 },
        { mapid: 1019, x: 101, y: 60 },
        { mapid: 1019, x: 78, y: 39 },
        { mapid: 1019, x: 28, y: 22 },
        { mapid: 1019, x: 32, y: 55 },
        { mapid: 1019, x: 110, y: 17 },
        // 1003 北俱芦洲
        { mapid: 1003, x: 24, y: 37 },
        { mapid: 1003, x: 61, y: 42 },
        { mapid: 1003, x: 102, y: 48 },
        { mapid: 1003, x: 120, y: 17 },
        { mapid: 1003, x: 87, y: 23 },
    ]

    static ETaskKind: any = {
        EStory: 1,
        EDaily: 2,
        EFuBen: 3,
    };

    static EState: any = {
        ELock: 0,
        EDoing: 1,
        EDone: 2,
        EFaild: 3,
    };

    static msgCode: any = {
        SUCCESS: 0,
        FAILED: 1,
        REGISTER_ACCOUNT_REPEAT: 100001, // 帐号重复
        REGISTER_DATABASE_ERROR: 100002, // 数据库插入错误
        LOGIN_ACCOUNT_PWD_ERROR: 100003, // 帐号或密码错误
        SERVICE_NOT_FOUND: 100004, //
        ACCOUNT_FREEZE: 100005, // 帐号被封，请联系客服查询
        NETWORK_ERROR: 100006, //
        NETWORK_DISCONNECT: 100007, // 网络断开连接
        CREATE_NAME_INVALID: 100008,//名字不合法
        INVITE_CODE_ERR: 100009, //邀请码错误
        VERSION_ERROR: 100010,//版本不正确

        OPERATION_ERROR: 200001,//操作失败
        ROLE_NAME_EXIST: 200010,//角色名已存在
        ITEM_OPERATION_ERROR: 200011,//物品操作失败

        RELIVE_LEVEL_TOO_HIGH: 200012, // 更高转生等级暂未开放
        RELIVE_LEVEL_NOT_ENOUGH: 200013, // 转生等级不足

        BAG_ITEM_IS_FULL: 200014, // 背包已满
        GIFT_HAS_GOT: 300001,// 没有礼包或者已经领过了
        GIFT_DAY_HAS_GOT: 300002,// 没有礼包或者已经领过了

        NO_TITLE: 300010, // 没有这个称谓


        HONGBAO_GET_YET: 900001,//红包已经领过了
        SLDH_NOT_OPEN: 900002, // 水陆大会没有开启
        SLDH_NOT_SIGN_TIME: 900003, // 不在水陆大会报名时间
        SLDH_SIGN_ALREADY: 900004,// 已经报名过了。
        SLDH_SIGN_TEAM: 900005,// 水路大会必须3人以上组队参加
        SLDH_SIGN_TEAM_LEADER: 900006,// 只能队长报名
        SLDH_NOT_SIGN: 900007,//水路大会 没有报名
        SLDH_SIGN_LEVEL_80: 900008,

        LINGHOU_NOT_TEAM: 900100,// 不能组队 灵猴大吼一句，欺人太甚，还想以多欺少！
        LINGHOU_MONEY_ENOUGH: 900101,// 银两不足 灵猴轻蔑的看了你一眼，便不再搭理你了！
        LINGHOU_FIGHT_TOO_MACH: 900102, // 灵猴攻击次数太多 小猴子大喊一声，少侠饶命，小的再也不敢了！
        LINGHOU_TODAY_TOO_MACH: 900103, // 今天攻击猴子次数太多 小猴子大喊一声，少侠饶命，小的再也不敢了！
    };

    static attrTypeL1Name: any = {
        [EAttrTypeL1.K_CONFUSION]: '抗混乱',
        [EAttrTypeL1.K_SEAL]: '抗封印',
        [EAttrTypeL1.K_SLEEP]: '抗昏睡',
        [EAttrTypeL1.K_POISON]: '抗毒',
        [EAttrTypeL1.K_WIND]: '抗风',
        [EAttrTypeL1.K_FIRE]: '抗火',
        [EAttrTypeL1.K_WATER]: '抗水',
        [EAttrTypeL1.K_THUNDER]: '抗雷',
        [EAttrTypeL1.K_WILDFIRE]: '抗鬼火',
        [EAttrTypeL1.K_FORGET]: '抗遗忘',
        [EAttrTypeL1.K_BLOODRETURN]: '抗三尸',
        [EAttrTypeL1.K_DETER]: '抗震慑',
        [EAttrTypeL1.PHY_GET]: '物理吸收',
        [EAttrTypeL1.PHY_HIT]: '命中率',
        [EAttrTypeL1.PHY_DODGE]: '闪躲率',
        [EAttrTypeL1.HK_CONFUSION]: '忽视抗混乱',
        [EAttrTypeL1.HK_SEAL]: '忽视抗封印',
        [EAttrTypeL1.HK_SLEEP]: '忽视抗昏睡',
        [EAttrTypeL1.HK_POISON]: '忽视抗毒',
        [EAttrTypeL1.HK_WIND]: '忽视抗风',
        [EAttrTypeL1.HK_FIRE]: '忽视抗火',
        [EAttrTypeL1.HK_WATER]: '忽视抗水',
        [EAttrTypeL1.HK_THUNDER]: '忽视抗雷',
        [EAttrTypeL1.HK_WILDFIRE]: '忽视抗鬼火',
        [EAttrTypeL1.HK_FORGET]: '忽视抗遗忘',
        [EAttrTypeL1.HK_BLOODRETURN]: '忽视抗三尸',
        [EAttrTypeL1.HK_DETER]: '忽视抗震慑',
        [EAttrTypeL1.K_PHY_GET]: '抗物理',
        [EAttrTypeL1.HK_PHY_GET]: '忽视抗物理',
        [EAttrTypeL1.PHY_COMBO]: '连击',
        [EAttrTypeL1.PHY_COMBO_PROB]: '连击率',
        [EAttrTypeL1.PHY_DEADLY]: '狂暴',
        [EAttrTypeL1.PHY_BREAK]: '破防程度',
        [EAttrTypeL1.PHY_BREAK_PROB]: '破防率',
        [EAttrTypeL1.PHY_REBOUND]: '反震程度',
        [EAttrTypeL1.PHY_REBOUND_PROB]: '反震率',
        [EAttrTypeL1.DEFEND_ADD]: '加强防御',
        [EAttrTypeL1.SPD_ADD]: '加速',
        [EAttrTypeL1.ATK_ADD]: '加攻',
        [EAttrTypeL1.HP_ADD]: '加血',
        [EAttrTypeL1.MP_ADD]: '加法',
        [EAttrTypeL1.CHARM_ADD]: '加强魅惑',
        [EAttrTypeL1.HP_MAX]: '增加气血上限',
        [EAttrTypeL1.MP_MAX]: '增加法力上限',
        [EAttrTypeL1.ATK]: '攻击',
        [EAttrTypeL1.SPD]: '速度',
        [EAttrTypeL1.HP]: '气血',
        [EAttrTypeL1.MP]: '法力',


        [EAttrTypeL1.HP_PERC]: '气血改变',
        [EAttrTypeL1.MP_PERC]: '法力改变',
        [EAttrTypeL1.ATK_PERC]: '攻击改变',
        [EAttrTypeL1.SPD_PERC]: '速度改变',

        [EAttrTypeL1.KB_WATER]: '水系狂暴率',
        [EAttrTypeL1.KB_THUNDER]: '雷系狂暴率',
        [EAttrTypeL1.KB_FIRE]: '火系狂暴率',
        [EAttrTypeL1.KB_WIND]: '风系狂暴率',
        [EAttrTypeL1.KB_BLOODRETURN]: '三尸狂暴率',
        [EAttrTypeL1.KB_WILDFIRE]: '鬼火狂暴率',

        [EAttrTypeL1.Q_WATER]: '水狂暴',
        [EAttrTypeL1.Q_THUNDER]: '雷狂暴',
        [EAttrTypeL1.Q_FIRE]: '火狂暴',
        [EAttrTypeL1.Q_WIND]: '风狂暴',
        [EAttrTypeL1.Q_BLOODRETURN]: '三尸狂暴',
        [EAttrTypeL1.Q_WILDFIRE]: '鬼火狂暴',


        [EAttrTypeL1.GOLD]: '金',
        [EAttrTypeL1.WOOD]: '木',
        [EAttrTypeL1.WATER]: '水',
        [EAttrTypeL1.FIRE]: '火',
        [EAttrTypeL1.SOIL]: '土',
        [EAttrTypeL1.S_GOLD]: '强力克金',
        [EAttrTypeL1.S_WOOD]: '强力克木',
        [EAttrTypeL1.S_WATER]: '强力克水',
        [EAttrTypeL1.S_FIRE]: '强力克火',
        [EAttrTypeL1.S_SOIL]: '强力克土',

        [EAttrTypeL1.BONE]: '根骨',
        [EAttrTypeL1.SPIRIT]: '灵性',
        [EAttrTypeL1.STRENGTH]: '力量',
        [EAttrTypeL1.DEXTERITY]: '敏捷',

        [EAttrTypeL1.PHY_HENGSAO]: '强化横扫',
        [EAttrTypeL1.PHY_ZHENJI]: '强化震击',
        [EAttrTypeL1.PHY_ZHIYU]: '强化治愈',
        [EAttrTypeL1.PHY_POJIA]: '强化破甲',
        [EAttrTypeL1.KB_POJIA]: '破甲狂暴%',
        [EAttrTypeL1.KB_ZHENJI]: '震击狂暴%',
        [EAttrTypeL1.KB_HENGSAO]: '横扫狂暴%',

    };
    // 属性2名称
    static attrTypeL2Name: any = {
        [EAttrTypeL2.GENGU]: '根骨',
        [EAttrTypeL2.LINGXING]: '灵性',
        [EAttrTypeL2.LILIANG]: '力量',
        [EAttrTypeL2.MINJIE]: '敏捷',
    }

    static launch(call: Function) {
        SKMongoUtil.launch(call);
        this.game_conf = SKDataUtil.readJson("../conf/json/game_conf.json");
        GameUtil.channel = GameConf.channel;
        SKLogger.isDebug = GameConf.isDebug;
        SKLogger.info(`[${GameUtil.channel}:${SKLogger.isDebug ? `调试` : `正式`}]读取游戏全局配置完成!`);
    }

    static getReliveText(relive: number, level: number): string {
        let prefix = "";
        if (relive > 3) {
            prefix = "飞升";
        } else {
            prefix = `${relive}转`;
        }
        let result = `${prefix}${level}级`;
        return result;
    }
    // 清空属性表
    static clearAllAttr(attr1: { [key: string]: number }) {
        for (let key in EAttrTypeL1) {
            let value = SKDataUtil.toNumber(key);
            if (isNaN(value)) {
                continue;
            }
            attr1[value] = 0;
        }
    }

    static getIPAdress(): string {
        var interfaces = os.networkInterfaces();
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
        return "127.0.0.1";
    }
}
