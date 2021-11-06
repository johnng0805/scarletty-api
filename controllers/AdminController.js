const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../models").Admin;
const { body, validationResult } = require("express-validator");

const router = express.Router();
const saltRounds = 10;

router.post("/login",
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
                    res.status(200).redirect("/");
                } else {
                    res.sendStatus(403);
                }
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

router.get("/logout", (req, res) => {
    req.session.loggedIn = false;
    return res.sendStatus(200);
});



module.exports = router;

