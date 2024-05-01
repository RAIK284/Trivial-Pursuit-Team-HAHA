const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

router.post('/updpate-score', scoreController.updateScore);
router.get('/top-scores', scoreController.findTopScores);

module.exports = router;
