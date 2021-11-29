const express = require("express");
const multer = require("multer");
const path = require("path");
const ProductImage = require("../models").Product_Image;

const router = express.Router();

function checkIsNaN(id) {
    var idConverted = parseInt(id);
    return isNaN(idConverted);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/upload/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("error: images only");
    }
}

router.get("/product/:id", async (req, res) => {
    if (checkIsNaN(req.params.id)) {
        return res.sendStatus(400);
    }
    const productID = req.params.id;

    try {
        const Images = await ProductImage.findAll({
            where: {
                product_id: productID
            }
        });
        res.status(200).send(Images);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post("/product/:id", upload.any("product_image", 5), async (req, res) => {
    if (checkIsNaN(req.params.id)) {
        return res.sendStatus(400);
    }
    const product_id = req.params.id;
    var images = [];

    req.files.forEach(file => {
        images.push({ "product_id": product_id, "image": file.filename });
    });

    try {
        const productImages = await ProductImage.bulkCreate(images);
        res.status(200).send(productImages);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

module.exports = router;