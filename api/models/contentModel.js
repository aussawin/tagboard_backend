var mysql = require('mysql')
var pool = require('../../server')
const tagSubscribed = []

exports.getTagSubscribed = function(callback) {
    pool.getConnection(function(error, connection) {
        if (error) throw error
        
        const sql = "SELECT tag_id FROM user_subscribe " +
                  "WHERE user_id = '1'"

        connection.query(sql, function(err, result) {
            if (err) callback(err)

            for (i = 0; i < result.length; i++) {
                tagSubscribed.push(result[i].tag_id)
            }

            connection.release()
            callback(null, result)
        })
    })
}

exports.getSubscribedTagPost = function(callback) {

    // pool.getConnection()
    //     .then( (connection) => {
    //         return connection.query('SELECT * FROM user_subscribe');
    //     })
    //     .then( (result) => {
    //         console.log(result)
    //         // do queries inside transaction
    //     })
    //     .catch( (err) => {
    //         console.log(err)
    //     })

    // let connection
    // pool.getConnection()
    //     .then(con => {
    //         connection = con
    //         const tagSubscribed = []
            // var sql = "SELECT tag_id FROM user_subscribe " +
    //                     "WHERE user_id = '1'"
    //         return connection.query(sql)
    //     })
    //     .then(result => {
    //         callback(null, result)
    //     })
    //     .catch(err => {
    //         throw err
    //     })

    // pool.getConnection(function(error, connection) {
    //     if (error) throw error

    //     const tagSubscribed = []
    //     var sql = "SELECT tag_id FROM user_subscribe " +
    //               "WHERE user_id = '1'"

    //     // connection.query(sql, function(err, result) {
    //     //     if (err) callback(err)

    //     //     for (i = 0; i < result.length; i++) {
    //     //         tagSubscribed.push(result[i].tag_id)
    //     //     }
    //     // })
        
    //     // sql = "SELECT* FROM post_tag " +
    //     //           "INNER JOIN post ON post_tag.post_id = post.post_id " +
    //     //           "WHERE post_tag.tag_id IN ('" + tagSubscribed + "') " +
    //     //           "ORDER BY created_at DESC"

    //     // connection.query(sql, function(err, result) {
    //     //     if (err) callback(err)

    //     //     callback(null, result)
    //     // })
        // let sql = "SELECT tag_id FROM user_subscribe " + "WHERE user_id = '1'"

        // connection.query(sql)
        //     .then(result => {
        //         console.log(result)
        //         callback(null ,result)
        //     })
            // .then(result => {
            //     connection.query(sql, function(err, result) {
            //         if (err) callback(err)

            //         callback(null, result)
            //         connection.release()
            //     })
            // })
            // .catch(err => {
            //     console.log(err)
            // })
    // })


    // pool.getConnection(function(error, connection) {
    //     if (error) throw error
    //     console.log('test')
    //     // connection.query('SELECT 1', (err ,res) => {
    //     //     console.log('test2')
    //     // })
    //     connection.query('SELECT 1')
    //         .then( (res) => {

    //             console.log('test')
    //         })
    //         .catch( (err) => {
    //             console.log(err)
    //         })
    // })

    // pool.getConnection().then( conn => {
    //     conn.query("SELECT 1")
    //                 .then(r => {
    //                     conn.release();
    //                     console.log(r[0]);
    //                 })
    //                 .catch(err => {
    //                     conn.release();
    //                     console.log(err);
    //                 });
    //     });
    pool.query("SELECT 1", null)
        .then(r => {
            conn.release()
            console.log('test')
        })
        .catch(err => {
            conn.release()
            console.log(err)
        })
}