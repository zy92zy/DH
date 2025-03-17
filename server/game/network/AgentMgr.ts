import SKLogger from "../../gear/SKLogger";
import GameUtil from "../core/GameUtil";
import Agent from "./Agent";
import AgentBase from "./AgentBase";

let agent_seed_id = 1000;

export default class AgentMgr {
    static shared = new AgentMgr();
    io: any;
    agent_list: any;

    constructor() {
        this.io = null;
        this.agent_list = {};

        GameUtil.serverType=='game'&&setInterval(()=>{
            GameUtil.login_status = 0;
            SKLogger.debug(`定时重置登陆人数`);
        }, 100 * 1000);

    }

    addAgent(agent: Agent) {
        agent.id = agent_seed_id;
        this.agent_list[agent.id] = agent;
        agent_seed_id++;
        SKLogger.debug(`加入Agent:${agent.id}`);
    }

    delAgent(agentId: number) {
        let agent = this.agent_list[agentId];
        if (agent == null) {
            return;
        }
        delete this.agent_list[agentId];
        SKLogger.debug(`删除Agent:${agentId}`);
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
    start() {
        let websocket = require('ws').Server;
        let wss = new websocket({ port: GameUtil.serverConfig.GAME.PORT });
        wss.on("connection", (ws: any) => {
            let agent = new Agent(ws);
            agent.init();
            this.addAgent(agent);
        });
        wss.on('error', (ws: any) => {
            SKLogger.debug('error');
        });
        this.io = wss;
        SKLogger.debug(`网关代理模块启动完毕，正在监听${GameUtil.serverConfig.GAME.HOST}:${GameUtil.serverConfig.GAME.PORT}`);
    }
    // 关服
    close() {
        for (let agentid in this.agent_list) {
            let agent: AgentBase = this.agent_list[agentid];
            if(agent)
                agent.close();
        }
        if (this.io) {
            this.io.close();
        }
    }

    getAgentByAccountid(accountid: any): any {
        for (const agent_id in this.agent_list) {
            if (this.agent_list.hasOwnProperty(agent_id)) {
                const agent = this.agent_list[agent_id];
                if (agent.accountid == accountid) {
                    return agent;
                }
            }
        }
        return null;
    }
}
