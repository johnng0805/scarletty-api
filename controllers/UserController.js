const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const saltRounds = 10;

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/",
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().isAlphanumeric(),
    async function (req, res) {
        const err = validationResult(req);
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
                    res.sendStatus(200);
                } else {
                    res.sendStatus(403);
                }
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

module.exports = router;

