const { Router } = require("express");

const userController = require("../controllers/userController");

const router = Router();

router.get("/", userController.allUsers_get);

router.get("/:id", userController.oneUser_get);

module.exports = router;
