const express = require("express");
const Category = require("../models").Category;
const { body, validationResult } = require("express-validator");

const router = express.Router();

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

router.get("/info/:id", async (req, res) => {
    console.log(req.params);
    if (req.params.id === ":id") {
        try {
            const Categories = await Category.findAll({
                attributes: [
                    "id",
                    "name",
                    "description",
                    "createdAt",
                    "updatedAt"
                ]
            });

            (Categories) ? res.status(200).send(Categories) : res.sendStatus(404);
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
            const category = await Category.findOne({
                where: {
                    id: id
                }
            });

            (category) ? res.status(200).send(category) : res.sendStatus(404);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }
});

router.put("/info/:id", checkLoggedIn,
    body("name").notEmpty().matches(/^[a-zA-Z0-9 ]+$/),
    body("description").notEmpty().matches(/^[a-zA-Z0-9,.;'"%() ]+$/),
    async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.sendStatus(400);
        }
        const id = req.params.id;

        if (checkIsNaN(id)) {
            return res.sendStatus(400);
        }

        const { name, description } = req.body;
        try {
            const updatedCategory = await Category.update({
                name: name,
                description: description
            }, {
                where: {
                    id: id
                }
            });

            (updatedCategory) ? res.sendStatus(200) : res.sendStatus(400);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });

router.post("/info", checkLoggedIn,
    body("name").notEmpty().matches(/^[a-zA-Z0-9 ]+$/),
    body("description").notEmpty().matches(/^[a-zA-Z0-9,.;:'"%() ]+$/),
    async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.sendStatus(400);
        }
        const { name, description } = req.body;
        try {
            const newCategory = await Category.create({
                name: name,
                description: description
            });
            (newCategory) ? res.status(200).send(newCategory) : res.sendStatus(400);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });

router.delete("/info/:id", checkLoggedIn, async (req, res) => {
    const id = req.params.id;

    if (checkIsNaN(id)) {
        return res.sendStatus(400);
    }

    try {
        await Category.destroy({
            where: {
                id: id
            },
        });
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

module.exports = router;