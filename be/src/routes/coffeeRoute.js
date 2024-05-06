const express = require(`express`);
const router = express.Router();
const coffeeController = require(`../controllers/coffeeController`);
const authorization = require(`../middlewares/auth`)

router.post("/add",authorization.authorization, coffeeController.addCoffee);
// router.get("/getall", coffeeController.getAllcoffee);
router.post("/:search", coffeeController.findCoffee);
router.put("/:id", authorization.authorization,coffeeController.updateCoffe);
// router.post("/restock/:id", authorization.authorization, authorization.adminOnly,coffeeController.addStockcoffee)
router.delete("/:id", authorization.authorization, coffeeController.deleteCoffee);

module.exports = router;