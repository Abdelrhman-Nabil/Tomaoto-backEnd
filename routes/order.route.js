const express=require("express")
const CheckAuth=require("../middleware/checkAuth")
const router=express.Router();
const orderController=require('../controller/orderController')
router.get('/user/:uid',orderController.getOrderByUserId)
router.get('/getorders',orderController.getAllOrder);

router.delete('/:pid',orderController.deleteOrder);


// router.use(CheckAuth)

router.post('/',orderController.addOrder);

module.exports=router
