const showModalSizeBtns = document.querySelectorAll(".selectSize");
// const selectOptionsBtns = document.querySelectorAll('.product-option');
const addToCartBtn = document.querySelector(".add-to-cart");

const sizeModalDismissbtn = document.querySelector('.size-chart-dismiss');
const showCartItems = document.querySelector(".show-cart-items");
const removeFromCartBtn = document.querySelectorAll('.cart-remove-btn');
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector("#search-button");
const viewBtns = document.querySelectorAll(".view-product");
const checkOutBtn = document.querySelector(".check-out-cart");
const viewMoreProducts = document.querySelector(".view-more-products");
const moreProductsDiv = document.querySelector(".more-products");
const paginationNumberBtn = document.querySelectorAll(".pagination-page-number");
const productContainer = document.getElementById("searchResults");

////////////////////////////////////////////////////////////////
/////////////GET VISITOR////////////////////////////////////////

  const getVisitor = async () =>{

    const visitor = await fetch('https://ipinfo.io/json?token=');
  const visitorInfo = await visitor.json()
  // console.log(visitorInfo);
     let ip = visitorInfo.ip;
    let city = visitorInfo.city;
    let country = visitorInfo.country;
    let postal = visitorInfo.postal;
    let region = visitorInfo.region;
    let userAgent = navigator.userAgent;
  let pagesVisited = window.location.href
  

  const visit = 
  {ip: ip, 
  pagesVisited: pagesVisited, 
  city: city, 
  country: country, 
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


/////////////END GET VISITOR////////////////////////////
////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
////////////////GO TO CHECK OUT PAGE////////////////////////////////
checkOutBtn.addEventListener("click", ()=>{
    window.location = window.location.origin + `/checkout-page`
})

showCartItems.addEventListener("click", async ()=>{
const response = await fetch(window.location.origin + '/cart');
const serverResponse = await response.json();
})

/////////////////END GO TO CHECK OUT PAGE///////////////////////
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
//////////////SHOW OPTIONS MODAL////////////////////////////

const showModalOptions = async(e)=>{
  //button clicked before modal appears
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
            // console.log(ul);
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
  ////////////////END SHOW OPTIONS MODAL///////////////////////////
  /////////////////////////////////////////////////////////////


  
  /////////////////////////////////////////////////////////////
  //////////////REMOVE ITEM FROM CART/////////////////////////

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
    // console.log(response);

  }
  
  
  removeFromCartBtn.forEach(btn=>{
    btn.addEventListener("click", removeFromCart);
  });
  /////////////////END REMOVE ITEM FROM CART//////////////////////////
  ///////////////////////////////////////////////////////////////////

  
  
  ////////////////////////////////////////////////////////////////////
  ///////////FUNCTION TO GO TO PRODUCT PAGE////////////////////////
  const viewPage = async (e) =>{
    const btn = e.target;
    const id = btn.parentElement.parentElement.id
    window.location = window.location.origin + `/product/${id}`;
  }
  
  viewBtns.forEach(btn=>{
    btn.addEventListener("click", viewPage);
  });
  /////////////////END FUNCTION TO GO TO PRODUCT PAGE//////////////////////
  /////////////////////////////////////////////////////////////////////////


  
  ///////////////////////////////////////////////////////////////////////////////////////
  ////////////////////SEARCH BAR /SEARCH ITEM BY ITS PATHNAME/////////////////////////////
  
  searchBtn.addEventListener("click", async ()=>{ 
    try{
      const reg = /^[a-zA-Z0-9]/; // ensure only letters or numbers are entered
      const inputVal = document.getElementById("floatingInputGroup1").value;
      if (!reg.test(inputVal)){
        alert('Use only characters or numbers to search')
        return;
      }
let products;
switch(window.location.pathname){
  case '/allproducts':
  const fetchAll = await fetch('/all-products/' + `${inputVal}`);
  products = await fetchAll.json();
  break;

  case '/women':
  const fetchWomen = await fetch('womens-products/' + `${inputVal}`);
  products = await fetchWomen.json();
  break;

  case '/men':
  const fetchMen = await fetch('/mens-products/' + `${inputVal}`);
  products = await fetchMen.json();
  break;

  case '/women-clothing':
  const fetchWomenClothing = await fetch('/women-clothing/' + `${inputVal}`);
  products = await fetchWomenClothing.json();
  break;

  case '/men-clothing':
  const fetchMenClothing = await fetch('/men-clothing/' + `${inputVal}`);
  products = await fetchMenClothing.json();
  break;

  case '/women-bags':
  const fetchWomenBags = await fetch('/women-bags/' + `${inputVal}`);
  products = await fetchWomenBags.json();
  break;

  case '/men-bags':
  const fetchMenBags = await fetch('/men-bags/' + `${inputVal}`);
  products = await fetchMenBags.json();
  break;

  case '/women-shoes':
  const fetchWomenShoes = await fetch('/women-shoes/' + `${inputVal}`);
  products = await fetchWomenShoes.json();
  break;

  case '/men-shoes':
  const fetchMenShoes = await fetch('/men-shoes/' + `${inputVal}`);
  products = await fetchMenShoes.json();
  break;

  case '/women-watches-and-jewelry':
  const fetchWomenWatches = await fetch('/women-watches-and-jewelry/' + `${inputVal}`);
  products = await fetchWomenWatches.json();
  break;

  case '/men-watches-and-jewelry':
  const fetchMenWatches = await fetch('/men-watches-and-jewelry/' + `${inputVal}`);
  products = await fetchMenWatches.json();
  break;

  case '/men-sunglasses':
  const fetchMenSunglasses = await fetch('/men-sunglasses/' + `${inputVal}`);
  products = await fetchMenSunglasses.json();
  break;

case '/women-sunglasses':
const fetchWomenSunglasses = await fetch('/women-sunglasses/' + `${inputVal}`);
products = await fetchWomenSunglasses.json();
  break;

  case '/rolex-watches':
  const fetchRolexWatches = await fetch('/rolex/' + `${inputVal}`);
  products = await fetchRolexWatches.json()
  break;
  
  case '/patek-watches':
  const fetchPatekWatches = await fetch('/patek/' + `${inputVal}`);
  products = await fetchPatekWatches.json()
  break;

  case '/panerai-watches':
  const fetchPaneraiWatches = await fetch('/panerai/' + `${inputVal}`);
  products = await fetchPaneraiWatches.json()
  break;

  case '/omega-watches':
  const fetchOmegaWatches = await fetch('/omega/' + `${inputVal}`);
  products = await fetchOmegaWatches.json()
  break;

case '/breitling-watches':
const fetchBreitlingWatches = await fetch('/breitling/' + `${inputVal}`);
products = await fetchBreitlingWatches.json()
break;

case '/audemars-watches':
const fetchAudemarsWatches = await fetch('/audemars/' + `${inputVal}`);
products = await fetchAudemarsWatches.json()
break;


case '/hublot-watches':
const fetchHublotWatches = await fetch('/hublot/' + `${inputVal}`);
products = await fetchHublotWatches.json()
break;

case '/tag-watches':
const fetchTagWatches = await fetch('/tag/' + `${inputVal}`);
products = await fetchTagWatches.json()
break;

}
     

    if(products.length >= 1){
      const html = products.map((product) => `
      <article class='profile-card text-center'>
      <div class='card-body'>
        <div class='row' >
  <div class="col-md-3 col-lg-4 col-sm-6 product">
    <div class="card" id="${product._id}" style="border-width: 0px;">
      <img src="${product.mainImage}" class="card-img-top img-fluid product-img" alt="${product.productName}" />
      <div class="card-body">
        <b class="card-title">${product.productName}</b>
        <h6>$${product.price}</h6>
        <button class="btn cardBtn view-product view-btn">View Details</button>
        <button class="btn cardbtn selectSize" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Add To Cart
        </button>
        <ul class="product-options">
          ${product.options.length > 0 ? product.options.map(option => `
            <li class="list-group-item" style="display: none;"><div></div><b>${option}</b></li>
          `).join('') : ''}
        </ul>
      </div>
    </div>
  </div>
  </div>
  </article>
`).join('');

      document.querySelector("#searchResults").innerHTML = html;
      
      const showModalSizeBtns = document.querySelectorAll(".selectSize");
      const viewBtns = document.querySelectorAll(".view-product");
      showModalSizeBtns.forEach(btn =>{
        btn.addEventListener("click", showModalOptions)});
        
    viewBtns.forEach(btn=>{
        btn.addEventListener("click", viewPage);
      });
    } else{
      const noResults = `<h1 style="color: black;"> No Results</h1>`;
      const div = document.createElement("div");
      div.innerHTML = noResults;
      document.querySelector("#searchResults").innerHTML = '';
      document.querySelector('#searchResults').append(div);
      document.querySelector("#searchResults").getElementsByTagName('div')[0].style.marginBottom = "400px"; //keeps footer at bottom if no results found 🤷‍♂️
    }
  }catch(err){
    console.log(err)
  }});
  /////////////////////////END SEARCH BAR /SEARCH ITEM BY ITS PATHNAME/////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////ADD PRODUCT TO CART//////////////////////////////////////

  addToCartBtn.addEventListener("click", async (e)=>{
      const el = e.target;
      const parent = el.parentElement.parentElement;
      // console.log(parent);
      const productId = parent.querySelector('ul').id;
      const optionsBtns = parent.querySelectorAll('li');
      let option;
          let itemId;
          let elementOption; 
          let reg = /^[a-zA-Z\d\s:.]+$/;
          //sanitize to ensure only letters and colons input for color options
          for(let i = 0; i < optionsBtns.length; i++){ // get the user selected size by the color which is yellow
            if(optionsBtns[i].style.backgroundColor === "yellow"){
             elementOption = optionsBtns[i];
              option = optionsBtns[i].innerText; //get the innerText which is th option chose by user
              if(reg.test(option)){
                itemId = {id: productId, option: option}; // add option and product id to object
                // console.log(itemId);
              } else {
                alert("Error!"); 
                return;
              }
            }
          };

          if(!elementOption){ // if nothing selected aler user
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
                  <img src="${product.product.mainImage}" class="card-img-top cart-img " style="width: 50%;" alt="..." />
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
  
  ////////////////////////END FUNCTION FOR ADDING PRODUCT TO CART/////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Pagination Function to Show More Products////////////////////////////////////
  
  const paginatePage = async(e)=>{
    let pageNum = e.target.innerText;
    let digitReg = /^\d+$/;
    //ensure that only numbers are used for page numbers
    if(!digitReg.test(pageNum)){
alert("Error!");
return;
    }
    let products;
    //switch statement to determine which route to fetch based on the pathname

    switch(window.location.pathname){
        case '/allproducts':
        const fetchAll = await fetch('/more-products-all', 
        {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({pageNumber: pageNum})
    });
        products = await fetchAll.json();
        break;


        case '/women':
        const fetchWomen = await fetch('/more-products-women', 
        {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({pageNumber: pageNum})
    });
        products = await fetchWomen.json();
        break;


        case '/men':
        const fetchMen = await fetch('/more-products-men', 
        {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({pageNumber: pageNum})
    });
        products = await fetchMen.json();
        break;

        case '/rolex-watches':
          const fetchRolex = await fetch('/more-products-rolex', 
          {
      method: "POST",
      headers: {'Content-Type': "application/json"},
      body: JSON.stringify({pageNumber: pageNum})
      });
          products = await fetchRolex.json();
          break;


        case '/women-clothing':
        const fetchWomenClothing = await fetch('/more-products-women-clothing', 
        {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({pageNumber: pageNum})
    });
        products = await fetchWomenClothing.json();
        break;


        case '/men-clothing':
        const fetchMenClothing = await fetch('/more-products-men-clothing', 
        {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({pageNumber: pageNum})
    });
        products = await fetchMenClothing.json();
        break;


        case '/women-bags':
        const fetchWomenBags = await fetch('/more-products-women-bags', 
        {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({pageNumber: pageNum})
    });
        products = await fetchWomenBags.json();
        break;


        case '/men-bags':
        const fetchMenBags = await fetch('/more-products-men-bags', 
        {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({pageNumber: pageNum})
    });
        products = await fetchMenBags.json();
        break;


        case '/women-shoes':
        const fetchWomenShoes = await fetch('/more-products-women-shoes', 
        {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({pageNumber: pageNum})
    });
        products = await fetchWomenShoes.json();
        break;


        case '/men-shoes':
        const fetchMenShoes = await fetch('/more-products-men-shoes', 
        {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({pageNumber: pageNum})
    });
        products = await fetchMenShoes.json();
        break;


        case '/women-watches-and-jewelry':
        const fetchWomenWatches = await fetch('/more-products-women-watches-jewelry', 
        {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({pageNumber: pageNum})
    });
        products = await fetchWomenWatches.json();
        break;


    case '/men-watches-and-jewelry':
    const fetchMenWatches = await fetch('/more-products-men-watches-jewelry', 
    {
method: "POST",
headers: {'Content-Type': "application/json"},
body: JSON.stringify({pageNumber: pageNum})
});
    products = await fetchMenWatches.json();
    break;


    case '/men-sunglasses':
    const fetchMenSunglasses = await fetch('/more-products-men-sunglasses', 
    {
method: "POST",
headers: {'Content-Type': "application/json"},
body: JSON.stringify({pageNumber: pageNum})
});
    products = await fetchMenSunglasses.json();
    break;


  case '/women-sunglasses':
    const fetchWomenSunglasses = await fetch('/more-products-women-sunglasses', 
    {
method: "POST",
headers: {'Content-Type': "application/json"},
body: JSON.stringify({pageNumber: pageNum})
});
    products = await fetchWomenSunglasses.json();
    break;


  case '/rolex-watches':
    const fetchRolexWatches = await fetch('/more-products-rolex', 
    {
method: "POST",
headers: {'Content-Type': "application/json"},
body: JSON.stringify({pageNumber: pageNum})
});
    products = await fetchRolexWatches.json();
    break;

      
  case '/patek-watches':
    const fetchPatekWatches = await fetch('/more-products-patek', 
    {
method: "POST",
headers: {'Content-Type': "application/json"},
body: JSON.stringify({pageNumber: pageNum})
});
  products = await fetchPatekWatches.json();
  break;


  case '/panerai-watches':
    const fetchPaneraiWatches = await fetch('/more-products-panerai', 
    {
method: "POST",
headers: {'Content-Type': "application/json"},
body: JSON.stringify({pageNumber: pageNum})
});
  products = await fetchPaneraiWatches.json();
  break;
    

  case '/omega-watches':
    const fetchOmegaWatches = await fetch('/more-products-omega', 
    {
method: "POST",
headers: {'Content-Type': "application/json"},
body: JSON.stringify({pageNumber: pageNum})
});
  products = await fetchOmegaWatches.json();
  break;


  case '/breitling-watches':
    const fetchBreitlingWatches = await fetch('/more-products-breitling', 
    {
method: "POST",
headers: {'Content-Type': "application/json"},
body: JSON.stringify({pageNumber: pageNum})
});
  products = await fetchBreitlingWatches.json();
  break;


  case '/audemars-watches':
    const fetchAudemarsWatches = await fetch('/more-products-audemars', 
    {
method: "POST",
headers: {'Content-Type': "application/json"},
body: JSON.stringify({pageNumber: pageNum})
});
  products = await fetchAudemarsWatches.json();
  break;


  case '/hublot-watches':
    const fetchHublotWatches = await fetch('/more-products-hublot', 
    {
method: "POST",
headers: {'Content-Type': "application/json"},
body: JSON.stringify({pageNumber: pageNum})
});
  products = await fetchHublotWatches.json();
  break;


  case '/tag-watches':
    const fetchTagWatches = await fetch('/more-products-tag', 
    {
method: "POST",
headers: {'Content-Type': "application/json"},
body: JSON.stringify({pageNumber: pageNum})
});
  products = await fetchTagWatches.json();
  break;

  } //end switch



      if(products.products.length >= 1){
      const html = products.products.map((product) => `
      <article class='profile-card text-center'>
      <div class='card-body'>
        <div class='row' >
  <div class="col-md-3 col-lg-4 col-sm-6 product">
    <div class="card" id="${product._id}" style="border-width: 0px;">
      <img src="${product.mainImage}" class="card-img-top img-fluid  product-img" alt="${product.productName}" />
      <div class="card-body">
        <b class="card-title">${product.productName}</b>
        <h6>$${product.price}</h6>
        <button class="btn cardBtn view-product view-btn">View Details</button>
        <button class="btn cardbtn selectSize" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Add To Cart
        </button>
        <ul class="product-options">
          ${product.options.length > 0 ? product.options.map(option => `
            <li class="list-group-item" style="display: none;"><div></div><b>${option}</b></li>
          `).join('') : ''}
        </ul>
      </div>
    </div>
  </div>
  </div>
  </article>
`).join('');
document.querySelector("#searchResults").innerHTML = html;

const showModalSizeBtns = document.querySelectorAll(".selectSize");
const viewBtns = document.querySelectorAll(".view-product");
showModalSizeBtns.forEach(btn =>{
      btn.addEventListener("click", showModalOptions)});
      
      viewBtns.forEach(btn=>{
        btn.addEventListener("click", viewPage);
      });
      window.scrollTo({
        top: 0,
        behavior: "auto" // You can change this to "auto" for instant scrolling
    });
      


    } else{
    
          const noResults = `<h1 style="color: black !important;"> No Results</h1>`;
          const div = document.createElement("div");
          div.innerHTML = noResults;
          document.querySelector("#searchResults").innerHTML = '';
          document.querySelector('#searchResults').append(div);
          document.querySelector("#searchResults").getElementsByTagName('div')[0].style.marginBottom = "400px"; //keeps footer at bottom if no results found 🤷‍♂️
      };
  }

  paginationNumberBtn.forEach(btn=>{
    btn.addEventListener("click", paginatePage);
  })

//////////////////////////////END PAGINATION/////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////DYNAMICALLY CHANGE HOW MANY PAGINATION BUTTONS ARE ON PAGE////////////////////////////////////////

const totalPages = document.querySelectorAll(".pagination-page-number").length;


const changePaginateButtons = async (e) => {
  const currentPage = parseInt(e.target.innerText);

  const visibleRange = 5;

  // Calculate startPage and endPage
  let startPage = Math.max(1, currentPage - Math.floor(visibleRange / 2));
  let endPage = Math.min(totalPages, startPage + visibleRange - 1);

  // Adjust startPage and endPage to ensure visible range and keep first and last buttons visible
  if (endPage - startPage < visibleRange - 1) {
    startPage = Math.max(1, endPage - visibleRange + 1);
  }

  const paginateContainer = document.querySelector(".page-pagination-container");

  // Generate updated pagination HTML
  let paginationHTML = '';
  if (startPage > 1) {
    paginationHTML += `<div class="pagination-page-number" style="display: inline; border: 2px solid; height: 2em; width: 2em; border-radius: 99px; border-color: grey; margin: 5px;">1</div>`;
    if (startPage > 2) {
      paginationHTML += `<span style="margin: 5px;">...</span>`;
    }
  }
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `<div class="pagination-page-number" style="display: inline; border: 2px solid; height: 2em; width: 2em; border-radius: 99px; border-color: grey; margin: 5px;" data-page="${i}">${i}</div>`;
  }
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<span style="margin: 5px;">...</span>`;
    }
    paginationHTML += `<div class="pagination-page-number" data-page="${totalPages}" style="display: inline; border: 2px solid; height: 2em; width: 2em; border-radius: 99px; border-color: grey; margin: 5px;">${totalPages}</div>`;
  }

  // Update the content of the pagination container
  paginateContainer.innerHTML = paginationHTML;

  // Add click event listeners to the updated pagination numbers
  const updatedPaginationNumbers = document.querySelectorAll(".pagination-page-number");
  updatedPaginationNumbers.forEach((btn) => {
    btn.addEventListener("click", changePaginateButtons);
    btn.addEventListener("click", paginatePage);
  });
};

paginationNumberBtn.forEach((btn) => {
  btn.addEventListener("click", changePaginateButtons);
});


//when page first loads click the first pagination button so the pagination buttons are formatted correctly, otherwise they will overflow the page
document.addEventListener("DOMContentLoaded", ()=>{
  paginationNumberBtn[0].click()
})


///////////////////////////////END DYNAMICALLY CHANGE HOW MANY PAGINATION BUTTONS ARE ON PAGE////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
