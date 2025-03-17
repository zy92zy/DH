/**  消息码 */
export enum MsgCode {
    /**  成功 */
    SUCCESS = 0,
    /**  失败 */
    FAILED = 1,
    /** gate服务后台接口签名 */
    //SING = "DBchen123456",
    SING = "Z2dQoK5Nvx6Uip0Ds8Iu123",
    /** game服务后台接口签名 */
    GMSIGN = "bMnc2W6Yu8Hjq2ZNm",
    //GMSIGN = "DBchen", 
    /**  IP禁用 */
    FORZEN_IP = 2,
    /**  MAC禁用 */
    FORZEN_MAC = 3,
    /**  在黑名单中 */
    BLACK = 4,
    /**  登录版本号过低 */
    LOGIN_LOW_VERSION = 5,
    /**  登录没有Token */
    LOGIN_NO_TOKEN = 6,
    /**  登录找不到服务器 */
    LOGIN_NO_SERVER = 7,
    /**  帐号重复 */
    REGISTER_ACCOUNT_REPEAT = 100001,
    /**  数据库插入错误 */
    REGISTER_DATABASE_ERROR = 100002,
    /**  帐号或密码错误 */
    LOGIN_ACCOUNT_PWD_ERROR = 100003,
    SERVICE_NOT_FOUND = 100004, //
    /**  帐号被封，请联系客服查询 */
    ACCOUNT_FREEZE = 100005,
    /**网络异常 */
    NETWORK_ERROR = 100006, //
    /**  网络断开连接 */
    NETWORK_DISCONNECT = 100007,
    /** 名字不合法 */
    CREATE_NAME_INVALID = 100008,
    /** 邀请码错误 */
    INVITE_CODE_ERR = 100009,
    /** 版本不正确 */
    VERSION_ERROR = 100010,

    /** 操作失败 */
    OPERATION_ERROR = 200001,
    /** 角色名已存在 */
    ROLE_NAME_EXIST = 200010,
    /** 物品操作失败 */
    ITEM_OPERATION_ERROR = 200011,

    /**  更高转生等级暂未开放 */
    RELIVE_LEVEL_TOO_HIGH = 200012,
    /**  转生等级不足 */
    /** 200013,  */
    RELIVE_LEVEL_NOT_ENOUGH = '转生等级不足',

    /**  背包已满 */
    BAG_ITEM_IS_FULL = 200014,
    /**  没有礼包或者已经领过了 */
    GIFT_HAS_GOT = 300001,
    /**  今日已领取 */
    GIFT_DAY_HAS_GOT = 300002,

    /**  没有这个称谓 */
    NO_TITLE = 300010,
    /** 红包已经领过了 */
    HONGBAO_GET_YET = 900001,

    /**  水陆大会没有开启 */
    SLDH_NOT_OPEN = '水陆大会没有开启',//900002, 
    /**  不在水陆大会报名时间 */
    SLDH_NOT_SIGN_TIME = '不在水陆大会报名时间',//900003, 
    /**  已经报名过了。 */
    SLDH_SIGN_ALREADY = '已经报名过了。',//900004,
    /**  水路大会必须3人以上组队参加 */
    SLDH_SIGN_TEAM = '水路大会必须3人以上组队参加',//900005,
    /**  只能队长报名 */
    SLDH_SIGN_TEAM_LEADER = '只能队长报名',//900006,
    /** 水路大会 没有报名 */
    SLDH_NOT_SIGN = '你没有报名',// 900007,
    /** 900008, */
    SLDH_SIGN_LEVEL_80 = '当前队伍有成员等级不足',

    /**  不能组队 灵猴大吼一句，欺人太甚，还想以多欺少！ */
    LINGHOU_NOT_TEAM = 900100,
    /**  银两不足 灵猴轻蔑的看了你一眼，便不再搭理你了！ */
    LINGHOU_MONEY_ENOUGH = 900101,
    /**  灵猴攻击次数太多 小猴子大喊一声，少侠饶命，小的再也不敢了！ */
    LINGHOU_FIGHT_TOO_MACH = 900102,
    /**  今天攻击猴子次数太多 小猴子大喊一声，少侠饶命，小的再也不敢了！ */
    LINGHOU_TODAY_TOO_MACH = 900103,
}
/**  任务 */
export enum ETaskKind {
    /**  剧情任务 */
    STORY = 1,
    /**  活动任务 */
    DAILY = 2,
    /**  副本任务 */
    FUBEN = 3,
};
/**  任务状态 */
export enum ETaskState {
    /**  锁定 */
    LOCK = 0,
    /**  进行中 */
    DOING = 1,
    /**  完成 */
    DONE = 2,
    /**  失败 */
    FALIED = 3,
};
export enum EEquipType {
    /**  新手 */
    XinShou = 0,
    /**  高级装备 */
    HIGH = 1,
    /**  神器 */
    ShenBing = 2,
    /**  仙器 */
    XianQi = 3,
    /**  翅膀 */
    WING = 4,
    /**  佩饰 */
    BALDRIC = 5,
    /** 星卡 */
    STARCARD = 6,
}
/**  道具索引 */
export enum EEquipIndex {
    /**  武器 */
    WEAPONS = 1,
    /**  项链 */
    NECKLACE = 2,
    /**  衣服 */
    CLOTHES = 3,
    /**  头盔 */
    HELMET = 4,
    /**  鞋子 */
    SHOES = 5,
    /**  翅膀 */
    WING = 6,
    /**  披风 */
    CAPE = 7,
    /**  挂件 */
    PENDANT = 8,
    /**  腰带 */
    BELT = 9,
    /**  戒指-左 */
    RING_LEFT = 10,
    /**  特效 */
    EFFECT = 11,
    /**  戒指-右 */
    RING_RIGHT = 12,
    /** 星卡 */
    STAR_CARD = 13,
}

