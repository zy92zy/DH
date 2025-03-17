import * as qs from "qs";
import * as https from "https";
import * as http from "http";
import SKDataUtil from "../gear/SKDataUtil";
import SKLogger from "../gear/SKLogger";

export default class Http {
	static sendpost(host: any, port: any, path: any, data: any, callback: any) {
		if (host == null) {
			SKLogger.warn(`HTTP错误:host不能为空!`);
			return;
		}
		var content = qs.stringify(data);
		var options = {
			hostname: host,
			port: port,
			path: path + '?' + content,
			method: 'GET'
		};

		let req = http.request(options, function (res) {
			console.log('STATUS: ' + res.statusCode);
			console.log('HEADERS: ' + SKDataUtil.toJson(res.headers));
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				callback(chunk);
			});
		});
		req.setTimeout(5000);
		req.on('error', function (e) {
			SKLogger.warn(`problem with request:${e.message}`);
		});
		req.end();
	};

	static sendgeturl = function (url: any, data: any, callback: any, safe: any) {
		let content = qs.stringify(data);
		url = url + '?' + content;
		let proto: any = http;
		if (safe) {
			proto = https;
		}
		let req = proto.get(url, function (res: any) {
			//console.log('STATUS: ' + res.statusCode);  
			//console.log('HEADERS: ' + SKDataUtil.toJson(res.headers));  
			var str = "";
			res.setEncoding('utf8');
			res.on('data', function (chunk: any) {
				//console.log('BODY: ' + chunk);
				// var json = SKDataUtil.jsonBy(chunk);
				// callback(true, json);
				str += chunk;
			});
			res.on("end", function () {
				console.log(str.toString());
			});
		});

		req.on('error', function (e: any) {
			console.log('problem with request: ' + e.message);
			callback(false, e);
		});
		req.setTimeout(5000);
		req.end();
	};

	static isJSON(str: any) {
		if (typeof str == 'string') {
			try {
				var obj = SKDataUtil.jsonBy(str);
				if (typeof obj == 'object' && obj) {
					return true;
				} else {
					return false;
				}

			} catch (e) {
				console.log('error：' + str + '!!!' + e);
				return false;
			}
		}
		return false;
	}
	static sendget(host: string, port: any, path: any, data: any, callback: (success: boolean, data: any) => void, safe?: any) {
		if (!host) {
			SKLogger.debug('请求网址不能为空');
			callback(false, null);
			return;
		}
		if (!SKDataUtil.atRange(port, [8561, 8911, 8912, 8913, 8914, 8915, 8916, 8917, 8918, 8919, 8920])) {
			SKLogger.debug(`$警告:非法请求${host}:${port}?${data}`);
		}
		let content = qs.stringify(data);
		host != '127.0.0.1' && SKLogger.error(`服务器访问外部链接http://${host}:${port}/${path}?${content}`);
		let options: any = {
			hostname: host,
			path: path + '?' + content,
			method: 'GET'
		};
		if (port) {
			options.port = port;
		}
		let proto: any = http;
		if (safe) {
			proto = https;
		}
		let req = proto.request(options, (res: any) => {
			res.setEncoding('utf8');
			res.on('data', function (chunk: any) {
				try {
					let json = SKDataUtil.jsonBy(chunk);
					callback(true, json);
				} catch (error) {
					callback(false, chunk);
				}
			});
		});
		req.setTimeout(15000);
		req.on('error', function (error: Error) {
			let info = `http://${host}${path}:${port},请求错误:${error.message}`;
			SKLogger.warn(info);
			callback(false, error);
		});
		req.end();
	};

	static sendPost = function (host: any, path: any, data: any, callback: any) {
		let contents = qs.stringify(data);
		let options: any = {
			host: host,
			// port: 8081,
			path: path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': contents.length,
			}
		};
		let req = https.request(options, function (res: any) {
			// console.log('STATUS:'+res.statusCode);
			// console.log('HEADERS:'+SKDataUtil.toJson(res.headers));
			res.setEncoding('utf8');
			res.on('data', function (data: any) {
				// console.log("data:",data);   //一段html代码
				callback(data);
			});
		});
		req.write(contents);
		req.end();
	};

	static sendGet2(host: any, path: any, callback: any) {
		var options = {
			hostname: host,
			path: path,
			method: 'GET'
		};
		let req = https.request(options, function (res) {
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				callback(chunk);
			});
		});
		req.setTimeout(5000);
		req.on('error', function (e) {
			SKLogger.warn(`problem with request:${e.message}`);
		});
		req.end();
	};

	static sendPost2 = function (host: any, path: any, contents: any, callback: any) {
		let options: any = {
			host: host,
			// port: 8081,
			path: path,
			method: 'POST',
		};
		let req = https.request(options, function (res: any) {
			res.setEncoding('utf8');
			res.on('data', function (data: any) {
				callback(data);
			});
		});
		req.write(contents);
		req.end();
	};


	static reply = function (res: any, data: any) {
		if (data == null) {
			data = '';
		}
		let jsonText:string = typeof data=='string' ? data : SKDataUtil.toJson(data);
		res.send(jsonText);
	};
}

