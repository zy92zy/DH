import GameUtil from "../core/GameUtil";

export default class EventStateBase {
    nEventType:number;
    nState:number;

    constructor() {
        this.nEventType = 0;
        this.nState = GameUtil.EState.ELock;
    }
}