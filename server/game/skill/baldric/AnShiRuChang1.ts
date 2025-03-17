import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType, ESkillQuality, EBuffType, EAttrTypeL1 } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

// 隐身
export default class AnShiRuChang1 extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.AnShiRuChang1;
		this.skill_name = '安适如常-把玩';
        this.effectDesc = "加强治愈属性10%";
        this.effectMap = {
            [EAttrTypeL1.PHY_ZHIYU]: { add: 10, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }


}