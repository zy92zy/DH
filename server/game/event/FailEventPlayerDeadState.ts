import { EEventType } from "../role/EEnum";

export default class FailEventPlayerDeadState {

    nEventType:any;
    nDeadCnt:number;

    constructor() {
        this.nEventType = EEventType.FailEventPlayerDead;
        this.nDeadCnt = 0;
    }
}