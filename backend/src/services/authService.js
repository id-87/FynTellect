const express=require('express')
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
        if(password===resp.hashedPassword){
            return res.send("User logged in successfully")
        }
    }
    catch(err){
        console.log(err)
        return res.send("Login failed due to error:",err)
    }
    }


async function Signup(req,res){
    try{
        const resp=await User.create(req.body)
        res.send(resp)
    }
    catch(err){
        res.send(err)
    }
}
module.exports={
    Login:Login,
    Signup:Signup
}