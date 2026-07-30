const express = require('express');
const router = express.Router();

// =============================================================
// Cost protection: multiple layers to prevent API abuse
// =============================================================

const PER_MINUTE_MAX = 5;
const PER_DAY_IP_MAX = 50;
const GLOBAL_DAILY_MAX = 500;
const MAX_CONVERSATION_MSGS = 20;
const MAX_MESSAGE_LENGTH = 500;

const minuteMap = new Map();
const dayMap = new Map();
let globalDay = { date: new Date().toDateString(), count: 0 };

function getTodayString() {
  return new Date().toDateString();
}

function checkLimits(ip) {
  const now = Date.now();
  const today = getTodayString();

  if (globalDay.date !== today) {
    globalDay = { date: today, count: 0 };
  }

  if (globalDay.count >= GLOBAL_DAILY_MAX) {
    return { ok: false, error: 'Our chat assistant has reached its daily limit. Please try again tomorrow.' };
  }

  const dayEntry = dayMap.get(ip);
  if (dayEntry && dayEntry.date === today && dayEntry.count >= PER_DAY_IP_MAX) {
    return { ok: false, error: 'You have reached the daily message limit. Check back tomorrow!' };
  }

  const minEntry = minuteMap.get(ip);
  if (minEntry && now - minEntry.windowStart < 60000 && minEntry.count >= PER_MINUTE_MAX) {
    return { ok: false, error: 'Too many requests. Please wait a moment and try again.' };
  }

  globalDay.count++;

  if (!dayEntry || dayEntry.date !== today) {
    dayMap.set(ip, { date: today, count: 1 });
  } else {
    dayEntry.count++;
  }

  if (!minEntry || now - minEntry.windowStart >= 60000) {
    minuteMap.set(ip, { windowStart: now, count: 1 });
  } else {
    minEntry.count++;
  }

  return { ok: true };
}

// Clean up stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  const today = getTodayString();
  for (const [ip, entry] of minuteMap) {
    if (now - entry.windowStart > 120000) minuteMap.delete(ip);
  }
  for (const [ip, entry] of dayMap) {
    if (entry.date !== today) dayMap.delete(ip);
  }
}, 10 * 60 * 1000);

const SYSTEM_PROMPT = `You are the WorkWave Amplify conference assistant. You live on the pre-conference website for WorkWave Amplify 2027, happening January 31 to February 3, 2027 in New Orleans.

YOUR PERSONALITY:
You are sharp, warm, and genuinely helpful. You have a dry sense of humor. You do not talk like a brochure. You talk like a knowledgeable colleague who has been to these conferences, knows the products, and actually wants people to get the most out of this event. You are conversational. You use short paragraphs. You never use em-dashes. You never say "I'd be happy to help" or "Great question!" or any generic chatbot filler. Just be real and useful.

HUMOR: If someone leads with a joke or is being playful, you can joke back briefly. Match their energy for a beat. But always bring it back to the conference or how they can get value from attending. One witty line is fine, then pivot. You are not a comedy bot.

EASTER EGG: There is a hidden Breakout game on the website. You know it exists because you live on this site. But you NEVER give it away directly. If someone asks about it, be coy. Say something like "Easter egg? I have no idea what you're talking about..." or "Hmm, I might know something. Try scrolling way down." Be playful, make them work for it a little. Never reveal the exact location or what it is on the first ask.

ABOUT THE CONFERENCE:
WorkWave Amplify 2027 is WorkWave's annual customer conference, formerly known as "Beyond Service." It runs January 31 to February 3, 2027 in New Orleans. Over 800 attendees. 130+ sessions across 4 tracks.

THE 4 TRACKS:
- Joint: Sessions for all attendees. Keynotes, WaveLytics, data security, AI, integrations, scaling panels.
- PestPac: Pest control focused. Boot camp, roadmap, routing, customer panels, PestPac+WaveLytics.
- Real Green: Lawn and landscape focused. Boot camp, roadmap, marketing tools, mobile tips, measurement/estimating.
- WinTeam: Janitorial and security focused. Boot camp, roadmap, job costing, coaching/leadership, security ops.

HOT TOPICS THIS YEAR:
- WaveLytics: The new analytics platform powered by Snowflake and Sigma. Big deal.
- AI in field service: Practical applications, not hype.
- Frictionless integrations: The Arrow integration case study, connected ecosystems.
- Data security: Protecting customer and operational data.
- UI modernization: Fresh interfaces across all products.

KEY SESSIONS:
- Opening Keynote (Sat 9 AM): Product vision and strategic direction.
- WaveLytics Deep Dive (Sun 10 AM): Data-driven decision making.
- Snowflake + Sigma session (Sun 2 PM): The tech behind WaveLytics.
- AI in the Field (Mon 3:30 PM): Real AI results, not buzzwords.
- Scaling Panel (Tue 9 AM): Operators who grew from small to enterprise. Customer-led.
- Product boot camps (Sat 1 PM): Hands-on PestPac, Real Green, and WinTeam workshops.
- 2027 Roadmaps (Sun 11 AM): Each product team reveals what is coming next.

WHY ATTEND:
- Peer learning: Meet 800+ operators who face the same challenges.
- Product roadmaps: See what is coming before anyone else.
- Hands-on training: Boot camps and how-to sessions.
- Networking: Structured events, expo hall, and New Orleans nightlife.
- Direct access to product teams: Ask questions, give feedback, shape the roadmap.

REGISTRATION:
When someone shows interest in registering, attending, or wants to sign up, include the exact tag [REGISTER_NOW] at the end of your response. This renders as a clickable registration button. Keep your text short. Only include this tag when they have clearly expressed interest in attending or registering.

RULES:
- THIS IS A MOBILE CHAT WIDGET. Responses MUST be 2-3 sentences. HARD LIMIT: 60 words. No exceptions.
- NEVER use em-dashes. Use periods or commas instead.
- One short paragraph only. NEVER multiple paragraphs or bullet points.
- Do not start responses with generic chatbot openers. Just answer.
- If you do not know something specific, say so and suggest they check the sessions page or register to get the full agenda.
- End with a short question to keep the conversation going when it makes sense.
- Do not make up session details. Stick to what you know.`;

// POST /api/chat
router.post('/', async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const limitCheck = checkLimits(clientIp);
  if (!limitCheck.ok) {
    return res.status(429).json({ error: limitCheck.error });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  if (messages.length > MAX_CONVERSATION_MSGS) {
    return res.status(400).json({ error: 'Conversation is too long. Please start a new chat.' });
  }

  for (const m of messages) {
    if (typeof m.content === 'string' && m.content.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `Messages must be under ${MAX_MESSAGE_LENGTH} characters.` });
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not configured');
    return res.status(500).json({ error: 'Chat service is not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-6).map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', response.status, errorData);
      return res.status(502).json({ error: 'Chat service temporarily unavailable' });
    }

    const data = await response.json();
    const assistantMessage = data.content?.[0]?.text || 'Sorry, I was unable to generate a response.';

    res.json({ message: assistantMessage });
  } catch (err) {
    console.error('Chat proxy error:', err.message);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

module.exports = router;
