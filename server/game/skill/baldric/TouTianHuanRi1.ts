import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 偷天换日-把玩
export default class TouTianHuanRi1 extends SkillBase {

    constructor() {
        super();
        this.skill_id = ESkillType.TouTianHuanRi1;
        this.skill_name = "偷天换日-把玩";
        this.effectDesc = "增加自身[E]%的强震摄属性";
        this.effectMap = {
            [EAttrTypeL1.K_DETER]: { add: 5, index: 0 },
            [EAttrTypeL1.HK_DETER]: { add: 5, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }
}
