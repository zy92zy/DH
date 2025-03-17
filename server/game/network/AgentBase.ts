import SKLogger from "../../gear/SKLogger";
import Packet from "./Packet";
let ByteBuffer = require("byte-buffer");

export default class AgentBase {

    // PING等待时间 5分钟
    static TIME_WAIT_PING:number = 5 * 60 * 1000;

    id: number;
    socket: WebSocket;
    _buffer: any;
    lastPing: number;
    packet: Packet;
    dt: number;
    starttime: number;
    //接收映射
    static g_recv_map:number[]= [
        0x51,0xA1,0x9E,0xB0,0x1E,0x83,0x1C,0x2D,0xE9,0x77,0x3D,0x13,0x93,0x10,0x45,0xFF,
        0x6D,0xC9,0x20,0x2F,0x1B,0x82,0x1A,0x7D,0xF5,0xCF,0x52,0xA8,0xD2,0xA4,0xB4,0x0B,
        0x31,0x97,0x57,0x19,0x34,0xDF,0x5B,0x41,0x58,0x49,0xAA,0x5F,0x0A,0xEF,0x88,0x01,
        0xDC,0x95,0xD4,0xAF,0x7B,0xE3,0x11,0x8E,0x9D,0x16,0x61,0x8C,0x84,0x3C,0x1F,0x5A,
        0x02,0x4F,0x39,0xFE,0x04,0x07,0x5C,0x8B,0xEE,0x66,0x33,0xC4,0xC8,0x59,0xB5,0x5D,
        0xC2,0x6C,0xF6,0x4D,0xFB,0xAE,0x4A,0x4B,0xF3,0x35,0x2C,0xCA,0x21,0x78,0x3B,0x03,
        0xFD,0x24,0xBD,0x25,0x37,0x29,0xAC,0x4E,0xF9,0x92,0x3A,0x32,0x4C,0xDA,0x06,0x5E,
        0x00,0x94,0x60,0xEC,0x17,0x98,0xD7,0x3E,0xCB,0x6A,0xA9,0xD9,0x9C,0xBB,0x08,0x8F,
        0x40,0xA0,0x6F,0x55,0x67,0x87,0x54,0x80,0xB2,0x36,0x47,0x22,0x44,0x63,0x05,0x6B,
        0xF0,0x0F,0xC7,0x90,0xC5,0x65,0xE2,0x64,0xFA,0xD5,0xDB,0x12,0x7A,0x0E,0xD8,0x7E,
        0x99,0xD1,0xE8,0xD6,0x86,0x27,0xBF,0xC1,0x6E,0xDE,0x9A,0x09,0x0D,0xAB,0xE1,0x91,
        0x56,0xCD,0xB3,0x76,0x0C,0xC3,0xD3,0x9F,0x42,0xB6,0x9B,0xE5,0x23,0xA7,0xAD,0x18,
        0xC6,0xF4,0xB8,0xBE,0x15,0x43,0x70,0xE0,0xE7,0xBC,0xF1,0xBA,0xA5,0xA6,0x53,0x75,
        0xE4,0xEB,0xE6,0x85,0x14,0x48,0xDD,0x38,0x2A,0xCC,0x7F,0xB1,0xC0,0x71,0x96,0xF8,
        0x3F,0x28,0xF2,0x69,0x74,0x68,0xB7,0xA3,0x50,0xD0,0x79,0x1D,0xFC,0xCE,0x8A,0x8D,
        0x2E,0x62,0x30,0xEA,0xED,0x2B,0x26,0xB9,0x81,0x7C,0x46,0x89,0x73,0xA2,0xF7,0x72
    ];

    constructor(socket: WebSocket) {
        this.id = -1;
        this.socket = socket;
        this._buffer = new ByteBuffer(1024 * 2);
        this.lastPing = 0;
        this.packet = new Packet();
        this.starttime = 0;
    }

