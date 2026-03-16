const jwt=require("jsonwebtoken")
require("dotenv").config
function authMiddleware(req,res,next){
    try{
        authHeaders=req.headers.authorisation;
        if(!authHeaders||authHeaders.startsWith("Bearer")){
            return res.status(401).json({
                success:false,
                message:"No token found"            })
        }
        const token=authHeaders.split(" ")[1]
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:err.message
        })
    }

}

export default authMiddleware