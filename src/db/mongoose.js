const mongoose = require('mongoose')

// Connecting Mongoose to MongoDB and also specify the Database Name
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})





