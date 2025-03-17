import GameUtil from "../core/GameUtil";

export default class LivingThing {
	onlyid:number;
	resid:number;
	name:string;
	mapid:number;
	x:number;
	y:number;
	living_type:any;
	dir:number;

	constructor(){
		this.onlyid = GameUtil.getAutoAddId(); //唯一id
		this.resid = 0;//资源id
		this.name = '未知';

		this.mapid = 0;
		this.x = 0;
		this.y = 0;
		this.dir = 4;

		this.living_type = GameUtil.livingType.Unknow;
	}

	toObj() {
		return {
			onlyid: this.onlyid,
			name: this.name,
			
			mapid: this.mapid,
			x: this.x,
			y: this.y,
			type: this.living_type,
		}
	}

	move(){

	}

	isNpc(){
		return this.living_type == GameUtil.livingType.NPC;
	}

	isPlayer(){
		return this.living_type == GameUtil.livingType.Player;
	}

	isMonster() {
		return this.living_type == GameUtil.livingType.Monster;
	}

	isPet(){
		return this.living_type == GameUtil.livingType.Pet;
	}
}
