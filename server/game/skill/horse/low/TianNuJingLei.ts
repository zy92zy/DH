import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 天怒惊雷
export default class TianNuJingLei extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.TianNuJingLei;
        this.skill_name = "天怒惊雷";
        this.effectDesc = "[E]增加雷系狂暴率{0}%;[E]增加忽视风、雷、水、火、鬼火{1}%";
        this.effectMap = {
            [EAttrTypeL1.KB_THUNDER]: { add: 3.17, index: 0 },
            [EAttrTypeL1.HK_WIND]: { add: 0.57, index: 1 },
            [EAttrTypeL1.HK_THUNDER]: { add: 0.57, index: 2 },
            [EAttrTypeL1.HK_WATER]: { add: 0.57, index: 3 },
            [EAttrTypeL1.HK_FIRE]: { add: 0.57, index: 4 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 0.57, index: 5 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
