module.exports = function(app){
    var controller = require('../controllers/contentController')

    app.route('/api/getsubscribedtagpost')
        .get(controller.getSubscribedTagPost)

    app.route('/api/getmostsubcribedtag')
        .get(controller.getMostSubcribedTag)

    app.route('/api/gethotpost')
        .get(controller.getHotPost)

    app.route('/api/addpost')
        .post(controller.addPost)
        
    app.route('/api/uploadpostimage')
        .post(controller.uploadPostImage)
}