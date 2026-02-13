const mongoose=require('mongoose')
const model=new mongoose.Schema({
    _id:{
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
            type:Number,
            required:true
        },
        updatedAt:{
            type:Number,
            required:true
        }
})