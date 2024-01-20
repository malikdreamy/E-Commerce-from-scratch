
// const showModalSizeBtn = document.querySelector(".selectOption");
const selectOptionsBtns = document.querySelectorAll('.select-option');
const addToCartBtn = document.querySelector(".add-to-cart");
const sizeModalDismissbtn = document.querySelector('.size-chart-dismiss');
const showCartItems = document.querySelector(".show-cart-items");
const removeFromCartBtn = document.querySelectorAll('.cart-remove-btn');
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


checkOutBtn.addEventListener("click", ()=>{
    window.location = window.location.origin + `/checkout-page`
})


showCartItems.addEventListener("click", async ()=>{
const response = await fetch(window.location.origin + '/cart');
const serverResponse = await response.json();
// console.log(serverResponse);


})


const removeFromCart = async(e)=>{
    const btn = e.target; //get button and then get id from parent el
    const itemId = {itemId: btn.parentElement.parentElement.id}
    btn.parentElement.parentElement.innerHTML = "";

    const response = await fetch(window.location.origin + "/remove-from-cart", {
    method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemId)
    });
    // console.log(response);

}
// //add to cart button
addToCartBtn.addEventListener("click", async (e)=>{
    const el = e.target;
    const parent = el.parentElement.parentElement;
    const productId = parent.querySelector('ul').id;
    const optionsBtns = parent.querySelectorAll('li');
    let option;
    let itemId;
    let elementOption;
    let reg = /^[a-zA-Z\d\s:.]+$/;//sanitize to ensure only letters, numbers and colon can be input
    for(let i = 0; i < optionsBtns.length; i++){ // get the user selected size by the color which is yellow
      if(optionsBtns[i].style.backgroundColor === "yellow"){
       elementOption = optionsBtns[i];
        option = optionsBtns[i].innerText; 
        if(reg.test(option)){
          itemId = {id: productId, option: option};
          // console.log(itemId);
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
                   
            };


            


})




// // for making background color yellow of selected size
selectOptionsBtns.forEach(btn=>{
  btn.addEventListener("click", (e)=>{
      // console.log(e.target)
          const el = e.target;
          const ul = el.parentElement.children;
          el.style.backgroundColor = "yellow"; 
        for(let i = 0; i < ul.length; i++){
      if(ul[i] !== el){
        ul[i].style.backgroundColor = "";
      }
    }})
});


removeFromCartBtn.forEach(btn=>{
    btn.addEventListener("click", removeFromCart)
});




// to format product description 
const productDesc = document.querySelector(".product-description").textContent;

const formatTextAsTable = (text) => {
  const sections = text.split(/\n{2,}/); // Split text into sections based on double newlines
  let html = '';

  sections.forEach((section) => {
    const lines = section.split('\n');
    let hasKeyValues = false;

    // Check if the section contains key-value pairs
    lines.forEach((line) => {
      const [key, value] = line.split(':').map((item) => item.trim());
      if (key && value) {
        hasKeyValues = true;
        return;
      }
    });

    if (hasKeyValues) {
      // Generate table only if the section has key-value pairs
      html += '<table class="table table-bordered">';
      lines.forEach((line) => {
        const [key, value] = line.split(':').map((item) => item.trim());
        if (key && value) {
          html += `<tr><th class="w-50">${key}</th><td class="w-50">${value}</td></tr>`;
        }
      });
      html += '</table>';
    } else {
      // Display the text directly without creating a table
      html += `<p>${section}</p>`;
    }
  });

  return html;
};

document.addEventListener("DOMContentLoaded", () => {
  const productDesc = document.querySelector(".product-description").textContent;
  const formatted = formatTextAsTable(productDesc);
  document.querySelector(".product-description").innerHTML = formatted;
});

