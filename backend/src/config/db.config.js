const mongoose=require('mongoose')

dbConnect=async ()=>{
    try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("DB connected")}
    catch(err){
        console.log("Error:",err)
    }

}

module.exports=dbConnect
