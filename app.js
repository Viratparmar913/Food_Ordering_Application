const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')

const apiRouter = require('./routes/router');

const port = 5000;
const app = express();


app.use(bodyparser.json());
app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api',apiRouter);

app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build'));
});


mongoose.connect(
    'mongodb+srv://Shrey_Srivastava:Edureka2611@cluster0.0d9at.mongodb.net/Zomato',
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(success => {
   
    console.log('connected to MongoDb');
    app.listen(port, () => {

        console.log(`server is running at: ${port}`)
    });
}).catch(error => {
    console.log(error);
});
