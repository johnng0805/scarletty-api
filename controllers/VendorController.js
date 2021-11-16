const express = require("express");
const { body, validationResult } = require("express-validator");
const Vendor = require("../models").Vendor;

const router = express.Router();

const checkLoggedIn = (req, res, next) => {
    (!req.session.loggedIn) ? res.sendStatus(403) : next();
}

function checkIsNaN(id) {
    var idConverted = parseInt(id);
    return isNaN(idConverted);
}

router.get("/info/:id", async (req, res) => {
    if (req.params.id === ":id") {
        try {
            const vendors = await Vendor.findAll({
                attributes: [
                    "id",
                    "name",
                    "country",
                    "email",
                    "description",
                    "createdAt",
                    "updatedAt"
                ]
            });
            res.status(200).send(vendors);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    } else {
        const id = req.params.id;
        if (checkIsNaN(id)) {
            return res.sendStatus(400);
        }
        try {
            const vendorInfo = await Vendor.findOne({
                where: {
                    id: id
                }
            });
            (vendorInfo) ? res.status(200).send(vendorInfo) : res.sendStatus(404);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }
});

router.post("/info",
    body("name").notEmpty().matches(/^[a-zA-Z0-9 ]+$/),
    body("country").notEmpty().matches(/^[a-zA-Z0-9 ]+$/),
    body("email").notEmpty().isEmail().normalizeEmail(),
    body("description").notEmpty().matches(/^[a-zA-Z0-9,.;:'"()% ]+$/),
    async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).send(err);
        }

        const { name, country, email, description } = req.body;
        try {
            const postedVendor = await Vendor.create({
                name: name,
                country: country,
                email: email,
                description: description
            });
            (postedVendor) ? res.status(200).send(postedVendor) : res.status(500).send({
                error: "Cannot create vendor"
            });
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });

router.put("/info/:id", checkLoggedIn,
    body("name").notEmpty().matches(/^[a-zA-Z0-9 ]+$/),
    body("country").notEmpty().matches(/^[a-zA-Z0-9 ]+$/),
    body("email").notEmpty().isEmail().normalizeEmail(),
    body("description").notEmpty().matches(/^[a-zA-Z0-9,.;:'"()% ]+$/),
    async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            console.log(err);
            return res.status(400).send(err);
        }

        const id = req.params.id;
        if (checkIsNaN(id)) {
            return res.sendStatus(400);
        }
        const { name, country, email, description } = req.body;

        try {
            await Vendor.update({
                name: name,
                country: country,
                email: email,
                description: description
            }, {
                where: {
                    id: id
                }
            });
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

router.delete("/info/:id", checkLoggedIn, async (req, res) => {
    const id = req.params.id;
    (checkIsNaN(id)) ?? res.sendStatus(400);

    try {
        await Vendor.destroy({
            where: {
                id: id
            }
        });
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;