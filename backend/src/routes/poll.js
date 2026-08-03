const express = require('express');
const fs = require('fs');
const path = require('path');
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

// Persistent storage
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const POLL_FILE = path.join(DATA_DIR, 'poll.json');

function loadPollData() {
  try {
    const raw = fs.readFileSync(POLL_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return {
      votes: data.votes || [0, 0, 0, 0],
      votedIPs: new Set(data.votedIPs || []),
    };
  } catch {
    return { votes: [0, 0, 0, 0], votedIPs: new Set() };
  }
}

function savePollData(votes, votedIPs) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(POLL_FILE, JSON.stringify({
      votes,
      votedIPs: [...votedIPs],
    }));
  } catch (err) {
    console.error('Failed to save poll data:', err.message);
  }
}

// Load persisted data on startup
const pollData = loadPollData();
const votes = pollData.votes;
const votedIPs = pollData.votedIPs;

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
  savePollData(votes, votedIPs);

  res.json({
    votes: [...votes],
    total: votes.reduce((a, b) => a + b, 0),
  });
});

module.exports = router;
