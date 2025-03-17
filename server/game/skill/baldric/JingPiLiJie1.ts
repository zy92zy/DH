import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType, ESkillQuality, EBuffType, EAttrTypeL1 } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

// 隐身
export default class JingPiLiJie1 extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.JingPiLiJie1;
		this.skill_name = '精疲力竭-把玩';
        this.effectDesc = "破甲和震击加强10%";
        this.effectMap = {
            [EAttrTypeL1.PHY_ZHENJI]: { add: 10, index: 0 },
            [EAttrTypeL1.PHY_POJIA]: { add: 10, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }


}