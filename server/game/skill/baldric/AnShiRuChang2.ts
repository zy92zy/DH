import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType, ESkillQuality, EBuffType, EAttrTypeL1 } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

// 隐身
export default class AnShiRuChang2 extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.AnShiRuChang2;
		this.skill_name = '安适如常-珍藏';
        this.effectDesc = "在治愈时额外恢复目标10%法力值";
        this.effectMap = {};
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }


}