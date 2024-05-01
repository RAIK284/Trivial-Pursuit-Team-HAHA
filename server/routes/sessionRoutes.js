const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/sessionController");

router.post("/createsession", scoreController.createGameSession);
router.post("/sessionExists", scoreController.sessionExists);

module.exports = router;
