const mongoose=require('mongoose')
const model=new mongoose.Schema({
    _id:{},
        userID:{},
        type:{},
        amount:{},
        category:{},
        status:{},
        // fraudScore(to be added later)
        createdAt:{},
        updatedAt:{}
})