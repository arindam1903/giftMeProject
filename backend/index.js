const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const uri =
  "";        // paste secret key here --------------

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function createCollection(collectionName) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const adminDb = client.db("userdetails");
    await adminDb.command({ create: collectionName });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// createCollection('users').catch(console.dir);

// Function to insert data into a collection
async function insertData(data) {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Access the database
    const database = client.db("userdetails");

    // Access the collection
    const collection = database.collection("users");

    // Insert a single document
    return await collection.insertOne(data);

    console.log("Data inserted successfully:");
    // console.log(insertResult, insertResult.ops);
  } finally {
    // Close the connection
    await client.close();
  }
}
// Function to insert data into a collection
async function checkForUser(email) {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Access the database
    const database = client.db("userdetails");

    // Access the collection
    const collection = database.collection("users");

    // Insert a single document
    return await collection.find({ emailId: email }).toArray();
  } catch {
    // Close the connection
    await client.close();
  }
}

// Call the function to insert data
const data = { emailId: "test", password: "testpass" };
// insertData(data).catch(console.error);

app.post("/login", async (req, res) => {
  // console.log(req.body)
  let user = await checkForUser(req.body.emailId);

  // console.log({password: user[0].password})
  if (user && user[0] && user[0].password) {
    if (user[0].password === req.body.password) {
      res.send({ message: "log in" });
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(404);
  }
});
app.post("/signup", async (req, res) => {
  let user = await checkForUser(req.body.emailId);
  // console.log(req.body)
  debugger;
  if (!user || !user[0]) {
    insertData(req.body)
      .then((data) => res.send({ email: data.emailId }))
      .catch(console.error);
  } else {
    res.sendStatus(404);
  }

  // console.log({password: user[0].password})
});

app.listen(3001, () => {
  //   console.log(`Example app listening on port 3001`)
});
