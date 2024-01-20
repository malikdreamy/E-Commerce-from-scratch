const router = require('express').Router();
require('dotenv').config();
const Product = require('../../models/product');
const Blog = require('../../models/blogModel');
const uniqid = require('uniqid');


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


/////////////////////////   BLOG ROUTE    ///////////////////////////////////////
  router.get('/blogs', isAuthenticated, async (req ,res ) => {
try{
  if(!req.session.cart){
    req.session.cart = [];
  }

  const totalCount = await Blog.countDocuments()
  const productsPerPage = 14;
  const totalPages = Math.ceil(totalCount / productsPerPage);
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(10); // sort in desending order to show most recent product
          res.render('blogs', {blogs: blogs, cart: req.session.cart, totalPages: totalPages});
 
}catch(error){
    console.log(error)
}});




router.get('/blog/:blogName', isAuthenticated,  async (req ,res ) => {
    try{
        const reg = /^[a-zA-Z0-9?!.]+/; // ensure only letters or numbers are entered
        if (!reg.test(req.params.blogName)){
          return;
        }

      if(!req.session.cart){
        req.session.cart = [];
      }
      const searchTerm = req.params.blogName;
      const regex = new RegExp(searchTerm, 'i');
        
      const blog = await Blog.findOne({
        title: { $regex: regex }
      });
      if(!blog){
        res.render('nothingfound');
        return;
      }

 res.render('blog', {blog: blog, cart: req.session.cart});
     
    }catch(error){
        console.log(error)
    }});



    router.post("/more-blogs", async(req,res)=>{
        try {
          let digitReg = /^\d+$/; //if pagenumber isnt a number do nothing and return
          if(!digitReg.test(req.body.pageNumber)){
            return;
          }
          const pageSize = 14;
          const pageNumber = Number(req.body.pageNumber);
          const blogs = await Blog.find().sort({createdAt: -1}).skip(pageSize *(pageNumber -1)).limit(pageSize);
      
          res.status(200).json(blogs);
          
        } catch (error) {
            res.status(500).json({message: 'Error'})
          console.log(error);
        }
      
      });


module.exports = router