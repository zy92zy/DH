import EventBase from "./EventBase";
import GameUtil from "../core/GameUtil";
import { EEventType } from "../role/EEnum";

export default class FailEventPlayerDead extends EventBase {
    nEventType:any;
    nDeadCnt:number;
    constructor() {
        super();
        this.nEventType = EEventType.FailEventPlayerDead;
        this.nDeadCnt = 1;
    }
}