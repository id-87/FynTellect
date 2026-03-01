const express=require('express')
const User=require('../models/userModel')
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")
const JWT_SECRET=process.env.JWT_SECRET

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
        const match=bcrypt.compare(password,resp.hashedPassword)
        if(match){
            const token=jwt.sign({username},JWT_SECRET)
            res.cookie("access token",token)
            return res.send("User logged in successfully")
        }
    }
    catch(err){
        console.log(err)
        return res.send("Login failed due to error:",err)
    }
    }


async function Signup(req,res){
    const {name,username,password,role,organisation}=req.body
    if (!name||!username||!password||!role||!organisation){
        return res.send("Please fill all required fields")
    }
    try{
        let hashedPassword=await bcrypt.hash(password,10)
        const resp=await User.create({name,username,password:hashedPassword,role,organisation})
        res.send("User created successfully")
    }
    catch(err){
        res.send(err)
    }
}
module.exports={
    Login:Login,
    Signup:Signup
}