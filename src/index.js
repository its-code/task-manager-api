
const app = require('./app')

const port = process.env.PORT

app.listen(port,()=>{
    console.log("Running uo on the port: "+port)
})



// app.use((req,res,next)=>{
//     const meth = Object.keys(req.method)
//     const methods = ['GET','POST','PATCH','DELETE']
//     meth.forEach((method)=>{
//         return method.includes(methods)
//     })
//     if(meth){
//         res.status(503).send("Server is under maintenance!")
//     }
//     else{
//         next()
//     }
// })



// const user = require("./models/user")
// const task = require("./models/task")

// const main = async ()=>{
//     // const indtask = await task.findById('5fd713217919ec22bce3c6fa') 
//     // await indtask.populate('owner').execPopulate()
//     // console.log(indtask)
//     const induser = await user.findById('5fd712aa7919ec22bce3c6f7') 
//     await induser.populate('tasks').execPopulate()
// }

// main()