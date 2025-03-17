import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 起死回生-把玩
export default class QiShiHuiSheng1 extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.QiShiHuiSheng1;
        this.skill_name = "起死回生-把玩";
        this.effectDesc = "增加自身{0}%的强三尸属性";
        this.effectMap = {
            [EAttrTypeL1.K_BLOODRETURN]: { add: 6, index: 0 },
            [EAttrTypeL1.HK_BLOODRETURN]: { add: 6, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
