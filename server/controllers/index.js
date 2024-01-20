const router = require('express').Router();
const productRoute = require('./api/product');
const visitorRoute = require('./api/visitor')
const adminRoute = require('./api/admin');
const checkOutRoute = require('./api/check-out.js');
const blogRoute = require('./api/blog-route.js')


router.use('/', productRoute);
router.use('/', visitorRoute);
router.use('/', adminRoute);
router.use('/', checkOutRoute);
router.use('/', blogRoute);

module.exports = router;