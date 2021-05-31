var express = require('express');
var router = express.Router();
const request = require('request');
var settings = require('../settings.json');

/* GET home page. */
router.get('/', function(req, res) {
  request({
    url: `https://api.github.com/users/${settings.github_username}/repos`,
    headers: {'user-agent': 'node.js'},
    }, async(error, response, body) => {
    if (error) return console.log(error)
    else if (!error) {
    var data = JSON.parse(body)
    if(data.message){
      return res.redirect(`/ratelimit`)
    }else{
      res.render('index', {
        data:data,
        font: settings.fontawesome
      })
    }
  }
})
});


router.get('/ratelimit', function(req, res, next) {
      res.render('ratelimit')
});

module.exports = router;
