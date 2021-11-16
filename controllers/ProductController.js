const express = require("express");
const { body, validationResults } = require("express-validator");
const Product = require("../models").Product;
const Category = require("../models").Product_Category;

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
        const products = await Product.findall({
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

module.exports = router;