
const mongoose=require('mongoose')
const model=new mongoose.Schema({
    _id:{
        type:Number,
        require:true
    },
    userID:{
        type:Number,
        require:true,

    },
    category:{
        type:String,
        require:true
    },
    monthlyLimit:{
        type:Number,
        require:true
    },
    createdAt:{
        type:Number,
        require:true
    },
    updatedAt:{
        type:Number,
        require:true
    }
})