export enum EAttrTypeL1 {
    /**  抗混乱 */
    K_CONFUSION = 0,
    /**  抗封印 */
    K_SEAL = 1,
    /**  抗昏睡 */
    K_SLEEP = 2,
    /**  抗毒 */
    K_POISON = 3,
    /**  抗风 */
    K_WIND = 4,
    /**  抗火 */
    K_FIRE = 5,
    /**  抗水 */
    K_WATER = 6,
    /**  抗雷 */
    K_THUNDER = 7,
    /**  抗鬼火 */
    K_WILDFIRE = 8,
    /**  抗遗忘 */
    K_FORGET = 9,
    /**  抗三尸 */
    K_BLOODRETURN = 10,
    /**  抗震慑 */
    K_DETER = 11,
    /**  抗物理 */
    K_PHY_GET = 12,
    /**  物理吸收 */
    PHY_GET = 13,
    /**  命中 */
    PHY_HIT = 14,
    /**  闪避 */
    PHY_DODGE = 15,
    /**  忽视抗混乱 */
    HK_CONFUSION = 16,
    /**  忽视抗封印 */
    HK_SEAL = 17,
    /**  忽视抗昏睡 */
    HK_SLEEP = 18,
    /**  忽视抗毒 */
    HK_POISON = 19,
    /**  忽视抗风 */
    HK_WIND = 20,
    /**  忽视抗火  */
    HK_FIRE = 21,
    /**  忽视抗水 */
    HK_WATER = 22,
    /**  忽视抗雷 */
    HK_THUNDER = 23,
    /**  忽视抗鬼火 */
    HK_WILDFIRE = 24,
    /**  忽视抗遗忘 */
    HK_FORGET = 25,
    /**  忽视抗三尸 */
    HK_BLOODRETURN = 26,
    /**  忽视抗震慑 */
    HK_DETER = 27,
    /**  忽视抗物理 */
    HK_PHY_GET = 28,
    /**  生命值 */
    HP = 30,
    /**  最大生命值 */
    HP_MAX = 31,
    /**  魔法值 */
    MP = 32,
    /**  最大魔法值 */
    MP_MAX = 33,
    /**  攻击力 */
    ATK = 34,
    /**  速度 */
    SPD = 35,
    /** 连击 */
    PHY_COMBO = 36,
    /** 连击率 */
    PHY_COMBO_PROB = 37,
    /** 狂暴 */
    PHY_DEADLY = 38,
    /** 破防 */
    PHY_BREAK = 39,
    /** 破防率 */
    PHY_BREAK_PROB = 40,
    /** 反震 */
    PHY_REBOUND = 41,
    /** 反震率 */
    PHY_REBOUND_PROB = 42,
    /** 加防 */
    DEFEND_ADD = 43,
    /** 加速 */
    SPD_ADD = 44,
    /** 加攻 */
    ATK_ADD = 45,
    /** 加血 */
    HP_ADD = 46,
    /** 加蓝 */
    MP_ADD = 47,
    /** 加强魅惑 */
    CHARM_ADD = 48,
    /**  整体 百分比 血量 */
    HP_PERC = 49,
    /**  整体 百分比 法力 */
    MP_PERC = 50,
    /**  整体 百分比 攻击 */
    ATK_PERC = 51,
    /**  整体 百分比 速度 */
    SPD_PERC = 52,
    /**  风狂暴率 */
    KB_WIND = 53,
    /**  火狂暴率 */
    KB_FIRE = 54,
    /**  水狂暴率 */
    KB_WATER = 55,
    /**  雷狂暴率 */
    KB_THUNDER = 56,
    /**  三尸狂暴率 */
    KB_BLOODRETURN = 57,
    /**  鬼火狂暴率 */
    KB_WILDFIRE = 58,
    /**  风狂暴 */
    Q_WIND = 59,
    /**  火狂暴 */
    Q_FIRE = 60,
    /**  水狂暴 */
    Q_WATER = 61,
    /**  雷狂暴 */
    Q_THUNDER = 62,
    /** 三尸狂暴 */
    Q_BLOODRETURN = 63,
    /** 鬼火狂暴 */
    Q_WILDFIRE = 64,
    /** 金 */
    GOLD = 70,
    /** 木 */
    WOOD = 71,
    /** 水 */
    WATER = 72,
    /** 火 */
    FIRE = 73,
    /** 土 */
    SOIL = 74,
    /** 强力克金 */
    S_GOLD = 75,
    /** 强力克木 */
    S_WOOD = 76,
    /** 强力克水 */
    S_WATER = 77,
    /** 强力克火 */
    S_FIRE = 78,
    /** 强力克土 */
    S_SOIL = 79,

