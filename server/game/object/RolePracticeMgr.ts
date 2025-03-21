import { EAttrTypeL1 } from "../role/EEnum";

export default class RolePracticeMgr {
  static shared = new RolePracticeMgr();
  MaxPointKang: any = {
    [EAttrTypeL1.K_SEAL]: [16, 20, 24, 26, 26],
    [EAttrTypeL1.K_CONFUSION]: [16, 20, 24, 26, 26],
    [EAttrTypeL1.K_SLEEP]: [16, 20, 24, 26, 26],
    [EAttrTypeL1.K_FORGET]: [16, 20, 24, 26, 26],

    [EAttrTypeL1.K_WIND]: [10, 12, 14, 16, 16],
    [EAttrTypeL1.K_WATER]: [10, 12, 14, 16, 16],
    [EAttrTypeL1.K_FIRE]: [10, 12, 14, 16, 16],
    [EAttrTypeL1.K_POISON]: [10, 12, 14, 16, 16],
    [EAttrTypeL1.K_THUNDER]: [10, 12, 14, 16, 16],
    [EAttrTypeL1.K_WILDFIRE]: [10, 12, 14, 16, 16],
    [EAttrTypeL1.K_BLOODRETURN]: [10, 12, 14, 16, 16],

    [EAttrTypeL1.PHY_GET]: [10, 15, 20, 25, 25],
    [EAttrTypeL1.PHY_HIT]: [10, 15, 20, 25, 25],
    [EAttrTypeL1.PHY_DODGE]: [10, 15, 20, 25, 25],
    [EAttrTypeL1.PHY_COMBO]: [3, 3, 3, 3, 3],
    [EAttrTypeL1.PHY_COMBO_PROB]: [10, 15, 20, 25, 25],
    [EAttrTypeL1.PHY_DEADLY]: [10, 15, 20, 25, 25],
    [EAttrTypeL1.PHY_BREAK]: [10, 15, 20, 25, 25],
    [EAttrTypeL1.PHY_BREAK_PROB]: [10, 15, 20, 25, 25],
    [EAttrTypeL1.PHY_REBOUND_PROB]: [10, 13, 16, 16, 16],
    [EAttrTypeL1.PHY_REBOUND]: [10, 13, 16, 19, 19]
  }

  YinLiang: any = {
    [0]: 825,
    [1]: 2112,
    [2]: 3717,
    [3]: 7416,
    [4]: 10188,
    [5]: 16600,
    [6]: 25062,
    [7]: 30738,
    [8]: 36482,
    [9]: 43517,
    [10]: 48900,
    [11]: 53966,
    [12]: 54851,
    [13]: 55801,
    [14]: 56815,
    [15]: 57893,
    [16]: 59033,
    [17]: 60236,
    [18]: 61501,
    [19]: 62826,
    [20]: 64212,
    [21]: 65659,
    [22]: 67165,
    [23]: 68731,
    [24]: 70355,
    [25]: 76079,
    [26]: 78181,
    [27]: 80358,
    [28]: 82609,
    [29]: 84933,
    [30]: 87330,
    [31]: 89801,
    [32]: 92344,
    [33]: 94960,
    [34]: 97648,
    [35]: 100408,
    [36]: 103240,
    [37]: 107595,
    [38]: 114602,
    [39]: 121909,
    [40]: 129524,
    [41]: 137452,
    [42]: 145700,
    [43]: 154274,
    [44]: 163181,
    [45]: 172426,
    [46]: 182015,
    [47]: 191956,
    [48]: 202254,
    [49]: 212915,
    [50]: 286043,
    [51]: 301089,
    [52]: 326641,
    [53]: 342707,
    [54]: 359295,
    [55]: 376411,
    [56]: 394314,
    [57]: 418064,
    [58]: 447245,
    [59]: 466989,
    [60]: 487304,
    [61]: 508197,
    [62]: 529676,
    [63]: 551748,
    [64]: 574421,
    [65]: 594158,
    [66]: 621514,
    [67]: 646266,
    [68]: 671650,
    [69]: 697673,
    [70]: 754342,
    [71]: 781665,
    [72]: 829648,
    [73]: 838300,
    [74]: 907627,
    [75]: 1082194,
    [76]: 1283276,
    [77]: 1317827,
    [78]: 1334797,
    [79]: 1351800,
    [80]: 1368836,
    [81]: 1385907,
    [82]: 1403010,
    [83]: 1420148,
    [84]: 1437320,
    [85]: 1454526,
    [86]: 1471766,
    [87]: 1489040,
    [88]: 1506348,
    [89]: 1523691,
    [90]: 1541069,
    [91]: 1558481,
    [92]: 1575928,
    [93]: 1593410,
    [94]: 1610926,
    [95]: 1628478,
    [96]: 1646065,
    [97]: 1663687,
    [98]: 1681345,
    [99]: 1699037,
    [100]: 1719180,
    [101]: 1734290,
    [102]: 1749386,
    [103]: 1764470,
    [104]: 1779542,
    [105]: 1794601,
    [106]: 1809649,
    [107]: 1824685,
    [108]: 1839709,
    [109]: 1854722,
    [110]: 1869725,
    [111]: 1884716,
    [112]: 1899697,
    [113]: 1914667,
    [114]: 1929627,
    [115]: 1944577,
    [116]: 1959517,
    [117]: 1974447,
    [118]: 1989368,
    [119]: 2004279,
    [120]: 2019181,
    [121]: 2034074,
    [122]: 2048959,
    [123]: 2063834,
    [124]: 2078701,
    [125]: 0,
  }

