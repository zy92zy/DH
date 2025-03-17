export default class DateUtil{

    static toString(value:Date):string{
        let year=value.getFullYear();
        let month=(value.getMonth()+1).toString();
        let day=value.getDate().toString();
        let result=`${year}-${month}-${day}`;
        return result;
    }

    static dateBy(value:string):Date{
        if(value==null){
            return null;
        }
        let params=value.split("-");
        if(params.length != 3){
            return null;
        }
        let year=parseInt(params[0]);
        let month=parseInt(params[1]);
        let day=parseInt(params[2]);
        let result=new Date(year,month-1,day);
        return result;
    }

    static atRange(start:string,end:string):boolean{
        let now=new Date();
        let startDate=this.dateBy(start);
        if(startDate){
            if(now<startDate){
                return false;
            }
        }
        let endDate=this.dateBy(end);
        if(endDate){
            if(now>endDate){
                return false;
            }
        }
        return true;
    }
}