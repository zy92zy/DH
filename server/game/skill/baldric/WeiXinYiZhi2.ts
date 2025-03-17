import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 违心一致-珍藏
export default class WeiXinYiZhi2 extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.WeiXinYiZhi2;
        this.skill_name = "违心一致-珍藏";
        this.effectDesc = "增加自身{0}%的加强混乱属性";
        this.effectMap = {
            [EAttrTypeL1.K_CONFUSION]: { add: 11, index: 0 },
            [EAttrTypeL1.HK_CONFUSION]: { add: 11, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
