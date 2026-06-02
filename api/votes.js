import { kv } from '@vercel/kv';
const VOTES_KEY = 'birthday_quest_votes';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'GET') {
      const votes = await kv.get(VOTES_KEY) || {};
      return res.status(200).json(votes);
    }
    if (req.method === 'POST') {
      const { name, vote } = req.body;
      if (!name || !vote) return res.status(400).json({ error: 'name and vote required' });
      const votes = await kv.get(VOTES_KEY) || {};
      votes[name] = vote;
      await kv.set(VOTES_KEY, votes);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
