const express=require('express')
const {postTransaction}=require('..//services/transactionService')
const {getAllTransactions}=require('..//services/transactionService')
const {getById}=require('..//services/transactionService')
const {deleteById}=require('..//services/transactionService')
const {update}=require('..//services/transactionService')
const router=express.Router()
const authMiddleware=require('../middleware/authMiddleware')
// router.post('/post',postTransaction)
// module.exports=router


class TransactionRoutes{
    router
    postTransaction
    mid
    getAllTransactions
    getById
    deleteById
    update

    constructor(router,mid,postTransaction,getAllTransactions,getById,deleteById,update){
        this.mid=mid
        this.router=router
        this.postTransaction=postTransaction
        this.getAllTransactions=getAllTransactions
        this.getById=getById
        this.deleteById=deleteById
        this.update=update
        this.router.post('/post',this.mid,this.postTransaction)
        this.router.get('/get',this.mid,this.getAllTransactions)
        this.router.get('/get/:id',this.mid,this.getById)
        this.router.delete('/delete/:id',this.mid,this.deleteById)
        this.router.put('/update/:id',this.mid,this.update)
        // this.router.post('/post',this.mid,this.postTransaction)
    }
}

const transR=new TransactionRoutes(router,authMiddleware,postTransaction,getAllTransactions,getById,deleteById,update)
module.exports=transR.router