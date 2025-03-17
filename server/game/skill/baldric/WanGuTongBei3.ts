import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 万古同悲-无价
export default class WanGuTongBei3 extends SkillBase {
    constructor() {
        super();
        this.skill_id = ESkillType.WanGuTongBei3;
        this.skill_name = "万古同悲-无价";
        this.effectDesc = "增加自身{0}%的强仙法鬼火属性";
        this.effectMap = {
            [EAttrTypeL1.HK_WIND]: { add: 18, index: 0 },
            [EAttrTypeL1.HK_THUNDER]: { add: 18, index: 0 },
            [EAttrTypeL1.HK_WATER]: { add: 18, index: 0 },
            [EAttrTypeL1.HK_FIRE]: { add: 18, index: 0 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 18, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.FINAL;
    }
}
