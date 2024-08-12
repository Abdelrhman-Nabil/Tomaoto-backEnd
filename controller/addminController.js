const HttpError=require("../model/errorModal")
const AddminEmail=require("../model/schema/admin.Scema")
const getAllAdmin=async(req,res,next)=>{
    let addminEmails;
    try{
      addminEmails=AddminEmail.find({})
    }catch(err){
      const error=new HttpError("couldn't find the addmins emails.please try again",500);
    return next(error)
    }
    res.json({addminEmails:(await addminEmails).map(addminEmail=>addminEmail.toObject({getters:true}))})
};

const addAdmin=async(req,res,next)=>{
    const{email,time}=req.body
    const createEmail=new AddminEmail({email,time});
    
    try{
     await createEmail.save()
   }
   catch (err) {
     const error = new HttpError("create add Email filed, please try again.", 500);
     return next(error);
   }
   res.status(201).json({ email: createEmail });
};
const deleteAddmin=async(req,res,next)=>{
  const emailId = req.params.pid;
  let email;
  try{
      email=await AddminEmail.findByIdAndDelete(emailId);

  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete email.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted email.' });
}
exports.getAllAdmin=getAllAdmin;
exports.addAdmin=addAdmin;
exports.deleteAddmin=deleteAddmin;