import { EEventType } from "../role/EEnum";

export default class FailEventTimeOutState {

    nEventType:any;
    nStartTime:number;

    constructor() {
        this.nEventType = EEventType.FailEventTimeOut;
        this.nStartTime = 0;
    }
}