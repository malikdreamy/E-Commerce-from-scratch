const router = require('express').Router();
require('dotenv').config();
const Product = require('../../models/product');
const uniqid = require('uniqid');
const sgMail = require('@sendgrid/mail');



/////////// FUNCTION FOR AUTHENTICATING EACH USER //////////////////////
function isAuthenticated (req, res, next) { //add to every route in production to give user session id
    if(!req.session.userId){ // if no req.session.userId then add one
        req.session.userId = `${uniqid('userId-')}`;
        req.session.save(function(err){
            if (err) return next(err)
     }) 
    }
        next()

  };


/////////////////////////   HOME ROUTE    ///////////////////////////////////////
  router.get('/', isAuthenticated, async (req ,res ) => {
try{
  console.log(req.session.admin )
  if(!req.session.cart){
    req.session.cart = [];
  }
    
    const products = await Product.find().sort({ createdAt: -1 }).limit(14); // sort in desending order to show most recent product
          res.render('homepage', 
          {products: products, cart: req.session.cart});
 
}catch(error){
    console.log(error)
}});

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////// MEN ROUTE ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////
router.get('/men', isAuthenticated, async(req, res) =>{
  try {
    if (!req.session.cart) {
      req.session.cart = [];
    } 
   
    const totalCount = await Product.countDocuments({category: "Men"})
    const productsPerPage = 14;
    const totalPages = Math.ceil(totalCount / productsPerPage);
    const products = await Product.find({category: "Men"}).sort({createdAt: -1}).limit(14);

    res.render("category-pages", {products: products, name: "Men", cart: req.session.cart, totalPages: totalPages});
  } catch (error) {
    console.log(error)
  }
});

//men product search
router.get("/mens-products/:productName", async (req,res)=>{
  try{
    const reg = /^[a-zA-Z0-9]/; // ensure only letters or numbers are entered
    if (!reg.test(req.params.productName)){
      return;
    }
    if (!req.session.cart) {
      req.session.cart = [];
    } 
  const searchTerm = req.params.productName;
  const regex = new RegExp(searchTerm, 'i');
  const products = await Product.find({
    category: "Men", 
    productName: { $regex: regex }
  });
    console.log(products);
    res.json(products);

  }catch(err){
    console.log(err);
    res.json({error: err})
  }
});

