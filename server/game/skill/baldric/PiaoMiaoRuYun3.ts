import {ESkillType, EAttrTypeL1, EActionType, ESkillQuality, EAttrTypeL2} from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 飘渺如云・无价
export default class PiaoMiaoRuYun3 extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.PiaoMiaoRuYun3;
        this.skill_name = "飘渺如云・无价";
        this.effectDesc = "(仙法、鬼火)增加自身{0}%的忽视属性";
        this.effectMap = {
            [EAttrTypeL1.HK_WILDFIRE]: { add: 25, index: 0 },
            [EAttrTypeL1.HK_WIND]: { add: 25, index: 0 },
            [EAttrTypeL1.HK_FIRE]: { add: 25, index: 0 },
            [EAttrTypeL1.HK_THUNDER]: { add: 25, index: 0 },
            [EAttrTypeL1.HK_BLOODRETURN]: { add: 25, index: 0 },
            [EAttrTypeL1.ATK_ADD]: { add: 25, index: 1 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.FINAL;
    }
}
