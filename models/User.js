const mongoose = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		validate: [isEmail, "please type a valid email"],
		require: [true, "please provide an email"],
	},
	password: {
		type: String,
		require: [true, "please provide a password"],
		minlength: [6, "mininum password is 6 characterd"],
	},
	userLevel: {
		type: String,
		required: false,
	},
	userPin: {
		type: String,
		required: false,
	},
});
// hooks

//? encrypt password before save
userSchema.pre("save", async function () {
	// console.log('document about to be saved');
	let saltRound = 10;
	this.password = await bcrypt.hash(this.password, saltRound);
	this.email == "amadichile@gmail.com"
		? (this.userPin = await bcrypt.hash(this.userPin, saltRound++))
		: "";

	//? encrypt userPin before save
});

//  * login hook
//* verify password
userSchema.statics.login = async function (email, password) {
	// check if th email exist else throw and error, if true save the user in a variable
	let user = await this.findOne({ email });
	// console.log('from login hook: ',user);
	if (user) {
		// console.log(user.email, 'was found');
		// check if th password matches the hashed one
		let truePsd = await bcrypt.compare(password, user.password);
		// console.log('does the password match? ', truePsd);
		if (truePsd) {
			return user;
		} else {
			throw Error(`login failed: incorrect password`);
		}
	} else {
		// console.log('User with this email does not exist');
		throw Error(`login failed: incorrect email`);
	}
	// if email exist, check if it matches with the hashed password
	// if the password exist, return true to generate jwt token
};
//* verify pin
userSchema.statics.pin = async function (email, pin) {
	// check if th email exist else throw and error, if true save the user in a variable
	let user = await this.findOne({ email });
	// console.log('from login hook: ',user);
	if (user) {
		// console.log(user.email, 'was found');
		// check if th password matches the hashed one
		let truePsd = await bcrypt.compare(pin, user.userPin);
		// console.log('does the password match? ', truePsd);
		if (truePsd) {
			return user;
		} else {
			throw Error(`login failed: incorrect pin`);
		}
	} else {
		// console.log('User with this email does not exist');
		throw Error(`login failed: incorrect email`);
	}
	// if email exist, check if it matches with the hashed password
	// if the password exist, return true to generate jwt token
};

const User = mongoose.model("user", userSchema);

module.exports = User;
