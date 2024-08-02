const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const AddminSchema=new Schema({
    email:{type:String ,require:true, unique:true},
    time: {type:String,require:true},

}); 
module.exports=mongoose.model('Addmin',AddminSchema)