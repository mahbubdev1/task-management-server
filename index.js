const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000;

const uri = "mongodb+srv://database-management:hSU2njyxtNMUqYNy@cluster0.jypts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const userCollection = client.db('task-management').collection('users')
        const taskCollection = client.db('task-management').collection('tasks')
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });

        // user related apis
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const isExist = await userCollection.findOne({ email: user?.email })
            if (isExist) {
                return res.status(409).send({ message: "User already exists." });
            }
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        // task related apis
        app.get('/tasks', async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result);
        });

        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Task Management Server running!')
})

app.listen(port, () => {
    console.log(`Task Management Server running on port ${port}`)
})
