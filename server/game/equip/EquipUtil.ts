import SKDataUtil from "../../gear/SKDataUtil";

export default class EquipUtil {
    // 行 装备位 0-武器 ... 列 1,2,3,4,5,6,7级宝石
    static gemarr: number[][] = [
        [30025, 30026, 30027, 30028, 30029, 30030, 30104], // 红宝石
        [30013, 30014, 30015, 30016, 30017, 30018, 30102], // 绿宝石
        [30019, 30020, 30021, 30022, 30023, 30024, 30103], // 蓝宝石
        [30001, 30002, 30003, 30004, 30005, 30006, 30100], // 紫宝石
        [30007, 30008, 30009, 30010, 30011, 30012, 30101], // 橙宝石
    ];

    static getInlayGemId(index:number,count:number):number{
        let result=SKDataUtil.getItemBy(this.gemarr,index-1);
        if(result==null){
            return 0;
        }
        result=SKDataUtil.getItemBy(result,Math.floor(count/3));
        if(result==null){
            return 0;
        }
        return result;
    }
}