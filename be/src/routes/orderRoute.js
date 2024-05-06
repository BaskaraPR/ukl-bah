const express = require(`express`);
const router = express.Router();
const orderController = require(`../controllers/orderController`);
const authorization = require(`../middlewares/auth`)

router.post("/add", orderController.addOrder);
router.get("/getall", authorization.authorization,orderController.getAllorder);

module.exports = router;