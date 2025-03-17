import SKLogger from "../gear/SKLogger";
var fs = require('fs');

export default class GFile {

    static load(path:string, call: (error: any, data: any) => void):any {
        fs.readFile(path, function(error:any, data:any){
            if(error){
                SKLogger.warn(`文件读取失败 ${path}`);
            }
            call(error, data&&data.toString())
        })
    }
    static save(path:string, data: any, call: (error: any) => void = null):any {
        fs.writeFile(path, data, function(error: any){
            if(error){
                SKLogger.warn(`文件写入失败 ${path}`);
            }
            call&&call(error);
        });
    }

    static exists(path:string, call:(has:boolean)=>void) {
        fs.exists(path, call)
    }


    static mkdir(path: string, call: Function = null){
        fs.mkdirSync(path, {recursive :true} , call);
    }

    static del(path: any, call: Function = null){
        fs.unlink(path, call)
    }
    
    static rename(oldPath:string, newPath:string, callback:Function=null){
        fs.rename(oldPath, newPath, callback)
    }

    static append(path:string, data:string , call:Function=null){
        fs.appendFile(path, data, call)
    }


    static saveRuntime(name:string , data:string, call:(error:any)=>void = null){
        this.save(`./runtime/${name}`, data, call);
    }
    static loadRuntime(name:string , call:(error:any, data:string)=>void){
        this.load(`./runtime/${name}`, call)
    }


}

