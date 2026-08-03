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
    // Support both old format (votedIPs as array) and new format (votedMap as object)
    let votedMap = new Map();
    if (data.votedMap && typeof data.votedMap === 'object') {
      votedMap = new Map(Object.entries(data.votedMap).map(([k, v]) => [k, Number(v)]));
    } else if (Array.isArray(data.votedIPs)) {
      // Migrate old format — can't recover which option, so just mark as -1
      for (const ip of data.votedIPs) {
        votedMap.set(ip, -1);
      }
    }
    return {
      votes: data.votes || [0, 0, 0, 0],
      votedMap,
    };
  } catch {
    return { votes: [0, 0, 0, 0], votedMap: new Map() };
  }
}

function savePollData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const mapObj = {};
    for (const [ip, idx] of votedMap) {
      mapObj[ip] = idx;
    }
    fs.writeFileSync(POLL_FILE, JSON.stringify({
      votes,
      votedMap: mapObj,
    }));
  } catch (err) {
    console.error('Failed to save poll data:', err.message);
  }
}

function getIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
}

// Load persisted data on startup
const pollData = loadPollData();
const votes = pollData.votes;
const votedMap = pollData.votedMap;

// GET /api/poll — return poll data with current counts + caller's vote status
router.get('/', (req, res) => {
  const ip = getIp(req);
  const hasVoted = votedMap.has(ip);
  const votedIndex = hasVoted ? votedMap.get(ip) : -1;

  res.json({
    question: POLL.question,
    options: POLL.options,
    votes: [...votes],
    total: votes.reduce((a, b) => a + b, 0),
    voted: hasVoted,
    votedIndex,
  });
});

// POST /api/poll — cast a vote
router.post('/', (req, res) => {
  const ip = getIp(req);
  const { optionIndex } = req.body;

  if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= POLL.options.length) {
    return res.status(400).json({ error: 'Invalid option index' });
  }

  if (votedMap.has(ip)) {
    return res.status(409).json({
      error: 'Already voted',
      votes: [...votes],
      total: votes.reduce((a, b) => a + b, 0),
      votedIndex: votedMap.get(ip),
    });
  }

  votedMap.set(ip, optionIndex);
  votes[optionIndex]++;
  savePollData();

  res.json({
    votes: [...votes],
    total: votes.reduce((a, b) => a + b, 0),
    votedIndex: optionIndex,
  });
});

module.exports = router;
