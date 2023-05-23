const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r1co4vf.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

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
    // Connect the client to the server	(optional starting in v4.7)

    const database = client.db("toysDB");
    const toyCollection = database.collection("toys");

    app.get('/toys',async(req, res) => {
        const cursor = toyCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/toys', async(req, res) => {
        const toy= req.body;
        console.log(toy);
        const result = await toyCollection.insertOne(toy);
        res.send(result);
    })

    app.delete('/toys/:id', async(req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = {_id: new ObjectId(id)}
        const result = await toyCollection.deleteOne(query);
        res.send(result);
    })

    app.put('/toys/:id', async(req, res) =>{
        const id = req.params.id;
        const toy = req.body;
        console.log(id, toy);
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updatedUser = {
            $set: {
                price: toy.price ,
                quantity: toy.quantity,
                details: toy.details
            }
        }
        const result = await toyCollection.updateOne(filter, updatedUser, options);
        res.send(result)
    })


    app.get('/toys/:id', async(req, res) =>{
        const id = req.params.id;
        console.log(id);
        const query = {_id: new ObjectId(id)}
        const toy = await toyCollection.findOne(query);
        res.send(toy);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// start getting data

app.get("/", (req, res) => {
	res.send("Princess Palette Server is running!");
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
