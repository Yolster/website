var express = require('express');
var router = express.Router();
const request = require('request');
var settings = require('../settings.json');
var {con,session} = require('../app')

/* GET home page. */
router.get('/', function(req, res) {
  
  if(req.session.username && req.session.password){
    return res.redirect('/admin/dashboard')
  } 
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
      res.render('admin/login', {
        data: data,
        font: settings.fontawesome
      })
    }}
  })
    });

    router.post('/admin/login', async(req,res) => {
      const data = await new Promise((resolve, reject) => {
         con.query('SELECT * FROM admin',function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

      if(!req.body.username){
        return res.redirect('/admin/login')
      }

      if(!req.body.password){
        return res.redirect('/admin/login')
      }

      if(req.body.username != data[0].name){
        return res.redirect('/admin/login')
      }

      if(req.body.password != data[0].password){
        return res.redirect('/admin/login')
      }

      req.session.username = req.body.username;
      req.session.password = req.body.password;
      res.redirect('/admin/dashboard')
    })

    // router/admin/dashboard
    router.get('/dashboard', function(req, res) {
      const data = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM admin',function (err, result) {
       if (err)
           reject(err);
       resolve(result);
   });
});
  
      if(data[0].name != req.session.username){
        return res.redirect('/admin')
      } 

      if(data[0].password != req.session.password){
        return res.redirect('/admin')
      } 

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
          res.render('admin/login', {
            data: body,
            font: settings.fontawesome
          })
        }}
      })
        });

module.exports = router;
