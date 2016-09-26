var express = require('express');
var router = express.Router();

var ssoConfig = require("../config/sso.json");
var firebaseClientConfig = require('../config/firebase.webclient.json');


/* GET login page. 
 * Prarams: redirect_uri
 */
router.get('/', function(req, res, next) {
    var sso = {
        client: '',
        firebasetoken: '',
        error: '',
    };

    var client = req.query.redirect_uri;


    // console.log('Param:');
    // console.log(client);
    if (typeof(client) === "string") {
        // Check client in trust list
        if (clientValidate(client)) {
            sso.client = client;
        } else {
            // client is not allow
            sso.error = 'client is not in trust list';
        }
    } else {
        // Someone try to attack sso-server
        sso.error = 'please check the type of origin';
    }
    res.render('login', { title: 'Login', sso: sso, firebase: firebaseClientConfig.webclient });
});

/* origin checking */
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
