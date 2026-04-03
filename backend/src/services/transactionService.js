// const express=require('express')
const User=require('../models/userModel')
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
        console.log("USER DATA:", req.user)

        if(req.user.role === 'admin'){

            const users = await User.find({
                organisation: req.user.organisation
            })

            const userIds = users.map(u => u._id)

            const resp = await Transactions.find({
                user: { $in: userIds }
            }).populate('user','name username')

            return res.status(200).json({
                message:"Organisation transactions fetched",
                Transactions:resp
            })

        }

        else{

            const resp = await Transactions.find({
                user:req.user._id
            })

            return res.status(200).json({
                message:"User transactions fetched",
                Transactions:resp
            })

        }

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
        const resp=await Transactions.findById(transaction_id)
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

        const transaction = await Transactions.findById(req.params.id)

        if(!transaction){
            return res.status(404).json({message:"Not found"})
        }

        if(req.user.role !== 'admin'){
            if(transaction.user.toString() !== req.user._id.toString()){
                return res.status(403).json({message:"Unauthorized"})
            }
        }

        await Transactions.findByIdAndDelete(req.params.id)

        return res.status(200).json({
            message:"Transaction deleted"
        })

    }catch(err){
        return res.status(500).json({
            message:"Internal server error",
            error:err.message
        })
    }
}
async function update(req,res){
    try{

        const transaction = await Transactions.findById(req.params.id)

        if(!transaction){
            return res.status(404).json({message:"Not found"})
        }

        if(req.user.role !== 'admin'){
            if(transaction.user.toString() !== req.user._id.toString()){
                return res.status(403).json({message:"Unauthorized"})
            }
        }

        const resp = await Transactions.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        )

        return res.status(200).json({
            status:"Success",
            message:"Transaction updated successfully",
            transaction:resp
        })

    }catch(err){
        return res.status(500).json({
            message:"Internal server error",
            error:err.message
        })
    }
}

class TransactionService{

    model
    postTrans
    getall
    getById
    deleteById
    upd

    

    constructor(model,post,getall,getById,deleteById,upd){
        this.model=model
        this.postTrans=post
        this.getall=getall
        this.getById=getById
        this.deleteById=deleteById
        this.upd=upd

    }
}

const tranSer=new TransactionService(Transactions,postTransaction,getAllTransactions,getById,deleteById,update)

module.exports={
    postTransaction:tranSer.postTrans,
    getAllTransactions:tranSer.getall,
    getById:tranSer.getById,
    deleteById:tranSer.deleteById,
    update:tranSer.upd
}