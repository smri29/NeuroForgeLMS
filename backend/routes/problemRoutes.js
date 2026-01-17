// backend/routes/problemRoutes.js
const express = require('express');
const router = express.Router();
const { getProblems, getProblemById, createProblem } = require('../controllers/problemController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public: Get all. Private/Admin: Create new.
router.route('/').get(getProblems).post(protect, admin, createProblem);

// Public: Get one.
router.route('/:id').get(getProblemById);

module.exports = router;