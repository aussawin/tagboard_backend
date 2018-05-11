const mysql = require('mysql')
const pool = require('../../server')
const contentModel = require('../models/contentModel')
const multer = require('multer')

exports.getFeed = function(req, res) {
    contentModel.getFeed((error, data) => {
        if (error) throw error

        res.json(data)
    })
}

exports.getMostSubscriber = function(req, res) {
    contentModel.getMostSubscriber((error, data) => {
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

exports.tagSearch = function(req, res) {
    contentModel.tagSearch(req.params.tagName, (error, data) => {
        if (error) throw error  

        console.log(data)
        res.json(data)
    })
}

exports.textSearch = function(req, res) {
    contentModel.textSearch(req.params.text, (error, data) => {
        if (error) throw error

        res.json(data)
    })
}

exports.subscribeTag = function(req, res) {
    contentModel.subscribeTag(req.params.tagName, req.uid, (error, data) => {
        if (error) throw error

        res.json(data)
    })
}