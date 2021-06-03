var express = require('express');
var router = express.Router();
const request = require('request');
var settings = require('../settings.json');
var {session} = require('../app')
var {con} = require('../app')

/* GET home page. */
router.get('/', async(req, res) => {
  
  const blog = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM blog`, function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

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
        blog:blog,
        title:"HOME - Yolster",
        data:data,
        settings:settings,
        font: settings.fontawesome
      })
    }
  }
})
});

        router.get('/blog/:id', async(req, res) => {
    
          const blog = await new Promise((resolve, reject) => {
            con.query(`SELECT * FROM blog WHERE id = ?`,[req.params.id], function (err, result) {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    
           request({
            url: `https://api.github.com/users/${settings.github_username}/repos`,
            headers: {'user-agent': 'node.js'},
            }, async(error, response, body) => {
            if (error) return console.log(error)
            else if (!error) {
            var body = JSON.parse(body)
            if(body.message){
              return res.redirect(`/ratelimit`)
            }else{
              res.render('blog', {
                title:"BLOG - Yolster",
                blog:blog,
                data: body,
                font: settings.fontawesome
              })
            }}
          })
            });

router.get('/ratelimit', function(req, res, next) {
      res.render('ratelimit')
});



module.exports = router;
