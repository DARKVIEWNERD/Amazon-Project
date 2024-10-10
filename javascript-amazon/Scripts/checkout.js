import { cart,removeFromCart,updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/currency.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {deliveryOption} from "../data/DeliveryOption.js"



 let cartsummaryHTML='';
 cart.forEach((cartItem)=>{
    const productId=cartItem.productId;

    let matchingProduct;

  products.forEach((product)=>{
    if(product.id===productId){
      matchingProduct=product; 
    }
  });
 
  const deliveryOptionId=cartItem.deliveryOptionId;
  let deliveryOptions;
  deliveryOption.forEach((option)=>{
    if(option.id===deliveryOptionId)deliveryOptions=option;
  });
  const today=dayjs();
  const deliveryDate=today.add(
    deliveryOptions.deliveryDays,'days' 
  );
  const dateString=deliveryDate.format(
    'dddd, MMMM, D'
  );
    cartsummaryHTML+=`
    <div class="cart-item-container
       js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date:${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
           ${matchingProduct.name}
          </div>
          <div class="product-price">
           $ ${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link"
             data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options js-delivery-option" >
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionhtml(matchingProduct,cartItem)}
        </div>
      </div>
    </div>
  `
 });
 function deliveryOptionhtml(matchingProduct,cartItem){
  let html=''
  deliveryOption.forEach((deliveryOptions)=>{
    const today=dayjs();
    const deliveryDate=today.add(
      deliveryOptions.deliveryDays,'days' 
    );
    const dateString=deliveryDate.format(
      'dddd, MMMM, D'
    );
    const priceString=deliveryOptions.priceCents===0
    ?'FREE'
    : `$${formatCurrency(deliveryOptions.priceCents)}`;

    const isChecked=deliveryOptions.id===cartItem.deliveryOptionId;
    html+=
    `
      <div class="delivery-option data-product-id="${matchingProduct.id}"
      data-delivery-option="${deliveryOptions.id}"">
        <input type="radio"
          ${isChecked ?'checked':''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </div> 
    `
  });
  return html;
}
document.querySelector('.js-order-summary').innerHTML=cartsummaryHTML;

document.querySelectorAll('.js-delete-link')
.forEach((link)=>{
  link.addEventListener('click',()=>{
    const productId=link.dataset.productId;
    removeFromCart(productId);
    const container=document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();  
  });
  
});
document.querySelectorAll('.js-delivery-option')
.forEach((element)=>{
    element.addEventListener('click',()=>{
      const {productId,deliveryOptionId}=element.dataset;
      updateDeliveryOption(productId,deliveryOptionId);
      alert('Delivery option updated successfully');
    });
});