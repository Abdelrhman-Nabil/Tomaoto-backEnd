const mongoose=require('mongoose')
const HttpError=require('../model/errorModal')
const Orders=require("../model/schema/order.Schema")
const User=require("../model/schema/user.schema")
const { validationResult } = require("express-validator");

const getOrderByUserId=async(req,res,next)=>{
    const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed ,please check your data", 422)
    );
  }
  const userId = req.params.uid;
  let orderWithUser;
  try{
    orderWithUser=await User.findById(userId).populate('orders');
  }
  catch (err) {
    const error = new HttpError(
      "Fetching Orders failed ,please try again later",
      500
    );
    return next(error);
  }
  if (!orderWithUser || orderWithUser.orders.length === 0) {
    return next(
      new HttpError("Couldn't find a orders for the previos product ID", 404)
    );
  }
  res.json({
    orders: orderWithUser.orders.map((order) => order.toObject({ getters: true })),
  });
}
const getAllOrder=async(req,res,next)=>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed ,please check your data", 422)
      );
    }
    let orders;
    try{
      orders=Orders.find({})
    }catch(err){
      const error=new HttpError("couldn't find the orders.please try again",500);
    return next(error)
    }
    res.json({orders:(await orders).map(order=>order.toObject({getters:true}))})
  }
const addOrder=async(req,res,next)=>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed ,please check your data", 422)
      );
    }
    const {fullName,email,address,total,products,creator,phoneNumber}=req.body;
    const createOrder=new Orders({fullName,email,address,total,action:"Food Processing",products,creator,phoneNumber});
    let user;
    try{
        user=await User.findById(creator)
    }
    catch (err) {
    const error = new HttpError(
      'No user for provided id , please try again.',
      500
    )}
    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    try{
        const sess=await mongoose.startSession();
        sess.startTransaction();
        await createOrder.save({ session: sess });
        user.orders.push(createOrder);
        await user.save({session:sess});
        await sess.commitTransaction();
    }  
    catch (err) {
        const error = new HttpError("create order filed, please try again.", 500);
        return next(error);
  }
  res.status(201).json({orders:createOrder})


}

const updateOrder=async(req,res,next)=>{
    const orderId=req.params.pid
    const {action}=req.body;
    let order;
    try{
      order=await Orders.findById(orderId)
    }
    catch(err){
      const error = new HttpError(
           "Something went wrong ,please try again later",
           500
         );
         return next(error);
     }
     order.action=action;
     try{
      await order.save();
    }catch (err) {
     const error = new HttpError(
       "Somthing went wrong ,couldn't edit order",
       500
     );
     return next(error)
   }
   res.status(200).json({ order: order.toObject({ getters: true }) });
    }
const deleteOrder=async(req,res,next)=>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed ,please check your data", 422)
      );
    }

    const orderId=req.params.pid;
    let order;
    try{
        order=await Orders.findByIdAndDelete(orderId).populate("creator");
    }catch (err) {
        const error = new HttpError(
          'Something went wrong, could not delete order.',
          500
        );
        return next(error);
      }
      if(!order){
        const error= new HttpError("couldn't find a order that has the previos id")
      }
    try{
        const sess=await mongoose.startSession();
        sess.startTransaction();
        order.creator.orders.pop(order);
        await order.creator.save({ session: sess });
        await sess.commitTransaction();
      }catch (err) {
        const error = new HttpError(
          'deleting review failed, please try again.',
          500
        );
        return next(error);
      }
      res.status(200).json({ message: 'Deleted order.' });
}

exports.getOrderByUserId=getOrderByUserId;
exports.getAllOrder=getAllOrder;
exports.addOrder=addOrder;
exports.updateOrder=updateOrder;
exports.deleteOrder=deleteOrder;