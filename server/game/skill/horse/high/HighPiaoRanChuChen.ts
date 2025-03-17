import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级飘然出尘
export default class HighPiaoRanChuChen extends SkillBase{

	constructor() {
		super();
		this.skill_id = ESkillType.HighPiaoRanChuChen;
		this.skill_name = "高级飘然出尘";
        this.effectDesc = "[S]增加速度{0}%;[B]增加气血{1}%";
        this.effectMap = {
            [EAttrTypeL1.SPD_PERC]: { add: 0.95 ,index:0},
            [EAttrTypeL1.HP_PERC]: { add: 0.9 ,index:1}
        };
        this.action_type=EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
