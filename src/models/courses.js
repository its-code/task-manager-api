const mongoose = require('mongoose')


const courseSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true  
  },
  discription:{
    type: String,
    required: true,
    trim: true
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  }
},{
  timestamps: true
})

//Creating a Task Model
const Courses = mongoose.model('Courses',courseSchema)

module.exports = Courses