function Axios(config) {
	this.config = config;
}

Axios.prototype.request = function (config) {
	return dispatchRequest(config);
};

function dispatchRequest(config) {
	return xhrAdapter(config);
}

function xhrAdapter(config) {
	// 发送ajax请求
	return new Promise((resolve, reject) => {
		// 实例化对象
		const xhr = new XMLHttpRequest();
		xhr.open(config.method, config.url);
		xhr.send();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve({
						status: xhr.status,
						statusText: xhr.statusText,
					});
				} else {
					reject(new Error("请求失败"));
				}
			}
		};
		// 关于取消请求的处理
		if (config.cancelToken) {
			// 对cancelToken的promise指定回调
			config.cancelToken.promise.then((value) => {
				xhr.abort();
			});
		}
	});
}

// CancelToken构造函数
function CancelToken(executor) {
	//声明一个变量
	var resolvePromise;
	// 为实例对象添加属性
	this.promise = new Promise((resolve) => {
		resolvePromise = resolve;
	});

	//调用executor
	executor(function () {
		// 执行resolvePromise
		resolvePromise();
	});
}

// 以下为测试代码
// 创建axios函数
const context = new Axios({});
const axios = Axios.prototype.request.bind(context);

let cancel = null;
let cancelToken = new CancelToken(function (c) {
	cancel = c;
});

//发送请求
axios({
	method: "GET",
	url: "http://localhost:3000/posts",
	cancelToken: cancelToken,
}).then(
	(response) => {
		console.log(response);
	},
	(error) => {
		console.log(error);
	}
);

// 取消请求
setTimeout(cancel, 1000);
