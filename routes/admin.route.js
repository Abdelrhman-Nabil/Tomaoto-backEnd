const express=require("express")
const router=express.Router();
const {check}=require('express-validator')
const addminController=require('../controller/addminController');

router.get('/getAddminEmails',addminController.getAllAdmin);
router.post('/',[check('email').normalizeEmail().isEmail(),
],addminController.addAdmin);
router.delete('/:pid',addminController.deleteAddmin);

module.exports=router
