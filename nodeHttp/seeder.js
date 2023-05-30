const fs = require('fs');
const mongoose = require('mongose')
const dotenv = require('dotenv')

// Load env vars
dotenv.config({path: './config/config.env'})

// load models
const Bootcamp = require('./models/Bootcamp');

// connect to DB
mongoose.connect(process.env.MONGO_URI);

//Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

// import into DB
const importData = async ()=>{
    try{
        await Bootcamp.create(bootcamps);

        console.log('Data imported...')
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

// Delete Data
const deleteData = async ()=>{
    try{
        await Bootcamp.deleteMany();

        console.log('Data imported...')
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}





