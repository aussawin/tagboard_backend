const mysql = require('mysql')
const database = require('../../database')
const fs = require('fs')

exports.getFeed = function(user_id, callback) {
    let sql = 'SELECT tag_id FROM user_subscribe ' +
              'WHERE user_id = ' + user_id
    
    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, null, con)
        })
        .then(result => {
            let tagArray = ''

            for (i = 0; i < result.length; i++) {
                tagArray += ' ' + result[i].tag_id + ','
            }

            tagArray = tagArray.slice(0, -1)

            sql = 'SELECT post.subject, post.created_at, post.view, post.no_of_comment, post.no_of_like, ' +
                  'tag.tag_name, post.post_id ' +
                  'FROM post_tag ' +
                  'INNER JOIN post ON post_tag.post_id = post.post_id ' +
                  'INNER JOIN tag ON tag.tag_id = post_tag.tag_id ' +
                  'WHERE post_tag.tag_id IN (' + tagArray + ') ' +
                  'ORDER BY created_at DESC '

            return database.query(sql, null, con)
        })
        .then(result => {
            var post_array = []
            var tagname_array = []
            var subject_array = []
            var created_at_array = []
            var view_array = []
            var no_of_comment_array = []
            var no_of_like_array = []

            result.forEach(element => {
                var isContain = post_array.includes(element.post_id)
                if (!isContain) {
                    post_array.push(element.post_id)
                    tagname_array.push(element.tag_name)
                    subject_array.push(element.subject)
                    created_at_array.push(element.created_at)
                    view_array.push(element.view)
                    no_of_comment_array.push(element.no_of_comment)
                    no_of_like_array.push(element.no_of_like)
                }
                else {
                    var index = post_array.indexOf(element.post_id)
                    tagname_array[index] += ',' + element.tag_name
                }
            })

            console.log(tagname_array)

            var data = []
            
            for (i=0; i<post_array.length; i++) {
                data.push({
                    post_id : post_array[i],
                    tags : tagname_array[i],
                    title : subject_array[i],
                    post_at : created_at_array[i],
                    views : view_array[i],
                    likes : no_of_like_array[i],
                    comments : no_of_comment_array[i]
                })
            }
            console.log(data)

            callback(null, data)
            database.release(con)
        })
        .catch(error => {
            console.log(error)
        })
}

exports.getMostSubscriber = function(callback) {
    let sql = 'SELECT tag.tag_name AS tag_name, COUNT(*) AS no_of_sub ' +
              'FROM user_subscribe ' +
              'INNER JOIN tag ON tag.tag_id = user_subscribe.tag_id ' +
              'GROUP BY user_subscribe.tag_id ' +
              'ORDER BY no_of_sub DESC LIMIT 5'

    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, null, con)
        })
        .then(result => {
            console.log(result)
            callback(null, result)
            database.release(con)
        })
        .catch(error => {
            console.log(error)
        })
}

exports.getHotPost = function(callback) {
    let sql = 'SELECT post_id, subject AS title FROM post ' + 
              'ORDER BY view DESC LIMIT 5'
    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, null, con)
        })
        .then(result => {
            callback(null, result)
            database.release(con)
        })
}

exports.addPost = function(user_id, data, callback) {
    let tags = data.tags.split(',')
    let sql = 'INSERT INTO post SET ?'
    let body = {
        subject : data.subject,
        content : data.content,
        view : 0,
        created_by : user_id,
        no_of_comment : 0,
        no_of_like : 0
    }
    let connection
    let postId
    let tagArray
    let status

    database.getConnection()
        .then(con => {
            connection = con

            return database.query(sql, body, connection)
        })
        .then(result => {
            if (result.affectedRows > 0) {
                postId = result.insertId
                tagArray = ''

                for (i = 0; i < tags.length; i++) {
                    tagArray += '"' + tags[i] + '",'
                }

                tagArray = tagArray.slice(0, -1)

                sql = 'SELECT tag_id from tag ' +
                      'WHERE tag.tag_name IN (' + tagArray + ')'

                return database.query(sql, null, connection)
            }
        })
        .then(result => {
            if (result.length == 0) {
                status = false
                sql = 'INSERT INTO tag (tag_name) ' +
                      'VALUES '

                for (i = 0; i < tags.length; i++) {
                    sql += '("' + tags[i] + '"),'
                }

                sql = sql.slice(0, -1)

                return database.query(sql, null, connection)
            } else {
                return result
            }
        })
        .then(result => {
            console.log(result)
            if (!status) {
                sql = 'SELECT tag_id FROM tag ' +
                      'WHERE tag.tag_name IN (' + tagArray + ')'

                return database.query(sql, null, connection)
            } else {
                return result
            }
        })
        .then(result => {
            let tagIdArray = ''

            for (i = 0; i < result.length; i++) {
                tagIdArray += '(' + postId + ', ' + result[i].tag_id + '),'
            }

            tagIdArray = tagIdArray.slice(0, -1)

            sql = 'INSERT INTO post_tag (post_id, tag_id) ' +
                  'VALUES ' + tagIdArray

            return database.query(sql, null, connection)
        })
        .then(result => {
            if (result.affectedRows > 0) {
                let response = {
                    post_id: post_id
                }

                callback(null, response)
                database.release(connection)
            }
        })
        .catch(error => {
            console.log(error)
        })
}

