import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级秋水流弦
export default class HighQiuShuiLiuXian extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.HighQiuShuiLiuXian;
        this.skill_name = "高级秋水流弦";
        this.effectDesc = "[E]增加攻击力{0}%;[E]增加连击率{1}%;[E]增加连击次数1";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 1.5, index: 0 },
            [EAttrTypeL1.PHY_COMBO_PROB]: { add: 1.5, index: 1 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
