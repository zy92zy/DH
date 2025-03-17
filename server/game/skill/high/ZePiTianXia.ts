import SKDataUtil from "../../gear/SKDataUtil";
import GameUtil from "../../core/GameUtil";
import {ESkillType, EMagicType, ESkillQuality, EActionOn, EAttrTypeL1, EBuffType} from "../../role/EEnum";
import SkillBase from "../core/SkillBase";

export default class ZePiTianXia extends SkillBase {
    constructor() {
        super();
        this.skill_id = ESkillType.ZePiTianXia;
        this.skill_name = '泽披天下';
        this.skill_type = EMagicType.ASYLUM;
        this.buff_type = EBuffType.LOOP;
        this.quality = ESkillQuality.HIGH;
        this.act_on = EActionOn.SELF;
        this.cooldown = 5;
    }

    getEffect(params:any=null):any{
        let profic = params.profic || 0;
        let ret = SKDataUtil.clone(GameUtil.skillEffect);
        ret.round = 3;
        ret.cnt = Math.min(7, Math.floor(3 * (1 + profic ** 0.35 * 5 / 100)));
        return ret;
    }
}