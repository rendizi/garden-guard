import express from "express"
import dotenv from "dotenv"
import { MongoClient } from "mongodb";
import cors from "cors"

import { register } from "./routes/register.mjs";
import { login } from "./routes/login.mjs";
import { publish } from "./routes/publish.mjs";
import { profile } from "./routes/profile.mjs";
import { updatePublish } from "./routes/updatePublish.mjs";
import bodyParser from "body-parser"; // Import body-parser

dotenv.config()

export let users;

async function connectToMongoDB() {
    try {
      const client = new MongoClient(process.env.MONGO_DB_URL);
      await client.connect();
      const database = client.db(process.env.DB_NAME);
      
      users = database.collection("users");
 
      console.log('Successfully connected to MongoDB and inited collections');
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
      throw error;
    }
}

await connectToMongoDB()

const app = express()
app.use(cors())
app.use(express.json({limit: '50mb'}));
const port = process.env.PORT 
if (port===undefined){
    port = 4000
}

app.post('/register', register)
app.post('/login', login)
app.post('/publish', publish)
app.get('/profile', profile)
app.put('/publish/:id', updatePublish)

app.get('/', (req, res) => {
  res.send({message:"server is alive"})
})

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})