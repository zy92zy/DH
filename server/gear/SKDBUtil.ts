import SKDataUtil from "./SKDataUtil";

export default class SKDBUtil {

    static createInsert(table: string, rows: any, fields: any, fliter: string = ""): string {
        let result = "";
        for (let row of rows) {
            let temp = ``;
            let index = 0;
            for (let field of fields) {
                index++;
                if (fliter.length > 0 && field.name == fliter) {
                    continue;
                }
                let key = field.name;
                let value = this.toString(row[key]);
                if (value.length < 1) {
                    continue;
                }
                temp += `${key}=${value}${index == fields.length ? "" : ","}`;
            }
            result += `INSERT INTO ${table} SET ${temp};`;
        }
        return result;
    }

    static createUpdate(table: string, obj: any, keys: string[]): string {
        let length = SKDataUtil.getLength(obj);
        if (length < 1) {
            return "";
        }
        let fields = ``;
        let index = 0;
        for (let field in obj) {
            index++;
            if (SKDataUtil.atRangeByString(field, keys)) {
                continue;
            }
            let value = this.toString(obj[field]);
            if (value.length < 1) {
                continue;
            }
            fields += `${field}=${value}${index == length ? "" : ","}`;
        }
        index = 0;
        let condition=``;
        for (let key of keys) {
            let value = this.toString(obj[key]);
            if (value.length < 1) {
                continue;
            }
            condition += `${index > 0 ? " AND " : ""}${key}=${value}`;
            index++;
        }
        let result = `UPDATE ${table} SET ${fields} WHERE ${condition};`;
        return result;
    }

    static createDelete(table: string, key: string, value: any): string {
        let temp = this.toString(value);
        if (temp.length < 1) {
            return "";
        }
        let result = `DELETE FROM ${table} WHERE ${key}=${value};`;
        return result;
    }

    static toString(value: any): string {
        if (value == null) {
            return ``;
        }
        if (value instanceof Date) {
            let result = SKDataUtil.formatDate("YYYY-mm-dd HH:MM:SS", value.toString());
            return `${result}`;
        }
        return `${String(value)}`;
    }
}