    //龙族属性
    /** 加强横扫 */
    PHY_HENGSAO = 80,
    /** 加强震击 */
    PHY_ZHENJI = 81,
    /** 加强治愈 */
    PHY_ZHIYU = 82,
    /** 加强破甲 */
    PHY_POJIA = 83,
    /** 横扫狂暴 */
    KB_HENGSAO = 84,
    /** 震击狂暴 */
    KB_ZHENJI = 85,
    /** 破甲狂暴 */
    KB_POJIA = 86,
    /** 多重攻击数量 */
    PHY_MULTIPLE = 87,
    /** 多重攻击概率 */
    PHY_MULTIPLE_PROB = 88,

    /**  根骨 */
    BONE = 100,
    /**  灵性 */
    SPIRIT = 101,
    /**  力量 */
    STRENGTH = 102,
    /**  敏捷 */
    DEXTERITY = 103,
    /** 抗冰封睡忘上限 */
    K_SEAL_CONFUSION_SLEEP_FORGET_LIMIT = 1000,

}

export enum EAttrTypeL2 {
    /**  根骨 */
    GENGU = 100,
    /**  灵性 */
    LINGXING = 101,
    /**  力量 */
    LILIANG = 102,
    /**  敏捷 */
    MINJIE = 103,
}

export enum EAttrCalType {
    ADD_NUM = 1,
    ADD_PERCENT = 2,
    PERCENT = 3
}

export enum EEffectType {
    HURT = 1,
    DEF = 2,
    HUNLUAN = 3,
    HUNSHUI = 4,
    FENGYIN = 5,
}

export enum EEquipPos {
    UNKNOW = 1,
    USE = 2,
    BAG = 3,
    BANK = 4,
}
/**  支付类型 */
export enum PayType {
    /**  瑞捷云 */
    RJY = 0,
    /**  八哥 */
    GESY8 = 1,
    /**  益讯 */
    YIXUN = 2,
    /**  新支付 */
    NEW = 3,
    /**鑫支付 */
    XZF = 4,
    /**天空支付 */
    SKY = 5,
    /**星火易 */
    XHY = 6,
    /**糖果易支付 */
    TGY = 7,
    /**苏梦易支付 */
    SMY = 8,
}


/**  技能类型 */
export enum ESkillType {
    /** 普通攻击(远程) */
    RemoteAtkSkill = 1000,
    /** 普通攻击 */
    NormalAtkSkill = 1001,
    /** 防御 */
    NormalDefSkill = 1002,
    /** 鹤顶红粉 */
    HeDingHongFen = 1003,
    /** 借刀杀人 */
    JieDaoShaRen = 1004,
    /** 迷魂醉 */
    MiHunZui = 1005,
    /** 作壁上观 */
    ZuoBiShangGuan = 1006,
    /** 万毒攻心 */
    WanDuGongXin = 1007,
    /** 失心狂乱 */
    ShiXinKuangLuan = 1008,
    /** 百日眠 */
    BaiRiMian = 1009,
    /** 四面楚歌 */
    SiMianChuGe = 1010,
    /** 烈火骄阳 */
    LieHuoJiaoYang = 1011,
    /** 风雷涌动 */
    FengLeiYongDong = 1012,
    /** 电闪雷鸣 */
    DianShanLeiMing = 1013,
    /** 蛟龙出海 */
    JiaoLongChuHai = 1014,
    /** 九阴纯火 */
    JiuYinChunHuo = 1015,
    /** 袖里乾坤 */
    XiuLiQianKun = 1016,
    /** 天诛地灭 */
    TianZhuDiMie = 1017,
    /** 九龙冰封 */
    JiuLongBingFeng = 1018,
    /** 魔神护体 */
    MoShenHuTi = 1019,
    /** 天外飞魔 */
    TianWaiFeiMo = 1020,
    /** 兽王神力 */
    ShouWangShenLi = 1021,
    /** 销魂蚀骨 */
    XiaoHunShiGu = 1022,
    /** 含情脉脉 */
    HanQingMoMo = 1023,
    /** 乾坤借速 */
    QianKunJieSu = 1024,
    /** 魔神附身 */
    MoShenFuShen = 1025,
    /** 阎罗追命 */
    YanLuoZhuiMing = 1026,
    /** 秦思冰雾 */
    QinSiBingWu = 1027,
    /** 血煞之蛊 */
    XueShaZhiGu = 1028,
    /** 落日熔金 */
    LuoRiRongJin = 1029,
    /** 失心疯 */
    ShiXinFeng = 1030,
    /** 倩女幽魂 */
    QianNvYouHun = 1031,
    /** 吸星大法 */
    XiXingDaFa = 1032,
    /** 血海深仇 */
    XueHaiShenChou = 1033,
    /** 孟婆汤 */
    MengPoTang = 1034,

