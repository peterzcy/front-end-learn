function Axios(config) {
	this.config = config;
	this.interceptors = {
		request: new InterceptorManager(),
		response: new InterceptorManager(),
	};
}

// 发送请求————难点&重点
Axios.prototype.request = function (config) {
	let promise = Promise.resolve(config);
	const chain = [dispatchRequest, undefined];
	// 处理拦截器
	// 将拦截器的回调压入到chains的前面
	this.interceptors.request.handlers.forEach((item) => {
		chain.unshift(item.fulfilled, item.rejected);
	});
	this.interceptors.response.handlers.forEach((item) => {
		chain.push(item.fulfilled, item.rejected);
	});

	// 遍历
	while (chain.length > 0) {
		promise = promise.then(chain.shift(), chain.shift());
	}

	// 发送请求
	function dispatchRequest(config) {
		return new Promise((resolve, reject) => {
			console.log("dispatchRequest");
			resolve(config);
		});
	}
	return promise;
};

// 创建实例
let context = new Axios({});
// 创建axios函数
let axios = Axios.prototype.request.bind(context);
// 将context属性config interceptors添加到axios函数对象上
Object.keys(context).forEach((key) => {
	axios[key] = context[key];
});

// 拦截器管理器构造函数
function InterceptorManager() {
	this.handlers = [];
}

InterceptorManager.prototype.use = function (fulfilled, rejected) {
	this.handlers.push({
		fulfilled,
		rejected,
	});
};

// 以下为功能测试代码
// 设置请求拦截器
axios.interceptors.request.use(
	function one(config) {
		console.log("请求拦截器 成功 - 1号");
		return config;
	},
	function one(error) {
		console.log("请求拦截器 失败 - 1号");
		return Promise.reject(error);
	}
);

axios.interceptors.request.use(
	function two(config) {
		console.log("请求拦截器 成功 - 2号");
		return config;
	},
	function two(error) {
		console.log("请求拦截器 失败 - 2号");
		return Promise.reject(error);
	}
);

// 设置响应拦截器
axios.interceptors.response.use(
	function (response) {
		console.log("响应拦截器 成功 1号");
		return response;
	},
	function (error) {
		console.log("响应拦截器 失败 1号");
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	function (response) {
		console.log("响应拦截器 成功 2号");
		return response;
	},
	function (error) {
		console.log("响应拦截器 失败 2号");
		return Promise.reject(error);
	}
);

//发送请求
axios({
	method: "GET",
	url: "http://localhost:3000/posts",
}).then((response) => {
	console.log(response);
});
