const cartItemUpdateFormElements = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement  = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

async function updateCartItem(event){
    event.preventDefault();
    const form = event.target;
    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrftoken;
    const quanitity = form.firstElementChild.value;
    console.log(csrfToken);

    let response;

    try{
        response = await fetch('/cart/items',{
            method : 'PATCH',
            body : JSON.stringify({
                productId : productId,
                quantity : quanitity,
                _csrf : csrfToken
            }),
            headers : {
                'Content-Type' : 'application/json'
            }
        });
    

    }catch(error){
        console.log(error);
        alert('Something went wrong');
        return;
    }

    if(!response.ok){
        alert('Something went wrong');
        return;
    }

    const responseData = await response.json();

    if(responseData.updatedCartData.updatedItemPrice === 0 ){
        form.parentElement.parentElement.remove();
    }else{
        const cartItemTotalPriceElement = form.parentElement.querySelector('.cart-item-price');
        cartItemTotalPriceElement.textContent = responseData.updatedCartData.updatedItemPrice.toFixed(2);
    }

    cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);
    for(const cartBadgeElement of cartBadgeElements){
        cartBadgeElement.textContent = responseData.updatedCartData.newTotalItems;
    }
    

}


for(const formElement of cartItemUpdateFormElements){
    formElement.addEventListener('submit', updateCartItem );
}