const { validationResult } = require("express-validator");
const Product=require('../model/schema/product.Schema')
const HttpError=require('../model/errorModal')

const getProductById=async(req,res,next)=>{
  const ProductId = req.params.pid;

  let product;
 try{
  product=await Product.findById(ProductId)
 }catch (err) {
  const error = new HttpError(
    "Something went wrong ,couldn't find a Product",
    500
  );
  return next(error);
}
if (!product) {
  const error = new HttpError(
    "Couldn't find a product for the previos product ID",
    404
  );
  return next(error);
}
res.json({ product: product.toObject({ getters: true }) }); // => { place } => { place: place }

}
const getAllProduct=async(req,res,next)=>{
  let products;
  try{
    products=Product.find({})
  }catch(err){
    const error=new HttpError("couldn't find the product.please try again",500);
  return next(error)
  }
  res.json({products:(await products).map(product=>product.toObject({getters:true}))})


}
const addProduct=async(req,res,next)=>{
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   throw new HttpError('Invalid inputs passed, please check your data.', 422);
  // }
  const { title, details,price,category} = req.body;
   const createProduct=new Product({title, details,price,category,image:req.file.path})
   try{
    await createProduct.save();
  }
  catch(err){
    const error = new HttpError("save Product filed, please try again.", 500);
      return next(error);
  }
    res.status(201).json({ product: createProduct });

};
const updateProduct=async(req,res,next)=>{
  const productId = req.params.pid;
  const {title,details,category,price,image}=req.body;
  let product;
  try{
    product=await Product.findById(productId)
  
  }
  catch(err){
    const error = new HttpError(
         "Something went wrong ,please try again later",
         500
       );
       return next(error);
   }
   product.title=title;
   product.details=details;
   product.category=category;
   product.price=price;
   product.image=req.file?req.file.path:image;

   try{
     await product.save();
   }catch (err) {
    const error = new HttpError(
      "Somthing went wrong ,couldn't updata place",
      500
    );
    return next(error)
  }
  res.status(200).json({ product: product.toObject({ getters: true }) });
  };  

const deleteProduct =async (req, res, next) => {
  const productId = req.params.pid;
  let product;
  try{
    product=await Product.findByIdAndDelete(productId);
  }
  catch(err) {
    const error = new HttpError(
      'Something went wrong, could not delete product.',
      500
    );
    return next(error);
  }
  res.status(200).json({ message: 'Deleted product.' });
};

exports.getProductById=getProductById;
exports.getAllProduct=getAllProduct;
exports.addProduct=addProduct;
exports.updateProduct=updateProduct
exports.deleteProduct=deleteProduct
