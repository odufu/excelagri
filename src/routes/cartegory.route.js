const express = require('express');
const authController = require('../controllers/auth.controller');
const cartegoryController = require('../controllers/cartegory.controller')

const router = express()

// Protect all routes after this middleware
router.use(authController.protect);

router.get("/getcartegorys", cartegoryController.getAll)
router.get("/getcartegory/:id", cartegoryController.getCartegory)

// Protect all routes after this middleware
router.use(authController.restrict('Admin'));
router.get("/", cartegoryController.ping)
router.post("/postcartegory",  cartegoryController.postCartegory)
router.put("/editcartegory/:id", cartegoryController.editCartegory)
router.delete("/deletecartegory/:id",cartegoryController.deleteCartegory)

module.exports = router;