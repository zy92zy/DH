import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 枯木盘根
export default class KuMuPanGen extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.KuMuPanGen;
        this.skill_name = "枯木盘根";
        this.effectDesc = "[M]减少{0}%的速度(固定)，增加气血{1}%。";
        this.effectMap = {
            [EAttrTypeL1.SPD_PERC]: { add: -20, grade: 0, index: 0 },
            [EAttrTypeL1.HP_PERC]: { add: 1.6, index: 1 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