    //------龙族 开始----- */
    /** 凌虚御风 */
    LingXuYuFeng = 1035,
    /** 飞举九天 */
    FeiJuJiuTian = 1036,
    /** 风雷万钧 */
    FengLeiWanYun = 1037,
    /** 震天动地 */
    ZhenTianDongDi = 1038,
    /** 沛然莫御 */
    FeiRanMoYu = 1039,
    /** 泽被万物 */
    ZeBeiWanWu = 1040,
    /** 白浪滔天 */
    BaiLangTaoTian = 1041,
    /** 沧海横流 */
    CangHaiHengLiu = 1042,
    /** 逆鳞 */
    NiLin = 1043,

    //------结束------- */


    /** 帐饮东都 */
    ZhangYinDongDu = 2001,
    /** 源泉万斛 */
    YuanQuanWanHu = 2002,
    /** 神工鬼力 */
    ShenGongGuiLi = 2003,
    /** 倍道兼行 */
    BeiDaoJianXing = 2004,
    /** 蹒跚 */
    PanShan = 2005,
    /**  恭行天罚 */
    GongXingTianFa = 2006,
    /**  天罡战气 */
    TianGangZhanQi = 2007,
    /** 悬刃 */
    XuanRen = 2008,
    /** 遗患 */
    YiHuan = 2009,
    /**  闪现 */
    ShanXian = 2010,
    /**  飞龙在天 */
    FeiLongZaiTian = 2011,
    /**  飞龙在天 风 */
    FeiLongZaiTian_Feng = 2012,
    /**  飞龙在天 火 */
    FeiLongZaiTian_Huo = 2013,
    /**  飞龙在天 水 */
    FeiLongZaiTian_Shui = 2014,
    /**  飞龙在天 雷 */
    FeiLongZaiTian_Lei = 2015,
    /**  有凤来仪 */
    YouFengLaiYi = 2016,

    /**  有凤来仪 金 */
    YouFengLaiYi_Jin = 2017,
    /**  有凤来仪 木 */
    YouFengLaiYi_Mu = 2018,
    /**  有凤来仪 水 */
    YouFengLaiYi_Shui = 2019,
    /**  有凤来仪 火 */
    YouFengLaiYi_Huo = 2020,
    /**  有凤来仪 土 */
    YouFengLaiYi_Tu = 2021,
    /**  分裂攻击 */
    FenLieGongJi = 2030,
    /**  天魔解体 */
    TianMoJieTi = 2031,
    /**  分光化影 */
    FenGuangHuaYing = 2032,
    /**  青面獠牙 */
    QingMianLiaoYa = 2033,
    /**  小楼夜哭 */
    XiaoLouYeKu = 2034,
    /**  隔山打牛 */
    GeShanDaNiu = 2035,
    /**  混乱 */
    HunLuan = 2036,
    /**  封印 */
    FengYin = 2037,
    /** 高级帐饮东都 */
    HighZhangYinDongDu = 2101,
    /** 高级源泉万斛 */
    HighYuanQuanWanHu = 2102,
    /** 高级神工鬼力 */
    HighShenGongGuiLi = 2103,
    /** 高级倍道兼行 */
    HighBeiDaoJianXing = 2104,
    /** 高级蹒跚 */
    HighPanShan = 2105,
    /**  高级闪现 */
    HighShanXian = 2110,
    /**  隐身 */
    YinShen = 2111,
    /** 妙手回春 */
    MiaoShouHuiChun = 2112,
    /**  分花拂柳 */
    FenHuaFuLiu = 2113,
    /**  五行相克 -- 用来标记五行技能 */
    WuXingXiangKe = 2120,
    /** 炊金馔玉 */
    ChuiJinZhuanYu = 2121,
    /** 枯木逢春 */
    KuMuFengChun = 2122,
    /** 如人饮水 */
    RuRenYinShui = 2123,
    /** 烽火燎原 */
    FengHuoLiaoYuan = 2124,
    /** 西天净土 */
    XiTianJingTu = 2125,
    /**  高级分裂攻击 */
    HighFenLieGongJi = 2130,
    /**  高级天魔解体 */
    HighTianMoJieTi = 2131,
    /**  高级分光化影 */
    HighFenGuangHuaYing = 2132,
    /**  高级青面獠牙 */
    HighQingMianLiaoYa = 2133,
    /**  高级小楼夜哭 */
    HighXiaoLouYeKu = 2134,
    /**  高级隔山打牛 */
    HighGeShanDaNiu = 2135,
    /**  击其不意 */
    JiQiBuYi = 2136,
    /**  子虚乌有 */
    ZiXuWuYou = 2700,
    /**  化无 */
    HuaWu = 2701,
    /**  绝境逢生 */
    JueJingFengSheng = 2702,
    /** 当头棒喝 */
    DangTouBangHe = 2703,
    /** 将死 */
    JiangSi = 2704,
    /**  作鸟兽散 */
    ZuoNiaoShouSan = 2705,
    /**  春回大地 */
    ChunHuiDaDi = 2706,
    /**  双管齐下 */
    ShuangGuanQiXia = 2707,
    /**  明察秋毫 */
    MingChaQiuHao = 2708,

