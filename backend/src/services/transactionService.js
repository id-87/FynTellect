// const express=require('express')
const Transactions=require('../models/transactionModel')
async function postTransaction(req,res){
    try{
        const {type,amount,category,status}=req.body
        const resp=await Transactions.create({
            user:req.user._id,
            type,amount,category,status
        })
        return res.status(200).json({message:"Transaction uploaded successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Some error occured"})
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