// get more products on the mens page
router.post("/more-products-men", async(req,res)=>{
  try {
    let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
    if(!digitReg.test(req.body.pageNumber)){
      return;
    }
    console.log(req.body)
    const pageSize = 14;
    const pageNumber = Number(req.body.pageNumber);
    const products = await Product.find({category: "Men"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)

    res.status(200).json({products: products});
    
  } catch (error) {
    console.log(error);
  }

});


// men shoes
router.get('/men-shoes', isAuthenticated, async(req,res)=>{
try {
  if(!req.session.cart){
    req.session.cart = [];
  }
  const totalCount = await Product.countDocuments({subCategory: "Men Shoes"})
  const productsPerPage = 14;
  const totalPages = Math.ceil(totalCount / productsPerPage);
  const products = await Product.find({subCategory: "Men Shoes"}).sort({createdAt: -1}).limit(14);
  res.render("category-pages", {products: products, name: "Men Shoes", cart: req.session.cart, totalPages: totalPages});
} catch (error) {
  console.log(error);
}
});

//searching shoe route
router.get("/men-shoes/:productName", async (req,res)=>{
  try{
    
    if (!req.session.cart) {
      req.session.cart = [];
    } 
    
    const reg = /^[a-zA-Z0-9]/; // ensure only letters or numbers are entered
    if (!reg.test(req.params.productName)){
      return;
    }
  const searchTerm = req.params.productName;
  const regex = new RegExp(searchTerm, 'i');
  const products = await Product.find({
    subCategory: "Men Shoes", 
    productName: { $regex: regex }
  });
    console.log(products);
    res.json(products);

  }catch(err){
    console.log(err);
    res.json({error: err})
  }
});

// pagination for men shoes
router.post("/more-products-men-shoes", async(req,res)=>{
  try {

    let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
    if(!digitReg.test(req.body.pageNumber)){
      return;
    }
    console.log(req.body)
    const pageSize = 14;
    const pageNumber = Number(req.body.pageNumber);
    const products = await Product.find({subCategory: "Men Shoes"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)

    res.status(200).json({products: products});
    
  } catch (error) {
    console.log(error);
  }

});



//men bags
router.get('/men-bags', isAuthenticated, async(req,res)=>{
  try {
    if(!req.session.cart){
      req.session.cart = [];
    }
    const totalCount = await Product.countDocuments({subCategory: "Men Bags"})
    const productsPerPage = 14;
    const totalPages = Math.ceil(totalCount / productsPerPage);
    const products = await Product.find({subCategory: "Men Bags"}).sort({createdAt: -1}).limit(14);
    res.render("category-pages", {products: products, name: "Men Bags", cart: req.session.cart, totalPages: totalPages});
    
  } catch (error) {
    console.log(error);
  }
  });

  //searching bag route
  router.get("/men-bags/:productName", async (req,res)=>{
    try{
      const reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
    if(!reg.test(req.params.productName)){
      return;
    }
      if (!req.session.cart) {
        req.session.cart = [];
      } 
    const searchTerm = req.params.productName;
    const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({
      subCategory: "Men Bags", 
      productName: { $regex: regex }
    });
      console.log(products);
      res.json(products);
  
    }catch(err){
      console.log(err);
      res.json({error: err})
    }
  });

  // get more products on the mens bag page
router.post("/more-products-men-bags", async(req,res)=>{
  try {

    let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
    if(!digitReg.test(req.body.pageNumber)){
      return;
    }
    console.log(req.body)
    const pageSize = 14;
    const pageNumber = Number(req.body.pageNumber);
    const products = await Product.find({subCategory: "Men Bags"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)

    res.status(200).json({products: products});
    
  } catch (error) {
    console.log(error);
  }

});



  //men clothing
  router.get('/men-clothing', isAuthenticated, async(req,res)=>{
    try {
      if(!req.session.cart){
        req.session.cart = [];
      }
      const totalCount = await Product.countDocuments({subCategory: "Men Clothing"})
      const productsPerPage = 14;
      const totalPages = Math.ceil(totalCount / productsPerPage);
      const products = await Product.find({subCategory: "Men Clothing"}).sort({createdAt: -1}).limit(14);
      res.render("category-pages", {products: products, name: "Men Clothing", cart: req.session.cart, totalPages: totalPages});
    } catch (error) {
      console.log(error);
    }
    });

    //searching men clothing route
    router.get("/men-clothing/:productName", async (req,res)=>{
      try{
        const reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
    if(!reg.test(req.params.productName)){
      return;
    }
      console.log(req.params)
      const searchTerm = req.params.productName;
      const regex = new RegExp(searchTerm, 'i');
      const products = await Product.find({
        subCategory: "Men Clothing", 
        productName: { $regex: regex }
      });
        console.log(products);
        res.json(products);
    
      }catch(err){
        console.log(err);
        res.json({error: err})
      }
    });

    // get more products on the mens clothing page
router.post("/more-products-men-clothing", async(req,res)=>{
  try {
    let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
    if(!digitReg.test(req.body.pageNumber)){
      return;
    }
    console.log(req.body)
    const pageSize = 14;
    const pageNumber = Number(req.body.pageNumber);
    const products = await Product.find({subCategory: "Men Clothing"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)

    res.status(200).json({products: products});
    
  } catch (error) {
    console.log(error);
  }

});


//men watches and jewelry
router.get('/men-watches-and-jewelry', isAuthenticated, async(req,res)=>{
  try {
    if(!req.session.cart){
      req.session.cart = [];

    }

    const totalCount = await Product.countDocuments({subCategory: "Men Watches And Jewelry"})
    const productsPerPage = 14;
    const totalPages = Math.ceil(totalCount / productsPerPage);
    const products = await Product.find({subCategory: "Men Watches And Jewelry"}).sort({createdAt: -1}).limit(14);
    res.render("category-pages", {products: products, name: "Men Watches And Jewelry", cart: req.session.cart, totalPages: totalPages});
    
  } catch (error) {
    console.log(error);
  }
  });

  router.get("/men-watches-and-jewelry/:productName", async (req,res)=>{
    try{
      const reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
    if(!reg.test(req.params.productName)){
      return;
    }
    console.log(req.params)
    const searchTerm = req.params.productName;
    const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({
      subCategory: "Men Watches And Jewelry", 
      productName: { $regex: regex }
    });
      console.log(products);
      res.json(products);
  
    }catch(err){
      console.log(err);
      res.json({error: err})
    }
  });

  // get more products on the mens jewelry
router.post("/more-products-men-watches-jewelry", async(req,res)=>{
try {

  let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
  if(!digitReg.test(req.body.pageNumber)){
    return;
  }
  console.log(req.body)
  const pageSize = 14;
  const pageNumber = Number(req.body.pageNumber);
  const products = await Product.find({subCategory: "Men Watches And Jewelry"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)

  res.status(200).json({products: products});
  
} catch (error) {
  console.log(error);
}

});



router.get('/men-sunglasses', isAuthenticated, async(req,res)=>{
  try {
  
    if(!req.session.cart){
      req.session.cart = [];
    }

    const totalCount = await Product.countDocuments({subCategory: "Men Sunglasses"})
    const productsPerPage = 14;
    const totalPages = Math.ceil(totalCount / productsPerPage);
    const products = await Product.find({subCategory: "Men Sunglasses"}).sort({createdAt: -1}).limit(14);
  
    res.render("category-pages", {products: products, name: "Men Sunglasses", cart: req.session.cart, totalPages: totalPages});
    
  } catch (error) {
    console.log(error);
  }
  });

  router.get("/men-sunglasses/:productName", async (req,res)=>{
    try{
      const reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
    if(!reg.test(req.params.productName)){
      return;
    }
      
    console.log(req.params)
    const searchTerm = req.params.productName;
    const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({
      subCategory: "Men Sunglasses", 
      productName: { $regex: regex }
    });
      console.log(products);
      res.json(products);
  
    }catch(err){
      console.log(err);
      res.json({error: err})
    }
  });

  // get more products on the mens sunglasses page
router.post("/more-products-men-sunglasses", async(req,res)=>{
try {


  let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
  if(!digitReg.test(req.body.pageNumber)){
    return;
  }
  console.log(req.body)
  const pageSize = 14;
  const pageNumber = Number(req.body.pageNumber);
  const products = await Product.find({subCategory: "Men Sunglasses"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)
  res.status(200).json({products: products});
  
} catch (error) {
  console.log(error);
}

});


//////////////////////////////////////////////////////////////////////////
//////////////////// END MEN ROUTE ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////////////
////////////////////////// ALL PRODUCT ROUTE ////////////////////////
router.get('/allproducts', isAuthenticated, async(req, res) =>{
  try {
    if(!req.session.cart){
      req.session.cart = [];
    }
    const totalCount = await Product.countDocuments()
    const productsPerPage = 14;
    const totalPages = Math.ceil(totalCount / productsPerPage);
    const products = await Product.find().sort({createdAt: -1}).limit(14);

res.render('category-pages', {products: products , cart: req.session.cart, name: "All Products", totalPages: totalPages}); 
  } catch (error) {
    console.log(error)
  }
});

//route for searching product
router.get("/all-products/:productName", async (req,res)=>{
  try{
    const reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
    if(!reg.test(req.params.productName)){
      return;
    }

  const searchTerm = req.params.productName;
  const regex = new RegExp(searchTerm, 'i');
  const products = await Product.find({
    productName: { $regex: regex }
  });
    console.log(products);
    res.json(products);

  }catch(err){
    console.log(err);
    res.json({error: err})
  }
});


router.post('/more-products-all', async(req,res)=>{
  try{
  let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
  if(!digitReg.test(req.body.pageNumber)){
    return;
  }
  console.log(req.body)
  const pageSize = 14;
  const pageNumber = Number(req.body.pageNumber);
  const products = await Product.find().sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)
  res.status(200).json({products: products});

  
  }catch(error){
    console.log(error);
    res.status(500).json({message: "Internal Server Error"})
  }

});


////////////////////////// END ALL PRODUCT ROUTE ////////////////////////
/////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////
////////////////////////// WOMEN ROUTE //////////////////////////////////
router.get('/women', isAuthenticated, async(req, res) =>{
  try {
    if(!req.session.cart){
      req.session.cart = [];

    }
    const totalCount = await Product.countDocuments({category: "Women"})
    const productsPerPage = 14;
    const totalPages = Math.ceil(totalCount / productsPerPage);
    const products = await Product.find({category: "Women"}).sort({createdAt: -1}).limit(14);
 

    res.render("category-pages", {products: products, name: "Women", cart: req.session.cart, totalPages: totalPages});
  } catch (error) {
    console.log(error)
  }
});




//women product search
router.get("/womens-products/:productName", async (req,res)=>{
  try{
    const reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
    if(!reg.test(req.params.productName)){
      return;
    }

  const searchTerm = req.params.productName;
  const regex = new RegExp(searchTerm, 'i');
  const products = await Product.find({
    category: "Women", 
    productName: { $regex: regex }
  });
    console.log(products);
    res.json(products);

  }catch(err){
    console.log(err);
    res.json({error: err})
  }
})


// get more products on the womens page
router.post("/more-products-women", async(req,res)=>{
  try {
  
    let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
    if(!digitReg.test(req.body.pageNumber)){
      return;
    }
    console.log(req.body)
    const pageSize = 14;
    const pageNumber = Number(req.body.pageNumber);
    const products = await Product.find({category: "Women"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)
    res.status(200).json({products: products});
    
  } catch (error) {
    console.log(error);
  }

});



router.get('/women-shoes', isAuthenticated, async(req,res)=>{
  try {

    if(!req.session.cart){
      req.session.cart = [];

    }
    const totalCount = await Product.countDocuments({subCategory: "Women Shoes"})
    const productsPerPage = 14;
    const totalPages = Math.ceil(totalCount / productsPerPage);
  
    const products = await Product.find({subCategory: "Women Shoes"}).sort({createdAt: -1}).limit(14);
  
    res.render("category-pages", {products: products, name: "Women Shoes", cart: req.session.cart, totalPages: totalPages});
    
  } catch (error) {
    console.log(error);
  }
  });


  router.get("/women-shoes/:productName", async (req,res)=>{
    try{
      let reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
      if(!reg.test(req.params.productName)){
        return;
      }
  
      
    console.log(req.params)
    const searchTerm = req.params.productName;
    const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({
      subCategory: "Women Shoes", 
      productName: { $regex: regex }
    });
      console.log(products);
      res.json(products);
  
    }catch(err){
      console.log(err);
      res.json({error: err})
    }
  });
  
  // get more products on the womens shoes page
  router.post("/more-products-women-shoes", async(req,res)=>{
    try {
  
      let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
    if(!digitReg.test(req.body.pageNumber)){
      return;
    }
    console.log(req.body)
    const pageSize = 14;
    const pageNumber = Number(req.body.pageNumber);
    const products = await Product.find({subCategory: "Women Shoes"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)
    res.status(200).json({products: products});
      
    } catch (error) {
      console.log(error);
    }
  
  });



//women bags
router.get('/women-bags', isAuthenticated, async(req,res)=>{
  try {
    if(!req.session.cart){
      req.session.cart = [];
    }
    const totalCount = await Product.countDocuments({subCategory: "Women Bags"})
    const productsPerPage = 14;
    const totalPages = Math.ceil(totalCount / productsPerPage);
    const products = await Product.find({subCategory: "Women Bags"}).sort({createdAt: -1}).limit(14);
  
    res.render("category-pages", {products: products, name: "Women Bags", cart: req.session.cart, totalPages: totalPages});
    
  } catch (error) {
    console.log(error);
  }
  });

  router.get("/women-bags/:productName", async (req,res)=>{
    try{
      let reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
      if(!reg.test(req.params.productName)){
        return;
      }
  
      
    console.log(req.params)
    const searchTerm = req.params.productName;
    const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({
      subCategory: "Women Bags", 
      productName: { $regex: regex }
    });
      console.log(products);
      res.json(products);
  
    }catch(err){
      console.log(err);
      res.json({error: err})
    }
  });

  // get more products on the womens bag page
router.post("/more-products-women-bags", async(req,res)=>{
  try {

    let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
    if(!digitReg.test(req.body.pageNumber)){
      return;
    }
    const pageSize = 14;
    const pageNumber = Number(req.body.pageNumber);
    const products = await Product.find({subCategory: "Women Bags"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)
    res.status(200).json({products: products});
    
  } catch (error) {
    console.log(error);
  }

});



  //women clothing
  router.get('/women-clothing', isAuthenticated, async(req,res)=>{
    try {
      if(!req.session.cart){
        req.session.cart = [];
      }
      const totalCount = await Product.countDocuments({subCategory: "Women Clothing"})
      const productsPerPage = 14;
      const totalPages = Math.ceil(totalCount / productsPerPage);
      const products = await Product.find({subCategory: "Women Clothing"}).sort({createdAt: -1}).limit(14);
    
      res.render("category-pages", {products: products, name: "Women Clothing", cart: req.session.cart, totalPages: totalPages});
      
    } catch (error) {
      console.log(error);
    }
    });


    router.get("/women-clothing/:productName", async (req,res)=>{
      try{
        let reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
        if(!reg.test(req.params.productName)){
          return;
        }
    
        
      console.log(req.params)
      const searchTerm = req.params.productName;
      const regex = new RegExp(searchTerm, 'i');
      const products = await Product.find({
        subCategory: "Women Clothing", 
        productName: { $regex: regex }
      });
        console.log(products);
        res.json(products);
    
      }catch(err){
        console.log(err);
        res.json({error: err})
      }
    });

    // get more products on the womens clothing page
router.post("/more-products-women-clothing", async(req,res)=>{
  try {

    let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
    if(!digitReg.test(req.body.pageNumber)){
      return;
    }
    const pageSize = 14;
    const pageNumber = Number(req.body.pageNumber);
    const products = await Product.find({subCategory: "Women Clothing"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)
    res.status(200).json({products: products});
    
  } catch (error) {
    console.log(error);
  }

});



//women watches and jewelry
router.get('/women-watches-and-jewelry', isAuthenticated, async(req,res)=>{
  try {
    if(!req.session.cart){
      req.session.cart = [];

    }

    const totalCount = await Product.countDocuments({subCategory: "Women Watches And Jewelry"})
    const productsPerPage = 14;
    const totalPages = Math.ceil(totalCount / productsPerPage);
    const products = await Product.find({subCategory: "Women Watches And Jewelry"}).sort({createdAt: -1}).limit(14);
  
    res.render("category-pages", {products: products, name: "Women Watches And Jewelry", cart: req.session.cart, totalPages: totalPages});
    
  } catch (error) {
    console.log(error);
  }
  });

  router.get("/women-watches-and-jewelry/:productName", async (req,res)=>{
    try{
      let reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
      if(!reg.test(req.params.productName)){
        return;
      }
  
    const searchTerm = req.params.productName;
    const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({
      subCategory: "Women Watches And Jewelry", 
      productName: { $regex: regex }
    });
      console.log(products);
      res.json(products);
  
    }catch(err){
      console.log(err);
      res.json({error: err})
    }
  });

  // get more products on the mens clothing page
router.post("/more-products-women-watches-jewelry", async(req,res)=>{
try {

  let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
  if(!digitReg.test(req.body.pageNumber)){
    return;
  }
  const pageSize = 14;
  const pageNumber = Number(req.body.pageNumber);
  const products = await Product.find({subCategory: "Women Watches And Jewelry"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)
  res.status(200).json({products: products});
  
} catch (error) {
  console.log(error);
}

});



router.get('/women-sunglasses', isAuthenticated, async(req,res)=>{
  try {
    if(!req.session.cart){
      req.session.cart = [];
    }
    const totalCount = await Product.countDocuments({subCategory: "Women Sunglasses"})
    const productsPerPage = 14;
    const totalPages = Math.ceil(totalCount / productsPerPage);
    const products = await Product.find({subCategory: "Women Sunglasses"}).sort({createdAt: -1}).limit(20);
    res.render("category-pages", {products: products, name: "Women Sunglasses", cart: req.session.cart, totalPages: totalPages});
    
  } catch (error) {
    console.log(error);
  }
  });


  router.get("/women-sunglasses/:productName", async (req,res)=>{
    try{
      let reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
      if(!reg.test(req.params.productName)){
        return;
      }
  
      
    const searchTerm = req.params.productName;
    const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({
      subCategory: "Women Sunglasses", 
      productName: { $regex: regex }
    });
      console.log(products);
      res.json(products);
  
    }catch(err){
      console.log(err);
      res.json({error: err})
    }
  });

  // get more products on the mens clothing page
router.post("/more-products-women-sunglasses", async(req,res)=>{
try {
  let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
  if(!digitReg.test(req.body.pageNumber)){
    return;
  }
  const pageSize = 14;
  const pageNumber = Number(req.body.pageNumber);
  const products = await Product.find({subCategory: "Women Sunglasses"}).sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize)
  res.status(200).json({products: products});
  
} catch (error) {
  console.log(error);
}

});

////////////////////////// END WOMEN ROUTE //////////////////////////////////
///////////////////////////////////////////////////////////////////////////



////////////////////////// PRODUCT ROUTE  //////////////////////////////////
router.get("/products/:productName", async (req, res) => {
    try{
      let reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
    if(!reg.test(req.params.productName)){
      return;
    }

      
        console.log(req.params)
        const searchTerm = req.params.productName;
        const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({productName: { $regex: regex } });
  if(products){
        res.status(200).json(products);
  } else {
    res.json({message: "Nothing Found"})
  }
    }catch(err){
        res.send(err);
    }
});




//searching route, searching for particular product by id
router.get("/product/:productId", isAuthenticated, async (req, res) => { // for finding single product on the productpage before checkout
  try{
    let reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
    if(!reg.test(req.params.productId)){
      return res.render('nothingfound');

    }
        if(!req.session.cart){
      req.session.cart = [];

    }
    req.session.save(function(err){
      if (err) return next(err)
  }) 
    
    if(reg.test(req.params.productId)){

  const product = await Product.findById(req.params.productId);
  if(product){
    res.render('productpage', {product: product, cart: req.session.cart});
  return;
  }  
}
  res.render("nothingfound");

  }catch(err){
    console.log(err);
      res.render("nothingfound");
  }
});

////////////////////////// END PRODUCT ROUTE  //////////////////////////////////




////////////////////////// CART ROUTE  //////////////////////////////////
router.get('/cart', isAuthenticated, (req, res) =>{
    try{

    if (!req.session.cart) {
        req.session.cart = [];
      } 
    const cart = req.session.cart; 
     res.json(cart);
      
    }catch(err){
        console.log(err);
    }

});

router.post('/cart', isAuthenticated, async (req, res) => {
  try{
    let reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
    if(!reg.test(req.body.id)){
  return
    }
  const newItem = req.body.id; //get product id from client and find
  const product = await Product.findById(newItem);
  if (!req.session.cart) { // if no req.session.cart create one
    req.session.cart = [];
  }
  req.session.cart.push({product: product, option: req.body.option}) // add the product and the size into req.session.cart
console.log(req.session.cart);
  req.session.save(function(err){
      if (err) return next(err)
  }) 
  res.json({ message: 'Item added to cart.' });
}catch(err){
  console.log(err);
}
});




//delete item from cart
router.post('/remove-from-cart', async (req, res) => {
try{
  let reg = /^[a-zA-Z0-9]+$/; // sanitize input so it only accepts numbers or letters for the productid
  if(!reg.test(req.body.itemId)){
return
  }
  if(!req.session.cart){
req.session.cart = [];

}

  const itemId = req.body.itemId; 
  if (req.session.cart) {  
    const cartItems = req.session.cart
    for(let i = 0; i < cartItems.length; i++){
      if(cartItems[i].product._id.toString() === `${itemId}`){
        cartItems.splice([i], 1)
      }
    }
  }


  res.json({ message: 'Item removed from cart.' });
}catch(err){
  res.send(`Error, please try again.`);
}
});

//////////////////////////  END CART ROUTE  //////////////////////////////////





//////////////////////////  CONTACT US ROUTE  //////////////////////////////////
router.get("/contact-us", isAuthenticated, async (req, res)=>{
  try {
    if(!req.session.cart){
      req.session.cart = [];

    }
    req.session.save(function(err){
      if (err) return next(err)
  }) 
    res.render("contact-us", {cart: req.session.cart});
    
  } catch (error) {
    console.log(error);
  }
})



  // route for user sending email 
router.post('/email', (req,res) =>{
    try{
    const apiKey = process.env.EMAIL_KEY;

    

    sgMail.setApiKey(apiKey);

const msg = {
  to: `chinatimedirect@mail.com`, 
  from: `chinatimedirect@mail.com`, // keep as your sendgrid email or it wont send!
  subject: `New Email From Customer`,
  html: `<h3>Subject: ${req.body.subject}</h3>
  <h4>From: ${req.body.email}</h4>

  <h4 display: block;><b>Message:</b></h4>
<p>${req.body.message}</p>
  
  `,
};
const sendEmail = async () =>{
  try{
  const send = await sgMail.send(msg);
  console.log("sent");
  res.json({message: "Email Sent! We will respond within 12 hours."})
  }catch(err){
    console.log(err);
        res.json({message: 'Error Sending Email, Please Try Again!'});
  }
}
sendEmail();


}catch(err){
  res.json({message: 'Error Sending Email, Please Try Again!'})
  console.log(err);
}

  });
//////////////////////////  END CONTACT US ROUTE  //////////////////////////////////


//////////////////////////  ABOUT US ROUTE //////////////////////////////////

  router.get('/about-us', async(req,res)=>{
    if(!req.session.cart){
      req.session.cart = [];
    }

res.render('about-us', {cart: req.session.cart})

  });

//////////////////////////  END ABOUT US ROUTE //////////////////////////////////



//////////////////////////  CHECK OUT ROUTE //////////////////////////////////

  router.get('/checkout-page', isAuthenticated, async (req, res)=>{
    if(!req.session.cart){
      req.session.cart = [];
    }


    res.render('checkout-page-verification', {cart: req.session.cart});
  })

///////////////////////END CHECK OUT ROUTE/////////////////////////////////////


////////////////////////////FAQ ROUTE//////////////////////////////////////////////

router.get('/faq', isAuthenticated, async(req,res)=>{
  try {
    if(!req.session.cart){
      req.session.cart = [];
    }
    res.render('faq', {cart: req.session.cart});
    
  } catch (error) {
    console.log(error);
  }
})

/////////////////////////////END FAQ ROUTE////////////////////////////////////////////////
  

module.exports = router