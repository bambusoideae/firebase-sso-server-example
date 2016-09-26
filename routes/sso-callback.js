var express = require('express');
var router = express.Router();


// Load sso config
var ssoConfig = require("../config/sso.json");



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('This page does not support GET method.');
});

router.post('/', function(req, res, next) {
    // console.log(req.body);
    var client = req.body.sso.client;
    var token = req.body.sso.firebasetoken;
    
    if (typeof(client) === "string" && typeof(token) === "string") {
        // Pass information
        // Check client in trust list
        if (clientValidate(client)) {
            // Redirect to client with token
            // Default redirect code is 302
            // token or code
            res.redirect(client + '?token=' + token);
            return;
            // return next();
        } else {
            // Client is not in trust list
            res.send('Client is not in trust list');
            return;
            // return next();
        }
    } else {
        // Someone try to hack.
    }

    res.send('Something wrong!');
    // return next();
});

/* 
 * Check if client in trust list
 *
 */
function clientValidate(client) {
    clientsTrustList = ssoConfig.clients;
    for (i = 0; i < clientsTrustList.length; i++) {
        if (client.startsWith(clientsTrustList[i])) {
            return true;
        }
    }

    return false;
}


module.exports = router;
