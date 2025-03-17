import SKDataUtil from "../../gear/SKDataUtil";
import GameUtil from "../core/GameUtil";

export default class Horse {
    position: number;
    name: string = "";
    level: number = 1;
    exp: number = 0;
    race: number = 0;
    showName: string = "";

    constructor(position: number, name: string, level: number, exp: number, race: number) {
        this.position = position;
        this.name = name;
        this.level = level;
        this.exp = exp;
        this.setRace(race);
        this.resetLevel();
    }

    resetLevel(){
        let expList = GameUtil.game_conf.horse_exp;
        let level = expList.length;
        for (let item of expList) {
            if (this.exp < item.exp) {
                level = item.level;
                break;
            }
        }
        this.level=level;
    }

    setRace(race: number) {
        if(this.race == race){
            return;
        }
        this.race=race;
        let conf = GameUtil.game_conf.horse[(this.race - 1) * 4 + this.position];
        if (conf != null) {
            if (SKDataUtil.isEmptyString(this.name)) {
                this.showName = conf.name;
            } else {
                this.showName = this.name;
            }
        }
    }

    toObj(): any {
        let result = {
            position: this.position,
            name: this.name,
            level: this.level,
            exp: this.exp
        };
        return result;
    }
}