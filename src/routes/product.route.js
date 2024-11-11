const express = require('express');
const authController = require('../controllers/auth.controller');
const productController = require('../controllers/product.controller')

const router = express()

// Protect all routes after this middleware
router.use(authController.protect);

router.get("/getproducts", productController.getAll)

router.get("/getproduct/:id", productController.getProduct)

// Protect all routes after this middleware
router.use(authController.restrict('Admin'));

router.get("/", productController.ping)

router.post("/postproduct",  productController.postProduct)

router.put("/editproduct/:id", productController.editProduct)

router.delete("/deleteproduct/:id",productController.deleteProduct)

module.exports = router;