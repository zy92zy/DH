import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 后发制人
export default class HouFaZhiRen extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HouFaZhiRen;
        this.skill_name = "后发制人";
        this.effectDesc = "[M]减少{0}%的速度(固定)，增加攻击力{1}%";
        this.effectMap = {
            [EAttrTypeL1.SPD_PERC]: { add: -20, grade: 0, index: 0 },
            [EAttrTypeL1.ATK_PERC]: { add: 2.45, index: 1 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
