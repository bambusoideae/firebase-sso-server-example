/**
 * Function called when clicking the Login/Logout button.
 */
// [START buttoncallback]
function toggleSignIn() {
    if (!firebase.auth().currentUser) {
        // [START createprovider]
        var provider = new firebase.auth.GoogleAuthProvider();
        // [END createprovider]
        // [START addscopes]
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        // [END addscopes]
        // [START signin]
        firebase.auth().signInWithRedirect(provider);
        // [END signin]
    } else {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
    // [START_EXCLUDE]
    document.getElementById('google-sign-in').disabled = true;
    // [END_EXCLUDE]
}
// [END buttoncallback]

// Sign out
function signOut() {
    firebase.auth().signOut();
    document.getElementById('firebase-sign-out').disabled = true;
}

// Submit form
function submitSSOCallbackForm() {
    document.getElementById("sso-callback-form").submit();
}

// Sign in with Google
function signInWithGoogle() {
    // [START createprovider]
    var provider = new firebase.auth.GoogleAuthProvider();
    // [END createprovider]
    // [START addscopes]
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    // [END addscopes]
    // [START signin]
    firebase.auth().signInWithRedirect(provider);
    // [END signin]


    // [START_EXCLUDE]
    document.getElementById('google-sign-in').disabled = true;
    // [END_EXCLUDE]
}

// Sign in with facebook
function signInWithFacebook() {
    // [START createprovider]
    var provider = new firebase.auth.FacebookAuthProvider();
    // [END createprovider]
    // [START addscopes]
    provider.addScope('user_likes');
    // [END addscopes]
    // [START signin]
    firebase.auth().signInWithRedirect(provider);
    // [END signin]


    // [START_EXCLUDE]
    document.getElementById('facebook-sign-in').disabled = true;
    // [END_EXCLUDE]
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 *  - firebase.auth().getRedirectResult(): This promise completes when the user gets back from
 *    the auth redirect flow. It is where you can get the OAuth access token from the IDP.
 */
function initApp() {
    // Result from Redirect auth flow.
    // [START getidptoken]
    firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // [START_EXCLUDE]
            // document.getElementById('quickstart-oauthtoken').textContent = token;
        } else {
            // document.getElementById('quickstart-oauthtoken').textContent = 'null';
            // [END_EXCLUDE]
        }
        // The signed-in user info.
        var user = result.user;
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
        } else {
            console.error(error);
        }
        // [END_EXCLUDE]
    });
    // [END getidptoken]

    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE]
            // document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            // document.getElementById('google-sign-in').textContent = 'Sign out';
            // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            
            // Enable sign out button
            document.getElementById('firebase-sign-out').disabled = false;
            
            // Disable login button
            // [START_EXCLUDE]
            document.getElementById('google-sign-in').disabled = true;
            document.getElementById('facebook-sign-in').disabled = true;
            // [END_EXCLUDE]
            

            // Set form value
            // console.log('Get accessToken');
            firebase.auth().currentUser.getToken().then(function(idToken) {
                document.getElementsByName('sso[firebasetoken]')[0].value = idToken; // user.stsTokenManager.accessToken;
                signOut();
                // document.getElementById("sso-callback-form").submit();               
                submitSSOCallbackForm();
            }).catch(function(error) {
                // Handle error
            });
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            // document.getElementById('google-sign-in').textContent = 'Sign in with Google';
            // document.getElementById('quickstart-account-details').textContent = 'null';
            // document.getElementById('quickstart-oauthtoken').textContent = 'null';
            // [END_EXCLUDE]

            // [START_EXCLUDE]
            document.getElementById('google-sign-in').disabled = false;
            document.getElementById('facebook-sign-in').disabled = false;
            // [END_EXCLUDE]
        }
    });
    // [END authstatelistener]

    document.getElementById('google-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('facebook-sign-in').addEventListener('click', signInWithFacebook, false);
    document.getElementById('firebase-sign-out').addEventListener('click', signOut, false);
}

window.onload = function() {
    initApp();
};
