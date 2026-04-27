const mongoose = require('mongoose');

const dbConfig = () => {
    mongoose.connect(process.env.MONGODB_URL).then(()=> {
        console.log("Database conected");
        
    })
}

module.exports = dbConfig;