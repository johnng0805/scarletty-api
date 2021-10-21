const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db");

dotenv.config();
const app = express();

app.set("view engine", "pug");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log('Starting Scarletty-API at port: ' + process.env.PORT);
});

app.get("/", (req, res) => {
    res.render("index");
});