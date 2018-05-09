module.exports = function(app){
    var controller = require('../controllers/contentController')
//TESTo
    app.route('/api/getAllTag')
        .get(controller.getTagSubscribedList)

    app.route('/api/getSubscribedTagPost')
        .get(controller.getSubscribedTagPost)
}