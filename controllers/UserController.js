const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models").User;
const Cart = require("../models").Cart;
const { body, validationResult } = require("express-validator");

const router = express.Router();
const saltRounds = 10;

const checkLoggedIn = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.sendStatus(403);
    } else {
        next();
    }
}

function checkIsNaN(id) {
    var idConverted = parseInt(id);
    return isNaN(idConverted);
}

router.get("/info/:id", checkLoggedIn, async (req, res) => {
    const id = req.params.id;

    if (checkIsNaN(id)) {
        return res.sendStatus(400);
    }

    try {
        const userInfo = await User.findOne({
            where: {
                id: id
            }
        });

        if (userInfo) {
            const userSend = {
                name: userInfo.name,
                date_of_birth: userInfo.date_of_birth,
                gender: userInfo.gender,
                email: userInfo.email
            }
            return res.status(200).send(userSend);
        } else {
            return res.sendStatus(404);
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.put("/info/:id", checkLoggedIn,
    body("name").notEmpty().matches(/^[a-zA-Z0-9 ]+$/),
    body("email").isEmail().normalizeEmail(),
    body("gender").notEmpty().isAlphanumeric(),
    body("date_of_birth").notEmpty().isDate(),
    body("password").notEmpty().isAlphanumeric().isLength({ min: 5 }),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation do not match password");
        }
        return true;
    }),
    async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).send(err);
        }
        const id = req.params.id;
        const updateInfo = req.body;

        if (checkIsNaN(id)) {
            return res.sendStatus(400);
        }

        updateInfo.password = bcrypt.hashSync(updateInfo.password, saltRounds);

        try {
            const updatedUser = await User.update({
                name: updateInfo.name,
                email: updateInfo.email,
                gender: updateInfo.gender,
                date_of_birth: updateInfo.date_of_birth,
                password: updateInfo.password
            }, {
                where: {
                    id: id
                }
            });
            return res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

router.delete("/info/:id", checkLoggedIn, async (req, res) => {
    const id = req.params.id;

    if (checkIsNaN(id)) {
        return res.sendStatus(400);
    }

    try {
        await User.destroy({
            where: {
                id: id
            },
        });
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.post("/register",
    body("name").notEmpty().matches(/^[a-zA-Z0-9 ]+$/),
    body("email").isEmail().normalizeEmail(),
    body("gender").notEmpty().isAlphanumeric(),
    body("date_of_birth").notEmpty().isDate(),
    body("password").notEmpty().isAlphanumeric().isLength({ min: 5 }),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation do not match password");
        }
        return true;
    }),
    async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).send(err);
        }

        const registerInfo = req.body;

        registerInfo.password = bcrypt.hashSync(registerInfo.password, saltRounds);

        try {
            const newUser = await User.create({
                name: registerInfo.name,
                date_of_birth: registerInfo.date_of_birth,
                gender: registerInfo.gender,
                email: registerInfo.email,
                password: registerInfo.password
            });
            return res.sendStatus(200);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });

router.post("/login",
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().isAlphanumeric().isLength({ min: 5 }),
    async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).send(err);
        }
        const { email, password } = req.body;
        try {
            const user = await User.findOne({
                where: {
                    email: email
                }
            });

            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    try {
                        const [cart, created] = await Cart.findOrCreate({
                            attributes: ['id', 'user_id', 'createdAt', 'updatedAt'],
                            where: {
                                user_id: user.id
                            },
                            defaults: {
                                user_id: user.id
                            }
                        })

                        if (cart) {
                            req.session.loggedIn = true;
                            return res.status(200).send({
                                user_id: user.id,
                                cart_id: cart.id
                            });
                        }
                    } catch (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                } else {
                    return res.status(403).send({
                        error: "Email or password is incorrect"
                    });
                }
            } else {
                return res.status(403).send({
                    error: "Email or password is incorrect"
                });
            }
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });

router.get("/logout", (req, res) => {
    req.session.loggedIn = false;
    return res.sendStatus(200);
})

module.exports = router;