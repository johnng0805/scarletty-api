const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db");
const session = require("express-session");
/*---Controllers---*/
const AdminController = require("./controllers/AdminController");
const UserController = require("./controllers/UserController");
const CategoryController = require("./controllers/CategoryController");
const VendorController = require("./controllers/VendorController");
const ProductController = require("./controllers/ProductController");
/*-----------------*/
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

dotenv.config();
const app = express();

app.set("view engine", "pug");
app.use("/static", express.static(path.join(__dirname, "public")));
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(session({
    secret: "scarletty-api",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 1000 * 60
    }
}));

const checkLoggedIn = (req, res, next) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        next();
    }
}

app.listen(process.env.PORT, () => {
    console.log('Starting Scarletty-API at port: ' + process.env.PORT);
});

app.get("/", checkLoggedIn, (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});
/*---Admin's Routes---*/
app.use("/admin", AdminController);
/*---User's Routes---*/
app.use("/user", UserController);
/*---Category's Routes---*/
app.use("/category", CategoryController);
/*---Vendor's Routes---*/
app.use("/vendor", VendorController);
/*---Product's Routes---*/
app.use("/product/", ProductController);