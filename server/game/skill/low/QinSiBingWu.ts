import SkillBase from "../core/SkillBase";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";
import { EBuffType, EMagicType, ESkillQuality, ESkillType } from "../../role/EEnum";

export default class QinSiBingWu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.QinSiBingWu;
		this.skill_name = '秦丝冰雾';
		this.skill_type = EMagicType.SubDefense;
		this.buff_type = EBuffType.ONCE;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params:any=null):any{
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.skongzhi = Math.floor(1.5 * (profic ** 0.35 * 20 / 100 + 1));
		ret.round = Math.floor(3 * (1 + profic ** 0.35 * 5 / 100));
		return ret;
	}
}