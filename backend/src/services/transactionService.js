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

async function getAllTransactions(req,res){
    try{
        const resp=await Transactions.find()
        return res.status(200).json({
            message:"All transactions fetched successfully",
            Transactions:resp
        })
    }catch(err){
        return res.status(500).json({
            status:"Failed",
            error:err.message
        })
    }
}


class TransactionService{

    model
    postTrans
    getall

    

    constructor(model,post,getall){
        this.model=model
        this.postTrans=post
        this.getall=getall

    }
}

const tranSer=new TransactionService(Transactions,postTransaction,getAllTransactions)

module.exports={
    postTransaction:tranSer.postTrans,
    getAllTransactions:tranSer.getall
}