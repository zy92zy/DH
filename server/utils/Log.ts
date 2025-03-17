import DB from './DB';
import GTimer from '../common/GTimer';
import SKLogger from '../gear/SKLogger';
import GameUtil from '../game/core/GameUtil';
import { SrvRecord } from 'dns';

export enum LogType{
    login = 0,
    addBagItem = 1,
    addItem = 2,
    addExp = 3,
    addMoney = 4,
    addEquip = 5,
    createPet = 6,
    addPet = 7,
    delPet = 8,
    useItem = 9,
    upgradeEquip = 10,
    createEquip = 11,
    //删除装备
    delEquip = 12,
    shenbignUpgrade = 13,
    //一键分解
    gfenjieEquip = 14,
    // 宝石镶嵌
	equipInlay = 15,
    /** 装备炼化 */
	equipRefine = 16,
    //物品重铸
	itemResolve = 17,
	baldricRecast = 18,
	chat = 19,
    //减少物品
    subItem = 20,
    //改名
    changeName = 21,
}


export default class Log {

    static init() {

        this.dayUpdate();
    };

    

    static log_db_name: string = 'game_log';
    static data_db_name: string = 'player_data_log';
    //日志表删除世界
    static expire_day: number = 7;

    /**创建未来1月的数据表 */
    static dayUpdate(){
        let sql = `SELECT table_name FROM information_schema.tables WHERE table_schema='game_log';`;
        let date = new Date();
        date.setDate(date.getDate() - this.expire_day);
        let day = Number(GTimer.format(date, 'yyyyMMdd'));
        DB.query(sql, (error: any, rows: any) => {
            if(error){
                SKLogger.warn(`SQL异常 ${sql}`);
                return;
            }
            for (const row of rows) {
                let name = row['table_name'];
                if(/^[0-9]{8}$/.test(name)){
                    if(Number(name) < day){
                        let sql = `DROP TABLE ${this.log_db_name}.${name};`;
                        DB.query(sql, ()=>{});
                        SKLogger.info(`日志表${name}时间超过7日, 删除`);
                    }
                }
            }
        });

        for(let i=0;i<30;i++){
            let date = new Date().setDate(new Date().getDate() + i);
            let day = GTimer.format(date, 'yyyyMMdd');
            let sql = `CREATE TABLE IF NOT EXISTS ${this.log_db_name}.${day} (
                id int(10) NOT NULL AUTO_INCREMENT,
                roleid int(11) DEFAULT NULL,
                serverid int(10) DEFAULT NULL,
                type int(3) DEFAULT NULL,
                val1 int(11) DEFAULT NULL,
                val2 int(11) DEFAULT NULL,
                val3 int(11) DEFAULT NULL,
                time datetime DEFAULT NULL,
                msg varchar(32) DEFAULT NULL,
                PRIMARY KEY (id)
              ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;`;

            DB.query(sql, (error: any, rows: any) => {
                error&&SKLogger.warn(`SQL异常 ${sql}`);
            })
        }
    }

    static reduceStr(str:string):string{
        return str.length > 30 ? (str = str.substr(0,30)) : str;
    }
    static getDay(){
        return GTimer.format('yyyyMMdd');
    }
    static addLog(data: any = {}){
		return;
        data.serverid = GameUtil.serverId;
        for (const key in data) {
            data[key] || (data[key]=0);
        }
        if(data.msg){
            data.msg = this.reduceStr(data.msg);
        }
        let key = Object.keys(data).join(',');
        let val = Object.values(data).join('\',\'');
        let sql = `INSERT INTO ${this.log_db_name}.${this.getDay()} (${key},time) VALUES ('${val}',NOW());`;
        DB.query(sql, (error: any, rows: any) => {
            error && SKLogger.info(`创建添加日志失败 ${sql}`);
        });
    }

    static login(accountid: number,  ip:string){
        this.addLog({
            roleid: 0,
            val1: accountid,
            type: LogType.login,
            msg: ip,
        });
    }
    static addExp(roleid: number, exp:number){
        return;
        this.addLog({
            roleid: roleid,
            type: LogType.addExp,
            val1: exp,
        });
    }

    static addMoney(roleid: number, kind:number, count: number, msg: string = ""){
        this.addLog({
            roleid: roleid,
            type: LogType.addMoney,
            val1: kind,
            val2: count,
            msg: msg,
        });
    }

