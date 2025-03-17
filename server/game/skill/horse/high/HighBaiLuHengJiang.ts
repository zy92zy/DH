import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级白露横江
export default class HighBaiLuHengJiang extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighBaiLuHengJiang;
        this.skill_name = "高级白露横江";
        this.effectDesc = "[D]增加法力{0}%;[E]增加抗物理{1}%;[E]增加抗毒{2}%;[E]增加忽视风、雷、水、火、鬼火{3}%";
        this.effectMap = {
            [EAttrTypeL1.MP_PERC]: { add: 1.76, index: 0 },
            [EAttrTypeL1.K_PHY_GET]: { add: 1.24, index: 1 },
            [EAttrTypeL1.K_POISON]: { add: 3.45, index: 2 },
            [EAttrTypeL1.HK_WIND]: { add: 1.11, index: 3 },
            [EAttrTypeL1.HK_THUNDER]: { add: 1.11, index: 4 },
            [EAttrTypeL1.HK_WATER]: { add: 1.11, index: 5 },
            [EAttrTypeL1.HK_FIRE]: { add: 1.11, index: 6 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 1.11, index: 7 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
