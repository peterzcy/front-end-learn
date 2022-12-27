const express = require("express");

const app = express();

app.get("/home", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/data", (req, res) => {
	res.send("123");
});

app.listen(9000, () => {
	console.log("服务已经启动...");
});
