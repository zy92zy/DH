import SkillBase from "../skill/core/SkillBase";
import SkillUtil from "../skill/core/SkillUtil";
import DB from "../../utils/DB";
import SKDataUtil from "../../gear/SKDataUtil";
import Player from "../object/Player";
import SKLogger from "../../gear/SKLogger";
import ItemUtil from "../core/ItemUtil";
import GameUtil from "../core/GameUtil";
import { MsgCode } from "../role/EEnum";
import SKTimeUtil from "../../gear/SKTimeUtil";

export enum RefiningOperate {
    REFINING = 1,
    REPLACE = 2,
}

export default class HorseSkill {

    static skillMax: number = 12;
    owner: Player;
    dict: { [key: number]: SkillBase };
    times: any;

    constructor(player: Player) {
        this.owner = player;
        this.dict = {};
    }

    setDB(rows: any) {
        if (rows && rows.length > 0) {
            for (let item of rows) {
                let skill = SkillUtil.getHorseSkill(item.skill_id);
                if (skill) {
                    skill.exp = item.exp;
                    this.dict[item.position] = skill;
                }
            }
        }
        let hasFixed = false;
        // 修正
        for (let position = 1; position <= HorseSkill.skillMax; position++) {
            let skill = this.dict[position];
            if (skill == null) {
                let skill = SkillUtil.getRandomHorseSkill(position - 1);
                if (skill) {
                    SKLogger.debug(`玩家[${this.owner.roleid}:${this.owner.name}]随机坐骑技能[${position}:${skill.skill_name}]`);
                    skill.exp = 0;
                    this.dict[position] = skill;
                    hasFixed = true;
                } else {
                    SKLogger.debug(`玩家[${this.owner.roleid}:${this.owner.name}]随机坐骑技能[${position}]为空!`);
                }
            }
        }
    }
    // 存档
    saveDB(callback?: (code: number, msg: string) => void) {
        DB.saveHorseSkillList(this.owner.roleid, this.dict, (error: any, rows: any[]) => {
            if (callback) {
                if(error){
                    callback(MsgCode.FAILED,error.sqlMessage);
                    return;
                }
                callback(MsgCode.SUCCESS,"");
            } else {
                if (error != null) {
                    SKLogger.warn(`存档:玩家[${this.owner.roleid}:${this.owner.name}]坐骑技能存档失败[${error.sqlMessage}]!`);
                } else {
                    SKLogger.debug(`存档:玩家[${this.owner.roleid}:${this.owner.name}]坐骑技能存档完成!`);
                }
            }
        });
    }
	/**
	 * 存档
	 * @param sleep 是否延迟存档
	 * @param source 存档原因
	 */
     save(sleep: boolean = false, source = ''){
		let self = this;
		if(sleep){
			//延迟5s存档
			if(this.times != 0){
				SKTimeUtil.cancelDelay(this.times);
				this.times = 0;
			}
			this.times = SKTimeUtil.delay(()=>{
				self.save(false,source);
			},5 * 1000);
			return;
		}
		this.saveDB();
	}
    // 获得管制技能列表
    getList(control: number): SkillBase[] {
        let list: SkillBase[] = [];
        if (control == 0) {
            return list;
        }
        // 1个种族4个坐骑,1个坐骑位3个技能
        let horseIndex = control % 4;
        let start = ((horseIndex == 0 ? 4 : horseIndex) - 1) * 3 + 1;
        for (let i = 0; i < 3; i++) {
            let skill = this.dict[start + i];
            if (skill) {
                list.push(skill);
            }
        }
        return list;
    }
    getSkill(position: number): SkillBase {
        let result = this.dict[position];
        return result;
    }
    // 洗炼
    refining(data: any) {
        let operate = data.operate;
        let position = data.horseIndex;
        if (operate == RefiningOperate.REFINING) {
            let itemData = ItemUtil.getItemData(GameUtil.horseRefiningItemId);
            let count = ItemUtil.getBagItemCount(this.owner, itemData.id);
            if (count < 3) {
                this.owner.send('s2c_notice', {
                    strRichText: `您需要至少3个[${itemData.name}]才能洗炼坐骑技能!`
                });
                return;
            }
            let group = (position - 1) * 3;
            let right = group + 1 + HorseSkill.skillMax;
            for (let i = 0; i < 3; i++) {
                let skill = SkillUtil.getRandomHorseSkill(group + i);
                this.dict[right + i] = skill;
                SKLogger.debug(`玩家[${this.owner.roleid}:${this.owner.name}]坐骑技能洗炼:[${right + i}:${skill.skill_name}]`);
            }
            this.owner.addItem(itemData.id, -3, false, "坐骑洗炼");
            let params = this.toObj();
            this.owner.send("s2c_horse_skill", params);
        } else if (operate == RefiningOperate.REPLACE) {
            if (data.locks) {
                let total = 0;
                for (let lock of data.locks) {
                    if (lock == 1) {
                        total++;
                    }
                }
                if (total > 0) {
                    total = SKDataUtil.clamp(total, 1, 2);
                    let jade = GameUtil.lockJade[total - 1];
                    if (this.owner.jade < jade) {
                        this.owner.send('s2c_notice', {
                            strRichText: `您的仙玉不足,坐骑洗炼锁住${total}条技能需消耗仙玉${jade}`,
                        });
                        return;
                    }
                    this.owner.addMoney(GameUtil.goldKind.Jade, -jade, `坐骑洗炼锁住${total}条技能,消耗仙玉${jade}`);
                }
            }
            let left = (position - 1) * 3 + 1;
            let right = left + HorseSkill.skillMax;
            for (let i = 0; i < 3; i++) {
                let leftSkill = this.dict[left + i];
                let rightSkill = this.dict[right + i];
                if (rightSkill == null) {
                    continue;
                }
                if (data.locks && i < data.locks.length) {
                    let lock = data.locks[i];
                    if (lock == 1) {
                        this.dict[right + i] = null;
                        continue;
                    }
                }
                rightSkill.exp = leftSkill.exp;
                this.dict[left + i] = rightSkill;
                this.dict[right + i] = null;
                SKLogger.debug(`玩家[${this.owner.roleid}:${this.owner.name}]坐骑技能洗炼替换:[${leftSkill.skill_name}]->[${rightSkill.skill_name}]`);
            }
            let params = this.toObj();
            this.owner.send("s2c_horse_skill", params);
            let control = (this.owner.race - 1) * 4 + position;
            this.owner.updatePetControl(control);
            this.saveDB();
        }
    }

    toObj(): any {
        let result = [];
        for (let position in this.dict) {
            let skill: SkillBase = this.dict[position];
            if (skill) {
                let obj = {
                    position: SKDataUtil.toNumber(position),
                    skillId: SKDataUtil.toNumber(skill.skill_id),
                    exp: skill.exp,
                };
                result.push(obj);
            }
        }
        return { list: result };
    }
}