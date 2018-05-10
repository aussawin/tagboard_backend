module.exports = function(app){
    var controller = require('../controllers/userController')
//TESTo
    app.route('/api/getAllUser')
        .get(controller.getUser)
    app.route('/api/createdUser')
        .get(controller.createUser)

} 