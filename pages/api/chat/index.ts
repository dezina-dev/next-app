import { Server, Socket } from 'socket.io';
import { connectToDatabase, Message } from '../../../utils/db';
import { ObjectId } from 'mongodb';

export default async function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Already set up');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', async (socket: Socket) => {
    try {
      // Fetch existing messages and send them to the connected user
      const db = await connectToDatabase();
      const messages = db.collection<Message>('messages');
      socket.on('request-messages', async ({ userId, receiverId }: { userId: string, receiverId: string }) => {
        try {
          const userMessages = await messages.find({ receiverId: new ObjectId(receiverId), userId: new ObjectId(userId) }).toArray();
          socket.emit('requested-messages', userMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      });

      socket.on('send-message', async (obj: Message) => {
        const timestamp = new Date();
        const messageWithTimestamp = { ...obj, timestamp };

        try {
          const result = await messages.insertOne(messageWithTimestamp);
          if (result) {
            console.log('Message saved successfully:', messageWithTimestamp);
          } else {
            console.error('Failed to save message:', messageWithTimestamp);
          }
        } catch (error) {
          console.error('Error saving message to the database:', error);
        }
        // add query to fetch messages based if groupId exists else line 54
        io.emit('receive-message', messageWithTimestamp);
      });
    } catch (error) {
      console.error('Error in socket connection:', error);
    }
  });

  res.end();
}
