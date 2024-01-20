const proxyDiv = document.querySelectorAll(".proxy");
const vpnDiv = document.querySelectorAll(".vpn");
const blockBtn = document.getElementById("block-btn");
const categorySelect = document.getElementById("category-select");
const blockUserInput = document.getElementById("block-user-input");
const uploadPhotoInput = document.getElementById("inputGroupFile02");
const searchButton = document.getElementById('search-product');
const clearSearchBtn = document.getElementById("clear-search");
const uploadBlogInput = document.getElementById('inputGroupFile03');
const searchBlogBtn = document.getElementById('search-blog-btn');
const clearSearchBlogBtn = document.getElementById("clear-search-blog");
const addLinkPairBtn = document.querySelector('.add-link-pair');
const regIsTrue = /true/;
let selectedFiles;

//function to change color to red if user is using vpn or proxy
// const isVpnOrProxy = async () =>{
//     for(let i = 0; i < vpnDiv.length; i++){
//         if(regIsTrue.test(proxyDiv[i].textContent)){
//             proxyDiv[i].classList.add('text-bg-danger');
//         } else{
//             proxyDiv[i].classList.add('text-bg-success');
//         }

//         if( regIsTrue.test(vpnDiv[i].textContent)){
//             vpnDiv[i].classList.add('text-bg-danger');
//         } else {
//             vpnDiv[i].classList.add('text-bg-success');
//         }
//     }
// };
// isVpnOrProxy();


// function to block user
blockBtn.addEventListener("click", async ()=>{
    try{
      console.log(blockUserInput)
    if(blockUserInput.value == ""){
        alert("Must Input IP Address!");
        return;
    };
    let blockUser = {ip: blockUserInput.value};

    const fetchBlock = await fetch(window.location.origin + `/block-user`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json", },
        body: JSON.stringify(blockUser)
    });
    const result = await fetchBlock.json()
    alert(result.message);
    }catch(err){
        console.log(err);
    }
});


//function to show images that were uploaded
uploadPhotoInput.addEventListener("change", ()=>{
    selectedFiles = uploadPhotoInput.files; // Get all selected files (images)
  for(let i = 0; i < selectedFiles.length; i++){
    let imageUrl = URL.createObjectURL(selectedFiles[i]);
   let newImage = document.createElement('img');
   newImage.src = imageUrl;
   newImage.style.display = "block";
   newImage.style.height = '50%';
   newImage.style.width = '50%';
   document.getElementById('image-display-container').append(newImage);
  }
})


