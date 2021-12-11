var express = require('express');
var router = express.Router();
const request = require('request');
var settings = require('../settings.json');
var {session} = require('../app')

/* GET home page. */
router.get('/', async(req, res) => {

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
        title:"HOME - Yolster",
        data:data,
        settings:settings,
        font: settings.fontawesome
      })
    }
  }
})
});

router.get('/ratelimit', function(req, res, next) {
      res.render('ratelimit')
});


router.get('/404', async(req, res) => {
      res.render('404', {})
});

module.exports = router;
