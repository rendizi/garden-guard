import { users } from "../index.mjs";
import crypto from "crypto"

export const login = async (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');

        const user = await users.findOne({ username });

        if (user && user.password === hashedPassword) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in user', error);
        res.status(500).send('Error logging in user');
    }
}