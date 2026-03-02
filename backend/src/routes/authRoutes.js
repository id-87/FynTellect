const express=require('express')
const router=express.Router()
const {Login}=require('../services/authService')
const {Signup}=require('../services/authService')
// router.post('/login',Login)
// router.post('/signup',Signup)
// router.post('/signup', (req, res) => {
//     console.log("Signup route hit");
//     res.json({ message: "Signup working" });
// });
// module.exports=router


class AuthRoutes{
    router
    login
    signup

    constructor(router,login,signup){
        this.router=router
        this.login=login
        this.signup=signup
        // register handlers without invoking them; express will call with (req,res)
        this.router.post('/login', this.login)
        this.router.post('/signup', this.signup)
    }


}


const authR=new AuthRoutes(router,Login,Signup)
module.exports=authR.router
