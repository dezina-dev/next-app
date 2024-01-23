import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/db';
import { Filter, FindOneAndUpdateOptions, ObjectId, UpdateFilter } from 'mongodb';
import { UpdateQuery } from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // create group
    const { createdById } = req.body;
    const timestamp = new Date();
    const members = [];
    const body = { ...req.body, timestamp, members };

    const db = await connectToDatabase();
    const groups = db.collection('groups');

    try {
      await groups.insertOne(body);
      const result = await groups.find({ createdById: createdById }).toArray();
      return res.status(201).json({ message: 'Group Created', data: result });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    // get all group members
    const userId = req.query.userId as string;
    try {
      const db = await connectToDatabase();
      const groups = db.collection('groups');

      const result = await groups
        .find({
          $or: [
            { createdById: userId },
            { members: userId } // Check if userId exists in the members array
          ]
        })
        .toArray();

      const enhancedResult = await Promise.all(
        result.map(async (group) => {
          const membersData = await Promise.all(group.members.map((memberId) =>
            fetchUserData(memberId, db)));

          return {
            ...group,
            members: membersData,
          };
        })
      );
      return res.status(201).json({ data: enhancedResult });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    // update group members
    const { groupId, groupUsers } = req.body;

    try {
      const db = await connectToDatabase();
      const groups = db.collection('groups');

      const updateObject = await createUpdateObject(groupId, groupUsers);

      const updatedGroup = await groups.findOneAndUpdate(
        { _id: new ObjectId(groupId) },
        updateObject as any, // Cast updateObject to any
        { returnDocument: 'after' }
      );

      if (!updatedGroup) {
        console.error('Group not found');
        return res.status(404).json({ message: 'Group not found' });
      }

      // Ensure that updatedGroup.members is defined before mapping over it
      const membersData = await Promise.all(
        (updatedGroup.members || []).map((memberId) => fetchUserData(memberId, db))
      );
      const enhancedResult = {
        ...updatedGroup.value,
        members: membersData,
      };

      return res.status(200).json({ message: 'Members added to group', data: enhancedResult });
    } catch (error) {
      console.error('Error updating group members:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE' && req.query.deleteUserId) {
    // Delete member from group
    const groupId = req.query.groupId as string;
    const deleteUserId = req.query.deleteUserId as string;
    try {
      const db = await connectToDatabase();
      const groups = db.collection('groups');
      const filter: Filter<Document> = { _id: new ObjectId(groupId as string) };
      const update: UpdateQuery<Document> = { $pull: { members: deleteUserId as string } };
      const options: FindOneAndUpdateOptions = { returnDocument: 'after' };

      // Cast the update object to 'any' to bypass TypeScript type checking for this line
      const updatedGroup = await groups.findOneAndUpdate(filter, update as any, options);

      if (!updatedGroup) {
        console.error('Group not found');
        return res.status(404).json({ error: 'Group not found' });
      }
      let membersData: string[] = [];
      if (updatedGroup.members.length === 0) {
        membersData = []
      } else {
        // Ensure that updatedGroup.members is defined before mapping over it
        membersData = await Promise.all(
          (updatedGroup.members || []).map((memberId) => fetchUserData(memberId, db))
        );
      }
      return res.status(200).json(membersData);
    } catch (error) {
      console.error('Error deleting user from group:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE' && req.query.group) {
    // Delete group
    const { group, createdBy } = req.query;
    try {
      const db = await connectToDatabase();
      const groups = db.collection('groups');

      const deletedGroup = await groups.findOneAndDelete({
        _id: new ObjectId(group as string),
      });

      if (!deletedGroup) {
        console.error('Group not found');
        return res.status(404).json({ error: 'Group not found' });
      }
      const result = await groups.find({ createdById: createdBy }).toArray();
      return res.status(200).json({ message: 'Group deleted successfully', data: result });
    } catch (error) {
      console.error('Error deleting group:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

const fetchUserData = async (memberId, db) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(memberId) });
    return user; // Assuming user contains the user information
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null; // Return null for any error during user fetch
  }
};

const createUpdateObject = async (groupId, groupUsers: string[]) => {
  const db = await connectToDatabase();
  const groups = db.collection('groups');

  const memberIds = groupUsers.map((id) => id);

  // Fetch the existing members of the group
  const existingMembers = await groups
    .findOne({ _id: new ObjectId(groupId) })
    .then((group) => group?.members || []);

  // Filter out members that are already present in the group
  const newMembers = memberIds.filter((id) => !existingMembers.includes(id));

  return { $push: { members: { $each: newMembers } } };
};
