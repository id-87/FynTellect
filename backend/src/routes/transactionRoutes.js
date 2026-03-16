const express=require('express')
const {postTransaction}=require('..//services/transactionService')
const router=express.Router()
const authMiddleware=require('../middleware/authMiddleware')
// router.post('/post',postTransaction)
// module.exports=router


class TransactionRoutes{
    router
    postTransaction
    mid

    constructor(router,mid,postTransaction){
        this.mid=mid
        this.router=router
        this.postTransaction=postTransaction
        this.router.post('/post',this.mid,this.postTransaction)
    }
}

const transR=new TransactionRoutes(router,authMiddleware,postTransaction)
module.exports=transR.router