//function to upload new product to database
    async function uploadImages () {
      const selectedValue = categorySelect.value;
      const subCategory = document.getElementById("sub-category-select").value;
      const productName = document.getElementById("product-name");
      const productDescription = document.getElementById("product-description");
   const productOptions = document.getElementById("product-options");
      const productPrice = document.getElementById("product-price");
      // console.log(typeof productPrice);
    
      if(productPrice.value == ""){
        alert("Product Price Cannot Be Blank");
        return;
      } 
    
      if(productDescription.value == ""){
        alert("Please Enter Description!")
        return;
      }
      if(productName.value == ""){
    alert("Please Enter Name!");
        return;
      }
      if (selectedValue == "Select a Category") {
        alert(`Please select categorey!`);
        return;
      } ;

      if (subCategory == "Select a Sub Category") {
        alert(`Please select a sub categorey!`);
        return;
      } ;

      if (productOptions.value == "") {
        alert(`Please Enter A Color Name or Other Option!`);
        return;
      } ;

      const productOptionsArray = productOptions.value.split(',');
      console.log(productOptionsArray);


      const formData = new FormData(); // add each photo to the form that will be server to the server
      for(let i = 0; i < selectedFiles.length; i++){
        formData.append('photos', selectedFiles[i]);

      };

     
      
      
      
      formData.append("category", selectedValue);
      formData.append("subCategory", subCategory);
      formData.append("productName", productName.value);
      formData.append("description", productDescription.value);
      formData.append("price", productPrice.value);
      formData.append("options", productOptionsArray);
      
  
        if (selectedFiles.length > 0) {
            // console.log('Selected files:', selectedFiles);
            const response = await fetch(window.location.origin + `/upload-product`, {
                method: 'POST',
                body: formData,
              });
              const responseMessage = await response.json();
              if(responseMessage.message == `Successfully uploaded! 👍`){ // if success then alert user and reload page
                alert(responseMessage.message); 
                location.reload();

              } else {
                  alert(responseMessage.message); // if not successful than alert error message sent by server
              }
        } else {
            alert('No files selected.');
        }
    };



    //function to find product to edit

  searchButton.addEventListener("click", async ()=>{
const searchTerm = document.getElementById("search-field").value;
let editDiv = document.getElementById("image-display-container-edit-row");
editDiv.innerHTML = "";
console.log(searchTerm);

const response = await fetch(window.location.origin + `/products/${searchTerm}`);
const data = await response.json();
for(let i = 0; i < data.length; i++){
  let div = document.createElement('div');

  let htmlDiv = `<div class="card mb-3 col-8" >
  <img src="${data[i].mainImage}" class="card-img-top" alt="...">
  <div class="card-body">
  <h5>Product Name</h5>
    <h3 contenteditable="true" class="card-title product-name"> ${data[i].productName}</h3>
    <p> Product ID </p>
    <p class="product-id">${data[i]._id}</p>
    <h3>Product Description</h3>
    <p contenteditable="true" class="card-text description">${data[i].description}</p>
    <h3> Price </h3>
    <p contenteditable="true" class="product-price">${data[i].price}</p>
    <h3>Product Options</h3>
    <p contenteditable="true" class="product-option">${data[i].options}</p>
    <button class="btn btn-warning edit-product-btn">Edit Product</button>
    <button class="btn btn-danger delete-product-btn">Delete Product</button>
  </div>
</div>`;

  div.innerHTML = htmlDiv;
  editDiv.append(div);


};
const editProductBtn = document.querySelectorAll(".edit-product-btn"); // get edit and delete btns that were appened and add event listenrr to them
const deleteProductBtn = document.querySelectorAll(".delete-product-btn");

//edit product
editProductBtn.forEach(btn =>{
  btn.addEventListener("click", async (e)=>{
  const parent = e.target.parentElement.parentElement;
  let name = parent.querySelector(".product-name");
  let description = parent.querySelector(".description");
  let price = parent.querySelector(".product-price");
  let productId = parent.querySelector(".product-id");
  let productOption = parent.querySelector(".product-option");

const optionsArray = productOption.innerText.split(',');
console.log(optionsArray);


  let form = { 
    name: name.innerText, 
    description: description.innerText, 
    price: price.innerText, 
    productId: productId.innerText,
    productOptions: optionsArray
  };

  const response = await fetch(window.location.origin + `/update-product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });
const responseMessage = await response.json();

  if (responseMessage.message == "Edit Successful!") {
    alert(responseMessage.message);
  } else {
    alert(responseMessage.message);
    return;
  }
  
  })
});

//delete product
deleteProductBtn.forEach(btn => {
  btn.addEventListener("click", async (e)=>{
    const parent = e.target.parentElement.parentElement;
    let productId = parent.querySelector(".product-id").innerText;
    let form = {productId: productId};
    const response = await fetch(window.location.origin + `/delete-product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });
const responseMessage = await response.json();

  if (responseMessage.message == "Successfully deleted!") {
    alert(responseMessage.message);
    parent.innerHTML = '';
  } else {
    alert(responseMessage.message);
    return;
  }
    



  })
})
  


  });

// function to clear results if needed
  clearSearchBtn.addEventListener("click", ()=>{ 
    document.getElementById("image-display-container-edit-row").innerHTML = "";
  });



