// require('dotenv').config({path : './env'})

import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})


import connectDB from "./db/index.js";
import {app} from "./app.js";

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () =>{
        console.log(` Server is runnig at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("Mongo db connection failed !!! ",err);
})