module.exports = function(app){
    var userController = require('../controllers/userController')
//TESTo
    app.route('/api/getAllUser')
        .get(userController.getUser)
    app.route('/api/createdUser')
        .get(userController.createUser)

    app.route('/api/login')
        .post(userController.login)
        

} 