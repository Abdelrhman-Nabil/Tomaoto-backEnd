const HttpError = require("../model/errorModal");
const jwt=require("jsonwebtoken")

const CheckAuth=(req,res,next)=>{
    if(req.method==="OPTIONS"){
        return next()
    }
      try{
        const token=req.headers.authorization.split(' ')[1];

        if(!token){
                 throw new Error('Authentication Failed ',401)
        }
         const decodedToken=jwt.verify(token,process.env.DB_USER)
         req.userData={userId:decodedToken.userId};
         next();
      }catch(err){
        const error =new HttpError('Authentication Failed ',401);
        return next(error)
    }
}
module.exports=CheckAuth