const express = require("express");
const {
	home_get,
	login_post,
	signup_post,
	dashboard_get,
	about_get,
	signout_get,
	allUsers_get,
	verifyUserPin_post,
	usersLevel_post,
	blogs_get,
	error,
} = require("../controllers/routeControllers");
const { checkUser, sendDetails } = require("../middlewares/authMiddle");
const router = express.Router();
// router.get("*", sendDetails);
// router.post("*", sendDetails);
router.get("/", home_get);
router.get("/blogs", checkUser, blogs_get);
router.post("/login", login_post);
router.post("/signup", signup_post);
router.get("/dashboard", checkUser, dashboard_get);
router.get("/about", about_get);
router.get("/signout", signout_get);
router.get("/allUsers", allUsers_get);
router.post("/verifyUserPin", verifyUserPin_post);
router.post("/usersLevel", usersLevel_post);
router.get("*", error);

module.exports = {
	router,
};
