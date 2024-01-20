const sendBtn = document.querySelector(".send-btn");
const emailInput = document.querySelector(".email");
const messageTextArea = document.querySelector(".message-body");
const subjectInput = document.querySelector(".subject");
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


  showCartItems.addEventListener("click", async ()=>{
    const response = await fetch(window.location.origin + '/cart');
    const serverResponse = await response.json();
    })



    //send message 
sendBtn.addEventListener("click", async () => {
    const emailReg = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const subjectReg = /^[a-zA-Z0-9\s]+$/;

    if(!emailReg.test(emailInput.value)){
    alert("Please Enter A Valid Email");
    return;
    };

    

    const messageObj = {
        email: emailInput.value,
        subject: subjectInput.value,
        message: messageTextArea.value,
    };

    const response = await fetch(window.location.origin + `/email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(messageObj)
    })
    if(response.ok){

 const serverResponse = await response.json();

 const element = document.getElementById('successModal');
 element.setAttribute("data-bs-target", "#successModal");
 element.setAttribute("data-bs-toggle", "modal");
 element.querySelector('h2').innerText = serverResponse.message;
 element.click();   
 emailInput.value = "";
 subjectInput.value = "";
 messageTextArea.value = "";
    } else{
        alert('Error Please Try Again');
        return;
    }


    


})