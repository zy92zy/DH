import SkillBase from "../core/SkillBase";
import { EActionType, ESkillType, EMagicType, ESkillQuality } from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import SKDataUtil from "../../../gear/SKDataUtil";

// 飞珠溅玉
export default class FeiZhuJianYu extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.FeiZhuJianYu;
		this.skill_name = "飞珠溅玉";
		this.action_type = EActionType.INITIATIVE;
		this.kind = ESkillType.FeiZhuJianYu;
		this.quality = ESkillQuality.HIGH;
		this.skill_type = EMagicType.Water;
	}

	getEffect(params: any = null): any {
		let level = params.level || 0;
		let relive = params.relive || 0;
		let qinmi = params.qinmi || 0;
		let maxmp = params.maxmp || 0;
        let cnt = 1;
        /**
         * 概率两个目标，亲密度越高概率越高  最高70%概率。
         * 亲密度达到80%或者以上，才有概率三个目标，亲密度越高概率越高  最高50%概率。
        */
        let rate = qinmi / 1e9;

        let rand = SKDataUtil.random(0,100);
        if(rate * 100 + 15 >= rand){
            cnt = 2;
        }
        if(rate >= 0.2 && rate * 70 + 10 >= rand){
            cnt = 3;
        }
		let ret = SKDataUtil.clone(GameUtil.skillEffect);
		ret.hurt = Math.floor(80 * level + maxmp / 100 * 6 * (relive * 0.6 + 1) * (level ** 0.5 / 10 + qinmi ** 0.1566667 * 10 / (100 + relive * 20)));
		ret.cnt = cnt;
		return ret;
	}
}