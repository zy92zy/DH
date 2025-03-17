import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 澧兰沅芷
export default class LiLanYuanZhi extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.LiLanYuanZhi;
        this.skill_name = "澧兰沅芷";
        this.effectDesc = "[D]增加法力{0}%;[E]增加鬼火狂暴{1}%;[E]增加抗三尸{2}%;[E]抗鬼火{3}%;[E]增加忽视风、雷、水、火、鬼火{4}%";
        this.effectMap = {
            [EAttrTypeL1.MP_PERC]: { add: 1.33, index: 0 },
            [EAttrTypeL1.KB_WILDFIRE]: { add: 2.1, index: 1 },
            [EAttrTypeL1.K_BLOODRETURN]: { add: 1.24, index: 2 },
            [EAttrTypeL1.HK_WIND]: { add: 0.57, index: 3 },
            [EAttrTypeL1.HK_THUNDER]: { add: 0.57, index: 4 },
            [EAttrTypeL1.HK_WATER]: { add: 0.57, index: 5 },
            [EAttrTypeL1.HK_FIRE]: { add: 0.57, index: 6 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 0.57, index: 7 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
