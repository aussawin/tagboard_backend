var mysql = require('mysql')
var pool = global.pool

exports.getAllUser = function(callback) {
    let sql = 'SELECT * FROM user'
    database.query(sql)
        .then((result) => {
            return result
        }).catch((err) => {
            callback(null, result)
        });
}

exports.getUserByUsername = function(username, cb) {
    pool.getConnection(function(err, connection) {
        var sql = 'SELECT * FROM user WHERE username = "'+username+'"'
        connection.query(sql, function(err, result) {
            if(err) cb(err) 
            connection.release()
            cb(null, result)
        })
    })
}

exports.getUserByUserId = function(uid, cb) {
    pool.getConnection(function(err, connection) {
        var sql = 'SELECT * FROM user WHERE user_id = "'+uid+'"'
        connection.query(sql, function(err, result) {
            if(err) cb(err) 
            connection.release()
            cb(null, result)
        })
    })
}