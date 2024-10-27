const fs=require('fs')
const express=require('express')
const path = require('path');
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const HttpError=require('./model/errorModal')
const ProductRoute=require("./routes/product.route");
const UserRoute=require("./routes/user.route");
const AdminRoute=require("./routes/admin.route")
const OrderRoute=require("./routes/order.route")
const stripe=require("./routes/stripe");
const app=express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type ,Accept ,Authorization');
    res.setHeader('Access-Control-Allow-Methods',' GET, POST, PATCH, DELETE')

    next();
});
app.use('/api/users',UserRoute);
app.use('/api/products',ProductRoute);
app.use('/api/admins',AdminRoute);
app.use('/api/order',OrderRoute);
app.use('/api/Stripe',stripe);


app.use((req,res,next)=>{
    const error=new HttpError("couldn't find this routes",404);
    throw error 
})
app.use((error,req,res,next)=>{
    if(req.file){
        fs.unlink(req.file.path,err=>{console.log(err)})
      }
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message:error.message || 'An unkown error eccurred'})
})
const url = `mongodb+srv://boka:boka0505@tomato.8dzosfw.mongodb.net/Tomato?retryWrites=true&w=majority&appName=tomato`;
mongoose.connect(url)
.then(()=>{
    app.listen(5000);
    console.log("contect to database")
})
.catch(err=>{
    console.log(err)
})