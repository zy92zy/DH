import GameUtil from '../game/core/GameUtil';
import SKLogger from '../gear/SKLogger';

let socketio = require('socket.io-client');
let db_cfg = require('../etc/db_config');

export default class DBForm {
	static shared = new DBForm();
	sqlPool: any[];
	socket: any;
	sql_seed = 0;

	constructor() {
		this.sqlPool = [];
	}

	init() {
		if (this.socket) {
			return;
		}
		let uri = "http://localhost:"+db_cfg.PORT;
		this.socket = socketio.connect(uri, {
			reconnect: true
		});
		let self = this;
		this.socket.on('connect', () => { //绑定连接上服务器之后触发的数据
			self.reset();
		});
		this.socket.on("disconnection", () => {
			SKLogger.info("连接:DBServ断开连接");
		})
		this.socket.on("sqled", (data: any) => {
			let id = data.id;
			let sqlInfo = this.sqlPool[id];
			if (sqlInfo) {
				try {
					if (sqlInfo.func) {
						sqlInfo.func(data.error, data.rows)
					}
				} catch (error) {
					SKLogger.warn(`SQL错误:${sqlInfo.sql}:${error.stack}`);
				}
			}
			delete self.sqlPool[id];
		});
	}

	reset() {
		this.socket.emit('reg', {
			name: GameUtil.serverName,
		});
		for (let sql_seed_id in this.sqlPool) {
			let sqlinfo = this.sqlPool[sql_seed_id];
			this.socket.emit('sql', {
				id: sql_seed_id,
				sql: sqlinfo.sql,
			});
		}
	}
	// 查询
	query(sql: string, callback: (error: any, rows: any[]) => void) {
		this.sql_seed++;
		if (this.sql_seed > 5000) {
			this.sql_seed = 0;
		}
		this.sqlPool[this.sql_seed] = {
			id: this.sql_seed,
			sql: sql,
			func: callback,
		}
		this.socket.emit("sql", {
			id: this.sql_seed,
			sql: sql,
		});
	}
}