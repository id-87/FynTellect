const express=require('express')
const router=express.Router()
const {Login}=require('../services/authService')
const {Signup}=require('../services/authService')
router.post('/login',Login)
router.post('/signup',Signup)
// router.post('/signup', (req, res) => {
//     console.log("Signup route hit");
//     res.json({ message: "Signup working" });
// });
module.exports=router