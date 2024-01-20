const removeBtns = document.querySelectorAll(".remove-from-cart");
const checkOutBtn = document.querySelector(".check-out-btn");
const bitcoinBtn = document.querySelector(".bitcoin-check-out");

//get visitor on page load
const getVisitor = async () =>{

  const visitor = await fetch('https://ipinfo.io/json?token=1ceaf0e8df9886');
const visitorInfo = await visitor.json()
console.log(visitorInfo);
   let ip = visitorInfo.ip;
  let city = visitorInfo.city;
  let country = visitorInfo.country;
  // let isVpn = visitorInfo.isVpn;
// // let isProxy = visitor.data.privacy.proxy;
  let postal = visitorInfo.postal;
  let region = visitorInfo.region;
  let userAgent = navigator.userAgent;
let pagesVisited = window.location.href


const visit = {
  ip: ip, 
pagesVisited: pagesVisited, 
city: city, 
country: country, 
// isVpn: isVpn, 
// isProxy: isProxy, 
postal: postal, 
region: region,
userAgent: userAgent,
};

const sendVisit = await fetch(window.location.origin + '/visitor', {
method: "POST",
headers:{
  "Content-Type": "application/json"
},
body: JSON.stringify(visit)
});
}
document.addEventListener("DOMContentLoaded", getVisitor);




//remove item from cart function by id
const removeFromCart = async (e) =>{
    const itemId = {itemId: e.target.parentElement.parentElement.parentElement.id};
    console.log(itemId);
    e.target.parentElement.parentElement.parentElement.innerHTML = "";
    const response = await fetch(window.location.origin + `/remove-from-cart`, {
method: "POST",
headers:{
"Content-Type": "application/json"
},
      body: JSON.stringify(itemId)
    } 
    );
   const serverResponse = await response.json();
   console.log(serverResponse); 
   setTimeout(location.reload(), 2000);
};


removeBtns.forEach(btn=>{
    btn.addEventListener("click", removeFromCart);
});