    /**  利涉大川 */
    LiSheDaChuan = 2709,
    /** 安行疾斗 */
    AnXingJiDou = 2710,
    /** 飞珠溅玉 */
    FeiZhuJianYu = 2711,
    /** 六识炽烈 */
    LiuShiChiLie = 2712,
    /** 穆如清风 */
    MuRuQingFeng = 2713,
    /** 落纸云烟 */
    LuoZhiYunYan = 2714,
    /** 恨雨霏霏 */
    HenYuFeiFei = 2715,
    /** 暗影离魂 */
    AnYingLiHun = 2716,
    /** 暗之降临 */
    AnZhiJiangLin = 2717,


    /** 兵临城下 */
    BingLinChengXia = 3001,
    /** 涅槃 */
    NiePan = 3002,
    /** 强化悬刃 */
    QiangHuaXuanRen = 3003,
    /** 强化遗患 */
    QiangHuaYiHuan = 3004,
    /** 潮鸣电掣 */
    ChaoMingDianChe = 3005,
    /** 如虎添翼 */
    RuHuTianYi = 3006,
    /**  幻影如风 */
    HuanYingRuFeng = 3007,
    /**  偷钱，天降灵猴 */
    StealMoney = 8000,

    /**  坐骑技能-1组 */

    /**  高级冲云破雾 */
    HighChongYunPoWu = 9000,
    /**  高级泣血枕戈 */
    HighQiXueZhenGe = 9002,
    /**   高级怒剑狂花 */
    HighNuJianKuangHua = 9003,
    /**  高级破釜沉舟 */
    HighPoFuChenZhou = 9004,
    /**  高级金戈铁甲 */
    HighJinGeTieJia = 9010,
    /**  高级坚壁清野 */
    HighJianBiQingYe = 9011,

    /**  冲云破雾 */
    ChongYunPoWu = 9012,
    /**  泣血枕戈 */
    QiXueZhenGe = 9014,
    /**  怒剑狂花 */
    NuJianKuangHua = 9015,
    /**  破釜沉舟 */
    PoFuChenZhou = 9016,
    /**  金戈铁甲 */
    JinGeTieJia = 9022,
    /**  坚壁清野 */
    JianBiQingYe = 9023,
    /**  2组 */

    /**  高级赤血青锋 */
    HighChiXueQingFeng = 9024,
    /**  高级疾风骤雨 */
    HighJiFengZhouYu = 9026,
    /**  高级后发制人 */
    HighHouFaZhiRen = 9029,
    /**  高级百步穿杨 */
    HighBaiBuChuanYang = 9030,
    /**  高级神枢鬼藏 */
    HighShenShuGuiCang = 9033,

    /**  赤血青锋 */
    ChiXueQingFeng = 9035,
    /**  疾风骤雨 */
    JiFengZhouYu = 9037,
    /**  后发制人 */
    HouFaZhiRen = 9040,
    /**  百步穿杨 */
    BaiBuChuanYang = 9041,
    /**  神枢鬼藏 */
    ShenShuGuiCang = 9044,
    /**  3组 */

    /**  高级秋水流弦 */
    HighQiuShuiLiuXian = 9048,
    /**  高级追魂夺命 */
    HighZhuiHunDuoMing = 9051,
    /**  高级战心清明 */
    HighZhanXinQingMing = 9055,
    /**  高级折冲御晦 */
    HighSheChongYuHui = 9056,

    /**  秋水流弦 */
    QiuShuiLiuXian = 9059,
    /**  追魂夺命 */
    ZhuiHunDuoMing = 9062,
    /**  战心清明 */
    ZhanXinQingMing = 9066,
    /**  折冲御晦 */
    SheChongYuHui = 9067,

    /**  4组 */

