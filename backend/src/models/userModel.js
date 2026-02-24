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
        require:true
    },
    organisation:{
        type:String,
        require:true
    },
    createdAt:{
        type:Number,
        require:true
    }
})

const User=mongoose.model("User",model)
module.exports=User