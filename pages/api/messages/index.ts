import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, Message } from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const receiverId = req.query.receiverId as string;
    const userId = req.query.userId as string;
    const groupId = req.query.groupId as string;

    try {
      const db = await connectToDatabase();
      const messages = db.collection('messages');
      // Ensure that receiverId and userId are converted to ObjectId
      const userMessages = await messages.find({ receiverId: receiverId, userId: userId, groupId: groupId }).toArray();

      res.status(200).json(userMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
