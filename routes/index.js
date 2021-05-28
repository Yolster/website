var express = require('express');
var router = express.Router();
const request = require('request');
var settings = require('../settings.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  request({
    url: `https://api.github.com/users/${settings.github_username}/repos`,
    headers: {'user-agent': 'node.js'},
    }, async(error, response, body) => {
    if (error) return console.log(error)
    else if (!error) {
    var data = JSON.parse(body)
      res.render('index', {
        data:data,
        font: settings.fontawesome
      })
    }
})
});

module.exports = router;
