module.exports = function(app){
    const controller = require('../controllers/contentController')
    const userController = require('../controllers/userController')

    app.route('/api/feed')
        .get(userController.verifyToken, controller.getFeed)

    app.route('/api/mostsub')
        .get(userController.verifyToken, controller.getMostSubscriber)

    app.route('/api/hotpost')
        .get(userController.verifyToken, controller.getHotPost)

    app.route('/api/post')
        .post(userController.verifyToken, controller.addPost)
        
    app.route('/api/uploadpostimage')
        .post(userController.verifyToken, controller.uploadPostImage)

    app.route('/api/tagsearch/:tagName')
        .get(userController.verifyToken, controller.tagSearch)
    
    app.route('/api/textsearch/:text')
        .get(userController.verifyToken, controller.textSearch)

    app.route('/api/subscribe/:tagName')
        .get(userController.verifyToken, controller.subscribeTag)
}