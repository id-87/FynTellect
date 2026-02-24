const mongoose=require('mongoose')
const model=new mongoose.Schema({
    
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        type:{
            type:String,
            enum:['debit','credit'],
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        category:{
            type:String,
            enum:['marketing','development','testing','legal'],
            required:true
        },
        status:{
            type:String,
            enum:['failed','successful','pending'],
            required:true
        }
        // fraudScore(to be added later)
        
},{ timestamps: true })

const Transactions=new mongoose.model("Transactions",model)
module.exports=Transactions