export default class AgentData{
    nID:any;
    nAccount:any;
    strPwd:any;
    strName:any;
    nAddTime:any;
    inviteCode:any;
    nState:any;
    constructor(nID:any, nAccount:any, strPwd:any, strName:any, nAddTime:any, inviteCode:any, nState:any) {
        this.nID = nID;
        this.nAccount = nAccount;
        this.strPwd = strPwd;
        this.strName = strName;
        this.nAddTime = nAddTime;
        this.inviteCode = inviteCode;
        this.nState = nState;
    }
}