const mongoose=require('mongoose')
const model=new mongoose.Schema({
    _id:{},
    userId:{},
    type:{},
    message:{},
    relatedTransactionID:{},
    isRead:{},
    createdAt:{}

})