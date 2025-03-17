import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级四海宁靖
export default class HighSiHaiNingJing extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighSiHaiNingJing;
        this.skill_name = "高级四海宁靖";
        this.effectDesc = "[D]增加法力{0}%;[E]增加抗风、雷、水、火{1}%;[E]增加忽视风、雷、水、火、鬼火{6}%";
        this.effectMap = {
            [EAttrTypeL1.MP_PERC]: { add: 1.56, index: 0 },
            [EAttrTypeL1.K_WIND]: { add: 1.34, index: 1 },
            [EAttrTypeL1.K_THUNDER]: { add: 1.34, index: 2 },
            [EAttrTypeL1.K_WATER]: { add: 1.34, index: 3 },
            [EAttrTypeL1.K_FIRE]: { add: 1.34, index: 4 },
            [EAttrTypeL1.HK_WIND]: { add: 1.34, index: 5 },
            [EAttrTypeL1.HK_THUNDER]: { add: 0.99, index: 6 },
            [EAttrTypeL1.HK_WATER]: { add: 0.99, index: 7 },
            [EAttrTypeL1.HK_FIRE]: { add: 0.99, index: 8 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 0.99, index: 9 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
