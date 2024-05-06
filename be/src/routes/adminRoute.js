const express = require(`express`);
const router = express.Router();
const AdminController = require(`../controllers/adminController`);
const auth = require(`../middlewares/auth`)

router.post("/regis", AdminController.addAdmin);
router.post("/auth", auth.authentication);

module.exports = router;