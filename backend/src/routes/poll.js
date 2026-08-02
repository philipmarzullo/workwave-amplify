const express = require('express');
const router = express.Router();

const POLL = {
  question: "What's your #1 goal for AMPLIFY 2027?",
  options: [
    'Learn what\'s new in my product',
    'Network with peers in my industry',
    'Explore AI and analytics tools',
    'Build a business case for growth',
  ],
};

// In-memory vote counts and IP tracking
const votes = [0, 0, 0, 0];
const votedIPs = new Set();

// GET /api/poll — return poll data with current counts
router.get('/', (_req, res) => {
  res.json({
    question: POLL.question,
    options: POLL.options,
    votes: [...votes],
    total: votes.reduce((a, b) => a + b, 0),
  });
});

// POST /api/poll — cast a vote
router.post('/', (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
  const { optionIndex } = req.body;

  if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= POLL.options.length) {
    return res.status(400).json({ error: 'Invalid option index' });
  }

  if (votedIPs.has(ip)) {
    return res.status(409).json({
      error: 'Already voted',
      votes: [...votes],
      total: votes.reduce((a, b) => a + b, 0),
    });
  }

  votedIPs.add(ip);
  votes[optionIndex]++;

  res.json({
    votes: [...votes],
    total: votes.reduce((a, b) => a + b, 0),
  });
});

module.exports = router;
