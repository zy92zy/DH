import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 幽影-珍藏
export default class YouYing2 extends SkillBase {
    constructor() {
        super();
        this.skill_id = ESkillType.YouYing2;
        this.skill_name = "幽影-珍藏";
        this.effectDesc = "增加自身{0}%忽视鬼火属性";
        this.effectMap = {
            [EAttrTypeL1.HK_WILDFIRE]: { add: 14, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
