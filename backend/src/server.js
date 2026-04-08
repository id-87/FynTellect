const express=require('express')
const app=express()
// app.use(express.json())
// require('dotenv').config()
const authRoutes = require('./routes/authRoutes')
const transactionRoutes=require('./routes/transactionRoutes')
const aaRoutes=require('./routes/aaRoutes')
const connectDB = require('./config/db.config')


const PORT = process.env.PORT || 4000
const cors=require('cors')

// app.use(cors())

// connectDB()

// app.get('/health',(req,res)=>{
//     res.send("Server running healthy")
// })


// app.use('/auth',authRoutes)
// app.use('/transaction',transactionRoutes)

// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`)
// })



class Server{
    express
    app
    authRoutes
    transactionRoutes
    port
    cors
    aaRoutes

    cb(){
        console.log(`Server is running on ${this.port}`)
    }

    testRoute(){
        this.app.get('/',(req,res)=>{
            res.send("Welcome")
        })
    }


    healthRoute(){
        this.app.get('/health',(req,res)=>{
            res.send("Server running healthy")
})

    }

    authRoute(){
        this.app.use('/auth',this.authRoutes)
    }

    transactionRoute(){
        this.app.use('/transaction',this.transactionRoutes)
    }
    aaRoute(){
        this.app.use('/aa',this.aaRoutes)
    }


    startServer(){
        this.app.listen(this.port,()=>{
            this.cb()
        })
    }

    
    constructor(exp,authR,transR,cors,port,aaRoutes){
        require('dotenv').config()
        connectDB()

        this.express=exp
        this.cors=cors
        this.aaRoutes=aaRoutes
        this.app=this.express()
        this.app.use(this.express.json())
        this.port=port
        this.authRoutes=authR
        this.transactionRoutes=transR
        this.app.use(this.cors())
    }

}

const server=new Server(express,authRoutes,transactionRoutes,cors,PORT,aaRoutes)
server.startServer()
server.testRoute()
server.healthRoute()
server.authRoute()
server.transactionRoute()
server.aaRoute()