// backend/controllers/submissionController.js
const Submission = require('../models/submissionModel');

// @desc    Submit code for evaluation
// @route   POST /api/submissions
// @access  Private
const submitCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    // 1. Create a Pending Submission
    const submission = await Submission.create({
      user: req.user._id, // Gets ID from the "protect" middleware
      problem: problemId,
      code,
      language,
      status: 'Pending' // Will change once Python processes it
    });

    // TODO: Phase 03 - Call Python Service Here

    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ message: 'Submission failed', error: error.message });
  }
};

// @desc    Get user's history
// @route   GET /api/submissions/my
// @access  Private
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('problem', 'title difficulty') // Fetches the problem title too
      .sort({ createdAt: -1 });
      
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { submitCode, getMySubmissions };