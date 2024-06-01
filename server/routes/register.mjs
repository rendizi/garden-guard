import { users } from "../index.mjs";
import crypto from "crypto"

export const register = async (req,res) => {
        const { username, password } = req.body;
    
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
    
        try {
            const hash = crypto.createHash('sha256');
            hash.update(password);
            const hashedPassword = hash.digest('hex');  
            const user = { username, password: hashedPassword }; 
            const result = await users.insertOne(user);
    
            if (result.acknowledged) {
                res.status(201).send({message: 'User registered successfully'});
            } else {
                res.status(500).send({message:'Error registering user'});
            }
        } catch (error) {
            res.status(500).send({message: 'Error registering user'});
        }
}