  MaxPracticeLevel: any = {
    [0]: 25,
    [1]: 50,
    [2]: 75,
    [3]: 100,
    [4]: 125
  }

  MaxPracticePoint: any = {
    [0]: 25,
    [1]: 50,
    [2]: 75,
    [3]: 100,
    [4]: 125
  }

  MaxXiulianPoint: any = {
    [0]: {[1000]:5,[0]:5,[1]:5,[2]:5,[9]:5,[4]:4,[5]:4,[6]:4,[7]:4,[8]:4,[3]:4,[10]:4,[13]:5,},
    [1]: {[1000]:10,[0]:10,[1]:10,[2]:10,[9]:10,[4]:8,[5]:8,[6]:8,[7]:8,[8]:8,[3]:8,[10]:8,[13]:10,},
    [2]: {[1000]:15,[0]:15,[1]:15,[2]:15,[9]:15,[4]:12,[5]:12,[6]:12,[7]:12,[8]:12,[3]:12,[10]:12,[13]:15,},
    [3]: {[1000]:20,[0]:20,[1]:20,[2]:20,[9]:20,[4]:16,[5]:16,[6]:16,[7]:16,[8]:16,[3]:16,[10]:16,[13]:20,},
	  [4]: {[1000]:25,[0]:26,[1]:26,[2]:26,[9]:26,[4]:16,[5]:16,[6]:16,[7]:16,[8]:16,[3]:16,[10]:16,[13]:25,}
  }

  constructor() {
  }

  Init() {
  }

  GetMaxAddPoint(relive: any, type: any): any {
    return this.MaxPointKang[type][relive];
  }

  GetUpdateYinLiang(level: any): any {
    return this.YinLiang[level];
  }

  GetMaxPriactiveLevel(relive: any): any {
    return this.MaxPracticeLevel[relive];
  }

  GetMaxPoint(relive: any): any {
    return this.MaxPracticePoint[relive];
  }

  //获取某修炼属性最大加点
  GetMaxXiulianPoint(relive: any,key: any){
    return this.MaxXiulianPoint[relive][key];
  }

  GetLevelPoint(relive: any, level: any): any {
    if (level > this.MaxPracticePoint[relive]) {
      return this.MaxPracticePoint[relive];
    }
    return level;
  }
}