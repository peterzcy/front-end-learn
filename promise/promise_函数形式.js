// 声明构造函数
function Promise(executor) {
	// 添加属性
	this.PromiseState = "pending";
	this.PromiseResult = null;

	// this.callback = {};
	this.callbacks = [];

	const self = this; // self _this that
	// resolve函数
	function resolve(data) {
		// 判断状态
		if (self.PromiseState !== "pending") return;
		// 1. 修改对象的状态 (promiseState)
		self.PromiseState = "fulfilled";
		// 2. 设置对象结果值 (promiseRessult)
		self.PromiseResult = data;
		// 调用回调函数
		// if (self.callback.onResolved) {
		// 	self.callback.onResolved(data);
		// }
		self.callbacks.forEach((item) => {
			item.onResolved(data);
		});
	}

	function reject(data) {
		// 判断状态
		if (self.PromiseState !== "pending") return;
		// 1. 修改对象的状态 (promiseState)
		self.PromiseState = "rejected";
		// 2. 设置对象结果值 (promiseRessult)
		self.PromiseResult = data;
		// 调用回调函数
		// if (self.callback.onRejected) {
		// 	self.callback.onRejected(data);
		// }
		self.callbacks.forEach((item) => {
			item.onRejected(data);
		});
	}

	try {
		// 执行器函数同步调用
		executor(resolve, reject);
	} catch (e) {
		// 修改promise对象状态为失败
		reject(e);
	}
}
// 添加then方法
Promise.prototype.then = function (onResolved, onRejected) {
	const self = this;
	if (typeof onResolved !== "function") {
		onResolved = (value) => value;
	}
	if (typeof onRejected !== "function") {
		onRejected = (reason) => {
			throw reason;
		};
	}
	return new Promise((resolve, reject) => {
		// 封装函数
		function callback(type) {
			try {
				// 获得回调函数的执行结果
				let result = type(self.PromiseResult);
				// 判断
				if (result instanceof Promise) {
					// 如果是 Promise 类型的对象
					result.then(
						(v) => {
							resolve(v);
						},
						(r) => {
							reject(r);
						}
					);
				} else {
					// 结果的对象状态为成功
					resolve(result);
				}
			} catch (e) {
				reject(e);
			}
		}
		if (this.PromiseState === "fulfilled") {
			setTimeout(() => {
				callback(onResolved);
			});
		}
		if (this.PromiseState === "rejected") {
			setTimeout(() => {
				callback(onRejected);
			});
		}
		// 判断pending状态
		if (this.PromiseState === "pending") {
			//保存回调函数
			this.callbacks.push({
				onResolved: function () {
					callback(onResolved);
				},
				onRejected: function () {
					callback(onRejected);
				},
			});
		}
	});
};

// 添加catch方法
Promise.prototype.catch = function (onRejected) {
	return this.then(undefined, onRejected);
};

// 添加resolve静态方法
Promise.resolve = function (value) {
	return new Promise((resolve, reject) => {
		if (value instanceof Promise) {
			value.then(
				(v) => resolve(v),
				(r) => reject(r)
			);
		} else {
			resolve(value);
		}
	});
};

// 添加reject静态方法
Promise.reject = function (reason) {
	return new Promise((resolve, reject) => {
		reject(reason);
	});
};

//添加all静态方法
Promise.all = function (promises) {
	// 返回结果为promise对象
	return new Promise((resolve, reject) => {
		let count = 0; // 成功的promises的个数
		let arr = [];
		//遍历
		for (let i = 0; i < promises.length; i++) {
			promises[i].then(
				(v) => {
					// 得知对象的状态是成功的
					count++;
					// 将当前promise对象成功的结果，存入到数组中
					// 保持顺序
					arr[i] = v;
					if (count === promises.length) {
						// 修改状态
						resolve();
					}
				},
				(r) => {
					reject(r);
				}
			);
		}
	});
};

//添加race静态方法
Promise.race = function (promises) {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < promises.length; i++) {
			promises[i].then(
				(v) => {
					// 修改返回对象的状态
					resolve(v);
				},
				(r) => {
					// 修改返回对象的状态
					reject(r);
				}
			);
		}
	});
};
