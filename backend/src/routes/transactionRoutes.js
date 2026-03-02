const express=require('express')
const {postTransaction}=require('..//services/transactionService')
const router=express.Router()
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

const transR=new TransactionRoutes(router,postTransaction)
module.exports=transR.router