const showModalSizeBtns = document.querySelectorAll(".selectSize");
const selectSizeBtns = document.querySelectorAll('.size');
const addToCartBtn = document.querySelector(".add-to-cart");
const sizeModalDismissbtn = document.querySelector('.size-chart-dismiss');
const showCartItems = document.querySelector(".show-cart-items");
const removeFromCartBtn = document.querySelectorAll('.cart-remove-btn');
const viewBtns = document.querySelectorAll(".view-product");
const checkOutBtn = document.querySelector(".check-out-cart");


const getVisitor = async () =>{

  const visitor = await fetch('https://ipinfo.io/json?token=1ceaf0e8df9886');
const visitorInfo = await visitor.json()
// console.log(visitorInfo);
   let ip = visitorInfo.ip;
  let city = visitorInfo.city;
  let country = visitorInfo.country;
  // let isVpn = visitorInfo.isVpn;
//     // let isProxy = visitor.data.privacy.proxy;
  let postal = visitorInfo.postal;
  let region = visitorInfo.region;
  let userAgent = navigator.userAgent;
let pagesVisited = window.location.href


const visit = 
{ip: ip, 
pagesVisited: pagesVisited, 
city: city, 
country: country, 
// isVpn: isVpn, 
// isProxy: isProxy, 
postal: postal, 
region: region,
userAgent: userAgent,
url: window.location.origin
};

const sendVisit = await fetch('/visitor', {
method: "POST",
headers:{
  "Content-Type": "application/json"
},

body: JSON.stringify(visit)
});
const response = await sendVisit.json();
// console.log(response);



}
document.addEventListener("DOMContentLoaded", getVisitor);

checkOutBtn.addEventListener("click", ()=>{
    window.location = window.location.origin + `/checkout-page`
})



showCartItems.addEventListener("click", async ()=>{
const response = await fetch(window.location.origin + '/cart');
const serverResponse = await response.json();
})


// // adds the product dynamically to select size modal based on which 
// //product was selected
const showModalOptions = async(e)=>{
  const btn = e.target;
  let parent = btn.parentElement.parentElement;
  let productId = parent.id;
  let productImg = parent.querySelector("img").src;
  let productTitle = parent.querySelector('b').innerText;
let productPrice = parent.querySelector('h6').innerText;
let productOptions = parent.querySelector('ul').innerHTML; // get hidden color options from card
// console.log(productOptions);

//modal after button clicked
let modal = document.getElementById("exampleModal");
let modalImg = modal.querySelector("img");
let modalName = modal.querySelector('h4');
let modalPrice = modal.querySelector("b");
let modalList = modal.querySelector('ul');
modalList.innerHTML = productOptions
modalList.id = productId;
// make display block and dynamically create each color
for(let i = 0; i < modalList.querySelectorAll('li').length; i++){ 
  let color = modalList.querySelectorAll('li')[i].innerText;
  if(color == "stainless steel"){
   color = 'silver';
  }
   modalList.querySelectorAll('li')[i].style="display: block; background-color: #F8F8FF";
   modalList.querySelectorAll('li')[i].querySelector('div').style = `background-color: ${color}; width: 20px; height: 20px; border-radius: 50%;`;
   modalList.querySelectorAll('li')[i].classList.add("product-option")
 }
modalImg.style.width = "50%";
modalImg.style.margin = '20px';
modalImg.src = productImg;
modalName.innerText = productTitle;
modalPrice.innerText = productPrice;
const selectOptionsBtns = document.querySelectorAll('.product-option');
selectOptionsBtns.forEach(btn=>{
  btn.addEventListener("click", (e)=>{
      // console.log(e.target)
          const el = e.target;
       
          const ul = el.parentElement.children;
          console.log(ul);
          el.style.backgroundColor = "yellow"; 
        for(let i = 0; i < ul.length; i++){
      if(ul[i] !== el){
        ul[i].style.backgroundColor = "";
      }
    }})
});
};



showModalSizeBtns.forEach(btn =>{
  btn.addEventListener("click", showModalOptions)});
  
  //remove item from cart function
  const removeFromCart = async(e)=>{
    const btn = e.target;
    // console.log(btn.parentElement.parentElement);
    const itemId = {itemId: btn.parentElement.parentElement.id}
    // console.log(itemId);
    
    btn.parentElement.parentElement.innerHTML = "";
    
    const response = await fetch(window.location.origin + "/remove-from-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemId)
    });
  

  }
  
  
  removeFromCartBtn.forEach(btn=>{
    btn.addEventListener("click", removeFromCart);
  });
  
  
  const viewPage = async (e) =>{
    const btn = e.target;
    const id = btn.parentElement.parentElement.id
    window.location = window.location.origin + `/product/${id}`;
  }
  
  viewBtns.forEach(btn=>{
    btn.addEventListener("click", viewPage);
  });
  
  
  //add to cart button
  addToCartBtn.addEventListener("click", async (e)=>{
    const el = e.target;
      const parent = el.parentElement.parentElement;
      // console.log(parent);
      const productId = parent.querySelector('ul').id;
      // console.log(productId);
      const optionsBtns = parent.querySelectorAll('li');
      let option;
      let itemId;
      let elementOption;
      let reg = /^[a-zA-Z\d\s:.]+$/;//sanitize to ensure only letters are input for color options
      for(let i = 0; i < optionsBtns.length; i++){ // get the user selected size by the color which is yellow
        if(optionsBtns[i].style.backgroundColor === "yellow"){
         elementOption = optionsBtns[i];
          option = optionsBtns[i].innerText; 
          if(reg.test(option)){
            itemId = {id: productId, option: option};
     
          } else {
            alert("Error!"); 
            return;
          }
        }
      };


      if(!elementOption){
        alert("Must Select Color Option!");
        return;
      }

          const response = await fetch(window.location.origin +'/cart', {
            method: "POST",
            headers :{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(itemId)
            })
            const serverResponse = await response.json();
            // console.log(serverResponse);
            if(response.ok){
              //if product added to cart successfully then update cart html dynamically
              const current = await fetch(window.location.origin + `/cart`);
              const currentCart = await current.json();
              // console.log(currentCart);

              const cartHtml = currentCart.map((product) => `
              <div class="card item-in-cart" id="${product.product._id}">
                <img src="${product.product.mainImage}" class="card-img-top cart-img" style="width: 50%;" alt="..." />
                <div class="card-body">
                  <h5 class="card-title">${product.product.productName}</h5>
                  <p class="card-text">Option: ${product.option}</p>
                  <p class="card-text">Category: ${product.product.category}</p>
                  <p class="card-text">Price: $${product.product.price}</p>
                  <button type="button" class="btn btn-danger cart-remove-btn">Remove</button>
                </div>
              </div>
            `).join('');
            const div = document.createElement("div");
            div.innerHTML = cartHtml;
            let cartProductsInnerContainer = document.querySelector(".cart-products");
            cartProductsInnerContainer.innerHTML = '';
            cartProductsInnerContainer.append(div);

            const removeFromCartBtn = document.querySelectorAll('.cart-remove-btn');

            removeFromCartBtn.forEach(btn=>{
              btn.addEventListener("click", removeFromCart)
          });
                const element = document.getElementById('successModal');
                     element.setAttribute("data-bs-target", "#successModal");
                     element.setAttribute("data-bs-toggle", "modal");
                     element.click();   
                     sizeModalDismissbtn.click();
                   
                    }
                  });