exports.tagSearch = function(tagName, callback) {
    let sql = 'SELECT post_tag.post_id FROM tag ' +
              'INNER JOIN post_tag ON post_tag.tag_id = tag.tag_id ' +
              'WHERE tag.tag_name = "#' + tagName + '" ' +
              'GROUP BY post_tag.post_id'
    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, null, con)
        })
        .then(result => {
            console.log(result)
            let postArray = ''

            for (i = 0; i < result.length; i++) {
                postArray += '"' + result[i].post_id + '", '
            }

            postArray = postArray.slice(0, -2)

            sql = 'SELECT post.subject, post.created_at, post.view, post.no_of_comment, post.no_of_like, ' +
                'tag.tag_name, post.post_id ' +
                'FROM post_tag ' +
                'INNER JOIN post ON post_tag.post_id = post.post_id ' +
                'INNER JOIN tag ON tag.tag_id = post_tag.tag_id ' +
                'WHERE post.post_id IN (' + postArray + ') ' +
                'ORDER BY created_at DESC'
            
            return result.length != 0? database.query(sql, null, con) : 0
        })
        .then(result => {
            let data = []

            if (result != 0) {
                var post_array = []
                var tagname_array = []
                var subject_array = []
                var created_at_array = []
                var view_array = []
                var no_of_comment_array = []
                var no_of_like_array = []

                result.forEach(element => {
                    var isContain = post_array.includes(element.post_id)
                    if (!isContain) {
                        post_array.push(element.post_id)
                        tagname_array.push(element.tag_name)
                        subject_array.push(element.subject)
                        created_at_array.push(element.created_at)
                        view_array.push(element.view)
                        no_of_comment_array.push(element.no_of_comment)
                        no_of_like_array.push(element.no_of_like)
                    }
                    else {
                        var index = post_array.indexOf(element.post_id)
                        tagname_array[index] += ',' + element.tag_name
                    }
                })

                for (i = 0; i < post_array.length; i++) {
                    data.push({
                        post_id : post_array[i],
                        tags : tagname_array[i],
                        title : subject_array[i],
                        post_at : created_at_array[i],
                        views : view_array[i],
                        likes : no_of_like_array[i],
                        comments : no_of_comment_array[i]
                    })
                }
            }

            console.log(data)

            callback(null, data)
            database.release(con)
        })
        .catch(error => {
            console.log(error)
        })
}

exports.textSearch = function(text, callback) {
    let sql = 'SELECT post_id FROM post ' +
              'WHERE (subject LIKE "%' + text + '") OR ' +
              '(subject LIKE "' + text + '%") OR ' +
              '(subject LIKE "%' + text + '%")'
    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, null, con)
        })
        .then(result => {
            let postArray = ''

            for (i = 0; i < result.length; i++) {
                postArray += ' ' + result[i].post_id + ','
            }

            postArray = postArray.slice(0, -1)

            sql = 'SELECT post.subject, post.created_at, post.view, post.no_of_comment, post.no_of_like, ' +
                  'tag.tag_name, post.post_id ' +
                  'FROM post_tag ' +
                  'INNER JOIN post ON post_tag.post_id = post.post_id ' +
                  'INNER JOIN tag ON tag.tag_id = post_tag.tag_id ' +
                  'WHERE post.post_id IN (' + postArray + ') ' +
                  'ORDER BY created_at DESC '

            return result.length != 0? database.query(sql, null, con) : 0
        })
        .then(result => {
            let data = []

            if (result != 0) {
                var post_array = []
                var tagname_array = []
                var subject_array = []
                var created_at_array = []
                var view_array = []
                var no_of_comment_array = []
                var no_of_like_array = []

                result.forEach(element => {
                    var isContain = post_array.includes(element.post_id)
                    if (!isContain) {
                        post_array.push(element.post_id)
                        tagname_array.push(element.tag_name)
                        subject_array.push(element.subject)
                        created_at_array.push(element.created_at)
                        view_array.push(element.view)
                        no_of_comment_array.push(element.no_of_comment)
                        no_of_like_array.push(element.no_of_like)
                    }
                    else {
                        var index = post_array.indexOf(element.post_id)
                        tagname_array[index] += ',' + element.tag_name
                    }
                })
                
                for (i=0; i<post_array.length; i++) {
                    data.push({
                        post_id : post_array[i],
                        tags : tagname_array[i],
                        title : subject_array[i],
                        post_at : created_at_array[i],
                        views : view_array[i],
                        likes : no_of_like_array[i],
                        comments : no_of_comment_array[i]
                    })
                }
            }

            callback(null, data)
            database.release(con)
        })
        .catch(error => {
            console.log(error)
        })
}

exports.subscribeTag = function(tagName, user_id, callback) {
    let connection
    let sql

    database.getConnection()
        .then(con => {
            connection = con
            sql = 'SELECT tag_id FROM tag ' +
                  'WHERE tag_name = ("#' + tagName + '")'

            return database.query(sql, null, connection)
        })
        .then(result => {
            sql = 'INSERT INTO tag (tag_name) VALUES ("#' + tagName + '")'

            return result.length == 0? database.query(sql, null, connection) : null
        })
        .then(result => {
            sql = 'SELECT tag_id FROM tag WHERE tag_name = "#' + tagName + '"'

            return database.query(sql, null, connection)
        })
        .then(result => {
            sql = 'INSERT INTO user_subscribe SET ?'
            let body = {
                user_id: user_id,
                tag_id: result[0].tag_id
            }

            return database.query(sql, body, connection)
        })
        .then(result => {
            let response = {
                message: "Subscribed!"
            }

            callback(null, response)
            database.release(connection)
        })
        .catch(error => {
            console.log(error)
        })
}