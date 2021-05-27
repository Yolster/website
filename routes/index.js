var express = require('express');
var router = express.Router();
const request = require('request');
var settings = require('../settings.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  request({
    url: `https://discordapp.com/api/v7/users/${settings.id}`,
    headers: {
    "Authorization": `Bot ${settings.token}`
    },
    }, async(error, response, body) => {
    if (error) return console.log(error)
    else if (!error) {
    var user = JSON.parse(body)
      res.render('index', {
        user:user,
        font: settings.fontawesome
      })
    }
})
});

module.exports = router;