    /**  高级天雷怒火 */
    HighTianLeiNuHuo = 9068,
    /**  高级兴风作浪 */
    HighXingFengZuoLang = 9069,
    /**  高级四海宁靖 */
    HighSiHaiNingJing = 9071,
    /**  高级暮霭沉沉 */
    HighMuAiChenChen = 9072,
    /**  高级白露横江 */
    HighBaiLuHengJiang = 9073,

    /**  天雷怒火 */
    TianLeiNuHuo = 9079,
    /**  兴风作浪 */
    XingFengZuoLang = 9080,
    /**  四海宁靖 */
    SiHaiNingJing = 9082,
    /**  暮霭沉沉 */
    MuAiChenChen = 9083,
    /**  白露横江 */
    BaiLuHengJiang = 9084,

    /**  5组 */

    /**  高级万劫不复 */
    HighWanJieBuFu = 9092,
    /**  高级风卷残云 */
    HighFengJuanCanYun = 9094,
    /**  高级天怒惊雷 */
    HighTianNuJingLei = 9095,
    /**  高级惊涛骇浪 */
    HighJingTaoHaiLang = 9096,
    /**  高级星火燎原 */
    HighXingHuoLiaoYuan = 9097,
    /**  高级澧兰沅芷 */
    HighLiLanYuanZhi = 9100,
    /**  高级花晨月夕 */
    HighHuaChenYueXi = 9101,

    /**  万劫不复 */
    WanJieBuFu = 9104,
    /**  风卷残云 */
    FengJuanCanYun = 9106,
    /**  天怒惊雷 */
    TianNuJingLei = 9107,
    /**  惊涛骇浪 */
    JingTaoHaiLang = 9108,
    /**  星火燎原 */
    XingHuoLiaoYuan = 9109,
    /**  澧兰沅芷 */
    LiLanYuanZhi = 9112,
    /**  花晨月夕 */
    HuaChenYueXi = 9113,
    /**  6组 */

    /**  高级兰质蕙心 */
    HighLanZhiHuiXin = 9116,
    /**  高级蹑影追风 */
    HighNieYingZhuiFeng = 9122,

    /**  兰质蕙心 */
    LanZhiHuiXin = 9126,
    /**  蹑影追风 */
    NieYingZhuiFeng = 9132,
    /**  7组 */

    /**  高级身如铁石 */
    HighShenRuTieShi = 9134,
    /**  高级金身不坏 */
    HighJinShenBuHuai = 9135,
    /**  高级天神护体 */
    HighTianShenHuTi = 9136,
    /**  高级斗转星移 */
    HighDouZhuanXingYi = 9137,
    /**  高级凌波微步 */
    HighLingBoWeiBu = 9143,

    /**  身如铁石 */
    ShenRuTieShi = 9144,
    /**  金身不坏 */
    JinShenBuHuai = 9145,
    /**  天神护体 */
    TianShenHuTi = 9146,
    /**  斗转星移 */
    DouZhuanXingYi = 9147,
    /**  凌波微步 */
    LingBoWeiBu = 9153,
    /**  8组 */

    /**  高级烟江叠嶂 */
    HighYanJiangDieZhang = 9154,
    /**  高级枯木盘根 */
    HighKuMuPanGen = 9158,
    /**  高级心如止水 */
    HighXinRuZhiShui = 9160,
    /**  高级身似菩提 */
    HighShenSiPuTi = 9161,

    /**  烟江叠嶂 */
    YanJiangDieZhang = 9163,
    /**  枯木盘根 */
    KuMuPanGen = 9167,
    /**  心如止水 */
    XinRuZhiShui = 9169,
    /**  身似菩提 */
    ShenSiPuTi = 9170,
    /**  9组 */

    /**  高级傲雪凌霜 */
    HighAoXueLingShuang = 9175,
    /**  高级冰壶秋月 */
    HighBingHuQiuYue = 9176,
    /**  高级云合雾集 */
    HighYunHeWuJi = 9177,
    /**  高级飘然出尘 */
    HighPiaoRanChuChen = 9178,

    /**  傲雪凌霜 */
    AoXueLingShuang = 9184,
    /**  冰壶秋月 */
    BingHuQiuYue = 9185,
    /**  云合雾集 */
    YunHeWuJi = 9186,
    /**  飘然出尘 */
    PiaoRanChuChen = 9187,
    /**  佩饰技能 */

