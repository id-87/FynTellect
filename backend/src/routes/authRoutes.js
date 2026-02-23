const express=require('express')
const router=express.Router()
const {Login}=require('../services/authService')
const {Signup}=require('../services/authService')
router.post('/login',Login)
router.post('/signup',Signup)
module.exports=router