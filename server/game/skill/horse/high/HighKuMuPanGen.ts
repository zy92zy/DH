import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级枯木盘根
export default class HighKuMuPanGen extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighKuMuPanGen;
        this.skill_name = "高级枯木盘根";
        this.effectDesc = "[M]减少{0}%的速度(固定)，增加气血{1}%。";
        this.effectMap = {
            [EAttrTypeL1.SPD_PERC]: { add: -20, grade: 0, index: 0 },
            [EAttrTypeL1.HP_PERC]: { add: 2.6, index: 1 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
