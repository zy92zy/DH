import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType, ESkillQuality, EBuffType, EAttrTypeL1 } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

// 隐身
export default class GongWuBuKe2 extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.GongWuBuKe2;
		this.skill_name = '攻无不克-珍藏';
        this.effectDesc = "HP上限和伤害增加{0}%";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: 6, index: 0 },
            [EAttrTypeL1.ATK_PERC]: { add: 6, index: 0 },
        };
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.LOW;
    }


}