const express = require('express');
const app = express();
const cors = require('cors');

// const ObjectId = require('mongodb').ObjectId;
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const port =process.env.PORT || 5000
// console.log(process.env.DB_NAME);

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello fresh valley!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggzrw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    console.log("error",err);
  const productCollection = client.db("freshValley").collection("products");
  const ordersCollection = client.db("freshValley").collection("orders");
  

  app.get('/products',(req,res)=>{
    productCollection.find()
    .toArray((err,items) =>{
      res.send(items)
      console.log('from data base',items);
    })
  })
  app.delete('/delete/:id', (req, res) => {
    const id = ObjectId (req.params.id);
    console.log('deleted id', id)
    productCollection.findOneAndDelete({_id: id})
    .then(result => 
        {result.deletedCount > 0})
        
})

  app.get ('/product/:id',(req,res)=>{
    console.log(req.params.id);
    productCollection.find({_id: ObjectId (req.params.id)})

    .toArray((err,items)=>{
      res.send(items[0])
      console.log(items);
      console.log(err) 
    })
  })

  app.get('/checkOut/:id',(req,res) => { 
    productCollection.find({})
    .toArray((err,items)=>{
      res.send(items)
      console.log(items)
    })
  })
 
  app.post('/addProduct',(req,res) =>{
      const newProduct =req.body;
      console.log('added new product', newProduct)
      productCollection.insertOne(newProduct)
      .then(result =>{
        console.log('insertedCount',result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addOrders',(req, res) =>{
    const newProduct =req.body;
    console.log('added new product', newProduct)
    ordersCollection.insertOne(newProduct)
    .then(result =>{
      console.log('insertedCount',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
})

app.get('/order', (req, res) => {
  const queryEmail = req.query.email;
  ordersCollection.find({email: queryEmail})
  .toArray((err, documents) => {
    res.send(documents)
    console.log(documents)
    console.log(err);
  })
})
  
});



app.listen(process.env.PORT || port);