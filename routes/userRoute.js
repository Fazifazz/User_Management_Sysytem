const user_route = require('express').Router()
const userController = require('../controllers/userController');
const { isLogout, isLogged, isVerified } = require('../middlewares/auth')


user_route.get('/register', isLogout, userController.loadRegister);
user_route.post('/register', isLogout, userController.insertUser);

user_route.get('/login', isLogout, userController.loadLogin)
user_route.post('/login', isLogout, userController.validLogin)

user_route.get('/', isLogged, isVerified,  userController.loadIndex)
user_route.post('/logout', isLogged, userController.logout)

module.exports = user_route;

