const showCartItems = document.querySelector(".show-cart-items");
const removeFromCartBtn = document.querySelectorAll('.cart-remove-btn');
const checkOutBtn = document.querySelector(".check-out-cart");
const paginationNumberBtn = document.querySelectorAll(".pagination-page-number");

//helper function to make text not overflow
function truncateText(text, maxLength) {
     return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
   }

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


  const removeFromCart = async(e)=>{
    const btn = e.target;
    const itemId = {itemId: btn.parentElement.parentElement.id}
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


  showCartItems.addEventListener("click", async ()=>{
    const response = await fetch(window.location.origin + '/cart');
    const serverResponse = await response.json();
    })

    const paginatePage = async(e)=>{
        let pageNum = e.target.innerText;
        let digitReg = /^\d+$/;
        let blogs;
        //ensure that only numbers are used for page numbers
        if(!digitReg.test(pageNum)){
    alert("Error!");
    return;
        }

        const fetchBlogs = await fetch('/more-blogs', 
        {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({pageNumber: pageNum})
    });
      blogs = await fetchBlogs.json();
      const div = document.createElement('div');
      div.classList.add("row");
console.log(blogs.length)
      if(blogs.length > 0){
        const html = blogs.map((blog) => `
      
        <div class="col-md-6 mb-3 mt-3">
        <div class="card">
        <a href="/blog/${blog.title}">
        <img src="${blog.mainImage}" class="card-img-top" alt="${blog.title}">
        </a>
        <div class="card-body">
        <a href="/blog/${blog.title}" style="color:black; text-decoration: none;"><h5 class="blog-title">${blog.title}</h5></a>
        <p class="card-text">${truncateText(blog.mainContent, 75)}</p>
                    <a href="/blog/${blog.title}" class="btn btn-primary">Read Full Article</a>
                  </div>
         
        </div>
      </div>
   

  `).join('');
  div.innerHTML = html;
  document.querySelector(".searchResults").innerHTML = '';
  document.querySelector(".searchResults").append(div);
  window.scrollTo({
    top: 0,
    behavior: "auto" // You can change this to "auto" for instant scrolling
});



    } else{

        // const noResults = `<h1 style="color: black !important;"> No Results</h1>`;
        // const div = document.createElement("div");
        // div.innerHTML = noResults;
        // document.querySelector("#searchResults").innerHTML = '';
        // document.querySelector('#searchResults').append(div);
        // document.querySelector("#searchResults").getElementsByTagName('div')[0].style.marginBottom = "400px"; //keeps footer at bottom if no results found 🤷‍♂️


    }
}
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
  

paginationNumberBtn.forEach(btn=>{
    btn.addEventListener("click", paginatePage);
  })