    formatBuffer(buffer: any) {
        var bufferArray = Object.keys(buffer).map(function (k) {
            return buffer[k];
        })

        return bufferArray
    }

    init() {
        let list = require('./proto_c');
        let self=this;
        this.socket.onclose = (event: CloseEvent) => {
            if(self.socket){
                self.close();
            }
        }

        this.socket.onopen = (event: Event) => {
        }

        this.socket.onerror = (event: Event) => {
            this.close();
        }
        // 接受消息
        this.socket.onmessage = (event: MessageEvent) => {
            this.starttime&&(this.lastPing=this.dt);
            let data = event.data;
            if (typeof data == 'string') {
                this.onStrMsg(data);
                return;
            }
            try {
                let arrbuffer = this.formatBuffer(data);
                let enbuffer = new ByteBuffer(arrbuffer);
                
                // let startMili = Date.now();// 当前时间对应的毫秒数
                // SKLogger.warn("/**开始 "+startMili);

                //客户端数据解密
                let buffer = new ByteBuffer(arrbuffer);
                let max=enbuffer.length;
                for(let i=0;i<max;i++)
                {
                    let index = enbuffer.readUnsignedByte();
                    buffer.writeUnsignedByte(AgentBase.g_recv_map[index]);
                }
                buffer.front();
                //---------------------
                
                // let endMili=Date.now();//结束时间
                // SKLogger.warn("/**结束 s"+endMili);
                // //这里加入需要测试的代码
                // SKLogger.warn("/**总耗时为："+(endMili-startMili)+"毫秒");


                let headlen = buffer.readShort();
                let msgtype = buffer.readString(headlen);
                let func = list[msgtype];
                if (func) {
                    this.packet.setTemplate(msgtype);
                    buffer = buffer.slice(buffer._index, buffer.byteLength);
                    let pdata = this.packet.todata(buffer.toArray());
                    func(this, pdata);
                }else{
                    SKLogger.warn(`客户端数据解析错误:[headlen:${headlen} type:${msgtype}]!`);
                }
                enbuffer = null;
                buffer = null;
            } catch (error) {
                SKLogger.warn(`解析错误:${error}\n${error.stack}!`);
            }
        };
    }

    checkData(pdata:any,funcName:string):boolean{
        return true;
    }

    onStrMsg(text: string) {
        if (text == "ping") {
            this.ping(text); 
        }
    }

    send(event: string, obj: any) {
        if (this.socket == null || this.socket.readyState != 1) {
            return;
        }
        if (typeof (event) == "string") {
            let pack = this.packet;
            pack.setTemplate(event);
            let buffer = pack.tobuffer(obj);
            this.socket.send(buffer);
            pack.clean();
        } else {
            console.warn(`$警告:发送事件必须是字符串`);
        }
    }

    update(dt: number) {
        this.dt = dt;
        if(!this.starttime){
            this.starttime = dt;
        }else if(this.lastPing == 0){
            this.dt - this.starttime > 30 * 1000 && this.close(); //30秒内不发送ping信息直接踢掉
        }else if(this.dt - this.lastPing > AgentBase.TIME_WAIT_PING) {
            SKLogger.debug(`${this.id}心跳超过1分钟断开连接!`);
            this.close();
        }
        /*
        if (this.lastPing != 0 && (this.dt - this.lastPing) > AgentBase.TIME_WAIT_PING) {
            SKLogger.debug(`${this.id}心跳超过1分钟断开连接!`);
            this.close();
        }
        */
    }

    //ping客户端
    ping(text:string) {
        this.lastPing = this.dt;
        if (this.socket) {
            //异常捕获  客户端异常连接直接关闭
            try {
                this.socket.send(text);
            } catch (error) {
                SKLogger.warn(`客户端异常`)
                this.close();
            }
        }
    }

    close() {
        if (this.socket) {
            try {
                this.socket.close();
            } catch (error) {
                SKLogger.warn(`socket关闭异常`);
            }
        }
        this.socket = null;
    }
}