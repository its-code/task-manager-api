const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const courses = require('./courses')

const userSchema = mongoose.Schema({
  name:{
    type: String
  },
  email:{
    type: String,
    required: true,
    unique: true,
    validate(value){
      if(!validator.isEmail(value)){
          throw new Error('Email is invalid')
      }
    }    
  },
  password:{
      type: String,
      required: true,
      trim: true,
      validate(value){
          if(value.length<6){
          throw new Error('Error, Password is less than 6!')
          }
          else if(validator.contains(value,'password')){
          throw new Error('Error, Inavlid String!')    
          }
      }  
  },
  role:{
    type: String,
    required: true,
    trim: true,
   
  },
  age:{
    type: Number,
    default: 0
  },
  tokens:[{
     token:{
       type: String,
       required: true
     }
  }],
  avatar:{
    type: Buffer
  }
},{
  timestamps: true
}) 

userSchema.virtual('courses',{
  ref: 'Courses',
  localField: '_id',
  foreignField: 'owner'
})

// private user data
// toJSON give us data into string so we can maniuplate it
userSchema.methods.toJSON = function(){
  const user = this
  const userObject = user.toObject()
  
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

// generating tokens for user auth

userSchema.methods.generateAuthToken = async function(){
  const user = this 
  const token = jwt.sign({ _id: user._id.toString() },process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({token})

  await user.save()
  return token
}


// user login authentication

userSchema.statics.findByCredentials = async (email,password)=>{
  const user = await Users.findOne({email})

  if(!user){
    throw new Error("Unable to Log In")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch){
    throw new Error("Unable to Log In")
  }

  return user
}

// hashing the plain password
userSchema.pre('save', async function(next){

  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8)
  }

  next()
})

// Cascade Delete user and his tasks

userSchema.pre('remove', async function(next){
  const user = this

  await courses.deleteMany({ owner: user._id})

  next()
}) 


// Creating a User Model
const Users = mongoose.model('Users',userSchema)

module.exports = Users