// backend/controllers/submissionController.js
const Submission = require('../models/submissionModel');
const Problem = require('../models/problemModel'); // <--- Import Problem Model
const axios = require('axios');

// @desc    Submit code for evaluation
// @route   POST /api/submissions
// @access  Private
const submitCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    // 1. Fetch the Problem to get Test Cases
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // 2. Call the Python AI Service with Code AND Test Cases
    let executionResult;
    try {
      const pythonResponse = await axios.post('http://localhost:8000/execute', {
        code: code,
        test_cases: problem.testCases // <--- Sending the tests from DB
      });
      executionResult = pythonResponse.data;
      
    } catch (pyError) {
      console.error("Python Service Error:", pyError.message);
      executionResult = { 
        passed: false,
        results: 'Error: AI Service unreachable. Please ensure the Python server is running.' 
      };
    }

    // 3. Create the Submission Record
    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      code,
      language,
      status: executionResult.passed ? 'Accepted' : 'Wrong Answer', // <--- Real Status
    });

    // 4. Send back the saved submission + The Detailed Python Output
    res.status(201).json({
      ...submission._doc,
      output: executionResult.results // <--- Detailed logs from Python
    });

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
      .populate('problem', 'title difficulty')
      .sort({ createdAt: -1 });
      
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { submitCode, getMySubmissions };