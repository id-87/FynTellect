const { timeStamp } = require('console')
const mongoose=require('mongoose')
const model=new mongoose.Schema({
    // _id:{
    //     type:Number,
    //     require:true
    // },
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique: true 
        
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        required:true
    },
    organisation:{
        type:String,
        required:true
    }
},{ timestamps: true })

const User=mongoose.model("User",model)
module.exports=User