var mysql = require('mysql');
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var userModel = require('../models/userModel')

var secretKey = 'tagboard_secretkey'
var salt = bcrypt.genSaltSync(10)

exports.getUser = function(req, res) {
    userModel.getAllUser((err, data) => {
        if (err) throw err
        console.log(data)
        res.json(data)
    })
}

exports.login = function(req, res) {
    userModel.getUserByUsername(req.body.username, (err, data) => {
        if(err) throw err
        console.log(data[0])
        var user = data[0]
        bcrypt.compare(req.body.password, user.password, function(err, bool) {
            console.log(bool)
            if (bool) {
                var token = jwt.sign({ userid: user.user_id, username: user.username }, secretKey)
                res.json({'token': token})
            }
            else {
                res.status(401)
            }
        });
    })
}

exports.verifying = function(req, res) {
    if (req.headers.authentication) {
        var token = req.headers.authentication
        jwt.verify(token, secretKey, function(err, result){
            var uid = result.userid
            userModel.getUserByUserId(uid, function(err, data) {
                if (err) throw err
                console.log(data)
                next()
            })
        })
    }
}

exports.createUser = function(req, res) {
    pool.getConnection(function(err, connection) {
        var sql = "INSERT INTO user (username, password, name, email, bio, imgurl, created_at, updated_at) VALUES ?"
        var date = new Date()
        var data = req.body
        var values = [
            [data.username, bcrypt.hashSync(data.password, salt), data.name, data.email, data.bio, data.imgurl, date, date]
        ]
        connection.query(sql, [values], function(err, result){
            if(err) throw err
            connection.release()
            res.json(result)
        })
    })
}