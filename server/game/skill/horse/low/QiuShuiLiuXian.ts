import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 秋水流弦
export default class QiuShuiLiuXian extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.QiuShuiLiuXian;
        this.skill_name = "秋水流弦";
        this.effectDesc = "[E]增加攻击力{0}%;[E]增加连击率{1}%;[E]增加连击次数1";
        this.effectMap = {
            [EAttrTypeL1.ATK_PERC]: { add: 0.88, index: 0 },
            [EAttrTypeL1.PHY_COMBO_PROB]: { add: 0.88, index: 1 }
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
