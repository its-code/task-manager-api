const express =  require("express")
const router = express.Router()
const courses = require("../models/courses")
const auth = require("../middleware/auth")

// Routers for courses (HTTP Method : get,post,patch and delete)

router.post('/courses',auth,async (req,res)=>{  
    const course = new courses({
        ...req.body,
        owner: req.user._id
    })

    try{
       await course.save()
       res.status(201).send(course)
    }catch(e){
       res.status(500).send(e)
    }
})


// get courses?completed = true etc

router.get('/courses',auth,async (req,res)=>{

    const match = {}
    const sort = []

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }

    try{
        await req.user.populate({
            path: 'courses',
            match,
            option: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.courses)
        }catch(e){
            res.status(400).send(e)
        }
})

router.get('/course/:id',auth,async (req,res)=>{
    
    const _id = req.params.id


    try{
        // const courseID= await courses.findById(_id)
        const courseID = await courses.findOne({ _id , 'owner': req.user._id})      
        console.log(courseID)    
        if(!courseID){
          return res.status(404).send()
        }
        res.send(courseID)
  
      }catch(e){
          res.status(400).send(e)
      }
})

router.patch('/courses/:id',auth,async (req,res)=>{
    
    const updates = Object.keys(req.body) 
    const propertiesCourse = ['name','discription']
    const isValid = updates.every( update => propertiesCourse.includes(update))

    if(!isValid)
        return res.status(400).send()

    try{

      const courseUp = await courses.findOne({_id: req.params.id, owner: req.user._id})  
    //   const courseUp = await courses.findByIdAndUpdate(req.params.id, req.body , { new:true, runValidators: true})
      if(!courseUp){
         return res.status(404).send()
      }
      updates.forEach( update => courseUp[update] = req.body[update] )

      await courseUp.save()
      res.send(courseUp)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/courses/:id',auth, async (req,res)=>{
    try{
        const delCourse = await courses.findOneAndDelete({ _id:req.params.id, owner: req.user._id })
        if(!delCourse){
            return res.status(404).send()
        } 
        res.send(delCourse)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router