const router = require('express').Router();
require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Product = require('../../models/product')
const Admin = require('../../models/admin')
const BlockedUser = require('../../models/blockedVisitors');
// const DateStats = require('../../models/data');
const Visitor = require('../../models/visitor');
const Blog = require('../../models/blogModel');
const uniqid = require('uniqid'); 
const sgMail = require('@sendgrid/mail');
const path  = require('path');
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_SECRET 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'files',
    format: async (req, file) => 'jpg', // set the file format to jpg
    public_id: (req, file) => 'image-' + Date.now(), // set a custom public_id
  },
});


function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    // Convert 24-hour time to 12-hour format
    const hours12 = hours % 12 || 12;
    // Zero-pad minutes if necessary
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours12}:${formattedMinutes} ${ampm}`;
  };


  function getDate(){ // helper function for current date
    const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${month}-${day}-${year}`;
  return formattedDate;
    };

  


router.get('/admin-login', async (req,res) => { 
   

    res.render('index');
});



router.post("/is-user-blocked", async (req, res)=>{
    console.log(req.body)
    // console.log(req.body.ip)
    const isUserBlocked = await BlockedUser.find({ipAddress: req.body.ip});
    console.log(isUserBlocked.length);
    if(isUserBlocked.length > 0){
        res.json({url: req.body.url + `/block` })
    }
   
    // const isUserBlocked = await BlockedUser.find({ipAddress: req.body.ip})
    // console.log(isUserBlocked);
    

})



