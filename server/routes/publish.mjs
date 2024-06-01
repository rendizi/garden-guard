import { users } from "../index.mjs";
import { ObjectId } from "mongodb";

export const publish = async (req,res) => {
    const { username, image, description } = req.body;

    if (!username || !image || !description) {
        return res.status(400).send('Username, image, and description are required');
    }

    try {
        const publication = {
            _id: new ObjectId(),
            image,
            description,
            createdTime: new Date(),
            editedTime: new Date()
        };

        const result = await users.updateOne(
            { username },
            { $push: { publications: publication } }
        );

        if (result.modifiedCount > 0) {
            res.status(201).send('Content published successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error publishing content', error);
        res.status(500).send('Error publishing content');
    }
}