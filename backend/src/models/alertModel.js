const mongoose=require('mongoose')
const model=new mongoose.Schema({
    _id:{
        type:Number,
        require:true
    },
    userId:{
        type:Number,
        require:true
    },
    type:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    },
    relatedTransactionID:{
        type:Number,
        require:true
    },
    isRead:{
        type:Boolean,
        require:true
    },
    createdAt:{
        type:Number,
        require:true
    }

})