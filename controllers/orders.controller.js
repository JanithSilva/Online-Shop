const Order = require('../models/order.model');
const User = require('../models/user.model');
const stripe = require("stripe")('sk_test_51NIVVECWdFOLxNfMWlSwKGi7qtYB7T9bvXWfQ6pstBC7R9LzH79tFH0cXtflkEwJWQtl1IpT758sgJRq7UU4jixV00KxCt9oEA');

async function getOrders(req, res, next){
    try {
        const orders = await Order.findAllForUser(res.locals.uid);
        res.render('customer/orders/all-orders', { orders: orders });
        
      } catch (error) {
        next(error);
      }
}

async function addOrder(req, res, next){
    const cart = res.locals.cart;
    let userDocument;
    try{
        userDocument = await User.findById(res.locals.uid);
    }catch(error){
        return next(error);
    }

    const order = new Order(cart, userDocument);

    try{
     await order.save();
    }catch(error){
        return next(error);
    }

    req.session.cart = null;

    //stripe checkoout
    const session = await stripe.checkout.sessions.create({
        line_items: cart.items.map(function(item){
            return  {
                price_data: {
                    currency : 'usd',
                    product_data : {
                        name : item.product.title
                    },
                    unit_amount : +item.product.price.toFixed(2)*100
                },
                quantity: item.quantity,
              }
        }),
        mode: 'payment',
        success_url: `http://localhost:3000/orders/success`,
        cancel_url: `http://localhost:3000/orders/faliure`,
      });
    
      res.redirect(303, session.url);
   
}

function getSucess(req, res){
    res.render('customer/orders/success');
 }

function getFaliure(req, res){
    res.render('customer/orders/faliure');
}

module.exports = {
    addOrder: addOrder,
    getOrders: getOrders,
    getSucess: getSucess,
    getFaliure: getFaliure

}