//checkout function
const checkOut = async (e) =>{
    e.preventDefault()
    //billing user input
const billingFirst = document.getElementById("billing-first-name").value.trim();
  const billingLast = document.getElementById('billing-last-name').value.trim();
  const billingPhone = document.getElementById('billing-phone').value.trim();
  const billingAddress = document.getElementById("billing-address").value.trimEnd();
  const billingCity = document.getElementById("billing-city-town").value.trimEnd();
  const billingState = document.getElementById('billing-state-region').value.trimEnd();
  const billingCountry = document.getElementById("billing-country").value.trimEnd();
  const billingZip = document.getElementById("billing-zip").value.trim();
  
//   // delivery user input
  const userEmail = document.getElementById('delivery-email').value.trim();
  const deliveryFirst = document.getElementById("delivery-first-name").value.trim();
  const deliveryLast = document.getElementById('delivery-last-name').value.trim();
  const deliveryPhone = document.getElementById('delivery-phone').value.trim();
  const deliveryAddress = document.getElementById("delivery-address").value.trimEnd();
  const deliveryState = document.getElementById('delivery-state-region').value.trimEnd();
  const deliveryCity = document.getElementById("delivery-town").value.trim().trimEnd();
  const deliveryCountry = document.getElementById("delivery-country").value.trimEnd();
  const deliveryZip = document.getElementById("delivery-zip").value.trim();

  //regular expression to sanitize input
  const addressReg = /^[a-zA-Z0-9\s]+$/; // sanitization for address
  const charReg = /^[a-zA-Z]+$/; // sanitzation for only characters
  const digitReg = /^[0-9]{10,12}$/; // sanitzation for only numbers, 10 -12 digits for valid phone numbers
  const zipReg = /^[0-9]{5,10}/ // sanitization for zipcode
const emailReg = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // sanitization for email

 
  /*
  * Below each statement test if an input is blank, it also does sanitization to make sure only characters or numbers are
  * entered. It also checks to see if billing and delivery are the same
  */

        if(!emailReg.test(userEmail)){ // sanitize emails to make sure emails are valid format
      alert("Please enter a valid email!")
      return;
        }

      if(billingFirst === "" || deliveryFirst === "" || !charReg.test(billingFirst) || !charReg.test(deliveryFirst) || (deliveryFirst !== billingFirst)) { 
        alert("Error. Billing First Name and Delivery First Name Must Be The Same");
      return;
      };


    if(billingLast === "" || deliveryLast === "" || !charReg.test(billingLast) || !charReg.test(deliveryLast) || (deliveryLast !== billingLast)) { 
      alert("Error. Billing Last Name And Delivery Last Name Must Be The Same");
      return;
          };

      if(billingPhone === "" || deliveryPhone === "" || !digitReg.test(billingPhone) || !digitReg.test(deliveryPhone) || (billingPhone !== deliveryPhone)) { 
        alert("Error. Billing Phone And Delivery Phone Must Be The Same");
        return;
            };

      if(billingAddress === "" || deliveryAddress === "" || !addressReg.test(deliveryAddress) || !addressReg.test(billingAddress) || (deliveryAddress !== billingAddress)) { 
        alert("Error. Billing Address And Delivery Address Must Be The Same");
        return;
            };


        if(billingCity === "" || deliveryCity === "" || !addressReg.test(deliveryCity) || !addressReg.test(billingCity) || (deliveryCity!== billingCity)) { 
          alert("Error. Billing City And Delivery City Must Be The Same");
          return;
              };

              if(billingState === "" || deliveryState === "" || !addressReg.test(deliveryState) || !addressReg.test(billingState) || (deliveryState!== billingState)) { 
                alert("Error. Billing City And Delivery City Must Be The Same");
                return;
                    };

        if(billingCountry === "" || deliveryCountry === "" || !addressReg.test(deliveryCountry) || !addressReg.test(billingCountry) || (deliveryCountry!== billingCountry)) { 
          alert("Error. Billing Country And Delivery Country Must Be The Same");
          return;
              };
      if(billingZip === "" || deliveryZip === "" || !zipReg.test(deliveryZip) || !zipReg.test(billingZip) || (deliveryZip!== billingZip)) { 
        alert("Error. Billing Zip And Delivery Zip Must Be The Same");
        return;
            };

            let customerInfoObj = {

       billingFirst: document.getElementById("billing-first-name").value.trim(),
  billingLast : document.getElementById('billing-last-name').value.trim(),
   billingPhone : document.getElementById('billing-phone').value.trim(),
   billingAddress : document.getElementById("billing-address").value.trimEnd(),
   billingCity : document.getElementById("billing-city-town").value.trimEnd(),
   billingState : document.getElementById('billing-state-region').value.trimEnd(),
  billingCountry : document.getElementById("billing-country").value.trimEnd(),
  billingZip : document.getElementById("delivery-zip").value.trim(),

   userEmail : document.getElementById('delivery-email').value.trim(),
   deliveryFirst : document.getElementById("delivery-first-name").value.trim(),
   deliveryLast : document.getElementById('delivery-last-name').value.trim(),
   deliveryPhone : document.getElementById('delivery-phone').value.trim(),
   deliveryAddress : document.getElementById("delivery-address").value.trimEnd(),
   deliveryState : document.getElementById('delivery-state-region').value.trimEnd(),
 deliveryCity : document.getElementById("delivery-town").value.trim().trimEnd(),
   deliveryCountry : document.getElementById("delivery-country").value.trimEnd(),
   deliveryZip : document.getElementById("delivery-zip").value.trim(),

            };


const cart = await fetch(window.location.origin + '/cart'); //get the current cart items from session 
let currentCart = await cart.json();
// console.log(currentCart);
let serverObj = {}; // object that will be sent back to server
let cartArr = []; // create empty cart object for items
for(let i = 0; i < currentCart.length; i++){ // add each object to the array with name, quantity and price
  let obj = { name: "Watch", quantity: '1', 
  basePriceMoney: {amount: Number(String(currentCart[i].product.price).concat('00')), //add two zeros behind for squares converstion and them turn it back to number
    currency: 'USD'}
  };
    cartArr.push(obj);
}
serverObj.products = cartArr; // add cartArr to products in serverObj
serverObj.email = userEmail; // add users email to email in serverObj before sending to server for processing
serverObj.customer = customerInfoObj; // add customer object to object that is being sent to server
// console.log(cartArr);





        const response = await fetch(window.location.origin + "/express-checkout", {
            method: "POST", 
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(serverObj)
        });
        let url = await response.json(); // get payment url from server
        console.log(url.link)
        let urlToClick = document.createElement('a');// create link and add url to it
        urlToClick.href = url.link; 
     
        urlToClick.click(); // click link to open the payment window

} //end of checkmatch function

checkOutBtn.addEventListener("click", checkOut);





//bitcoin payment

