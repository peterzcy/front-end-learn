// 1. 声明构造函数
function Axios(config) {
	this.config = config;
}

Axios.prototype.request = function (config) {
	// 发送请求
	// 创建一个promise对象
	let promise = Promise.resolve(config);
	// 声明数组
	let chain = [dispatchRequest, undefined]; // undefined占位
	// 调用then方法指定回调
	let result = promise.then(chain[0], chain[1]);
	// 返回promise的结果
	return result;
};

// 2. dispatchRequest函数
function dispatchRequest(config) {
	// 调用适配器发送请求
	return xhrAdapter(config).then(
		(response) => {
			// 对响应的结果进行转换处理 transformData
			// ...... 略过
			return response;
		},
		(error) => {
			throw error;
		}
	);
}

// 3. adapter适配器
function xhrAdapter(config) {
	return new Promise((resolve, reject) => {
		// 发送ajax请求
		let xhr = new XMLHttpRequest();
		xhr.open(config.method, config.url);
		xhr.send();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if ((xhr.status >= 200) & (xhr.status < 300)) {
					resolve({
						config: config,
						data: xhr.response,
						headers: xhr.getAllResponseHeaders(), // 字符串 parseHeaders
						request: xhr,
						status: xhr.status,
						statusText: xhr.statusText,
					});
				} else {
					reject(new Error("请求失败 失败的状态码为" + xhr.status));
				}
			}
		};
	});
}

// 4. 创建axios函数
let axios = Axios.prototype.request.bind(null);

axios({
	method: "GET",
	url: "http://localhost:3000/posts",
}).then((response) => {
	console.log(response);
});
