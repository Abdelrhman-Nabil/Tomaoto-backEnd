const mongoose=require("mongoose");

const Schema=mongoose.Schema;
const uniqueValidator=require("mongoose-unique-validator")

const ProductSchema=new Schema({
    title:{type:String,require:true},
    category:{type:String , require:true},
    price:{type:String ,require:true},
    details:{type:String ,require:true},
    image:{type:String ,require:true},

});
ProductSchema.plugin(uniqueValidator)
module.exports=mongoose.model('Product',ProductSchema)