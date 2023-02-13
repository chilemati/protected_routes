const jwt = require("jsonwebtoken");
const foo = require("../global/state");
const Admin = require("../models/admin");
const User = require("../models/User");

let checkUser = (req, res, next) => {
	// console.log(req.cookies);
	let token = req.cookies.jwt;
	if (token) {
		let state = jwt.verify(token, "Let God be True!", (err, decodedToken) => {
			if (err) {
				res.json({ user: null });
			} else {
				// console.log(decodedToken);
				next();
			}
		});
	} else {
		res.json({ user: null });
		// next() is not used if there is a res
	}
};

// * using the YUI module pattern for global variable

let sendDetails = async function (req, res, next) {
	let token = req.cookies.jwt;
	if (token) {
		let verifiedToken = jwt.verify(
			token,
			"Let God be True!",
			async (err, decodedToken) => {
				if (err) {
					next();
				} else {
					// console.log(decodedToken);

					// console.log("person is: ", person);
					let user = await User.findById(decodedToken.id);
					res.locals.user = user;
					if (user) {
						if (user.userLevel) {
							console.log("A userLevel exists!");
							let allUsers = await User.find({}, { email: 1, userLevel: 1 });
							res.locals.allUsers = allUsers;
						} else {
							console.log("A userLevel does not exist!");
						}
					}
					next();
				}
			}
		);
	} else {
		next();
	}
};

// admin

let getDetails = (req, res) =>
	new Promise(async (resolve, reject) => {
		let token = req.cookies.jwt;
		let verifiedToken = await jwt.verify(
			token,
			"Let God be True!",
			async (err, decodedToken) => {
				if (err) {
					resolve(false);
				} else {
					let user = await User.findById(decodedToken.id);
					resolve(user);
				}
			}
		);
	});

module.exports = {
	checkUser,
	sendDetails,
	getDetails,
};

/** 

  AGOLRITHM FOR ADMIN AND SUB ADMIN

   ON LOGIN REQUEST?
     : CHECK IF USER HAS ADMIN OR SUBADMIN FIELD?
       IF TRUE? 
        : VERIFY REAL ADMIN OR SUBAMIN VIA 6 DIGIT PIN? 
          : IF TRUE?
            : SEND CONTENTS UNIQUE TO ADMIN OR SUBAMIN
            : ELSE
              ALLOW LOGIN AS NORMAL USER
        : ELSE
          ALLOW LOGIN AS NORMAL USER
     : USER ADMIN OR SUBAMIN SHOULD VERIFY BY PIN FOR EACH REQUEST TO QUERY TO  OR FROM DB
  
  


*/
