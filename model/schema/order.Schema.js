const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const OrdersSchema=new Schema({
    fullName:{type:String ,require:true},
    email:{type:String ,require:true, unique:true},
    address:{type:String ,require:true},
    total:{type:Number ,require:true},
    products:[{type:Array ,require:true}],
    action:{type:String ,require:true},
    phoneNumber:{type:String ,require:true},
    creator:{type:mongoose.Types.ObjectId ,require:true, ref:'User'},

}); 
module.exports=mongoose.model('Orders',OrdersSchema)
