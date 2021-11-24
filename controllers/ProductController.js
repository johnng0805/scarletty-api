const express = require("express");
const { body, validationResult } = require("express-validator");
const Product = require("../models").Product;
const Category = require("../models").Category;

const router = express.Router();

const checkLoggedIn = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.sendStatus(403);
    } else {
        next();
    }
};

function checkIsNaN(id) {
    var idConverted = parseInt(id);
    return isNaN(idConverted);
}

router.get("/info/:id", async (req, res) => {
    if (req.params.id === ":id") {
        try {
            const products = await Product.findAll({
                attributes: [
                    "id",
                    "vendor_id",
                    "name",
                    "price",
                    "description",
                    "discount",
                    "in_stock",
                ]
            });
            return res.send(200).send(products);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    } else {
        const id = req.params.id;
        if (checkIsNaN(id)) {
            return res.sendStatus(400);
        }
        try {
            const productInfo = await Product.findOne({
                where: {
                    id: id
                }
            });

            (productInfo) ? res.status(200).send(productInfo) : res.sendStatus(404);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }
});

router.get("/info/category/:id", async (req, res) => {
    const id = req.params.id;

    if (checkIsNaN(id)) {
        return res.sendStatus(400);
    }

    try {
        const products = await Product.findAll({
            include: [{
                model: Category,
                where: {
                    id: id
                }
            }]
        });
        res.status(200).send(products);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.post("/info",
    body("vendor_id").notEmpty().isAlphanumeric(),
    body("category_id").notEmpty().isAlphanumeric(),
    body("name").notEmpty().matches(/^[a-zA-Z0-9 ]+$/),
    body("price").notEmpty().isAlphanumeric(),
    body("description").notEmpty().matches(/^[a-zA-Z0-9,.:;'"()% ]/),
    body("discount").notEmpty().isAlphanumeric(),
    body("in_stock").isAlphanumeric(),
    async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).send(err);
        }

        const { vendor_id, category_id, name, price, description, discount, in_stock } = req.body;

        try {
            const product = await Product.create({
                vendor_id: vendor_id,
                name: name,
                price: price,
                description: description,
                discount: discount,
                in_stock: in_stock
            });
            const category = await Category.findOne({
                where: {
                    id: category_id
                }
            });
            if (category) {
                product.addCategory(category);
                res.status(200).send(product);
            } else {
                res.sendStatus(500);
            }
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });

router.put("/info/:id",
    body("name").notEmpty().matches(/^[a-zA-Z0-9 ]+$/),
    body("price").notEmpty().isAlphanumeric(),
    body("description").notEmpty().matches(/^[a-zA-Z0-9,.:;'"()% ]/),
    body("discount").notEmpty().isAlphanumeric(),
    body("in_stock").isAlphanumeric(),
    async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).send(err);
        }
        if (checkIsNaN(req.params.id)) {
            return res.sendStatus(404);
        }
        const { name, price, description, discount, in_stock } = req.body;
        const id = req.params.id;

        try {
            await Product.update({
                name: name,
                price: price,
                description: description,
                discount: discount,
                in_stock: in_stock
            }, {
                where: {
                    id: id
                }
            });
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });

module.exports = router;