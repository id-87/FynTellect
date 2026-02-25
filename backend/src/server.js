const express=require('express')
const app=express()
app.use(express.json())
require('dotenv').config()
const authRoutes = require('./routes/authRoutes')
const transactionRoutes=require('./routes/transactionRoutes')
const connectDB = require('./config/db.config')
const PORT = process.env.PORT || 4000


connectDB()

app.get('/health',(req,res)=>{
    res.send("Server running healthy")
})


app.use('/auth',authRoutes)
app.use('/transaction',transactionRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})