import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级风卷残云
export default class HighFengJuanCanYun extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighFengJuanCanYun;
        this.skill_name = "高级风卷残云";
        this.effectDesc = "[E]增加风系狂暴率{0}%;[E]增加忽视风、雷、水、火、鬼火{1}%";
        this.effectMap = {
            [EAttrTypeL1.KB_WIND]: { add: 5.45, index: 0 },
            [EAttrTypeL1.HK_WIND]: { add: 1.01, index: 1 },
            [EAttrTypeL1.HK_THUNDER]: { add: 1.01, index: 2 },
            [EAttrTypeL1.HK_WATER]: { add: 1.01, index: 3 },
            [EAttrTypeL1.HK_FIRE]: { add: 1.01, index: 4 },
            [EAttrTypeL1.HK_WILDFIRE]: { add: 1.01, index: 5 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
