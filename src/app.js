const express = require("express")
require("./db/mongoose")
const userRouter = require("./routers/user")
const courseRouter = require("./routers/courses")

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(courseRouter)

module.exports = app


