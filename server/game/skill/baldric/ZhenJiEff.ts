import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality, EMagicType } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 五毒俱全-把玩
export default class ZhenJiEff extends SkillBase {
    mpup: number = 1;

    constructor() {
        super();
        this.skill_id = ESkillType.ZhenJiEff;
        this.skill_name = "精疲力竭BUFF";
        this.effectDesc = "耗蓝增加";
        this.effectMap = {};
        this.action_type = EActionType.INITIATIVE;
        this.quality = ESkillQuality.LOW;
        this.buff_type = EMagicType.ZhenJiEff;
    }
}