    static addBagItem(roleid: number, item:number, count: number, source:string=''){
        this.addLog({
            roleid: roleid,
            type: LogType.addBagItem,
            val1: item,
            val2: count,
            msg: source,
        });
    }

    static addItem(roleid: number, item:number, count: number, type:number){
        this.addLog({
            roleid: roleid,
            type: LogType.addItem,
            val1: item,
            val2: count,
            val3: type,
        });
    }
    //添加装备 装备id, 装备模板id, 装备等级, 装备类型:装备名
    static addEquip(roleid: number, id:number, type:number, grade: number, msg:string = ''){
        this.addLog({
            roleid: roleid,
            type: LogType.addEquip,
            val1: id,
            val2: type,
            val3: grade,
            msg: msg,
        });
    }

    static createPet(roleid: number, petid:number, msg:string = ''){
        this.addLog({
            roleid: roleid,
            type: LogType.createPet,
            val1: petid,
            msg: msg,
        });
    }

    static delPet(roleid: number, petid:number, succ:number, msg:string=''){
        this.addLog({
            roleid: roleid,
            type: LogType.delPet,
            val1: petid,
            val2: succ,
            msg: msg,
        });
    }

    static useItem(roleid: number, itemid:number){
        this.addLog({
            roleid: roleid,
            type: LogType.useItem,
            val1: itemid,
        });
    }

    //添加装备 装备id, 装备模板id, 装备等级, 装备类型:装备名
    static upgradeEquip(roleid: number, id:number, type:number, grade: number, msg:string = ''){
        this.addLog({
            roleid: roleid,
            type: LogType.upgradeEquip,
            val1: id,
            val2: type,
            val3: grade,
            msg: msg,
        });
    }

    //装备升阶
    static shenbignUpgrade(roleid: number, equipid:number, resid:number){
        this.addLog({
            roleid: roleid,
            type: LogType.shenbignUpgrade,
            val1: equipid,
            val2: resid,
        });
    }

    //装备升阶
    static addPet(roleid: number, equipid:number, resid:number){
        this.addLog({
            roleid: roleid,
            type: LogType.addPet,
            val1: equipid,
            val2: resid,
        });
    }

    static createEquip(roleid: number, type:number, resid: number){
        this.addLog({
            roleid: roleid,
            type: LogType.createEquip,
            val1: type,
            val2: resid,
        });
    }
    static delEquip(roleid: number, equipid:number, msg:string){
        this.addLog({
            roleid: roleid,
            type: LogType.delEquip,
            val1: equipid,
            msg: msg,
        });
    }
    static equipInlay(roleid: number, equipid:number, baoshi:number){
        this.addLog({
            roleid: roleid,
            type: LogType.equipInlay,
            val1: equipid,
            val2: baoshi,
        });
    }
    static equipRefine(roleid: number, equipid:number){
        this.addLog({
            roleid: roleid,
            type: LogType.equipRefine,
            val1: equipid,
        });
    }
    static itemResolve(roleid: number, itemid:number){
        this.addLog({
            roleid: roleid,
            type: LogType.itemResolve,
            val1: itemid,
        });
    }
    static baldricRecast(roleid: number, equipid:number){
        this.addLog({
            roleid: roleid,
            type: LogType.baldricRecast,
            val1: equipid,
        });
    }
    static changeName(roleid: number, name:string, petid: any = 0){
        this.addLog({
            roleid: roleid,
            type: LogType.changeName,
            val1: petid,
            msg: name,
        });
    }
    static gfenjieEquip(roleid: number){
        this.addLog({
            roleid: roleid,
            type: LogType.gfenjieEquip,
        });
    }
    static subItem(roleid: number, item: number, count: number){
        this.addLog({
            roleid: roleid,
            val1: item,
            val2: count,
            type: LogType.subItem,
        });
    }

    //0 世界 1 队伍 2 帮派 3私聊
    static chat(roleid: number, type:number, msg: string, bangid:number=0, issend:number=0){
        this.addLog({
            roleid: roleid,
            val1: type,
            val2: bangid,
            val3: issend,
            msg: msg,
            type: LogType.chat,
        });
    }








}