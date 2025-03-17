import SkillBase from "../core/SkillBase";
import { ESkillType, EMagicType, EBuffType, EActionOn, ESkillQuality , EAttrTypeL1} from "../../role/EEnum";
import GameUtil from "../../core/GameUtil";
import Buff from "../core/Buff";
import SKLogger from "../../../gear/SKLogger";
import SKDataUtil from "../../../gear/SKDataUtil";
import SkillUtil from "../core/SkillUtil";

export default class NiLin extends SkillBase{
    constructor() {
        super();
		this.skill_id = ESkillType.NiLin;
		this.skill_name = '逆鳞';
		this.skill_type = EMagicType.BianShen;
		this.quality = ESkillQuality.HIGH;
		this.buff_type = EBuffType.ONCE;
		this.act_on = EActionOn.SELF;

        this.limit_round = 3;
        this.cooldown = 3;
    }

    
    getEffect(battleRole: any=null):any{
        let atk = (battleRole&&battleRole.getAttr(EAttrTypeL1.ATK)) || 0;
        let hit = (battleRole&&battleRole.getAttr(EAttrTypeL1.PHY_HIT)) || 0;
        let get = (battleRole&&battleRole.getAttr(EAttrTypeL1.PHY_GET)) || 0;

        let ret = SKDataUtil.clone(GameUtil.skillEffect);
        ret.round = 2;
        ret.hit = Math.round(hit*0.3);
        ret.atk = Math.round(atk*0.3);

        return ret;
    }

}