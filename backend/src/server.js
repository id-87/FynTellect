const express=require('express')
let app=express()
app.get('/health',(req,res)=>{
    res.send("Healthy")
})

app.get('/',(req,res)=>{
    res.send("Welcome to fintellect")
})

app.listen(3000,()=>{
    console.log("Server is running")
})