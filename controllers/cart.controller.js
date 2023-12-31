const Product = require('../models/product.model');

function getCart(req, res){
    res.render('customer/cart/cart');
}

async function addCartItem(req, res, next){
    let product;
    try{
         product = await Product.findById(req.body.productId); 
    }catch(error){
        next(error);
        return;
    }
    const cart = res.locals.cart;
    cart.addItem(product);
    req.session.cart = cart;
    /* req.session.save() will be called automatically 
    and only have call req.session.save() when perorming action that relies on that session data to be updated */
    res.status(201).json({
        message : 'cart Updated!',
        newTotalItems: cart['totalQuantity']
    });
    
}

function updateCartItem(req, res){
    const cart = res.locals.cart;
    const updatedItemData = cart.updateItem(req.body.productId, +req.body.quantity);
    req.session.cart = cart;
    res.status(201).json({
        message : 'Cart item Updated!',
        updatedCartData :{
        newTotalItems: cart['totalQuantity'],
        newTotalPrice: cart['totalPrice'],
        updatedItemPrice : updatedItemData['updatedItemPrice']
        }
    });

}

module.exports = {
    addCartItem: addCartItem,
    getCart: getCart,
    updateCartItem: updateCartItem
}