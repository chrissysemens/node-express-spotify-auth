var express = require('express');
var querystring = require('querystring');
var request = require('request');
var router = express.Router();
var stateKey = 'spotify_auth_state';

/* GET callback page */
router.get('/', function(req, res, next) {

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  // Check to ensure the state matches.
  if (state === null || state !== storedState) {
    
    // if it doesn't, error!
    res.redirect('/error?' +
      querystring.stringify({
        error: 'state_mismatch'
      }));

  } else {
    // if state matches, clear the stateKey cookie, we're finished with it
    res.clearCookie(stateKey);

    // prepare a token request
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
      },
      json: true
    };
  };

  // Request a token
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      // got a token
      var access_token = body.access_token,
          refresh_token = body.refresh_token;

          res.redirect(process.env.FINAL_RESPONSE_URI + '?' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));

    } else {
      // or error
      res.redirect('/error?' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
  });
});

module.exports = router;