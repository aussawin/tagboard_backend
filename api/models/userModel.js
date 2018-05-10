var mysql = require('mysql')
const database = require('../../database')
var pool = global.pool

exports.getAllUser = function(callback) {
    let sql = 'SELECT * FROM user'
    database.query(sql)
        .then((result) => {
            callback(null, result)
            database.release()
        }).catch((err) => {
            callback(err)
        });
}

exports.getUserByUsername = function(username, callback) {
    let sql = 'SELECT * FROM user WHERE username = "'+username+'"'
    database.query(sql)
        .then((result) => {
            callback(null, result)
            database.release()
        }).catch((err) => {
            callback(err)
        })
}

exports.getUserByUserId = function(uid, callback) {
    let sql = 'SELECT * FROM user WHERE user_id = "'+uid+'"'
    database.query(sql)
        .then((result) => {
            callback(null, result)
            database.release()
        }).catch((err) => {
            callback(err)
        })
}

exports.createAUser = function(user, callback) {
    let sql = "INSERT INTO user (username, password, name, email, bio, imgurl, created_at, updated_at) VALUES ?"
    database.query(sql, user)
        .then((result) => {
            callback(null, result)
            database.release()
        }).catch((err) => {
            callback(err)
        })
    
}