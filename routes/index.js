const { Router } = require("express");

const { authorizationMiddleware } = require("../middleware/authMiddleware");

const router = Router();

router.use("/auth", require("./authRoute"));
router.use("/users", authorizationMiddleware, require("./usersRoute"));

module.exports = router;
