import { EEventType } from "../role/EEnum";
import EventBase from "./EventBase";

export default class FailEventTimeOut extends EventBase {
    nEventType:number;
    nMaxTime:number;
    constructor() {
        super();
        this.nEventType = EEventType.FailEventTimeOut;
        this.nMaxTime = 60;
    }
}