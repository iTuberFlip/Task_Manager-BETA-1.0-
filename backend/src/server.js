
require("dotenv").config()
const express=require("express")
const cors=require("cors")
const http=require("http")
const {Server}=require("socket.io")
const authRoutes=require("./routes/authRoutes")
const taskRoutes=require("./routes/taskRoutes")
const taskSocket=require("./sockets/taskSocket")

const app=express()
const server=http.createServer(app)
const io=new Server(server,{cors:{origin:"*"}})

app.use((req,res,next)=>{req.io=io;next()})
app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/tasks",taskRoutes)

taskSocket(io)

server.listen(process.env.PORT||3000,()=>{
 console.log("Server running")
})
