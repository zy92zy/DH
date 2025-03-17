import GameUtil from "../core/GameUtil";
import DB from "../../utils/DB";
import ShopItem from "./ShopItem";

export default class Shop {
    private static _shared:Shop;
    nMaxID:number;
    mapItem:any;
    // 全部存档
    static saveAll(callback:(msg:string)=>void){
        this.shared.saveAll(callback);
    }

    static get shared():Shop{
        if(!this._shared){
            this._shared=new Shop();
        }
        return this._shared;
    }

    constructor() {
        this.nMaxID = 0;
        this.mapItem = {};
    }

    init() {
        this.readItemFromDB();
    }

    readItemFromDB() {
        let strSql = `SELECT * FROM shop_goods`;
        DB.query(strSql, (err:any, rows:any) => {
            if (err != null)
                return;

            for (let i = 0; i < rows.length; i++) {

                if (GameUtil.getTime() - rows[i].nAddTime > 86400 * 10) // 超过 10 天无人取回直接丢弃
                    continue;


                let stShopItem = new ShopItem(rows[i].nID, rows[i].nConfigID, rows[i].nKind, rows[i].nSubKind, rows[i].strJson, rows[i].nSeller, rows[i].nAddTime, rows[i].nPrice, rows[i].nCnt, rows[i].nSellCnt, );
                this.mapItem[stShopItem.nID] = stShopItem;
            }
        });
    }

    FindShopItem(nID:any):any{
        if (this.mapItem.hasOwnProperty(nID) == false)
            return null;

        return this.mapItem[nID];
    }


    GetMaxID() {
        let nMax = 0;
        for (let it in this.mapItem) {
            if (Number(it) > nMax)
                nMax = Number(it);
        }
        return nMax;
    }

    IsIteamCanSell(nID:any) {
        if (nID >= 30001 && nID <= 30030)
            return false;

        if (GameUtil.isDataInVecter(nID, [10202, 10116, 10201, 50004, 10301, 10302, 10303, 10406, 10401]))
            return false;

        return true;
    }
    // 全部存档
    saveAll(callback:(msg:string)=>void) {
        let total = GameUtil.getMapLen(this.mapItem);
        if (total == 0) {
            let msg=`商城存档:数量少于1个，无需存档!`;
            callback(msg);
            return;
        }
        let clear = 'TRUNCATE TABLE shop_goods';
        let sql = '';
        for (let key in this.mapItem) {
            let item = this.mapItem[key];
            let insert = `INSERT INTO shop_goods(nID,nConfigID, nKind, nSubKind, strJson, nSeller,nAddTime,nPrice,nCnt,nSellCnt) values( ${item.nID},${item.nConfigID} ,${item.nKind} ,0,'${item.strJson}',${item.nSeller},${item.nAddTime},${item.nPrice},${item.nCnt},${item.nSellCnt});`;
            sql += insert;
        }
        DB.query(clear,(error: any, rows: any[]) =>{
            if (error != null) {
                let msg=`商城存档:无法清空表!`;
                callback(msg);
                return;
            }
            DB.query(sql,(error: any, rows: any[]) =>{
                if(error != null){
                    let msg=`商城存档:无法插入数据!`;
                    callback(msg);
                    return;
                }
                let msg=`商城存档:全部存档成功!`;
                callback(msg);
            });
        });
    }
}