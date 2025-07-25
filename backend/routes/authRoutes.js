const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { getAllUsers } = require("../controllers/authController");
router.get("/users", getAllUsers);
router.get("/ping", (req, res) => res.send("pong"));

router.post("/register", register);
router.post("/login", login);

module.exports = router;
