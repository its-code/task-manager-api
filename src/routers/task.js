const express =  require("express")
const router = express.Router()
const tasks = require("../models/task")
const auth = require("../middleware/auth")

// Routers for tasks (HTTP Method : get,post,patch and delete)

router.post('/tasks',auth,async (req,res)=>{  
    const task = new tasks({
        ...req.body,
        owner: req.user._id
    })

    try{
       await task.save()
       res.status(201).send(task)
    }catch(e){
       res.status(500).send(e)
    }
})


// get tasks?completed = true etc

router.get('/tasks',auth,async (req,res)=>{

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
            path: 'tasks',
            match,
            option: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
        }catch(e){
            res.status(400).send(e)
        }
})

router.get('/task/:id',auth,async (req,res)=>{
    
    const _id = req.params.id


    try{
        // const taskID= await tasks.findById(_id)
        const taskID = await tasks.findOne({ _id , 'owner': req.user._id})      
        console.log(taskID)    
        if(!taskID){
          return res.status(404).send()
        }
        res.send(taskID)
  
      }catch(e){
          res.status(400).send(e)
      }
})

router.patch('/tasks/:id',auth,async (req,res)=>{
    
    const updates = Object.keys(req.body) 
    const propertiesTask = ['description','completed']
    const isValid = updates.every( update => propertiesTask.includes(update))

    if(!isValid)
        return res.status(400).send()

    try{

      const taskUp = await tasks.findOne({_id: req.params.id, owner: req.user._id})  
    //   const taskUp = await tasks.findByIdAndUpdate(req.params.id, req.body , { new:true, runValidators: true})
      if(!taskUp){
         return res.status(404).send()
      }
      updates.forEach( update => taskUp[update] = req.body[update] )

      await taskUp.save()
      res.send(taskUp)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth, async (req,res)=>{
    try{
        const delTask = await tasks.findOneAndDelete({ _id:req.params.id, owner: req.user._id })
        if(!delTask){
            return res.status(404).send()
        } 
        res.send(delTask)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router