    /**  偷天换日-把玩 魔 摄魂 */
    TouTianHuanRi1 = 9188,
    /**  偷天换日-珍藏 魔 摄魂 */
    TouTianHuanRi2 = 9189,
    /**  偷天换日-无价 魔 摄魂 */
    TouTianHuanRi3 = 9190,
    /**  幻影如风-把玩 通用 幻影 */
    HuanYingRuFeng1 = 9191,
    /**  幻影如风-珍藏 通用 幻影 */
    HuanYingRuFeng2 = 9192,
    /**  幻影如风-无价 通用 幻影 */
    HuanYingRuFeng3 = 9193,
    /**  五毒俱全-把玩 人 相柳 */
    WuDuJuQuan1 = 9194,
    /** 五毒俱全-珍藏 人 相柳 */
    WuDuJuQuan2 = 9195,
    /** 五毒俱全-无价 人 相柳 */
    WuDuJuQuan3 = 9196,
    /**  斩草除根-把玩 仙鬼 龙殇 */
    ZhanCaoChuGen1 = 9197,
    /**  斩草除根-珍藏 仙鬼 龙殇 */
    ZhanCaoChuGen2 = 9198,
    /**  斩草除根-无价 仙鬼 龙殇 */
    ZhanCaoChuGen3 = 9199,
    /**  违心一致-把玩 男人 罗睺 */
    WeiXinYiZhi1 = 9200,
    /**  违心一致-珍藏 男人 罗睺 */
    WeiXinYiZhi2 = 9201,
    /**  违心一致-无价 男人 罗睺 */
    WeiXinYiZhi3 = 9202,
    /**  万古同悲-把玩 仙鬼 残梦 */
    WanGuTongBei1 = 9203,
    /**  万古同悲-把玩 仙鬼 残梦 */
    WanGuTongBei2 = 9204,
    /**  万古同悲-把玩 仙鬼 残梦 */
    WanGuTongBei3 = 9205,
    /**  起死回生-把玩 男魔 断鬼 */
    QiShiHuiSheng1 = 9206,
    /**  起死回生-把玩 男魔 断鬼 */
    QiShiHuiSheng2 = 9207,
    /**  起死回生-把玩 男魔 断鬼 */
    QiShiHuiSheng3 = 9208,
    /**  幽影-把玩 鬼 幽影 */
    YouYing1 = 9209,
    /**  幽影-把玩 鬼 幽影 */
    YouYing2 = 9210,
    /**  幽影-把玩 鬼 幽影 */
    YouYing3 = 9211,

    //龙族饰品套装BUFF
    /**攻无不克-把玩 男龙 战意 */
    GongWuBuKe1 = 9212,
    /**攻无不克-珍藏 男龙 战意 */
    GongWuBuKe2 = 9213,
    /**攻无不克-无价 男龙 战意 */
    GongWuBuKe3 = 9214,
    /**精疲力竭-把玩 男龙 天威 */
    JingPiLiJie1 = 9215,
    /**精疲力竭-珍藏 男龙 天威 */
    JingPiLiJie2 = 9216,
    /**精疲力竭-无价 男龙 天威 */
    JingPiLiJie3 = 9217,
    /**万古长春-把玩 男龙 青阳 */
    WanGuChangCun1 = 9218,
    /**万古长春-珍藏 男龙 青阳 */
    WanGuChangCun2 = 9219,
    /**万古长春-无价 男龙 青阳 */
    WanGuChangCun3 = 9220,
    /**安适如常-把玩 男龙 沧海 */
    AnShiRuChang1 = 9221,
    /**安适如常-珍藏 男龙 沧海 */
    AnShiRuChang2 = 9222,
    /**安适如常-无价 男龙 沧海 */
    AnShiRuChang3 = 9223,
    /**精疲力竭 BUFF效果 */
    ZhenJiEff = 9224,

    /**天策 -诸神 */
    TcZhuShen = 9225,
    /**天策 -枯荣 */
    TcRongKu = 9226,
    /**天策 -忽混 */
    TcHuHun = 9227,
    /**天策 -忽封 */
    TcHuFeng = 9228,
    /**天策 -忽睡 */
    TcHuShui = 9229,
    /**天策 -载沉 */
    TcZaiChen = 9229,
    /**天策 -堆月 */
    TcDuiYue = 9230,

};
/**  特效播放位置 */
export enum EEffectPos {
    /**  敌人身上 */
    BODY = 0,
    /**  场景上 */
    STAGE = 1
};
/** 技能攻击范围 */
export enum EAttackType {
    /**  默认看技能属性 */
    NORMAL = 0,
    /** 近身 */
    MELEE = 1,
    /**  远程 */
    REMOTE = 2,
}
/** 技能攻击范围 */
export enum EAffectType {
    /** 单攻 */
    SINGLE = 0,
    /** 群攻 */
    GROUP = 1,
}
/**  战斗回合类型 */
export enum EActionType {
    /**  主动 */
    INITIATIVE = 1,
    /**  被动 */
    PASSIVE = 2,
}
/**  目标 */
export enum EActionOn {
    /**  所有人 */
    ALL = 0,
    /**  敌方 */
    ENEMY = 1,
    /**  已方 */
    SELF = 2,
}
/**  法术类型 */
export enum EMagicType {
    /**  无法术类型 */
    NONE = -1,
    /** 物理 */
    PHYSICS = 0,
    /** 混乱 */
    Chaos = 1,
    /** 毒 */
    Toxin = 2,
    /** 昏睡 */
    Sleep = 3,
    /** 封印 */
    Seal = 4,
    /** 风法 */
    Wind = 5,
    /** 火法 */
    Fire = 6,
    /** 雷法 */
    Thunder = 7,
    /** 水法 */
    Water = 8,
    /**  攻击类法术最大值 */
    AtkSkillMax = 9,
    /** 加速 */
    SPEED = 10,
    /** 加防 */
    Defense = 11,
    /** 加攻 */
    Attack = 12,
    /** 震慑 */
    Frighten = 13,
    /** 三尸 */
    ThreeCorpse = 14,
    /** 魅惑 */
    Charm = 15,
    /** 鬼火 */
    GhostFire = 16,
    /** 遗忘 */
    Forget = 17,
    /**  减防 */
    SubDefense = 18,
    /**  隐身 */
    YinShen = 19,
    /**  治愈 */
    Rrsume = 20,
    /**  飞龙探云手 */
    StealMoney = 21,

