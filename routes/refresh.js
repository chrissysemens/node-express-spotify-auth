var express = require('express');
var request = require('request');
var router = express.Router();

/* Refresh */
router.get('/', function(req, res, next) {
   
    var refresh_token = req.query.refresh_token;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token;
          res.send({
            'access_token': access_token
          });
        }
      });
});

module.exports = router;