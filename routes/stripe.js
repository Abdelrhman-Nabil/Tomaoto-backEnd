const express=require("express")
const Stripe=require("stripe")
// require("dotenv").config();
const router=express.Router();

const stripe=Stripe(process.env.SECRET_KEY)
router.post('/create-checkout-session', async (req, res) => {
    
    const line_items=req.body.cartItems.map((item)=>{
        return{
            price_data: {
                currency: 'usd',
                product_data: {
                  name: item.title,
                  description:item.details,

                },
                unit_amount: item.price * 100 ,
              },
              quantity: item.quantity,
        }
    })
    const session = await stripe.checkout.sessions.create({
          shipping_options: [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: 0,
                  currency: 'usd',
                },
                display_name: 'Free shipping',
                delivery_estimate: {
                  minimum: {
                    unit: 'business_day',
                    value: 5,
                  },
                  maximum: {
                    unit: 'business_day',
                    value: 7,
                  },
                },
              },
            },
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: 1500,
                  currency: 'usd',
                },
                display_name: 'Next day air',
                delivery_estimate: {
                  minimum: {
                    unit: 'business_day',
                    value: 1,
                  },
                  maximum: {
                    unit: 'business_day',
                    value: 1,
                  },
                },
              },
            },
          ],
      line_items,
      mode: 'payment',
      success_url: `https://tomato-11.web.app/CkeckOutSuccess`,
      cancel_url: `https://tomato-11.web.app/PaymentForm`,
    });
  
    res.send({url:session.url});
  });
  module.exports=router