var mysql = require('mysql')
var pool = require('../../server')

exports.getAllUser = function(cb) {
    // console.log(pool)
    pool.getConnection(function(err, connection) {
        var sql = "SELECT * FROM user"
        connection.query(sql, function(err, result) {
            if(err) cb(err)
            // console.log(result)
            // console.log(sql)
            connection.release()
            cb(null, result)
        })
    })

    // _enqueueCallback(cb)


}

