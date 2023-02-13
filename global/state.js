//? use this YUI module pattern in node for better global variable performance

var foo = (function () {
	var a = 10;
    var sum = (a, b) => {
        let cd = 4;
		return a + b;
	};
	return {
		fun_a: function (c) {
			// console.log(c ? c : a);
			return c ? c : a;
		},
        fun_b: function (c) {
            console.log(cd);
			console.log(c ? c : a);
		},
		sum,
	};
})();

module.exports = foo;
