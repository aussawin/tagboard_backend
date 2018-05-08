var mysql = require('mysql')
var pool = global.pool

exports.getAllUser = function(cb) {
    pool.getConnection(function(err, connection) {
        var sql = "SELECT * FROM user"
        connection.query(sql, function(err, result) {
            if(err) cb(err)
            connection.release()
            cb(null, result)
        })
    })
}

