import { MsgCode } from "../game/role/EEnum";
import SKLogger from "../gear/SKLogger";
import ChatLitenMgr from "./ChatLitenMgr";
import ServerMgr from "./ServerMgr";

export default class ChatLiten {

    socket: WebSocket;
    accountid: number;
    token: string;
    loginstep: number;
    lastPing: number;
    dt: number;
    id: number;
    serverlist: any = [];


    constructor(socket: any) {
       this.socket = socket;
        this.accountid = -1; // agent 绑定的玩家id
        this.token = ""; // agent 登录token
        this.loginstep = 0;
    }

    //初始化
    init(){
        
        //收到消息
        this.socket.onmessage = (event: MessageEvent)=>{
            let data = event.data;
            this.onmessage(data);
        }
        
        let serlist = ServerMgr.shared.getServerList();
        let svs = [];
        for(let k in serlist){
            let sv = serlist[k];
            svs.push({SerId:sv.sid,SerName:sv.name});
            this.serverlist.push(String(sv.sid));
        }

        let msg = {cmd:4000,data:JSON.stringify(svs)};
        this.send(msg);
    }
    //消息解析
    onmessage(data:any){
        if(data != "ping")
            data = JSON.parse(data);
        switch(data.cmd){
            case 4001:  //服务器筛选
                this.serverlist = data.serids;
                this.sendmsg("服务器筛选完成");
                break;
            case 1:     //禁言操作
                //let sid = data.serid;
                //let roleid = data.roleid;
                //let adid = data.adid;
                this.Speak(data.roleid);
                break;
            case 2:     //封号操作
                /*let sid = data.serid;
                let roleid = data.roleid;
                let adid = data.adid;*/
                this.FreezeAccount(data.roleid);
                break;
        }
    }

    //发送消息
    send(obj: any){
        let data = JSON.stringify(obj);
        this.socket.send(data);
    }

    //发送通知消息
    sendmsg(msg:any){
        this.send({
            cmd: 4002,
            data: msg,
        });
    }

    //发送聊天消息
    chat(obj: any){
        //SKLogger.info(obj);
        let scale = obj.scale;
        if(scale == undefined || scale == null)
            return;

        let data: any = {date:new Date().getTime()};
 
        switch(scale){
            case '1':   //队伍聊天
                data.cmd = 2003;
                break;
            case '2':   //帮派聊天
                data.cmd = 2001;
                break;
            case '0':   //世界聊天
                data.cmd = 2000;
                break;
            default:
                return;
        }

        data.serid = obj.serid;
        data.roleid = obj.roleid;
        data.msg = obj.msg;
        data.adid = obj.onlyid;

        //筛选选择接收的服务器信息
        for(let i = 0; i < this.serverlist.length; i++){
            if(obj.serid == Number(this.serverlist[i])){
                this.send(data);
                return;
            }
        }
    }

    /**
    *禁言操作 
    *@param roleid 角色ID
    * */
    Speak(roleid:number){
        ServerMgr.shared.sendServer(roleid, '/admin', {
            mod: "can_speak",
            sign: MsgCode.GMSIGN,
            roleid: roleid,
            state: 1
        },(success: boolean, data: any)=>{
            if (success)
                this.sendmsg(`${roleid} 禁言成功`);
            else
                this.sendmsg(`${roleid} 禁言失败`);
        });
    }
    /**
     * 封号操作
     * @param roleid 角色ID
     * */
    FreezeAccount(roleid:number){
        ServerMgr.shared.sendServer(roleid,'/admin',{
            mod: 'freeze_player',
            sign: MsgCode.GMSIGN,
            role_id: roleid,
            state: 1
        },(success: boolean, data: any)=>{
            if(success){
                this.sendmsg(`${roleid} 封号成功`);
                return;
            }
            this.sendmsg(`${roleid} 封号失败`);
        });
    }

    ping() {
        if (this.socket) {
            this.socket.send("ping");
        }
        this.lastPing = this.dt;
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
        this.socket = null;
        ChatLitenMgr.shared.delAgent(this.id);
    }
}