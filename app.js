const express = require("express");
const { router } = require("./Routes/routes");
const { connectDb } = require("./ulties/db");
const cookieParser = require("cookie-parser");
const { sendDetails, currentUser } = require("./middlewares/authMiddle");
const foo = require("./global/state");
const cors = require("cors");
const origin = ["http://localhost:3000"];

const app = express();

// ! middlewares
app.use(cors({ credentials: true, origin }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.get("/:i", sendDetails);
app.use("/api/protected", router);

// ! start server

connectDb(() => {
	app.listen(4000, () => {
		console.log("server started on port 4000");
	});
});

// let d = foo.fun_a("chile");
// console.log(d);
// foo.fun_b(300);
// foo.bar();
console.log(foo.sum(4, 10));
