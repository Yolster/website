var express = require('express');
var router = express.Router();
const request = require('request');
var settings = require('../settings.json');
var {session} = require('../app')
var {con} = require('../app')

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
        title:"LOGIN - Yolster",
        data: data,
        font: settings.fontawesome
      })
    }}
  })
    });

    router.post('/login', async(req,res) => {

      const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM admin`, function (err, result) {
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

      if(req.body.username != veri[0].name){
        return res.redirect('/admin/login')
      }

      if(req.body.password != veri[0].password){
        return res.redirect('/admin/login')
      }

      req.session.username = req.body.username;
      req.session.password = req.body.password;
      res.redirect('/admin/dashboard')
    })

    // router/admin/dashboard
    router.get('/dashboard', async(req, res) => {

      if(!req.session.username){
        return res.redirect('/admin')
      }

      const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM admin WHERE name = ?`, [req.session.username], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

      if(veri[0].password != req.session.password){
        return res.redirect('/admin')
      } 

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
        var body = JSON.parse(body)
        if(body.message){
          return res.redirect(`/ratelimit`)
        }else{
          res.render('admin/dashboard', {
            title:"DASHBOARD - Yolster",
            sql: veri,
            blog: blog,
            data: body,
            font: settings.fontawesome
          })
        }}
      })
        });


         // router new blog
    router.get('/blog/new', async(req, res) => {

      if(!req.session.username){
        return res.redirect('/admin')
      }

      const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM admin WHERE name = ?`, [req.session.username], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

      if(veri[0].password != req.session.password){
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
          res.render('admin/new-blog', {
            title:"NEW BLOG - Yolster",
            data: body,
            font: settings.fontawesome
          })
        }}
      })
        });

        // post new blog
        router.post('/blog/new', async(req,res) => {
           
          if(!req.body.title){
            return res.redirect('/admin/blog/new')
          }
    
          if(!req.body.thumbnail){
            return res.redirect('/admin/blog/new')
          }
    
          if(!req.body.content){
            return res.redirect('/admin/blog/new')
          }

          con.query('INSERT INTO blog(title,thumbnail,content) VALUES(?,?,?)',[req.body.title, req.body.thumbnail, req.body.content], function (err, result) {
            if (err) console.log(err);
          })
    
          res.redirect('/admin/dashboard')
        })
    


        // edit blog
    router.get('/blog/:id', async(req, res) => {

      if(!req.session.username){
        return res.redirect('/admin')
      }

      const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM admin WHERE name = ?`, [req.session.username], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

      if(veri[0].password != req.session.password){
        return res.redirect('/admin')
      } 

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
          res.render('admin/edit-blog', {
            title:"EDIT BLOG - Yolster",
            blog:blog,
            data: body,
            font: settings.fontawesome
          })
        }}
      })
        });

        // post edit blog
        router.post('/blog/:id', async(req,res) => {
           
          if(!req.body.title){
            return res.redirect('/admin/blog/new')
          }
    
          if(!req.body.thumbnail){
            return res.redirect('/admin/blog/new')
          }
    
          if(!req.body.content){
            return res.redirect('/admin/blog/new')
          }

          con.query('UPDATE blog SET title = ?,thumbnail = ?,content = ? WHERE id = ?; ',[req.body.title,req.body.thumbnail,req.body.content, req.params.id], function (err, result) {
            if (err) console.log(err);
           });

          res.redirect('/admin/dashboard')
        })


                // post delete blog
                router.post('/blogdelete/:id', async(req,res) => {
        
                  con.query('DELETE FROM blog WHERE id = ?',[req.params.id], function (err, result) {
                    if (err) console.log(err);
                   });
        
                  res.redirect('/admin/dashboard')
                })
    
module.exports = router;
