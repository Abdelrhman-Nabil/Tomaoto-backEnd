const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload=require("../middleware/uploadFile")
const ProductController = require("../controller/product.controller");

router.get("/product/:pid", ProductController.getProductById);
router.get("/allProduct", ProductController.getAllProduct);
router.post("/",fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("details").isLength({ min: 5 }),
    check("price").not().isEmpty(),
  ],
  ProductController.addProduct
);
router.patch(
  "/:pid",fileUpload.single("image"),
  [check("title").not().isEmpty(), check("details").isLength({ min: 5 })],
  ProductController.updateProduct
);
router.delete('/:pid',ProductController.deleteProduct)
module.exports = router;
