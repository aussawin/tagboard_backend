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

exports.getUserInformation = function(uid, callback) {
    var finalResult = []
    let connection
    database.getConnection()
        .then((con) => {
            connection = con
            let sql = 'SELECT username, name, email, bio, imgurl, COUNT(user.user_id) AS total_post FROM user ' +
                        'INNER JOIN post ' +
                        'ON post.created_by = user.user_id ' +
                        'WHERE user.user_id = '+uid
            return database.query(sql, null, connection)
        })
        .then((result) => {
            console.log(result)
            finalResult.push(result[0])
            let sql = 'SELECT COUNT(user.user_id) AS total_like FROM user ' +
                        'INNER JOIN post ' +
                        'ON post.created_by = user.user_id ' +
                        'INNER JOIN like_by ' +
                        'ON post.post_id = like_by.post_id ' +
                        'WHERE user.user_id = '+uid
            return database.query(sql, null, connection)
        })
        .then((result) => {
            console.log(result)
            finalResult.push(result[0])
            let sql = 'SELECT COUNT(user.user_id) AS total_comment FROM user ' +
                        'INNER JOIN post ' +
                        'ON post.created_by = user.user_id ' +
                        'INNER JOIN comment ' +
                        'ON post.post_id = comment.post_id ' +
                        'WHERE user.user_id = '+uid
            return database.query(sql, null, connection)
        })
        .then((result) => {
            console.log(result)
            finalResult.push(result[0])
            console.log("finalResult: " + finalResult)
            var data = {
                user_id : uid,
                username : finalResult[0].username,
                name : finalResult[0].name,
                email : finalResult[0].email,
                bio : finalResult[0].bio,
                imgurl : finalResult[0].imgurl,
                total_post : finalResult[0].total_post,
                total_like : finalResult[1].total_like,
                total_comment : finalResult[2].total_comment
            }
            callback(null, data)
            database.release(connection)
        }).catch((err) => {
            callback(err)
        })
}

exports.updateUserInformation = function(uid, newUser, havePwd, callback) {
    var pwdPhase = (havePwd == null ? '' : ', password = "' + havePwd + '" ');
    console.log("pwd : " + pwdPhase + " havePwd" + havePwd )
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sql = 'UPDATE user ' + 
                'SET username = "' + newUser.username + '", ' +
                'bio = "' + newUser.bio + '", ' + 
                'email = "' + newUser.email + '", ' +
                'imgurl = "' + newUser.imgurl + '", ' +
                'updated_at = "' + date + '" ' +
                pwdPhase +
                'WHERE user_id= ' +uid
    console.log(sql)
    database.getConnection()
        .then(con => {
            connection = con
            return database.query(sql, null, connection)
        })
        .then((result) => {
            console.log(result)
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