import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType, EAttrTypeL1 } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

export default class AnZhiJiangLin extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.AnZhiJiangLin;
		this.skill_name = '暗之降临';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.AnZhiJiangLin;
	}

    getEffect(params:any=null):any{
		let qinmi = params.qinmi || 0;

		if(qinmi >= 15000 * 10000){
			return 5;
		}else if(qinmi >= 7000 * 10000){
			return 4;
		}
		return 3;
    }
}