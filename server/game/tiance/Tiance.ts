
import DB from '../../utils/DB';
import TianceMgr from './TianceMgr';
export default class Tiance {

    id: any;
    typeid:any;
    attr_level:any;
    config:any;

    constructor(data:any) {
        this.id = data.id;
        this.typeid = data.typeid;
        this.attr_level = data.attr_level;
        this.config = TianceMgr.shared.getConfig(this.typeid);
    }

    getAttr(baseAttr:any = {}){
        let attr = this.config.level_attr[this.attr_level];
        if(attr){
            for (const key in attr) {
                baseAttr[key] = baseAttr[key] ? baseAttr[key] + Number(attr[key]) : attr[key]
            }
        }
        return baseAttr;
    }

    toObj(){
        return {
            id: this.id,
            typeid: this.typeid,
            attrLevel: this.attr_level,
        }
    }

    save(){
        DB.saveTiance({id: this.id, attr_level: this.attr_level})
    }

}