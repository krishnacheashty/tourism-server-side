const express=require("express");
const { MongoClient } = require('mongodb');
const cors=require('cors')
const ObjectId=require('mongodb').ObjectId;



const app=express();




/* for dotenv */
require('dotenv').config()

/* middle cors */

app.use(cors());
app.use(express.json());

port=process.env.PORT||5000;

/* for connection to database */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2rqzc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
    try{
        await client.connect()
        console.log("connected successfully")

        const database=client.db("blueSea");
        const serviceCollection = database.collection("services");
        const orderCollection=database.collection("orders")

        
        /* get all api */
        app.get('/services',async(req,res)=>{
            const query={}
            const cursor=serviceCollection.find(query)
            const service=await cursor.toArray();
            res.json(service);
        })

        /* get a single data for order place */
        app.get('/services/:id',async(req,res)=>{
            const id=req.params.id
            // console.log("hitting suceess",id)
            const query={_id:ObjectId(id)}
            const service=await serviceCollection.findOne(query)
            res.json(service)
        })
        /* put save data in database */
        app.post('/order',async(req,res)=>{
            const myOrder=req.body
            // console.log("our data",myOrder)
            const result=await orderCollection.insertOne(myOrder)
            res.json(result);
        })

        /* my all oder get here */
        app.get('/order',async(req,res)=>{
            const query={};
            const cursor=orderCollection.find(query)
            const event=await cursor.toArray()
            res.json(event)

        })

        /* delete my order */
        app.delete('/order/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const order=await orderCollection.deleteOne(query)
            console.log("deleted count",order)
            res.json(order)

        })
        /* update events */
        app.post('/services',async(req,res)=>{
            const event=req.body
            // console.log(event)
            const cursor=await serviceCollection.insertOne(event)
            res.json(cursor);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("server is running")
})
app.listen(port,()=>{
    console.log('server is running',port)
})