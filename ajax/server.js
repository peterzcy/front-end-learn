// 1. 引入express
const express = require("express");

// 2. 创建应用对象
const app = express();

// 3. 创建路由规则
app.get("/server", (request, response) => {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.send("Hello AJAX");
});

app.post("/server", (request, response) => {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.send("Hello AJAX");
});

app.all("/jsonp-server", (request, response) => {
	let cb = request.query.callback;
	const data = {
		name: "peter",
	};
	let str = JSON.stringify(data);
	response.send(`${cb}(${str})`);
});

app.all("/cors-server", (request, response) => {
	//设置响应头
	// response.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Headers", "*");
	response.setHeader("Access-Control-Allow-Method", "*");
	response.send("hello CORS");
});

// 4. 监听端口
app.listen(8000, () => {
	console.log("服务已启动...");
});
