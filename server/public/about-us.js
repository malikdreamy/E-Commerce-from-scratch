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

  