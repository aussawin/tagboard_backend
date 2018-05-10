const mysql = require('mysql')
const pool = require('../../server')
const contentModel = require('../models/contentModel')
const multer = require('multer')

exports.getSubscribedTagPost = function(req, res) {
    contentModel.getSubscribedTagPost((error, data) => {
        if (error) throw error

        let postArray = []

        for (i in data) {
            let post = {
                "subject" : data[i].subject,
                "content" : data[i].content,
                "view" : data[i].view,
                "no_of_comment" : data[i].no_of_comment,
                "no_of_like" : data[i].no_of_like,
                "created_by" : data[i].created_by,
                "created_at" : data[i].created_at
            }

            postArray.push(post)
        }

        res.json(postArray)
    })
}

exports.getMostSubcribedTag = function(req, res) {
    contentModel.getMostSubscribed((error, data) => {
        if (error) throw error

        res.json(data)
    })
}

exports.getHotPost = function(req, res) {
    contentModel.getHotPost((error, data) => {
        if (error) throw error

        res.json(data)
    })
}

exports.addPost = function(req, res) {
    contentModel.addPost(req.body, (error, data) => {
        if (error) throw error

        res.json(data)
    })
}

exports.uploadPostImage = function(req, res) {
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/images/post/')
        },
        filename: (req, file, cb) => {
            let type = file.originalname.split('.')
            cb(null, "img-" + Date.now() + '.' + type[1])
        }
    })
    
    let upload = multer({ storage: storage }).single('image')

    upload(req, res, next => {
        res.send("/images/post/" + req.file.filename)
        console.log("upload successful")
    })
}