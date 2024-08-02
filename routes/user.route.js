const express = require("express");
const router = express.Router();
const userController=require("../controller/userController")
const { check } = require("express-validator");
const fileUpload=require("../middleware/uploadFile")

router.post('/signUp',fileUpload.single("image"),[
    check('name',"address").not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:10})
],userController.signUp)


router.post('/logIn',userController.logIn,[    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:10})])
module.exports=router