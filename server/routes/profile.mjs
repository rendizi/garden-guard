import { users } from "../index.mjs";

export const profile = async (req,res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const user = await users.findOne(
            { username },
            { projection: { password: 0 } }
        );

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user profile', error);
        res.status(500).send('Error fetching user profile');
    }
}