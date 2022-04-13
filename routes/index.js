var express = require('express');
var router = express.Router();
const request = require('request');
var settings = require('../settings.json');
var {session} = require('../app')

/* GET home page. */
router.get('/', async(req, res) => {
      res.render('index', {
        title:"Ana Sayfa - Yolster",
        settings:settings,
      })
});


router.get('/easteregg', async(req, res) => {
  res.render('easteregg', {
    title:"Easter Egg - Yolster",
    settings:settings,
  })
});


module.exports = router;
