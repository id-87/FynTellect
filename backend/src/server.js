const express=require('express')
const app=express()
app.use(express.json())
app.get('/health',(req,res)=>{
    res.send("SErver running healthy")
})

app.listen(process.env.PORT || 4000,()=>{
    console.log("Server is running")
})