import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

export default class AnYingLiHun extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.AnYingLiHun;
		this.skill_name = '虎符之魂';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.AnYingLiHun;
	}

    getEffect(params:any=null):any{
        let rate = SKDataUtil.random(0,100);
        return 10;
    }
}