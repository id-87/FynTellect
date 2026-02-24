const { timeStamp } = require('console')
const mongoose=require('mongoose')
const model=new mongoose.Schema({
    // _id:{
    //     type:Number,
    //     require:true
    // },
    name:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true,
        unique: true 
        
    },
    hashedPassword:{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        require:true
    },
    organisation:{
        type:String,
        require:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User=mongoose.model("User",model)
module.exports=User