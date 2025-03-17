import { AnyAaaaRecord } from "dns";
import GameUtil from "../game/core/GameUtil";
import SKDataUtil from "./SKDataUtil";
import SKLogger from "./SKLogger";
var MongoClient = require('mongodb').MongoClient;


export enum DbName {
    Role = 1,
    Bang = 2,
    Hose = 3,
    HoseSkill = 4,
    Scheme = 5,
    Equip = 6,
    Pet = 7,
    Marry = 8,
    Config = 9,
    Online = 10,
    Tiance = 11,
}

/*
$gt:大于
$lt:小于
$gte:大于或等于
$lte:小于或等于

*/


export default class SKMongoUtil {
    static db: any;
    static client: any;
    static url = 'mongodb://localhost:27017/game';
    static collections:any = {};
    static db_name = {
        [DbName.Role] : 'role',
        [DbName.Bang] : 'bang',
        [DbName.Hose] : 'horse',
        [DbName.HoseSkill] : 'horseSkill',
        [DbName.Pet] : 'pet',
        [DbName.Scheme] : 'scheme',
        [DbName.Equip] : 'equip',
        [DbName.Marry] : 'marry',
        [DbName.Config] : 'gameConfg',
        [DbName.Online] : 'online',
        [DbName.Tiance] : 'tiance',
    };

    static launch(call: Function = null) {
        MongoClient.connect(this.url, (err:any, client:any)=>{
            if (err) {
                SKLogger.warn(err);
                return
            };
            SKMongoUtil.client = client;
            SKMongoUtil.db = client.db("game");
            SKLogger.info(`Mongo连接成功`);
            call&&call();
            client.addListener('close', ()=>{
                SKMongoUtil.launch();
            });
            new SKMongoUtil(DbName.Config).find((err, res)=>{
                if(err){
                    SKLogger.warn(`加载Mongo配置失败`);
                    return
                }
                if(res && res.eindex){
                    return
                }
                SKMongoUtil.setIndex(DbName.Role, 'rileid',{roleid:1}, {unique: true});
                SKMongoUtil.setIndex(DbName.Role, 'account', {serverid:1, accountid:2});
                SKMongoUtil.setIndex(DbName.Bang, 'bangid', {bangid:1}, {unique: true});
                SKMongoUtil.setIndex(DbName.Hose, 'role_id', {role_id:1, position:2}, {unique: true});
                SKMongoUtil.setIndex(DbName.HoseSkill, 'role_id', {role_id:1, position:2}, {unique: true});
                SKMongoUtil.setIndex(DbName.Pet, 'petid', {petid:1}, {unique: true});
                SKMongoUtil.setIndex(DbName.Pet, 'roleid', {roleid:1, state: 2});
                SKMongoUtil.setIndex(DbName.Scheme, 'schemeId', {schemeId:1}, {unique: true});
                SKMongoUtil.setIndex(DbName.Scheme, 'roleId', {roleId:1});
                SKMongoUtil.setIndex(DbName.Equip, 'EquipID', {EquipID:1},{unique: true});
                SKMongoUtil.setIndex(DbName.Equip, 'RoleID', {RoleID:1, state:2});
                SKMongoUtil.setIndex(DbName.Marry, 'id', {id:1}, {unique: true});
                SKMongoUtil.setIndex(DbName.Marry, 'roleid', {status:1, roleid1:2, roleid2: 3});
                SKMongoUtil.setIndex(DbName.Online, 'roleid', {roleid:1}, {unique: true});
                SKMongoUtil.setIndex(DbName.Tiance, 'roleid', {roleid:1, state:2});
                SKLogger.warn(`Mongo设置主键`);
                if(res){
                    new SKMongoUtil(DbName.Config).data({$set: {eindex:1}}).updateOne();
                }else{
                    new SKMongoUtil(DbName.Config).data({eindex:1}).insertOne();
                }

            })

        });

        
    }
    static getColl(index: DbName){
        let name = this.db_name[index];
        return this.collections[name] || (this.collections[name] = this.db.collection(name));
    }
    static setIndex(index: DbName, name:string, keys:any, options:any = null){
        this.getColl(index).createIndex(name, keys, options)
    }
    static close(){
        this.client.close();
    }

    _mongo: any;
    _call: any;
    _where: any = null;
    _data: any = {};
    _sort: any = null;
    _limit: number = null;
    _option: any = null;

    constructor(index: DbName, call: (err:any, res:any)=>void = null){
        this._mongo = SKMongoUtil.getColl(index);
        this._call = call;
        return this;
    }
    sort(res:any){
        res && (this._sort = res);
        return this;
    }
    limit(res:any){
        res && (this._limit = res);
        return this;
    }
    option(res:any){
        res && (this._option = res);
        return this;
    }
    //插入一条数据
    insertOne(call: (err:any, res:any)=>void = null){
        if(this._data){
            this._mongo.insertOne(this._data, call, this._option);
        }
        return this._mongo;
    }
    //插入一条数据
    insertMany(call: (err:any, res:any)=>void = null){
        if(this._data && this._data.length>0){
            this._mongo.insertMany(this._data, call, this._option);
        }
        return this._mongo;
    }
    //查询数据
    find(call: (err:any, res:any)=>void = null){
        this.findArray((err, res)=>{
            if(err || res.length == 0){
                call(err, null);
                return;
            }
            call(err, res ? res.shift() : null);
        })
        return this;
    }
    //查询数据
    findArray(call: (err:any, res:any)=>void = null){
        this._sort && (this._mongo=this._mongo.sort(this._sort));
        this._limit && (this._mongo=this._mongo.limit(this._limit));
        this._mongo.find(this._where).toArray(call);
        return this;
    }
    count(call: (err:any, res:any)=>void = null){
        this._mongo.find(this._where).count(call);
        return this;
    }
    where(where:any){
        where && (this._where = where);
        return this;
    }
    data(data:any){
        data &&(this._data = data);
        return this;
    }
    updateOne(call: (err:any, res:any)=>void = null){
        this._mongo.updateOne(this._where, this._data, call, this._option);
        return this;
    }
    updateMany(call: (err:any, res:any)=>void = null){
        this._mongo.updateMany(this._where, this._data, call, this._option);
        return this;
    }
    //删除一条数据
    deleteOne(call: (err:any, res:any)=>void = null){
        this._mongo.deleteOne(this._where, call, this._option);
        return this;
    }
    //删除多条数据
    deleteMany(call: (err:any, res:any)=>void = null){
        this._mongo.deleteMany(this._where, call, this._option);
        return this;
    }




}