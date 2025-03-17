import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType, ESkillQuality, EBuffType, EAttrTypeL1 } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

// 隐身
export default class WanGuChangCun3 extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.WanGuChangCun3;
		this.skill_name = '万古长春-无价';
        this.effectDesc = "治愈状态恢复目标生命最大值3%，每300点根骨提高1%";
        this.effectMap = {};
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }


}