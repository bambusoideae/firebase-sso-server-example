var express = require('express');
var router = express.Router();


/* Include all others routers */
router.use('/sso-callback', require('./sso-callback'));
router.use('/login', require('./login'));


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET /test?token=abc */
router.get('/test', function(req, res, next) {
    // console.log('Token: ' + req.query.token); 
    res.redirect('/');
});


module.exports = router;
