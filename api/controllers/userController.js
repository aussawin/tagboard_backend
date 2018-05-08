var mysql = require('mysql');
var pool = require('../../server')
var userModel = require('../models/userModel')

exports.getUser = function(req, res) {
    userModel.getAllUser((err, data) => {
        if (err) throw err
        console.log(data)
        res.json(data)
    })
}

exports.createUser = function(req, res) {
    pool.getConnection(function(err, connection) {
        var sql = "INSERT INTO user (username, password, name, email, bio, imgurl, created_at, updated_at) VALUES ?"
        var date = new Date()
        var values = [
            ['username1', 'password1', 'name1', 'name1@gmail.com', 'Bio1', 'url1', date, date],
            ['username2', 'password2', 'name2', 'name2@gmail.com', 'Bio2', 'url2', date, date],
            ['username3', 'password3', 'name3', 'name3@gmail.com', 'Bio3', 'url3', date, date]
        ]
        connection.query(sql, [values], function(err, result){
            if(err) throw err
            connection.release()
            res.json(result)
        })
    })
}