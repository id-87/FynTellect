// const express=require('express')
const Transactions=require('../models/transactionModel')
async function postTransaction(req,res){
    try{
        const resp=await postTransaction.create(req.body)
        return res.send("Transaction uploaded succesfully")
    }
    catch(err){
        console.log(err)
        return res.send("Some error occured")
    }
}

module.exports={
    postTransaction:postTransaction
}