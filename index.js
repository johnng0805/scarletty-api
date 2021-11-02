const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db");
const session = require("express-session");
const Admin = require("./models").Admin;
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

app.post("/login",
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().isAlphanumeric(),
    async function (req, res) {
        const err = validationResult(req);
        console.log(req.body);
        if (!err.isEmpty()) {
            return res.sendStatus(400);
        }

        const { email, password } = req.body;
        try {
            const admin = await Admin.findOne({
                where: {
                    email: email
                }
            });

            if (admin) {
                if (bcrypt.compareSync(password, admin.password)) {
                    req.session.loggedIn = true;
                    res.redirect("/");
                } else {
                    res.status(403).render("/login", {
                        error: "Email or password incorrect."
                    });
                }
            } else {
                res.status(404).render("login", {
                    error: "Email or password incorrect."
                });
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

// app.use("/login", UserController);