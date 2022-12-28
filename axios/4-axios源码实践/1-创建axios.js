// 构造函数
function Axios(config) {
	// 初始化
	this.defaults = config;
	this.intercepters = {
		request: {},
		response: {},
	};
}

Axios.prototype.request = function (config) {
	console.log("发送AJAX请求, 请求类型为" + config.method);
};

Axios.prototype.get = function (config) {
	return this.request({ method: "GET" });
};

Axios.prototype.post = function (config) {
	return this.request({ method: "POST" });
};

// 声明函数
function createInstance(config) {
	// 实例化
	let context = new Axios(config); // 可以context.get()等 但不能作为函数使用
	// 创建请求函数
	let instance = Axios.prototype.request.bind(context); // instance是一个函数 但不能作为对象使用
	// 将Axios.prototype对象中的方法，添加到instance函数对象中
	Object.keys(Axios.prototype).forEach((key) => {
		instance[key] = Axios.prototype[key].bind(context); // get post
	});
	// 为instance函数对象添加属性default与interceptors
	Object.keys(context).forEach((key) => {
		instance[key] = context[key]; // default interceptors
	});

	return instance;
}

let axios = createInstance({ method: "GET" });

// 发送请求
// axios({ method: "GET" });
axios.get();