// logging in to admin page
router.post('/admin', async (req, res) => {
    const { username, password, url } = req.body;

    try {// Find the admin by username
        const admin = await Admin.findOne({ user: username });
        if (!admin) { // No admin found with the provided username
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Check if the provided password is correct
        const isCorrectPass = await admin.isCorrectPassword(password);
        console.log(isCorrectPass);
        if (!isCorrectPass) { // Password doesn't match
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Password is correct, login successful
        // You can generate a token or set a session here, if needed
        if(!req.session.admin){ //create admin session
            req.session.admin = `${uniqid('adminId-')}`
           
        }
        console.log(req.session.admin)
    res.status(200).json({ message: 'Login successful', adminUrl: url + `/admin-panel`});
  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


//block user if they fail password five times
router.post('/block', async (req, res) => {
    console.log(req.body.attempts);
    console.log(req.body.url);

    if (req.body.attempts === 1) {
        console.log("blocked!");
        try {
            const newBlockedUser = new BlockedUser({
                user: `${uniqid()}`,
                ipAddress: req.body.ip,
                date: `${getCurrentTime()}, ${new Date}`,
            });
            await newBlockedUser.save();
            res.json({url: req.body.url + '/block'}); // send user the blocked url
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error rendering view' });
        }
    }
});


// send this to user if they are blocked
router.get('/block', async (req, res)=>{
res.render("blocked");

});



//route for viewing admin panel
router.get('/admin-panel', async (req , res)=>{

if(!req.session.admin){ // if no admin session then send not authorized page
    res.render('not-authorized');
    return;
}

const formattedDate = getDate(); // Get the formatted date as a string (e.g., "MM-DD-YYYY")
const visitorsToday = await Visitor.find({
    lastSeenDate: {         // get the users who visited the page today
      $regex: `^${formattedDate}`, // Match strings that start with the formatted date
    },
  }).sort({lastSeenTime: -1}); // last Seen Time -1 will show the most recent visitor
  console.log(visitorsToday);

const visitors = await Visitor.find().sort({lastSeenDate: -1}).limit(50); //limit by 50

    res.render('admin-panel', { visitors: visitors, visitorsToday: visitorsToday });
})





// route to block user manually
router.post('/block-user', async (req, res)=>{

if(!req.session.admin){
    res.render('not-authorized!')
    return;
};
try{
const visitor = await Visitor.deleteOne({ipAddress: req.body.ip}); // delete user from visitor document first
console.log(visitor);
}catch(err){
    console.log('Error Finding User!')
}


try{
const blockUser = new BlockedUser({ //then add user to blocked user document
    user: `${uniqid()}`,
    ipAddress: req.body.ip.toString(),
    date: `${getDate()}`

});
await blockUser.save();
console.log(blockUser);
res.status(200).send({message: `User Blocked 👺`})
}catch(err){
    console.log('error blocking user', err)
    
}

});



//upload products
const upload = multer({ storage: storage });
router.post('/upload-product', upload.fields([{ name: 'photos' }]), async (req, res) => {
  try {
    if(!req.session.admin){
        res.status(404).json({message: `You are not authorized to perform this operation!`});
        return;
    };
    const photos = req.files['photos'];
    console.log(req.body)

    const uploadedPhotos = req.files.photos;


      let productImages = []; // empty array for product images that arent the mainImages

      for(let i = 1; i < uploadedPhotos.length; i++){
        productImages.push(uploadedPhotos[i].path);
      }
      
      const optionToArr = req.body.options.split(',');
      
      
 
    const newProduct = new Product({
        productName: req.body.productName,
        price: req.body.price,
        mainImage: uploadedPhotos[0].path.toString(), // first uploaded photo will be main photo
        category: req.body.category, //men or women
        subCategory: req.body.subCategory, // shoes, watches, bags, clothing
        options: optionToArr,
        description: req.body.description,
        images: productImages
    })

    await newProduct.save();
    res.status(200).json({
    message: `Successfully uploaded! 👍`
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({message: `error uploading , ${error}`});
  }
});



//update product
router.post('/update-product', async (req, res)=>{
    try{
    if(!req.session.admin){
        res.status(404).json({message: `You are not authorized to perform this operation!`});
        return;
    };
    console.log(req.body)

    const updatedProduct = await Product.findOneAndUpdate({_id: req.body.productId}, {
        productName: req.body.name,
        description: req.body.description,
        price: req.body.price,
        options: req.body.productOptions
     });

     await updatedProduct.save();
     console.log(updatedProduct);

res.status(200).json({message: 'Edit Successful!'})


    }catch(err){
        res.status(404).json({message: "Error"})
        console.log(err)
    }


})


//route for deleteing product
router.post('/delete-product', async (req, res)=>{
    try{
    if(!req.session.admin){
        res.status(404).json({message: `You are not authorized to perform this operation!`});
        return;
    };

    const deleteProduct = await Product.findByIdAndDelete({_id: req.body.productId});
  
    res.status(200).json({message: `Successfully deleted!`})
    }catch(err){
        res.status(404).json({message: `Error Deleting Product!, ${err}`});
    }

});



//route to post on blog
router.post('/upload-blog', upload.fields([{ name: 'photos' }]), async (req, res) => {
  try {
    if(!req.session.admin){
        res.status(404).json({message: `You are not authorized to perform this operation!`});
        return;
    };


    const uploadedPhotos = req.files.photos;


      let productImages = []; // empty array for product images that arent the mainImages

      for(let i = 1; i < uploadedPhotos.length; i++){
        productImages.push(uploadedPhotos[i].path);
      }
      
      
    const newBlog = new Blog({
       title: req.body.title,
        mainContent: req.body.content,
        mainImage: uploadedPhotos[0].path.toString(), // first uploaded photo will be main photo
        images: productImages
    })

    if(req.body.secondContent){
        newBlog.secondContent = req.body.secondContent;
    }
    console.log(req.body.linksArr);
let linksArr = req.body.linksArr.split(","); //req.body strips original array to string so turn back into array
let newArr =[];


for(i=0; i <linksArr.length; i++){
if(i % 2 == 0){ // the even numbers are the title the odd numbers are the links
  let arr = [];
arr.push(linksArr[i]); // add title to the array
arr.push(linksArr[i+1])// then add the link to array
newArr.push(arr) //then add the array to the new array to make it two dimensional

}else{
  continue; //if loop is on even increment continue
}
}

    if(req.body.linksArr){
      newBlog.links = newArr;
    }


    await newBlog.save();
    res.status(200).json({
    message: `Successfully uploaded Blog! 👍`
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({message: `error uploading , ${error}`});
  }
});


//route to get blog to edit
router.get('/blog-edit/:blogName',  async (req ,res ) => {
    try{
        if(!req.session.admin){
            res.status(404).json({message: `You are not authorized to perform this operation!`});
            return;
        };
        const reg = /^[a-zA-Z0-9?!.]+/; // ensure only letters or numbers are entered
        if (!reg.test(req.params.blogName)){
          return;
        }

     
      const searchTerm = req.params.blogName;
      const regex = new RegExp(searchTerm, 'i');
        
      const blog = await Blog.find({
        title: { $regex: regex }
      });
      if(!blog){
        res.json({message: 'nothing found'});
        return;
      }

        res.status(200).json(blog);
     
    }catch(error){
       res.status(404).json({message: `Error, ${error}`})
    }});



    //route to update blog
router.post('/update-blog', async (req, res)=>{
  try{
  if(!req.session.admin){
      res.status(404).json({message: `You are not authorized to perform this operation!`});
      return;
  };


  const updatedBlog = await Blog.findOneAndUpdate({_id: req.body.blogId}, {
     title: req.body.title,
      mainContent: req.body.mainContent,
      secondContent: req.body.secondContent,
      links: req.body.linksArr,
   });

   await updatedBlog.save();


res.status(200).json({message: 'Edit Successful!'})


  }catch(err){
      res.status(404).json({message: `Error Updating Product!, ${err}`})
  }

});


router.post('/delete-blog', async (req, res)=>{
  try{
  if(!req.session.admin){
      res.status(404).json({message: `You are not authorized to perform this operation!`});
      return;
  };
console.log(req.body.blogId)
await Blog.findByIdAndDelete({_id: req.body.blogId});

  res.status(200).json({message: `Successfully deleted!`})
  }catch(err){
      res.status(404).json({message: `Error Deleting Product!, ${err}`});
  }

});



//to get stats by week, month, year, and all time
router.post('/get-stats', async (req,res)=>{
try {

    if(!req.session.admin){
        res.status(404).json({message: `You are not authorized to perform this operation!`});
        return;
    };
    const option = req.body.option;


    if(option === "This Week"){
        // Function to get the last seven days from a given date and return it in the same format as formattedCurrentDate
function getLastSevenDays(startDate) {
    const dateParts = startDate.split('-').map(part => parseInt(part));
    const startDateObj = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
    
    const sevenDaysAgo = new Date(startDateObj);
    sevenDaysAgo.setDate(startDateObj.getDate() - 7);
    
    const month = String(sevenDaysAgo.getMonth() + 1).padStart(2, '0');
    const day = String(sevenDaysAgo.getDate()).padStart(2, '0');
    const year = sevenDaysAgo.getFullYear();
    
    return `${month}-${day}-${year}`;
  }
  
          
          // Get the current date
          const currentDate = new Date();
          const formattedCurrentDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
          
          // Calculate the start date for the last seven days
          const startDateForLastSevenDays = getLastSevenDays(formattedCurrentDate);
          console.log(formattedCurrentDate);

          console.log(getLastSevenDays(formattedCurrentDate));
          
          // Query visitors whose lastSeenDate is within the last seven days
          let visitors = await Visitor.find({
            lastSeenDate: {
              $gte: startDateForLastSevenDays,
              $lte: formattedCurrentDate, // Current date
            }
          })
         console.log(visitors);
         res.json({visitors: visitors})
         return;


    };

    if(option === "This Month"){
        function getLastThirtyDays(startDate) {
            const dateParts = startDate.split('-').map(part => parseInt(part));
            const startDateObj = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
          
            const thirtyDaysAgo = new Date(startDateObj);
            thirtyDaysAgo.setDate(startDateObj.getDate() - 30);
          
            const month = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0');
            const day = String(thirtyDaysAgo.getDate()).padStart(2, '0');
            const year = thirtyDaysAgo.getFullYear();
          
            return `${month}-${day}-${year}`;
          }
          
          // Get the current date
          const currentDate = new Date();
          const formattedCurrentDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
          
          // Calculate the start date for the last 30 days
          const startDateForLastThirtyDays = getLastThirtyDays(formattedCurrentDate);
          console.log(formattedCurrentDate);
          console.log(getLastThirtyDays(formattedCurrentDate));
          
          // Query visitors whose lastSeenDate is within the last 30 days
          let visitors = await Visitor.find({
            lastSeenDate: {
              $gte: startDateForLastThirtyDays,
              $lte: formattedCurrentDate, // Current date
            }
          });
          console.log(visitors);
          res.json({ visitors: visitors });
          return;
          


    }


    if(option === "All Time"){
        let allVisitors = await Visitor.find();
        res.json({visitors: allVisitors});
        return;
        } 

    


    
} catch (error) {
    console.log(error);
}


})


module.exports = router;





