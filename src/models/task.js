const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
  description:{
    type: String,
    required: true,
    trim: true  
  },
  completed:{
    type: Boolean,
    default: false
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
const Tasks = mongoose.model('Tasks',taskSchema)

module.exports = Tasks