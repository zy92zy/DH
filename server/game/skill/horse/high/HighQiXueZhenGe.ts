import { ESkillType, EAttrTypeL1, EActionType, ESkillQuality } from "../../../role/EEnum";
import SkillBase from "../../core/SkillBase";

// 高级泣血枕戈
export default class HighQiXueZhenGe extends SkillBase{

	constructor() {
		super();
		this.skill_id = ESkillType.HighQiXueZhenGe;
		this.skill_name = "高级泣血枕戈";
        this.effectDesc = "[M]减少自身气血最大值{0}%(固定)，增加{1}%的攻击力";
        this.effectMap = {
            [EAttrTypeL1.HP_PERC]: { add: -50, grade: 0, index: 0 },
            [EAttrTypeL1.ATK_PERC]: { add: 2.45, index: 1 },
        };
        this.action_type=EActionType.PASSIVE;
        this.quality = ESkillQuality.HIGH;
    }
}
