require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const users_routes = require("./src/routes/auth")
const users_data = require("./src/routes/user")
const connectDB = require("./src/db/connect");
const responseService= require("./src/services/response")

const app = express()
const PORT = process.env.PORT||5000;


app.use(cors());
app.use(bodyParser.json());
app.use(responseService)
app.get("/",(req,res)=>{
    const randomString = Math.random().toString(36).substring(7);
res.send("abhi");
})

app.use("/api/users", users_routes)
app.use("/api/userdata", users_data)

const start = async () =>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT,()=>{
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    }
    catch(error){
        console.log(error)
    }
}
start()