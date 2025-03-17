import SKDataUtil from "../../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import { ESkillType, EMagicType, ESkillQuality } from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class JiaoLongChuHai extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.JiaoLongChuHai;
		this.skill_name = '蛟龙出海';
		this.skill_type = EMagicType.Water;
		this.quality = ESkillQuality.LOW;
	}

	getEffect(params:any=null):any{
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let profic = params.profic || 0;
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurt = Math.floor(65 * level * (profic ** 0.4 * 2.8853998 / 100 + 1));
		return ret;
	}
}