bitcoinBtn.addEventListener("click", async (e)=>{
  e.preventDefault();
  const userEmail = document.getElementById('delivery-email').value.trim();
  const deliveryFirst = document.getElementById("delivery-first-name").value.trim();
  const deliveryLast = document.getElementById('delivery-last-name').value.trim();
  const deliveryPhone = document.getElementById('delivery-phone').value.trim();
  const deliveryAddress = document.getElementById("delivery-address").value.trimEnd();
  const deliveryState = document.getElementById('delivery-state-region').value.trimEnd();
  const deliveryCity = document.getElementById("delivery-town").value.trim().trimEnd();
  const deliveryCountry = document.getElementById("delivery-country").value.trimEnd();
  const deliveryZip = document.getElementById("delivery-zip").value.trim();

  const emailReg = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 

  if(!emailReg.test(userEmail)){
    alert("Email Required!");
    return;
  };

  if(deliveryFirst == ""){
    alert("Delivery First Name Required!");
    return;
  };

  if(deliveryLast == ""){
alert("Delivery Last Name Required!");
return;
  };

  if(deliveryPhone == ""){
    alert("phone Number Required!");
    return;
  };
  if(deliveryAddress == ""){
    alert("Delivery Address Required!");
    return;
  };

  if(deliveryCity == ""){
alert("Delivery City Required!");
  return;
  }
  if(deliveryState == ""){
    alert("Delivery State Required!");
    return;
  };
  if(deliveryCountry == ""){
    alert("Delivery Country Required!")
return;
  };
  if(deliveryZip == ""){
    alert("Delivery Zip Code Required!");
    return;

  };

let customerInfoObj = {
  userEmail : document.getElementById('delivery-email').value.trim(),
  deliveryFirst : document.getElementById("delivery-first-name").value.trim(),
  deliveryLast : document.getElementById('delivery-last-name').value.trim(),
  deliveryPhone : document.getElementById('delivery-phone').value.trim(),
  deliveryAddress : document.getElementById("delivery-address").value.trimEnd(),
  deliveryState : document.getElementById('delivery-state-region').value.trimEnd(),
deliveryCity : document.getElementById("delivery-town").value.trim().trimEnd(),
  deliveryCountry : document.getElementById("delivery-country").value.trimEnd(),
  deliveryZip : document.getElementById("delivery-zip").value.trim(),


}


  const cart = await fetch(window.location.origin + '/cart'); //get the current cart items from session 
  let currentCart = await cart.json();
  // console.log(currentCart);
  let serverObj = {}; // object that will be sent back to server
  let cartArr = []; // create empty cart object for items
  for(let i = 0; i < currentCart.length; i++){ // add each object to the array with name, quantity and price
    let obj = { name: "Sneakers", quantity: '1', 
    basePriceMoney: {amount: Number(String(currentCart[i].product.price).concat('00')), //add two zeros behind for squares converstion and them turn it back to number
      currency: 'USD'}
    };
      cartArr.push(obj);
  }
  serverObj.products = cartArr; // add cartArr to products in serverObj
  serverObj.email = userEmail; // add users email to email in serverObj before sending to server for processing
  serverObj.customer = customerInfoObj; // add customer object to object that is being sent to server
  console.log(serverObj)
  // console.log(cartArr);

  // console.log(currentCart);
  let sum = 0;
  const getTotal = () =>{ // get total price of the products from cart
    for(let i = 0; i < currentCart.length; i++){
    sum += Number(currentCart[i].product.price);
    }
    return sum;
  }
//   console.log(getTotal());

const sendCustomerInfo = await fetch(window.location.origin + '/bitcoin-checkout', {
  method: "POST",
  headers:{
    "Content-Type": "application/json"
  },
  body: JSON.stringify(serverObj)
})



try{
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'speed-version': '2022-04-15',
      'content-type': 'application/json',
      authorization: 'Basic c2tfbGl2ZV9sbHE5eWxzZDgzZlc1cU12bGx2b2VsbXF1YmN4dnJDSmxsdm9lbG1xcmNKU3J3Zlc6'
    },
    body: JSON.stringify({
      metadata: {key_1: 'value_1', key_2: 'value_2'},
      cashback: {id: 'cb_xxxxxxxxxxxx'},
      currency: 'USD',
      amount: `${getTotal()}`,
      success_message: 'Payment Successful!'
    })
  };
  const bitCoinpay = await fetch('https://api.tryspeed.com/checkout-links', options);
  const payLink = await bitCoinpay.json();
  console.log(payLink.url);
  location.replace(payLink.url);
}catch(err){
  alert("An error has occured! Please refresh the page and try again!")

}
 




});