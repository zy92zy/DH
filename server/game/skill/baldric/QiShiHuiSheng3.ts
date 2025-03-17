import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 起死回生-无价
export default class QiShiHuiSheng3 extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.QiShiHuiSheng3;
        this.skill_name = "起死回生-无价";
        this.effectDesc = "增加自身{0}%的强三尸属性";
        this.effectMap = {
            [EAttrTypeL1.K_BLOODRETURN]: { add: 18, index: 0 },
            [EAttrTypeL1.HK_BLOODRETURN]: { add: 18, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.FINAL;
    }
}
