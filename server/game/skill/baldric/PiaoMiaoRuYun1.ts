import {ESkillType, EAttrTypeL1, EActionType, ESkillQuality, EAttrTypeL2} from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 飘渺如云・把玩
export default class PiaoMiaoRuYun1 extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.PiaoMiaoRuYun1;
        this.skill_name = "飘渺如云・把玩";
        this.effectDesc = "增加自身{0}%的强仙法、鬼火属性";
        this.effectMap = {
            [EAttrTypeL1.HK_WILDFIRE]: { add: 10, index: 0 },
            [EAttrTypeL1.HK_WIND]: { add: 10, index: 0 },
            [EAttrTypeL1.HK_FIRE]: { add: 10, index: 0 },
            [EAttrTypeL1.HK_THUNDER]: { add: 10, index: 0 },
            [EAttrTypeL1.HK_BLOODRETURN]: { add: 10, index: 0 },
            [EAttrTypeL1.ATK_ADD]: { add: 10, index: 1 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
