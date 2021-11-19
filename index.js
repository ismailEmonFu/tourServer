const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// UN: tour-plan-db
// PW: Nzc1qDiVJeTwaYlc


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ozmv8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("location");
        const tourPlace = database.collection("locationDetail");
        const placedOrder = database.collection("orderPlaced");
        // const selectTourPlace = database.collection("userLocationSelection");

        // get api
        app.get('/locations', async (req, res) => {
            const allLocations = tourPlace.find({});
            const allLocationsArray = await allLocations.toArray();
            res.send(allLocationsArray);
        })

        // post api
        app.post('/location', async (req, res) => {
            const locationBody = req.body;
            // console.log('hit the post api: ', locationBody);

            const result = await tourPlace.insertOne(locationBody);
            res.json(result); //response in json format of result
        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send('Running PlanUtouR Server');
});

app.listen(port, () => {
    console.log("Running port ", port, " For Server");
});