const mongoose=require('mongoose')
const model=new mongoose.Schema({
    transactionID:{
        type:Number,
        required:true
    },
        userID:{
            type:Number,
            required:true,
        },
        type:{
            type:String,
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        },
        // fraudScore(to be added later)
        createdAt:{
            type:Date,
            default:Date.now
        }
})

const Transactions=new mongoose.model("Transactions",model)
module.exports=Transactions