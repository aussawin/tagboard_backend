var mysql = require('mysql')
var pool = require('../../server')
var contentModel = require('../models/contentModel')

exports.getTagSubscribedList = function(req, res) {
    contentModel.getTagSubscribed((error, data) => {
        if (error) throw error
    
        res.json(data)
    })
}

exports.getSubscribedTagPost = function(req, res) {
    contentModel.getSubscribedTagPost((error, data) => {
        if (error) throw error

        res.json(data)
    })
}