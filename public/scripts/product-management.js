const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event){
    const buttonElement = event.target;
    const productid = buttonElement.dataset.productid;
    const csrftoken = buttonElement.dataset.csrftoken;

    const response = await fetch('/admin/products/' + productid + '?_csrf='+ csrftoken, {
        method: 'DELETE'
    })

    if(!response.ok){
        alert('Something went wrong');
        return;
    }

     buttonElement.parentElement.parentElement.parentElement.parentElement.remove();


}

for(const deleteProductButtonElement of deleteProductButtonElements){
    deleteProductButtonElement.addEventListener('click',deleteProduct);
}

