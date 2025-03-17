import DB from "../utils/DB";
import SKDataUtil from "../gear/SKDataUtil";
import { MsgCode } from "../game/role/EEnum";

class GateAgent{

    agent_id:any;
    account:any;
    pwd:any;
    agent_name:any;
    create_time:any;
    invitecode:any;
    type:any;
    parent_id:number;

    constructor(data:any) {
        this.agent_id = data.id;
        if(data.account){
            this.account = data.account;
        }else{
            this.account = data.username;
        }
        if(data.name){
            this.agent_name = data.name;
        }else{
            this.agent_name = data.nickname;
        }
        this.pwd = data.password;
        if(data.invitecode){
            this.invitecode=data.invitecode;
        }else{
            this.invitecode=data.invitation;
        }
        this.create_time = data.create_time;
        if(data.type){
            this.type=data.type
        }else{
            this.type=data.agent_type_id;
        }
        this.parent_id = data.p_id;
    }

    toObj():any{
        let result:any={};
        result.agent_id=this.agent_id;
        result.agent_name=this.agent_name;
        result.account=this.account;
        result.pwd=this.pwd;
        result.invitecode=this.invitecode;
        result.create_time=this.create_time;
        result.type=this.type;
        result.parent_id=this.parent_id;
        return result;
    }
}

export default class GateAgentMgr{
    static shared=new GateAgentMgr();
    oneAgent:{[key:string]:GateAgent};
    allAgent:{[key:string]:GateAgent};
    update:{[key:string]:number};

    constructor() {
    }

    encodeInvite(value:number){
        let key='E50CDG3HQA4B1NOPIJ2RSTUV67MWX89KLYZ';
        let result="";
        while(value>0){
            let mod=value%35;
            value=(value-mod)/35;
            result=key[mod]+result;
        }
        if(result.length<5){
            result="F"+result;
            let len=result.length;
            let min=0;
            let max=key.length-1;
            for(let i=len;i<5;i++){
                let index=Math.floor(Math.random()*(max-min+1))+min;
                result=key[index]+result;
            }
        }
        return result;
    }

    decodeInvite(value:string):number{
        let key='E50CDG3HQA4B1NOPIJ2RSTUV67MWX89KLYZ';
        let index=value.indexOf("F");
        if(index != -1){
            value=value.slice(index+1,value.length);
        }
        let result=0;
        let p=0;
        for(let i=value.length-1;i>=0;i--){
            let char=value[i];
            index=key.indexOf(char);
            if(index != -1){
                result+=index*Math.pow(35,p);
                p++;
            }
        }
        return result;
    }

    init() {
        this.readItemFromDB();
    }

    /** 单独更新CPS用户 */
    reloadItem(invitecode: string){
        let sql= `SELECT * FROM agent_admin_user WHERE invitecode='${invitecode}'`;
        let time = new Date().getTime();
        //限制单ID的检测时间为10秒
        if(this.update[invitecode] && this.update[invitecode] < time + 1000*10){
            return;
        }
        this.update[invitecode] = time;
        //清理超时的记录  防止被攻击溢出
        for (const key in this.update) {
            if (Object.prototype.hasOwnProperty.call(this.update, key)) {
                if(this.update[key] > time + 1000 * 120){
                    delete this.update[key];
                }
            }
        }
        DB.query(sql, (err:any, rows:any) => {
            if (err != null)
                return;
            for (let i = 0; i < rows.length; i++) {
                let data=rows[i];
                let invite=data.invitecode;
                if(invite && invite.length==5){
                    let agent = new GateAgent(data);
                    if(data.p_id==0){
                        this.oneAgent[agent.agent_id]=agent;
                    }
                    this.allAgent[agent.agent_id] = agent;
                    console.log(`更新CPS用户: [${agent.agent_id}][${agent.agent_name}][${invite}]`);
                    delete this.update[invite];
                }
            }
        });
    }


    readItemFromDB() {
        let sql= `SELECT * FROM agent_admin_user ORDER BY p_id`;
        /*if(GameUtil.serverConfig.HTTP.NAME=="qmxy"){
            sql=`SELECT * FROM agent_admin_user`;
        }*/
        DB.query(sql, (err:any, rows:any) => {
            if (err != null)
                return;
            this.oneAgent={};
            this.allAgent = {};
            this.update = {};
            for (let i = 0; i < rows.length; i++) {
                let data=rows[i];
                let invite=data.invitecode;
                /*if(GameUtil.serverConfig.HTTP.NAME=="qmxy"){
                    invite=data.invitation;
                }*/
                //console.log('1111111','0 0 0 * * *',invite);
                if(invite && invite.length==5){
                    let agent = new GateAgent(data);
                    if(data.p_id==0){
                        this.oneAgent[agent.agent_id]=agent;
                    }
                    this.allAgent[agent.agent_id] = agent;
                }
            }
        });
    }
    // 获得代理列表
    getAgentList(req:any,res:any){
        let result=this.toObj();
        res.end(SKDataUtil.toJson({
            list:result,
        }));
    }

    isCodeEnable(inviteCode:string):boolean{
        if(inviteCode.length!=5){
            return false;
        }
        if(inviteCode=="ABCDE"){
            return true;
        }
        for (let key in this.allAgent) {
            if (this.allAgent[key].invitecode == inviteCode){
                return true;
            }
        }
        this.reloadItem(inviteCode);
        return false;
    }

    toObj():any{
        let result=[];
        for (let key in this.oneAgent) {
            result.push(this.oneAgent[key].toObj());
        }
        return result;
    }

}