    /**  变身 */
    BianShen = 22,
    /**  扫击 */
    HengSao = 23,
    /**  震击 */
    ZhenJi = 24,
    /**精疲力竭 */
    ZhenJiEff = 25,
    /**分身 */
    FenShen = 26,
    /**破甲 */
    PoJia = 27,
};
/**  Buff类型 */
export enum EBuffType {
    /** 无buff */
    NONE = 0,
    /** 循环伤害 */
    LOOP = 1,
    /**  一次计算 */
    ONCE = 2,
}
/**  技能品质 */
export enum ESkillQuality {
    /**  普通技能 */
    LOW = 1,
    /**  高级技能 */
    HIGH = 2,
    /**  神兽技能 */
    SHEN = 3,
    /**  终极技能 */
    FINAL = 4,
}

export enum BattleType {
    /**  未定义 */
    Normal = 0,
    /**  强制PK */
    Force = 1,
    /**  切磋PK */
    PK = 2,
    /**  水路大会PK */
    ShuiLu = 3,
    /**  天降灵猴 */
    LingHou = 4,
    /**  皇城pk */
    PALACE = 5,
    /**  帮战 */
    BangZhan = 6,
    /**杀人香 */
    ShaRenXiang = 7,
    /**决战长安 */
    ChangAn = 8,
}

export enum EActType {
    /**  技能 */
    SKILL = 1,
    /**  道具  */
    ITEM = 2,
    /**  召唤 */
    SUMMON = 3,
    /**  逃跑 */
    RUN_AWAY = 4,
    /**  保护 */
    PROTECT = 5,
    /** 捕捉 */
    CATCH = 6,
    /** 召还 */
    SUMMON_BACK = 7,
    /** 变身 */
    BIANSHEN = 8,
    FENSHEN = 9, //分身
}
/**  战斗回合内 响应 */
export enum EBtlRespone {
    /**  无响应 */
    NOTHING = 0,
    /**  防御 */
    DEFENSE = 1,
    /**  闪避 */
    DODGE = 2,
    /**  暴击 */
    CRITICAL_HIT = 3,
    /**  被抓 */
    CATCHED = 4,
    /**  不能被抓 */
    NO_CATCH = 5,
    /**  捕捉失败 */
    CATCH_FAILED = 6,
    /**  保护 */
    PROTECT = 7,
    /** 被保护 */
    BE_PROTECTED = 8,
    /**  召还 */
    SUMMON_BACK = 9,
    /** 召唤 */
    SUMMON = 10,
    /** 召唤失败 */
    SUMMON_FAILED = 11,
    /**  破防 */
    PO_FANG = 12,
}

export enum EActNumType {
    /**  伤害 */
    HURT = 1,
    /**  加血 */
    HP = 2,
    /**  扣蓝 */
    MP = 3,
    /**  吸血 */
    SUCK = 4,
    /** 掉血 扣蓝 */
    HURT_MP = 5,
    HPMP = 6,
}

export enum ELiveingType {
    /**  未知  */
    UNKOWN = 0,
    /**  玩家 */
    PLAYER = 1,
    /**  NPC */
    NPC = 2,
    /**  怪物 */
    MONSTER = 3,
    /**  召唤兽 */
    PET = 4,
    /**  伙伴 */
    PARTNER = 5,
}

export enum ESubType {
    SKILL = 1,
    BUFFER = 2,
    MUL = 3,
    XUAN_REN = 4,
    YI_HUAN = 5,
    ADD = 6,
    SUB = 7,
    PERCENT = 8
}
/**  事件类型 */
export enum EEventType {
    PlayerTalkNpc = 1,
    PlayerKillNpc = 2,
    PlayerGatherNpc = 3,
    PlayerDoAction = 4,
    PlayerArriveArea = 5,
    PlayerGiveNpcItem = 6,
    FailEventPlayerDead = 11,
    FailEventTimeOut = 12,
};