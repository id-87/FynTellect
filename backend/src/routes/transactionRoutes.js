const express=require('express')
const {postTransaction}=require('..//services/transactionService')
const router=express.Router()
router.post('/post',postTransaction)
module.exports=router