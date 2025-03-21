import * as mysql from "mysql";
import GameUtil from "./game/core/GameUtil";
import SKDataUtil from "./gear/SKDataUtil";
import SKLogger from "./gear/SKLogger";

// 加载配置表
let config = require("./etc/db_config");
let socketio = require('socket.io');


GameUtil.serverType = 'DB';

// 未知异常捕获
process.on('uncaughtException', (error: Error)=>{
	SKLogger.warn(`$异常:${error.message}\n${error.stack}`);
});

// 数据库连接
class DBAgent {
	socket: any;
	name: string;
	id: number;
	ip: string;

	constructor(socket: any) {
		this.socket = socket;
		this.name = '';
		this.id = 0;
		this.getIP();
	}
	send(event: string, data: any) {
		if (!this.socket.connected) {
			SKLogger.warn(`数据库连接:[${this.id}:${this.name}]已经断开连接,取消发送[${event}]`);
			return;
		}
		this.socket.emit(event, data);
	}

	getIP(){
		if(this.socket.handshake.headers['x-forwarded-for'] != null){  
			this.ip = this.socket.handshake.headers['x-forwarded-for']; 
		}else{  
			this.ip = this.socket.handshake.address;
		}
	}
}

// 数据库服务器
export default class DBServ {

	static shared = new DBServ();

	agent: DBAgent;
	pool:  mysql.Pool;
	agent_seed_id: number = 0;
	socket_pool: any = {};

	constructor() {
		GameUtil.serverConfig = config;
		SKLogger.info('系统配置表加载完毕');
		this.init(config.DB);
	}

	init(config: any) {
		this.pool = mysql.createPool({
			host: config.HOST,
			user: config.USER,
			password: config.PWD,
			database: config.DB,
			port: config.PORT,
			connectionLimit: 200,
			connectTimeout: 60 * 60 * 1000,
			acquireTimeout: 60 * 60 * 1000,
			timeout: 60 * 60 * 1000,
			multipleStatements: true,
			charset: "utf8mb4"
		});
		SKLogger.info('数据库连接:初始化完毕!');
	}
	// 重置连接
	reset(socket: any) {
		let agent = new DBAgent(socket);
		let self = this;
		socket.on('sql', (data: any) => {
			self.fsql(agent, data);
		});
		socket.on('reg', (data: any) => {
			self.freg(agent, data);
		});
		socket.on('close', (data: any) => {
			self.fclose(agent);
		});
		socket.on("connect_error", (data: any) => {
			SKLogger.warn(`数据库连接:[${agent.id}:${agent.name}]连接错误[${data}]`);
		});
		socket.on("connect_timeout", (data: any) => {
			SKLogger.warn(`数据库连接:[${agent.id}:${agent.name}]连接超时[${data}]`);
		});
		socket.on("error", (data: any) => {
			SKLogger.warn(`数据库连接:[${agent.id}:${agent.name}]错误[${data}]`);
		});
		socket.on("disconnect", (reason: string) => {
			SKLogger.warn(`数据库连接:[${agent.id}:${agent.name}]断开连接[${reason}]`);
			self.fclose(agent);
		});
		socket.on("reconnect", (data: any) => {
			SKLogger.warn(`数据库连接:[${agent.id}:${agent.name}]重连[${data}]`);
		});
		socket.on("reconnect_attempt", (data: any) => {
			SKLogger.info("尝试重新连接");
		});
		socket.on("reconnect_error", (data: any) => {
			SKLogger.warn(`数据库连接:[${agent.id}:${agent.name}]重连错误[${data}]`);
		});
		socket.on("reconnect_failed", (data: any) => {
			SKLogger.warn(`数据库连接:[${agent.id}:${agent.name}]连接失败[${data}]`);
		});
		socket.on("ping", (data: any) => {
			SKLogger.info(`数据库连接:[${agent.id}:${agent.name}]PING[${data}]`);
		});
		socket.on("pong", (data: any) => {
			SKLogger.info(`数据库连接:[${agent.id}:${agent.name}]PONG[${data}]`);
		});
		agent.id = this.agent_seed_id;
		this.socket_pool[this.agent_seed_id] = agent;
		this.agent_seed_id++;
		SKLogger.info(`数据库连接:[${agent.id}]已连接!`);
	}

	lanuch() {
		let self = this;
		let io = socketio(config.PORT, {
			"transports":[
				'websocket','polling'
			]
		});
		io.sockets.on('connection', (socket: any) => {
			self.reset(socket);
		});
		SKLogger.info("数据库模块V1.5.0 启动完毕,正在监听本地:"+config.PORT);
	}

	fsql(agent: DBAgent, data: any) {
		this.query(data.sql, (error: any, rows: any) => {
			if (error) {
				SKLogger.warn(`SQL错误:${data.sql}`);
				agent.send('sqled', {
					id:data.id,
					error:error,
					rows:null,
				});
				return;
			}
			agent.send('sqled', {
				id:data.id,
				error:null,
				rows:rows,
			});
		});
	}
	// 注册连接
	freg(agent: DBAgent, data: any) {
		agent.name = data.name;
		SKLogger.warn(`数据库连接:[${agent.id}:${agent.name}]${agent.ip} 完成注册`);
	}
	// 关闭连接
	fclose(agent: DBAgent) {
		let temp: DBAgent = SKDataUtil.valueForKey(this.socket_pool, agent.id);
		if (temp == null) {
			return;
		}
		SKLogger.info(`数据库连接:[${temp.id}:${temp.name}]关闭`);
		delete this.socket_pool[temp.id];
	}

	// 执行查询
	query(sql: string, callback: (error: Error, rows: any) => void) {
		if(SKDataUtil.isEmptyString(sql)){
			SKLogger.warn(`$SQL错误:SQL不能为空!`);
			return;
		}
		this.pool.getConnection((conn_error: mysql.MysqlError, conn: mysql.PoolConnection) => {
			if (conn_error) {
				SKLogger.warn(`SQL连接错误:${conn_error}\n[${sql}]`);
				callback(conn_error, null);
			} else {
				conn.query(sql, (query_error: Error, rows: any, fields: any) => {
					if (query_error) {
						SKLogger.warn(`SQL查询错误:${query_error}\n[${sql}]`);
					}
					//释放连接  
					conn.release();
					//事件驱动回调  
					callback(query_error,rows);
				});
			}
		});
	};
}

new DBServ().lanuch();