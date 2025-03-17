import SkillBase from "../core/SkillBase";
import { EActionType, EAttrTypeL1, ESkillType} from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

export default class LuoZhiYunYan extends SkillBase {
	constructor() {
		super();
		this.skill_id = ESkillType.LuoZhiYunYan;
		this.skill_name = '落纸云烟';
		this.action_type = EActionType.PASSIVE;
		this.kind = ESkillType.LuoZhiYunYan;
	}

    getEffect(params:any=null):any{
        let ret = SKDataUtil.clone(GameUtil.skillEffect);
        ret.atk = params.getAttr(EAttrTypeL1.ATK) * 0.1;
        ret.round = 999;
		return ret;
    }
}