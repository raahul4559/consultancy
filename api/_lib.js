/**
 * Shared helpers for /api/* serverless functions.
 * Filename starts with `_` so Vercel does NOT expose it as a route.
 */
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'predictor1';
const COLLECTION_NAME = 'leads';

let cachedClient = null;
async function getClient() {
  if (cachedClient) return cachedClient;
  cachedClient = new MongoClient(MONGODB_URI);
  await cachedClient.connect();
  return cachedClient;
}

export async function getCollection() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI not configured');
  const client = await getClient();
  return client.db(DB_NAME).collection(COLLECTION_NAME);
}

export const VALID_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];
export const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export function setCors(res, methods = 'GET,POST,PATCH,DELETE,OPTIONS') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function authUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [username, timestamp] = decoded.split(':');
    const age = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000;
    if (username && age < maxAge) return username;
  } catch (e) {}
  return null;
}

export function requireAuth(req, res) {
  const user = authUser(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return user;
}

export function toObjectId(id) {
  try { return new ObjectId(id); } catch (e) { return null; }
}

/** Normalize a lead doc: stringify _id, ensure default fields */
export function normalize(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return {
    id: _id?.toString(),
    status: 'new',
    priority: 'medium',
    notes: [],
    reminders: [],
    activity: [],
    ...rest
  };
}

export function activityEntry(type, text, by) {
  return { type, text, by: by || 'system', at: new Date().toISOString() };
}
