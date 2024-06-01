import { users } from "../index.mjs";
import { ObjectId } from "mongodb";

export const updatePublish = async (req,res) => {
    const { id } = req.params;
    const { username, image, description } = req.body;

    if (!username || !image || !description) {
        return res.status(400).send('Username, image, and description are required');
    }

    try {
        const publicationId = new ObjectId(id);
        const updatedPublication = {
            "publications.$.image": image,
            "publications.$.description": description,
            "publications.$.editedTime": new Date()
        };

        const result = await users.updateOne(
            { username, "publications._id": publicationId },
            { $set: updatedPublication }
        );

        if (result.modifiedCount > 0) {
            res.status(200).send('Publication updated successfully');
        } else {
            res.status(404).send('Publication not found');
        }
    } catch (error) {
        console.error('Error updating publication', error);
        res.status(500).send('Error updating publication');
    }
}