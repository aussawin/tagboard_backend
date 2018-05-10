var mysql = require('mysql');
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var userModel = require('../models/userModel')

var secretKey = 'tagboard_secretkey'
var salt = bcrypt.genSaltSync(10)

exports.getAllUser = function(req, res) {
    userModel.getAllUser((err, data) => {
        if (err) throw err
        console.log(data)
        res.json(data)
    })
}

exports.getUserInfo = function(req, res) {
    console.log("req.uid : " + req.uid)
    userModel.getUserInformation(req.uid, (err, data) => {
        if (err) throw err
        console.log(data)
        res.json(data)
    })
}

exports.updateUserInformation = function(req, res) {
    var newData = req.body
    var havePwd = (newData.password == "" ? null : bcrypt.hashSync(newData.password, salt));
    console.log(havePwd)
    userModel.updateUserInformation(req.uid, newData, havePwd, function(err, data) {
        if (err) throw err
        console.log(data)
        res.json(data)
    })
}

exports.login = function(req, res) {
    console.log(req.body)
    userModel.getUserByUsername(req.body.username, (err, data) => {
        if(err) throw err
        if(data.length == 0){
            res.sendStatus(401)
        }
        else {
            console.log(data[0])
            var user = data[0]
            bcrypt.compare(req.body.password, user.password, function(err, bool) {
                if (bool) {
                    var token = jwt.sign({ userid: user.user_id, username: user.username }, secretKey)
                    res.json({'token': token})
                }
                else {
                    res.sendStatus(401)
                }
            });
        }
        
    })
}

exports.verifyToken = function(req, res, next) {
    console.log(req.headers.authorization)
    if (req.headers.authorization) {
        var token = req.headers.authorization
        var decoded = jwt.decode(token, {complete: true})
        if (decoded) {
            console.log(decoded)
            userModel.getUserByUserId(decoded.payload.userid, function(err, data) {
                if (err) throw err
                if (data.length != 0) {
                    req.uid = data[0].user_id
                    return next()
                }
                else { res.status(401).send('Invalid userid') }
            })
        }
        else { res.status(401).send('Invalid token') }
    }
    else { res.status(401).send('Cannot get header') }
    
}

exports.createUser = function(req, res) {
    var data = req.body
    var user = [[data.username, 
                bcrypt.hashSync(data.password, salt), 
                data.name, 
                data.email, 
                data.bio, 
                data.imgurl, 
                new Date(), 
                new Date()
    ]]
    userModel.createAUser(user, function(err, data) {
        if(err) throw err
        res.json(data)
    })
}