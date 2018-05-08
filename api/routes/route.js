module.exports = function(app){
    var controller = require('../controllers/userController')

    app.route('/getuser')
        .get(controller.getUser)
    app.route('/create')
        .get(controller.createUser)
} 