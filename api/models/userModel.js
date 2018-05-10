var mysql = require('mysql')
const database = require('../../database')
var pool = global.pool

exports.getAllUser = function(callback) {
    let sql = 'SELECT * FROM user'
    let connection
    database.getConnection()
        .then(con => {
            connection = con
            return database.query(sql, null, connection)
        })
        .then((result) => {
            callback(null, result)
            database.release(connection)
        }).catch((err) => {
            callback(err)
        });
}

exports.getUserByUsername = function(username, callback) {
    let sql = 'SELECT * FROM user WHERE username = "'+username+'"'
    let connection
    database.getConnection()
        .then(con => {
            connection = con
            return database.query(sql, null, connection)
        })
        .then((result) => {
            callback(null, result)
            database.release(connection)
        }).catch((err) => {
            callback(err)
        })
}

exports.getUserByUserId = function(uid, callback) {
    let sql = 'SELECT * FROM user WHERE user_id = "'+uid+'"'
    let connection
    database.getConnection()
        .then(con => {
            connection = con
            return database.query(sql, null, connection)
        })
        .then((result) => {
            callback(null, result)
            database.release(connection)
        }).catch((err) => {
            callback(err)
        })
}

exports.createAUser = function(user, callback) {
    let sql = "INSERT INTO user (username, password, name, email, bio, imgurl, created_at, updated_at) VALUES ?"
    console.log(user)
    let connection
    database.getConnection()
        .then(con => {
            connection = con
            return database.query(sql, [user], connection)
        })
        .then((result) => {
            console.log(result)
            callback(null, result)
            database.release(connection)
        }).catch((err) => {
            callback(err)
        })
    
}