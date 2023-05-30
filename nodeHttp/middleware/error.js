const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, res, req, next)=>{

let error = {...err}

error.message = error.message

// log to the console for dev
console.log(err);

// castError is an error related to a wrong ID. i.e when a wrong ID is passed it returns castError

// Mongoose bad objects
if (err.name=== 'castError'){
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404)
}

// Mongoose duplicate key 
if(err.code === 11000){
    const message ="Duplicate field value entered"
    error = new ErrorResponse(message, 400)
}

if(er.name === "ValidationError"){
    const message = Object.values(err.error).map(val => val.message)
    error = new ErrorResponse(message,400);
}

res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
});
}

module.exports = errorHandler