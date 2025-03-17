import SKLogger from "../gear/SKLogger";
import GameUtil from "../game/core/GameUtil";
import ChatLiten from "./ChatLiten";

let agent_seed_id = 1000;

export default class ChatLitenMgr {
    static shared = new ChatLitenMgr();
    io: any;
    agent_list: any;

    constructor() {
        this.io = null;
        this.agent_list = {};
    }

    addAgent(agent: any) {
        agent.id = agent_seed_id;
        this.agent_list[agent.id] = agent;
        agent_seed_id++;
        SKLogger.debug(`聊天监控加入Agent:${agent.id}`);
    }

    delAgent(agentId: any) {
        delete this.agent_list[agentId];
        SKLogger.debug(`聊天监控删除Agent:${agentId}`);
    }

    getAgent(agentid: any) {
        return this.agent_list[agentid];;
    }

    update(dt: number) {
        for (const agent_id in this.agent_list) {
            if (this.agent_list.hasOwnProperty(agent_id)) {
                let agent = this.agent_list[agent_id];
                agent.update(dt);
            }
        }
    }
    //广播聊天信息
    sendChat(data:any){
        for(let k in this.agent_list){
            let ag = this.agent_list[k];
            ag.chat(data);
        }
    }

    start(port:Number) {
        let websocket = require('ws').Server;
        let wss = new websocket({ port: port });
        wss.on("connection", (ws: any) => {
            let agent = new ChatLiten(ws);
            agent.init();
            this.addAgent(agent);
        });
        wss.on('error', (ws: any) => {
            console.log('error');
        });
        this.io = wss;
        console.log(`聊天监控模块启动完毕，正在监听:${port}`);
    }
}
