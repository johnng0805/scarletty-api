const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db");
const session = require("express-session");

dotenv.config();
const app = express();

app.set("view engine", "pug");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(session({
    secret: "scarletty-api",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 1000 * 60
    }
}));

app.listen(process.env.PORT, () => {
    console.log('Starting Scarletty-API at port: ' + process.env.PORT);
});

app.get("/", (req, res) => {
    res.render("index");
});