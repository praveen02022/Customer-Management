const express = require('express');
const mongoose = require("mongoose")
const cors = require("cors")
const app = express();
const bodyParser = require('body-parser')
require('dotenv').config();

app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const PORT = 5000;
const uri = process.env.ATLAS_URI;



//moongoes connection
mongoose.connect(uri, { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

//routes
const coustomersRouter = require('./routes/customers');
app.use('/customer', coustomersRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
//https://medium.com/fbdevclagos/developing-basic-crud-operations-with-node-express-and-mongodb-e754acb9cc15