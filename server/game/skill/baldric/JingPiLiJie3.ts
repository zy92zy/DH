import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType, ESkillQuality, EBuffType, EAttrTypeL1 } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

// 隐身
export default class JingPiLiJie3 extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.JingPiLiJie3;
		this.skill_name = '精疲力竭-无价';
        this.effectDesc = "目标处于破甲或震击状态下,施法法力消耗提升15%,每100点力量消耗提升2%";
        this.effectMap = {};
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }


}