export default class WorldReward{
    tagid: any;
    role_list: any[];
    jade_count: number;
    num: number;
    hongbaolist: any[];
    role_name: number;

    constructor(id:any){
        this.tagid = id;
        this.role_list = []; //
        this.jade_count = 0;
        this.num = 0;   //红包个数
        this.hongbaolist = [];
        this.role_name = 0;
    }

    init(){
        let count = this.jade_count;
        for(let i = 1;i<this.num ;i++){
            let safe_num = (count - (this.num -i) * 1)/(this.num -i);
            let x_num = Math.floor((Math.random()*(safe_num*100) + 1)/100);
            if(x_num == 0){
                x_num = 1;
            }
            count -= x_num;
            this.hongbaolist.push(x_num);
        }
        this.hongbaolist.push(count);
    }

    hasReward(roleid:any):boolean{
        for (let rid of this.role_list) {
            if(rid == roleid){
                return true;
            }
        }
        return false;
    }

    isVaild(){
        let n = this.role_list.length;
        return n < this.num;
    }

    getReward(roleid:any):any{
        this.role_list.push(roleid);
        let n = this.role_list.length;
        let jade = this.hongbaolist[n-1];
        if(jade == null){
            jade = 1;
        }
        return jade;
    }
}