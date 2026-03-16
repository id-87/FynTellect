// const express=require('express')
const Transactions=require('../models/transactionModel')
async function postTransaction(req,res){
    try{
        const resp=await Transactions.create(req.user)
        return res.send("Transaction uploaded succesfully")
    }
    catch(err){
        console.log(err)
        return res.send("Some error occured")
    }
}


class TransactionService{

    model
    postTrans

    

    constructor(model,post){
        this.model=model
        this.postTrans=post

    }
}

const tranSer=new TransactionService(Transactions,postTransaction)

module.exports={
    postTransaction:tranSer.postTrans
}