const express=require('expresss')
const User=require('../models/userModel')

async function Login(req,res){
    const {username,password}=req.body
    try{
    if(!username||!password){
        return res.send("Invalid or missing credentials")
    }
        const resp=await User.findOne({username:username})
        if(!resp){
            return res.send("User not found")
        }
        if(password=resp.hashedPassword){
            // assign and send jwt token
        }
    }
    catch(err){
        return res.send("Login failed due to error:",err)
    }
    }

