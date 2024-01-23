import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }


  const db = await connectToDatabase();
  const users = db.collection('users');

  const getusers = await users.find().toArray();
  if (!getusers) {
    return res.status(404).json({ error: 'Users not found' });
  }

  return res.status(200).json({ success: true, data: getusers });
}
