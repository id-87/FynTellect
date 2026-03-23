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

async function getById(req,res){
    try{
        const transaction_id=req.params.id
        const resp=await Transactions.find({where:{_id:transaction_id}})
        return res.status(200).json({status:"success",transactions:resp})
    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            error:err.message
        })
    }
}


async function deleteById(req,res){
    try{
        const transaction_id=req.params.id
        const resp=await Transactions.delete({where:{_id:transaction_id}})
        return res.status(200).json({status:"Success",message:"Transaction deleted successfully"})
    }catch(err){
        return res.status(500).json({message:"Internal server error",error:err.message})
       }
}

class TransactionService{

    model
    postTrans
    getall
    getById
    deleteById

    

    constructor(model,post,getall,getById,deleteById){
        this.model=model
        this.postTrans=post
        this.getall=getall
        this.getById=getById
        this.deleteById=deleteById

    }
}

const tranSer=new TransactionService(Transactions,postTransaction,getAllTransactions,getById,deleteById)

module.exports={
    postTransaction:tranSer.postTrans,
    getAllTransactions:tranSer.getall,
    getById:tranSer.getById,
    deleteById:tranSer.deleteById
}