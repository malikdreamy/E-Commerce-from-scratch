


const loginBtn = document.querySelector(".btn");
const getIp = async ()=>{
 
    const visitorInfo = await fetch('https://ipinfo.io/json?token=');
    const info = await visitorInfo.json();
    // console.log(info);
    let ip = info.ip;
    let city = info.city;
    let country = info.country;
    // let isVpn = info.privacy.vpn;
    // let isProxy = info.privacy.proxy;
    let postal = info.postal;
    let region = info.region;
    let pagesVisited = window.location.href
    let userAgent = navigator.userAgent;

    visitorObj = { // get visitor information
        ip: ip, 
        pagesVisited: pagesVisited, 
        city: city, 
        country: country, 
        // isVpn: isVpn, 
        // isProxy: isProxy, 
        postal: postal, 
        region: region,
        userAgent: userAgent

    };




   const sendToServer = await fetch(window.location.origin + `/visitor`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(visitorObj), // body data type must match "Content-Type" header
  });
  const response = await sendToServer.json()
  // console.log(response);
  if(sendToServer.ok){
console.log("hi");


  const sendIsUserBlock = await fetch(window.location.origin + `/is-user-blocked`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ip: ip, url: window.location.origin})
  });
  const blockResponse = await sendIsUserBlock.json();
  window.location.replace(blockResponse.url);

  



  }


}

document.addEventListener("DOMContentLoaded", getIp())





let num = 1;
let maxAttempts = 7;
const login = async()=>{
    num++;
    console.log(num);
    const username = document.querySelector(".email").value.trim();
    const password = document.querySelector(".password").value.trim();
    let reg = /^[a-zA-Z0-9]/; // ensure only numbers or letters are input into fielfd

    if(!reg.test(username)){ 
        alert(`Error!`);
        return;
    };
    if(!reg.test(password)){
        alert("Error!");
        return;
    }

    const cred = {username: username, password: password, url: window.location.origin};

    const sendToServer = await fetch(window.location.origin + `/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(cred), // body data type must match "Content-Type" header
      });

      let attempts = maxAttempts - num;

      if(sendToServer.status == "401"){
       alert(`Incorrect Password! You have ${attempts} attempts left before you are blocked!`);
      
      } else if(sendToServer.status == "200"){
        const admin = await sendToServer.json();
        const adminUrl = admin.adminUrl;
        location.replace(adminUrl); // if successful login go to adminUrl
        return;
      }

      const visitorInfo = await fetch('https://ipinfo.io/json?token=1ceaf0e8df9886');
    const info = await visitorInfo.json();
    // console.log(info);
    let ip = info.ip;
    let city = info.city;
    let country = info.country;
    // let isVpn = info.privacy.vpn;
    // let isProxy = info.privacy.proxy;
    let postal = info.postal;
    let region = info.region;
    let userAgent = navigator.userAgent;
  
    
    let visitorObj = {
        ip: ip,
        city: city,
        country: country,
        // isVpn: isVpn,
        // isProxy: isProxy,
        postal: postal,
        region: region,
        userAgent: userAgent,
        attempts: attempts,
        url: window.location.origin
    }

       const block = await fetch(window.location.origin + `/block`, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(visitorObj), 
  });
 location.replace(`${block.url}`);

};

loginBtn.addEventListener("click", login);

