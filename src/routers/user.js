const express = require('express')
const auth = require('../middleware/auth')
const user = require("../models/user")
const sharp = require('sharp')
const router = new express.Router() 
const multer = require('multer')


// Routers for tasks (HTTP Method : post,get,patch and delete)

router.post('/users',async (req,res)=>{  
    const me = new user(req.body)
    try{
      await me.save()
      const token = await me.generateAuthToken()
      res.status(201).send({me,token})  
    }catch(e){
      res.status(500).send(e)  
    }
})

router.post('/users/login',async (req,res) =>{
    try{
        const userAuth = await user.findByCredentials(req.body.email,req.body.password)
        const token = await userAuth.generateAuthToken()

        res.send({userAuth, token})
    }catch(e){
        res.status(400).send(e)
    }    
})

router.post('/users/logout', auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token) 
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutall', auth, async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/users/me', auth,async (req,res)=>{

    res.send(req.user)
    // try{
    // const userFind= await user.find({})

    // if(!userFind){
    //     return res.status(404).send()
    // }
    // res.send(userFind)
    // }catch(e){
    //     res.status(400).send(e)
    // }
})


router.get('/users/:id',async (req,res)=>{
    
    try{
      const _id = req.params.id
      const userID= await user.findById(_id)
        
      if(!userID){
        return res.status(404).send()
      }
      res.send(userID)

    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/users/me', auth ,async (req,res)=>{
    
    const updates = Object.keys(req.body) 
    const propertiesUsers = ['name','email','password','age']
    const isValid = updates.every( update => propertiesUsers.includes(update))

    if(!isValid)
        return res.status(400).send()

    try{
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })

      await req.user.save()  
      res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth ,async (req,res)=>{
    try{
        await req.user.remove()
        //sendFairwellEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload the image file only!"))
        }

        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req,res)=>{
    try {
        const userImage = await user.findById(req.params.id)
        
        if(!userImage || !userImage.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/jpg')
        res.send(userImage.avatar)
    } catch (e) {
        res.status(404).send(e)        
    }
})


module.exports = router