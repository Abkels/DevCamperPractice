const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbConfig = require("./config/db")
// Route files
const router = require('./routes/bootcamps');
const errorHandler = require('./middleware/error')

const PORT = process.env.PORT || 5000;
const app = express ();

app.use(express.json());
// load env vars
dotenv.config({path: './config/config.env'});

// connect to database
dbConfig();

// Dev logging middleware
// if(process.env.NODE_ENV === "development"){
//     app.use(morgan("dev"));
// }

// mount routers
app.use('/api/v1/bootcamps',router)
app.use(errorHandlern)
 
const server = app.listen(PORT,()=>{
    console.log(`server running in ${process.env.NODE_ENV} MODE ON PORT ${PORT}`)
});

process.on('uncaughtException',(error, promise)=>{
    console.log(`Error: ${error.message}`);
    // close server and exit
    server.close(()=> process.exit(1));
})

process.on('unhandledRejection',(error, promise)=>{
    console.log(`Error: ${error.message}`);
    // close server and exit
    server.close(()=> process.exit(1));
});
