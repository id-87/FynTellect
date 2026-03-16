const express=require('express')
const User=require('../models/userModel')
const bcrypt=require('bcrypt')
require('dotenv').config()
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
            return res.status(401).json({message:"User not found"})
        }
        const match=await bcrypt.compare(password,resp.password)
        if(match){
            const token=jwt.sign({_id:resp._id},JWT_SECRET,{expiresIn:"6h"})
            // res.cookie("access_token",token)
            return res.status(200).json({token:token,message:"User loogged in succesfully"})
        }
        else{
            return res.status(401).json({message:"Incorrect password"})
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({mesage:"Internal Server Error"})
    }
    }


async function Signup(req,res){
    const {name,username,password,role,organisation}=req.body
    if (!name||!username||!password||!role||!organisation){
        return res.status(400).json({message:"Please fill in all required fields"})
    }
    try{
        let hashedPassword=await bcrypt.hash(password,10)
        const resp=await User.create({name,username,password:hashedPassword,role,organisation})
        res.status(200).json({message:"User created sucessfully"})
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
}



class AuthService{
    model
    login
    signup


    constructor(mod,log,sign){
        this.model=mod
        this.login=log
        this.signup=sign

    }

}

const authSer=new AuthService(User,Login,Signup)

module.exports={
    Login:authSer.login,
    Signup:authSer.signup
}