const express=require("express")
const CheckAuth=require("../middleware/checkAuth")
const router=express.Router();
const orderController=require('../controller/orderController')
router.get('/user/:uid',orderController.getOrderByUserId)
router.get('/getOrders',orderController.getAllOrder);

router.delete('/:pid',orderController.deleteOrder);

router.patch("/:pid",orderController.updateOrder);

router.use(CheckAuth)

router.post('/',orderController.addOrder);

module.exports=router
