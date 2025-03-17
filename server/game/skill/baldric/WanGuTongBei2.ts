import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 万古同悲-珍藏
export default class WanGuTongBei2 extends SkillBase {
    constructor() {
        super();
        this.skill_id = ESkillType.WanGuTongBei2;
        this.skill_name = "万古同悲-珍藏";
        this.effectDesc = "增加自身{0}%的强仙法鬼火属性";
        this.effectMap = {
            [EAttrTypeL1.HK_WIND]: { add: 14, index: 0 },
            [EAttrTypeL1.HK_THUNDER]: { add: 14, index: 0 },
            [EAttrTypeL1.HK_WATER]: { add: 14, index: 0 },
            [EAttrTypeL1.HK_FIRE]: { add: 14, index: 0 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 14, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
