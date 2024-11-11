const express = require('express');
const brandController = require("../controllers/brand.controller")
const authController = require('../controllers/auth.controller');

const router = express()

router.get("/getbrands", brandController.getAll)

router.get("/getbrand/:id", brandController.getBrand)


// Protect all routes after this middleware
router.use(authController.protect);
router.get("/", brandController.ping)
router.post("/postbrand" ,brandController.postBrand)
router.get("/brands", brandController.getBasedOnTime)
router.put("/editbrand/:id", brandController.editBrand)
router.delete("/deletebrand/:id", authController.restrict('Admin') ,brandController.deleteBrand)
module.exports = router;