/**
 * 数据工具类
 * @author BrightLi
 * @since 2020/5/3
 */

import path from "path";
import fs from "fs";
import SKLogger from "./SKLogger";
import SKDBUtil from "./SKDBUtil";
import GTimer from "../common/GTimer";
import * as crypto from "crypto";

export default class SKDataUtil {
    // 生成UUID
    static uuid(): string {
        if (typeof (window) !== "undefined" && typeof (window.crypto) !== "undefined" && typeof (window.crypto.getRandomValues) !== "undefined") {
            let buf: Uint16Array = new Uint16Array(8);
            window.crypto.getRandomValues(buf);
            return (this.pad4(buf[0]) + this.pad4(buf[1]) + "-" + this.pad4(buf[2]) + "-" + this.pad4(buf[3]) + "-" + this.pad4(buf[4]) + "-" + this.pad4(buf[5]) + this.pad4(buf[6]) + this.pad4(buf[7]));
        } else {
            return this.random4() + this.random4() + "-" + this.random4() + "-" + this.random4() + "-" +
                this.random4() + "-" + this.random4() + this.random4() + this.random4();
        }
    }
    private static pad4(num: number): string {
        let ret: string = num.toString(16);
        while (ret.length < 4) {
            ret = "0" + ret;
        }
        return ret;
    }
    private static random4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    // 随机数
    static random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // 从数组中随机抽取一项
    static randomList(value: any[]): any {
        if (value == null || value.length < 1) {
            return null;
        }
        let index = this.random(0, value.length - 1);
        return value[index];
    }
    // 数组洗牌
    static shuffle(value: any[]): any[] {
        if (!Array.isArray(value)) {
            return null;
        }
        let result = this.clone(value);
        let j: number;
        for (let i = result.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
    static randomListBy(list: any[], total: number): any[] {
        if (list == null || list.length < total) {
            return [];
        }
        list = this.clone(list);
        let result = [];
        for (let i = 0; i < total; i++) {
            let random = Math.floor(Math.random() * list.length);
            result.push(list.splice(random, 1)[0]);
        }
        return result;
    }
    // 替换指定位置的字符
    static replaceChar(value: string, index: number, char: string): string {
        return value.substr(0, index) + char + value.substr(index + char.length);
    }
    // 从前查找相同字符出现的最后一个位置
    static sameIndex(value: string, char: string): number {
        var result: number = -1;
        for (var i = 0; i < value.length; i++) {
            if (value[i] == char) {
                if (result == -1) {
                    result = i;
                } else {
                    result++;
                }
            } else if (result != -1) {
                break;
            }
        }
        return result;
    }
    // 从后查找相同字符出现的最后一个位置
    static sameLastIndex(value: string, char: string): number {
        var result: number = -1;
        for (var i = value.length - 1; i > 0; i--) {
            if (value[i] == char) {
                if (result == -1) {
                    result = i;
                } else {
                    result--;
                }
            } else if (result != -1) {
                break;
            }
        }
        return result;
    }
    // 格式化数字，不足位补0
    static prefixInteger(num: number, length: number): string {
        let result = (Array(length).join('0') + num).slice(-length);
        return result;
    }
    // "YYYY-mm-dd HH:MM"
    static formatDate(format: string, value: string): string {
        let now = new Date(value);
        let opt: any = {
            "Y+": now.getFullYear().toString(),
            "m+": (now.getMonth() + 1).toString(),
            "d+": now.getDate().toString(),
            "H+": now.getHours().toString(),
            "M+": now.getMinutes().toString(),
            "S+": now.getSeconds().toString(),
        }
        let result: RegExpExecArray;
        for (let key in opt) {
            result = new RegExp(`(${key})`).exec(format);
            if (result) {
                format = format.replace(result[1], (result[1].length == 1) ? (opt[key]) : (opt[key].padStart(result[1].length, "0")));
            }
        }
        return format;
    }
    //判断日期是否为今天
    static isToday(str: string) {
        return GTimer.format(str, 'yyyyMMdd') != GTimer.format('yyyyMMdd');
    }
    // 根据ID生成5位邀请码
    static encodeInvite(value: number) {
        let key = 'E50CDG3HQA4B1NOPIJ2RSTUV67MWX89KLYZ';
        let result = "";
        while (value > 0) {
            let mod = value % 35;
            value = (value - mod) / 35;
            result = key[mod] + result;
        }
        if (result.length < 5) {
            result = "F" + result;
            let len = result.length;
            let min = 0;
            let max = key.length - 1;
            for (let i = len; i < 5; i++) {
                let index = Math.floor(Math.random() * (max - min + 1)) + min;
                result = key[index] + result;
            }
        }
        return result;
    }
    // 解码邀请码
    static decodeInvite(value: string): number {
        let key = 'E50CDG3HQA4B1NOPIJ2RSTUV67MWX89KLYZ';
        let index = value.indexOf("F");
        if (index != -1) {
            value = value.slice(index + 1, value.length);
        }
        let result = 0;
        let p = 0;
        for (let i = value.length - 1; i >= 0; i--) {
            let char = value[i];
            index = key.indexOf(char);
            if (index != -1) {
                result += index * Math.pow(35, p);
                p++;
            }
        }
        return result;
    }
    // 从数组中获得匹配
    static numberByList(list: any[], key: string, value: number, targetKey: string): any {
        for (let item of list) {
            let temp = item[key];
            if (!temp) {
                continue;
            }
            if (temp == value) {
                let result = item[targetKey];
                return result;
            }
        }
        return null;
    }
    // 是否存在KV
    static hasKVByList(list: any[], key: string, value: any): boolean {
        for (let item of list) {
            if (item[key] == value) {
                return true;
            }
        }
        return false;
    }
    // 是否有互斥
    static hasMutex(target: any[], mutex: any[], mutexKey: string, key: string): boolean {
        for (let item of target) {
            let temp = item[key];
            if (!temp) {
                continue;
            }
            // 如果是互斥数组
            if (Array.isArray(temp)) {
                for (let b of mutex) {
                    for (let a of temp) {
                        if (item[key] == b) {
                            return true;
                        }
                    }
                }
            } else {
                for (let b of mutex) {
                    if (temp == b) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    // 获得二维数组中的数值
    static intOf2Array(list: number[][], one: number, two: number, valid: number): number {
        if (!list) {
            return valid;
        }
        if (one < 0 || one >= list.length) {
            return valid;
        }
        let temp = list[one] as number[];
        if (!temp) {
            return valid;
        }
        if (two < 0 || two >= temp.length) {
            return valid;
        }
        return temp[two];
    }
    // 根据概率返回真假
    static probability(min: number, max: number): boolean {
        let result = SKDataUtil.random(min, max);
        if (result <= min) {
            return true;
        } else {
            return false;
        }
    }

    static dictByDict(target: any, sheet: any, key: any): any {
        if (!target) {
            return null;
        }
        let dict = target[sheet];
        if (!dict) {
            return null;
        }
        let result = dict[key];
        return result;
    }

    static findByDict(target: any, targetKey: any, value: any, resultKey: any, valid: any): any {
        if (!target) {
            return valid;
        }
        for (let key in target) {
            let item = target[key];
            if (item[targetKey] == value) {
                return item[resultKey];
            }
        }
        return valid;
    }

    static numberByString(target: string, splitter: string, index: number, valid: number = 0): number {
        if (!target) {
            return valid;
        }
        let temp = target.split(splitter);
        if (temp.length < index) {
            return valid;
        }
        let result = parseInt(temp[index]);
        return result;
    }
    static readJson(filename: string): any {
        let file = path.join(__dirname, filename);
        let data = fs.readFileSync(file);
        let result: any = SKDataUtil.jsonBy(data.toString());
        return result;
    }
    // JSON解析
    static jsonBy(value: any): any {
        if (value == null) {
            return null;
        }
        if (!this.isString(value)) {
            return value;
        }
        if (this.isEmptyString(value)) {
            return null;
        }
        let result: any = null;
        try {
            result = JSON.parse(value);
        } catch (error) {
            SKLogger.error(`JSON解析:${value},失败:${error}`);
        } finally {
            return result;
        }
    }
    // 转换成JSON字符串
    static toJson(value: any): string {
        if (value == null) {
            return "";
        }
        if (this.isString(value)) {
            return value;
        }
        let result: string = "";
        try {
            result = JSON.stringify(value);
        } catch (error) {
            SKLogger.warn(`JSON转换:${value},失败:${error}`);
        } finally {
            return result;
        }
    }
    // 是否为数字
    static isNumber(value: any): boolean {
        if (value == null) {
            return false;
        }
        let type = typeof value;
        if (type !== 'number') {
            return false;
        }
        return true;
    }
    // 转换成数字
    static toNumber(value: any): number {
        if (this.isNumber(value)) {
            return value;
        }
        if (value == "undefined") {
            return NaN;
        }
        if (this.isString(value)) {
            let result = parseFloat(value);
            return result;
        }
        return NaN;
    }
    // 版本号比较
    static checkVersion(versionA: string, versionB: string): number {
        let vA = versionA.split('.');
        let vB = versionB.split('.');
        for (let i = 0; i < vA.length; ++i) {
            let a = parseInt(vA[i]);
            let b = parseInt(vB[i] || '0');
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        return 0;
    }
    // 是否为数组
    static isArray(value: any): boolean {
        if (value == null) {
            return false;
        }
        let result = Array.isArray(value);
        return result;
    }
    // 是否为对象
    static isObject(value: any): boolean {
        if (value == null) {
            return false;
        }
        let type = typeof value;
        if (type === "object") {
            return true;
        }
        return false;
    }
    // 是否为字符串
    static isString(value: any): boolean {
        let result = typeof (value);
        if (result == "string") {
            return true;
        }
        return false;
    }
    // 判断对象是否为空
    static isEmptyObject(value: any): boolean {
        let keys = Object.keys(value);
        if (keys.length < 1) {
            return true;
        }
        return false;
    }
    // 是否为空字符串
    static isEmptyString(value: any): boolean {
        if (value == null) {
            return true;
        }
        if (!this.isString(value)) {
            return true;
        }
        let result = <string>value;
        if (result.length < 1) {
            return true;
        }
        return false;
    }
    // 正则测试
    static testRegExp(value: string, regexp: RegExp, min: number, max: number, tip: string) {
        if (value.length < min) {
            return `长度不能少于${min}个`;
        }
        if (value.length > max) {
            return `最多只能${max}个`;
        }
        let temp = regexp.test(value);
        if (!temp) {
            return tip;
        }
        return "";
    }
    // 获得键值
    static valueForKey(target: any, key: any): any {
        if (!target) {
            console.warn(`$警告:获得键值,对象不存在`);
            return null;
        }
        if (key == null) {
            console.warn(`$警告:获得键值,对象${target}KEY值不存在`);
            return null;
        }
        if (this.isArray(target)) {
            return target[key];
        }
        if (!this.isObject(target)) {
            console.warn(`$警告:获得键值,${target}[${key}]不是一个对象`);
            return null;
        }
        let temp: any = <Object>target;
        if (!temp.hasOwnProperty(key)) {
            return null;
        }
        return temp[key];
    }
    // 检查是否合法
    static checkValid(value: string): string {
        if (value == null || value.length < 1) {
            return "不能为空!";
        }
        let temp = value.trim();
        if (value.length != temp.length) {
            return "两侧不能有空格";
        }
        let list = [{ char: "\"", text: "双引号" },
        { char: "\'", text: "单引号" }];
        for (let item of list) {
            if (value.indexOf(item.char) != -1) {
                return `不能包含${item.text}`;
            }
        }
        return "";
    }
    // 检查MYSQL转义
    static checkMYSQL(value: string): string {
        value.replace(/g\'/g, "\'");
        value.replace(/g\"/g, "\"");
        return value;
    }

    static trim(value: string): string {
        if (value == null || value.length < 1) {
            return "";
        }
        value = value.trim();
        return value;
    }
    // 获得最大值经验值
    static maxExp(config: any, exp: number): any {
        let result = exp;
        for (let key in config) {
            let item = config[key];
            if (exp < item.exp) {
                result = item.exp;
                break;
            }
        }
        return result;
    }
    // 获得当前阶段的经验值与最大值
    static currentExp(config: any, exp: number): any {
        let result: any = { value: 0, max: 0 };
        for (let key in config) {
            let item = config[key];
            let level = item.id;
            let max_exp = item.exp;
            if (exp < max_exp) {
                if (level > 1) {
                    let prev = config[`${level - 1}`];
                    result.value = exp - prev.exp;
                    result.max = max_exp - prev.exp;
                } else {
                    result.value = exp;
                    result.max = max_exp;
                }
                break;
            }
        }
        return result;
    }
    // 是否有属性
    static hasProperty(target: any, key: string | number | symbol): boolean {
        if (target == null) {
            return false;
        }
        if (!this.isObject(target)) {
            return false;
        }
        let result = <Object>target;
        if (result.hasOwnProperty(key)) {
            return true;
        }
        return false;
    }
    // 获得字典长度
    static getLength(value: any): number {
        if (value == null) {
            return 0;
        }
        if (Array.isArray(value)) {
            return value.length;
        }
        let length = 0;
        for (let _key in value) {
            length++;
        }
        return length;
    }
    // 对键求和
    static getKeyTotal(value: any): number {
        let total: number = 0;
        for (let key in value) {
            let count = parseInt(key);
            total += count;
        }
        return total;
    }
    // 深度拷贝
    static clone(value: any): any {
        if (value == null) {
            return null;
        }
        let result: any = Array.isArray(value) ? [] : {};
        try {
            result = SKDataUtil.jsonBy(SKDataUtil.toJson(value));
        } catch (error) {
            let info = `警告:深拷贝对象:${value},失败:${error}`
            console.warn(info);
        } finally {
            return result;
        }
    }
    // 克隆类实例
    static cloneClass(value: any): any {
        if (value == null) {
            return null;
        }
        let result = Object.create(
            Object.getPrototypeOf(value),
            Object.getOwnPropertyDescriptors(value)
        );
        return result;
    }
    // 是否在范围内
    static atRange(target: number, range: number[]): boolean {
        for (let item of range) {
            if (target == item) {
                return true;
            }
        }
        return false;
    }
    // 是否在范围内
    static atRangeByString(target: string, keys: string[]): boolean {
        for (let key of keys) {
            if (target == key) {
                return true;
            }
        }
        return false;
    }
    static clamp(value: number, min: number, max: number): number {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }
    // 去除重复
    static removeRepeat(list: any[], key: string): any[] {
        if (list == null || !this.isArray(list) || list.length < 1) {
            return [];
        }
        let filters = [];
        let result: any[] = [];
        for (let i = 0; i < list.length; i++) {
            let item = list[i]
            let value = item[key];
            if (value) {
                if (filters.indexOf(value) == -1) {
                    filters.push(value);
                } else {
                    list.splice(i, 1);
                    i--;
                    result.push(item);
                }
            }
        }
        return result;
    }
    // 获得数组元素
    static getItemBy(list: any[], index: number): any {
        if (!this.isArray(list)) {
            return null;
        }
        if (index < 0 || index >= list.length) {
            return null;
        }
        let result = list[index];
        return result;
    }
    // 保留2位小数
    static toDecimal2(value: number): number {
        let temp = this.toNumber(value);
        if (isNaN(temp)) {
            return 0;
        }
        temp = Math.round(value * 100) / 100;
        return temp;
    }

    //名称特殊字符检测
    static CheckName(name: string):boolean{
        //let reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
        let reg = new RegExp("^[\u4e00-\u9fa5]{2,8}$");
        return reg.test(name);
    }


    static signStr(param :any){
        let signArr = [];
        let keys = Object.keys(param).sort();
        for (const key of keys) {
            signArr.push(`${key}=${param[key]}`);
        }
        let signStr = signArr.join('&');
        var crypto_md5 = crypto.createHash('md5');
        crypto_md5.update(signStr, 'utf8'); // 加入编码
        return crypto_md5.digest('hex');
    }

}