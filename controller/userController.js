const { validationResult } = require('express-validator');
const HttpError=require("../model/errorModal")
const User = require("../model/schema/user.schema");
const Addmin=require("../model/schema/admin.Scema")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")

  
const signUp=async(req,res,next)=>{
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed ,please check your data", 422)
    );
  }
    const {name,email,password,address,image}=req.body;
    let existingUser;
    try{
      existingUser=await User.findOne({ email: email })
    }catch(err){
   const error = new HttpError("SignUp FAILED ,please try again later", 500);
      return next(error);
    }

    if (existingUser) {
      const error = new HttpError(
        "User exist already ,please login insted.",
        422
      );
      return next(error);
    }
    let hashPassword;
    try{
      hashPassword=await bcrypt.hash(password,12)
    }catch (err) {
      const error = new HttpError(
        'Could not create user, please try again.',
        500
      );
  
      return next(error);
    }
    const createUser=new User({
      name,email,password:hashPassword,address,image,orders:[]
    })

    try{
      await createUser.save();
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again.',
        500
      );
      return next(error);
    }
    let token;
    try{
      token=jwt.sign({userId:createUser.id ,email:createUser.email},process.env.DB_USER,{expiresIn:"1h"})

    }
  catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
    res.status(201).json({userId: createUser.id,address:createUser.address,email:createUser.email,token:token});

}
const logIn=async(req,res,next)=>{
  const { email, password } = req.body;
     console.log(email, password)
  let existingUser,existAddmin;
  try{
    existAddmin=await Addmin.findOne({email}) ||''
  }catch(err){}

  try{
    existingUser=await User.findOne({email})
  }catch(err){
    const error = new HttpError("sign In FAILED ,please try again later", 500);
    return next(error);
  }
  if(!existingUser){
    const error=new HttpError("Invalid credentials ,couldn't log in",400)
    return next(error)
  }
  let isValidPassword=false;

   try{
    isValidPassword=await bcrypt.compare(password,existingUser.password)
   }
   catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }
  let token;
  try{
    token=jwt.sign({userId:existingUser.id ,email:existingUser.email},process.env.DB_USER,{expiresIn:"1h"})
  }
  catch (err) {
    const error = new HttpError(
      'loging in  failed, please try again later.',
      500
    );
    return next(error);
  }
  const exist=existAddmin?true:false

  res.json({userId: existingUser.id,email:existingUser.email,token:token,addmin:exist})  
}
exports.signUp = signUp;
exports.logIn = logIn;
