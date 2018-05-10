module.exports = function(app){
    var controller = require('../controllers/contentController')

    app.route('/api/feed')
        .get(controller.getFeed)

    app.route('/api/mostsub')
        .get(controller.getMostSubscriber)

    app.route('/api/hotpost')
        .get(controller.getHotPost)

    app.route('/api/post')
        .post(controller.addPost)
        
    app.route('/api/uploadpostimage')
        .post(controller.uploadPostImage)

    app.route('/api/tagsearch/:tagName')
        .get(controller.tagSearch)
    
    app.route('/api/textsearch/:text')
        .get(controller.textSearch)
}