const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { admin, getDetails } = require("../middlewares/authMiddle");
let { person } = require("../middlewares/authMiddle");
// functions
function handleErrors(err) {
	let errors = { email: "", password: "" };
	if (err.message.includes("user validation failed")) {
		// console.log('user error found');
		Object.values(err.errors).forEach(({ properties }) => {
			// console.log(properties);
			errors[properties.path] = properties.message;
		});
	}
	// console.log(err.message);
	if (err.message.includes("E11000")) {
		errors["email"] = "This email has been taken! Please try another.";
	}

	if (err.message.includes("login failed")) {
		if (err.message.includes("email")) {
			// console.log('incorrect email');
			errors["email"] = "incorrect email";
		} else if (err.message.includes("password")) {
			// console.log('incorrect password');
			errors["password"] = "incorrect password";
		}
	}

	return errors;
}
let maxAge = 1 * 60 * 60;
function createToken(id) {
	return jwt.sign({ id }, "Let God be True!", {
		expiresIn: maxAge,
	});
}

module.exports.home_get = async (req, res) => {
	let user = await getDetails(req, res);
	res.json(user);
};
module.exports.blogs_get = async (req, res) => {
	let user = await getDetails(req, res);
	res.json(user);
};

module.exports.signout_get = (req, res) => {
	// res.send('signout get page');
	res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
	res.json({ user: null });
};
module.exports.about_get = async (req, res) => {
	let user = await getDetails(req, res);
	res.render("about", { title: "About", user: user ? user : false });
};
module.exports.dashboard_get = async (req, res) => {
	let user = await getDetails(req, res);
	let allUsers = await User.find({}, { email: 1, userLevel: 1 });
	res.locals.allUsers = allUsers;
	res.render("dashboard", { title: "Dashboard", user });
};
module.exports.allUsers_get = async (req, res) => {
	let allUsers = await User.find({}, { email: 1, userLevel: 1 });
	res.json(allUsers);
};
module.exports.verifyUserPin_post = async (req, res) => {
	let { email, userPin } = req.body;
	// console.log(email, pin);
	try {
		let state = await User.pin(email, userPin);
		// console.log(state);
		if (state._id) {
			// let token = createToken(state._id);
			// res.cookie("jwt", token, { maxAge: maxAge * 1000, httpOnly: true });

			res.json({ user: state._id, status: true });
		} else {
			res.json({ user: null, status: false });
		}
	} catch (err) {
		let errors = handleErrors(err);
		// console.log(errors);
		res.json(errors);
	}
};
module.exports.usersLevel_post = async (req, res) => {
	let { email, level, remove } = req.body;
	// console.log(email, level);
	if (remove == "no") {
		if (email != "amadichile@gmail.com") {
			let toUpd = await User.findOneAndUpdate(
				{ email: email },
				{ $set: { userLevel: level } }
			);
			// console.log(toUpd);
			if (toUpd) {
				res.json({ status: true });
			} else {
				res.json({ status: false });
			}
		}
	} else if (remove == "suspend") {
		User.findOneAndUpdate(
			{ email: email },
			{ $set: { userLevel: "suspended" } }
		)
			.then((resp) => {
				res.json({ stauts: true });
			})
			.catch((err) => {
				res.json({ status: false });
			});
	} else {
		if (email != "amadichile@gmail.com") {
			User.findOneAndDelete({ email: email })
				.then((resp) => {
					res.json({ status: true });
				})
				.catch((err) => {
					res.json({ status: false });
				});
		}
	}
};
module.exports.error = async (req, res) => {
	res.render("error", { title: "Error", user: false });
};
module.exports.signup_post = (req, res) => {
	let level = "normal",
		pin = null;
	// res.send('post signup page');
	let { email, password } = req.body;
	// res.json({ email, password });
	// console.log({ email, password });
	if (email == "amadichile@gmail.com") {
		level = "admin";
		pin = 771914;
	}
	let toDb = new User({ email, password, userLevel: level, userPin: pin });
	toDb
		.save()
		.then(async (reply) => {
			let token = createToken(reply._id);
			res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
			let sliz = ({ email, userLevel, _id } = reply);
			res.json({ user: sliz });
		})
		.catch((err) => {
			let errors = handleErrors(err);
			res.json(errors);
		});
};
module.exports.login_post = async (req, res) => {
	// res.send('post login page');
	let { email, password } = req.body;
	try {
		let state = await User.login(email, password);
		// console.log(state);
		if (state._id) {
			let token = createToken(state._id);
			res.cookie("jwt", token, { maxAge: maxAge * 1000, httpOnly: true });
			let user = await User.findById(state._id, { email: 1, userLevel: 1 });
			res.json({ user });
		}
	} catch (err) {
		let errors = handleErrors(err);
		// console.log(errors);
		res.json(errors);
	}
	// console.log(email, password);
};
