import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 五毒俱全-珍藏
export default class WuDuJuQuan2 extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.WuDuJuQuan2;
        this.skill_name = "五毒俱全-珍藏";
        this.effectDesc = "增加自身{0}%的加强毒属性";
        this.effectMap = {
            [EAttrTypeL1.HK_POISON]: { add: 14, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