// function to get stats on visitors
  const getStats = async () =>{
    const statsFormVal = document.querySelector(".stats-form").value;
    console.log(statsFormVal)
    
    if(statsFormVal === "Show Visitors By"){
      alert("Please Choose A Time Frame!");
      return;

    }
    if(statsFormVal === "This Week"){
  const sendWeek = await fetch(window.location.origin + '/get-stats', {
    method: "POST",
    headers :{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({option: statsFormVal})
  });
  const response = await sendWeek.json();
let visitors = response.visitors
const visitorCount = visitors.length;

 
  
const html = `
<ul class="list-group">
  ${visitors.map(visitor => `
    <li class="mt-5 list-group text-bg-secondary p-3"><b>User ID: </b> ${visitor.user}</li>
    <li class="list-group-item text-bg-warning p-3"><b>IP Address: </b>${visitor.ipAddress}</li> 
    <li class="list-group-item text-bg-info p-3"><b>City: </b>${visitor.city}</li>
    <li class="list-group-item text-bg-info p-3"><b>Region: </b>${visitor.region}</li>
    <li class="list-group-item text-bg-success p-3"><b>Country: </b>${visitor.country}</li>
    <li class="list-group-item text-bg-info p-3"><b>First Visit Date: </b>${visitor.firstVisitDate}</li>
    <li class="list-group-item text-bg-info p-3"><b>Last Time Seen Date: </b>${visitor.lastSeenDate}</li>
    <li class="list-group-item text-bg-info p-3"><b>Last Time Seen Time: </b>${visitor.lastSeenTime}</li>
    <li class="list-group-item text-bg-info p-3"><b>User Agent: </b>${visitor.userAgent}</li>
    ${Object.entries(visitor.pagesVisited).map(entry => `
      <li class="list-group-item text-bg-primary p-3"><b>Visited: </b>${entry[0]} ${entry[1]}<b> Times</b></li>
    `).join('')}
    <li class="list-group-item"><b>Is Using VPN? </b>${visitor.isVpn}</li>
    <li class="list-group-item"><b>Is Using Proxy: </b>${visitor.isProxy}</li>
  `).join('')}
</ul>
`;

console.log(html);
const div = document.createElement("div"); //create new div
div.innerHTML = html; // make innerHTML the template string above
const visitorsDiv = document.querySelector(".all-visitors-div"); // get the current visitors div on page
visitorsDiv.innerHTML = ''; // clear it
visitorsDiv.append(div); // append new content
const visitorCounth5 = document.querySelector(".visitor-count-stat"); // get the count div from page
visitorCounth5.innerHTML = "";
visitorCounth5.innerText = `${visitorCount} views this week`; //make visitorCount  
  return;
}
  



if(statsFormVal === "This Month"){

  const sendMonth = await fetch(window.location.origin + '/get-stats', {
    method: "POST",
    headers :{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({option: statsFormVal})
  });
  const response = await sendMonth.json();
let visitors = response.visitors
const visitorCount = visitors.length;

 
  
const html = `
<ul class="list-group">
  ${visitors.map(visitor => `
    <li class="mt-5 list-group text-bg-secondary p-3"><b>User ID: </b> ${visitor.user}</li>
    <li class="list-group-item text-bg-warning p-3"><b>IP Address: </b>${visitor.ipAddress}</li> 
    <li class="list-group-item text-bg-info p-3"><b>City: </b>${visitor.city}</li>
    <li class="list-group-item text-bg-info p-3"><b>Region: </b>${visitor.region}</li>
    <li class="list-group-item text-bg-success p-3"><b>Country: </b>${visitor.country}</li>
    <li class="list-group-item text-bg-info p-3"><b>First Visit Date: </b>${visitor.firstVisitDate}</li>
    <li class="list-group-item text-bg-info p-3"><b>Last Time Seen Date: </b>${visitor.lastSeenDate}</li>
    <li class="list-group-item text-bg-info p-3"><b>Last Time Seen Time: </b>${visitor.lastSeenTime}</li>
    <li class="list-group-item text-bg-info p-3"><b>User Agent: </b>${visitor.userAgent}</li>
    ${Object.entries(visitor.pagesVisited).map(entry => `
      <li class="list-group-item text-bg-primary p-3"><b>Visited: </b>${entry[0]} ${entry[1]}<b> Times</b></li>
    `).join('')}
    <li class="list-group-item"><b>Is Using VPN? </b>${visitor.isVpn}</li>
    <li class="list-group-item"><b>Is Using Proxy: </b>${visitor.isProxy}</li>
  `).join('')}
</ul>
`;

console.log(html);
const div = document.createElement("div"); //create new div
div.innerHTML = html; // make innerHTML the template string above
const visitorsDiv = document.querySelector(".all-visitors-div"); // get the current visitors div on page
visitorsDiv.innerHTML = ''; // clear it
visitorsDiv.append(div); // append new content
const visitorCounth5 = document.querySelector(".visitor-count-stat"); // get the count div from page
visitorCounth5.innerHTML = "";
visitorCounth5.innerText = `${visitorCount} views this month`; //make visitorCount  
  return;

  
  
}


if(statsFormVal === "All Time"){


  const sendAllTime = await fetch(window.location.origin + '/get-stats', {
    method: "POST",
    headers :{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({option: statsFormVal})
  });
  const response = await sendAllTime.json();
let visitors = response.visitors
const visitorCount = visitors.length;

 
  
const html = `
<ul class="list-group">
  ${visitors.map(visitor => `
    <li class="mt-5 list-group text-bg-secondary p-3"><b>User ID: </b> ${visitor.user}</li>
    <li class="list-group-item text-bg-warning p-3"><b>IP Address: </b>${visitor.ipAddress}</li> 
    <li class="list-group-item text-bg-info p-3"><b>City: </b>${visitor.city}</li>
    <li class="list-group-item text-bg-info p-3"><b>Region: </b>${visitor.region}</li>
    <li class="list-group-item text-bg-success p-3"><b>Country: </b>${visitor.country}</li>
    <li class="list-group-item text-bg-info p-3"><b>First Visit Date: </b>${visitor.firstVisitDate}</li>
    <li class="list-group-item text-bg-info p-3"><b>Last Time Seen Date: </b>${visitor.lastSeenDate}</li>
    <li class="list-group-item text-bg-info p-3"><b>Last Time Seen Time: </b>${visitor.lastSeenTime}</li>
    <li class="list-group-item text-bg-info p-3"><b>User Agent: </b>${visitor.userAgent}</li>
    ${Object.entries(visitor.pagesVisited).map(entry => `
      <li class="list-group-item text-bg-primary p-3"><b>Visited: </b>${entry[0]} ${entry[1]}<b> Times</b></li>
    `).join('')}
    <li class="list-group-item"><b>Is Using VPN? </b>${visitor.isVpn}</li>
    <li class="list-group-item"><b>Is Using Proxy: </b>${visitor.isProxy}</li>
  `).join('')}
</ul>
`;

console.log(html);
const div = document.createElement("div"); //create new div
div.innerHTML = html; // make innerHTML the template string above
const visitorsDiv = document.querySelector(".all-visitors-div"); // get the current visitors div on page
visitorsDiv.innerHTML = ''; // clear it
visitorsDiv.append(div); // append new content
const visitorCounth5 = document.querySelector(".visitor-count-stat"); // get the count div from page
visitorCounth5.innerHTML = "";
visitorCounth5.innerText = `${visitorCount} all time visitors`; //make visitorCount  
  return;

}


  }



const getStatsBtn = document.querySelector(".show-stats");
getStatsBtn.addEventListener("click", getStats);


 //function to add another link
 const addLink = ()=>{
  const linkPair = document.querySelector(".link-pair");
  let newPair = linkPair.cloneNode(true);
  document.querySelector(".link-box").append(newPair);
  newPair.querySelector(".link-title").value = '';
  newPair.querySelector(".link").value = '';
}

addLinkPairBtn.addEventListener('click', addLink);

uploadBlogInput.addEventListener("change", ()=>{
  selectedFiles = uploadBlogInput.files; // Get all selected files (images)
for(let i = 0; i < selectedFiles.length; i++){
  let imageUrl = URL.createObjectURL(selectedFiles[i]);
 let newImage = document.createElement('img');
 newImage.src = imageUrl;
 newImage.style.display = "block";
 newImage.style.height = '50%';
 newImage.style.width = '50%';
 document.getElementById('blog-image-display-container').append(newImage);
}
})

////////////////function to upload blog/////////////

async function uploadBlog (){
const title = document.querySelector('#blog-title').value;
const content = document.querySelector('#blog-content').value;
const secondContent = document.querySelector('#blog-content-second').value;
const links = document.querySelectorAll(".link");
const linkTitles = document.querySelectorAll(".link-title");

if(title === ''){
alert('Title cannot be blank!');
return;
}

if(content === ''){
alert('Content Section Cannot Be Blank!');
return;
}


  const formData = new FormData(); // add each photo to the form that will be server to the server
  for(let i = 0; i < selectedFiles.length; i++){
    formData.append('photos', selectedFiles[i]);

  };

 
  
  
  
  formData.append("title", title);
  formData.append("content", content);

  if(secondContent !== ""){
    formData.append("secondContent", secondContent);
  }

  if(links[0] !== ""){
let linksArr = [];

//add array with link title as index 0 and the link as index 1
for(i=0; i < linkTitles.length; i++){
  linksArr.push([linkTitles[i].value, links[i].value])
}
console.log(linksArr)
    formData.append('linksArr', linksArr);
  }
  

    if (selectedFiles.length > 0) {
        // console.log('Selected files:', selectedFiles);
        const response = await fetch(window.location.origin + `/upload-blog`, {
            method: 'POST',
            body: formData,
          });
          const responseMessage = await response.json();
          if(responseMessage.message == `Successfully uploaded! 👍`){ // if success then alert user and reload page
            alert(responseMessage.message); 
            location.reload();

          } else {
              alert(responseMessage.message); // if not successful than alert error message sent by server
          }
    } else {
        alert('No files selected.');
        return;
    }
};


//function to search and edit blog

searchBlogBtn.addEventListener("click", async ()=>{
  const searchTerm = document.getElementById("search-blog").value;
  let editDiv = document.getElementById("image-display-container-edit-row-blog");
  editDiv.innerHTML = "";
  console.log(searchTerm);
  
  const response = await fetch(window.location.origin + `/blog-edit/${searchTerm}`);
  const data = await response.json();
  console.log(data.length)
  for(let i = 0; i < data.length; i++){
    let div = document.createElement('div');
  
    let htmlDiv = `<div class="card mb-3 col-8" >
    <img src="${data[i].mainImage}" class="card-img-top" alt="...">
    <div class="card-body">
    <h5>Blog Title</h5>
      <h3 contenteditable="true" class="card-title blog-title"> ${data[i].title}</h3>
      <p> Product ID </p>
      <p class="blog-id">${data[i]._id}</p>
      <h3>Main Content</h3>
      <p contenteditable="true" class="card-text main-content">${data[i].mainContent}</p>
      <h3> Second Content </h3>
      <p contenteditable="true" class="second-content">${data[i].secondContent}</p>
      ${data[i].links.map(link=>`
      <div class="input-group mb-3 link-pair">
      <input type="text" class="form-control mb-3 link-title"  value="${link[0]}" aria-label="Username" aria-describedby="addon-wrapping">
      <input type="text" class="form-control mb-3 link" value='${link[1]}' aria-label="Username" aria-describedby="addon-wrapping">
  </div>

  `)}

      <button class="btn btn-warning edit-blog-btn">Edit Blog</button>
      <button class="btn btn-danger delete-blog-btn">Delete Blog</button>
    </div>
  </div>`;

  
  
  div.innerHTML = htmlDiv;
  editDiv.append(div);
  };
  const editBlogBtn = document.querySelectorAll(".edit-blog-btn"); // get edit and delete btns that were appened and add event listenrr to them
  const deleteBlogBtn = document.querySelectorAll(".delete-blog-btn");
  
  //edit product
  editBlogBtn.forEach(btn =>{
    btn.addEventListener("click", async (e)=>{
    const parent = e.target.parentElement.parentElement;
    let title = parent.querySelector(".blog-title");
    let mainContent = parent.querySelector(".main-content");
    let secondContent = parent.querySelector(".second-content");
    let blogId = parent.querySelector(".blog-id");
    const links = parent.querySelectorAll(".link");
const linkTitles = parent.querySelectorAll(".link-title");

  

  
    let form = { 
      title: title.innerText, 
     mainContent: mainContent.innerText, 
      secondContent: secondContent.innerText, 
      blogId: blogId.innerText,

    };

    if(links && linkTitles){ //if links then add
      let linksArr = [];
      for(i=0; i < linkTitles.length; i++){
        linksArr.push([linkTitles[i].value, links[i].value])
      }

         form.linksArr = linksArr;
    }
  
    const response = await fetch(window.location.origin + `/update-blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });
  const responseMessage = await response.json();
  
    if (responseMessage.message === "Edit Successful!") {
      alert(responseMessage.message);
    } else {
      alert(responseMessage.message);
      return;
    }
    
    })
  });
  
  //delete blog
  deleteBlogBtn.forEach(btn => {
    btn.addEventListener("click", async (e)=>{
      const parent = e.target.parentElement.parentElement;
      let blogId = parent.querySelector(".blog-id").innerText;
      let form = {blogId: blogId};
      const response = await fetch(window.location.origin + `/delete-blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });
  const responseMessage = await response.json();
  
    if (responseMessage.message == "Successfully deleted!") {
      alert(responseMessage.message);
      parent.innerHTML = '';
    } else {
      alert(responseMessage.message);
      return;
    }
      
    })
  })
    
    });


    // function to clear results if needed
  clearSearchBlogBtn.addEventListener("click", ()=>{ 
    document.getElementById("image-display-container-edit-row-blog").innerHTML = "";
  });


 

