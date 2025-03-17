import express from 'express';

const app = express();
app.all('*', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

exports.start = (config: any) => {
    let list = config.funcList;
    for (let reg in list) {
        if (list.hasOwnProperty(reg)) {
            let func = list[reg];
            app.get('/' + reg, func);
        }
    }
    app.listen(config.port);
}

exports.app = app;