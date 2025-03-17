import { ESkillType, EMagicType, EActionType, ESkillQuality, EActionOn } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

// 当头棒喝
export default class DangTouBangHe extends SkillBase {
    constructor() {
        super();
        this.skill_id = ESkillType.DangTouBangHe;
        this.skill_name = '当头棒喝';
        this.action_type = EActionType.PASSIVE;
        this.quality = ESkillQuality.FINAL; //技能 品质
        this.act_on = EActionOn.SELF;
    }
}