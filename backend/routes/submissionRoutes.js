const express = require('express');
const router = express.Router();
const { submitCode, getMySubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitCode);
router.get('/my', protect, getMySubmissions);

module.exports = router;