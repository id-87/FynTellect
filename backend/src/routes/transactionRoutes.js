const express=require('express')
const {postTransaction}=require('..//services/transactionService')
const router=express.Router()
const authMiddleware=require('../middleware/authMiddleware')
// router.post('/post',postTransaction)
// module.exports=router


class TransactionRoutes{
    router
    postTransaction

    constructor(router,postTransaction){
        this.router=router
        this.postTransaction=postTransaction
        this.router.post('/post',this.postTransaction)
    }
}

const transR=new TransactionRoutes(router,authMiddleware,postTransaction)
module.exports=transR.router