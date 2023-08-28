const router = require('express').Router()
const adminController = require('../controllers/adminController');
const { isAdmin , loggedOutAdmin} = require('../middlewares/auth');


router.get('/login', loggedOutAdmin, adminController.loadLogin);
router.post('/login',loggedOutAdmin, adminController.adminLogin);

router.get('/dashboard', isAdmin,adminController.dashboard);

router.get('/users/:id/edit',isAdmin, adminController.loadEditUser)
router.put('/users/:id', isAdmin,adminController.updateUser)
router.delete('/users/:id/destroy',isAdmin, adminController.deleteUser);

router.get('/createUser', isAdmin, adminController.AdminAddUser);
router.post('/createUser', isAdmin, adminController.createUser);


router.post('/logout',isAdmin,adminController.logoutAdmin)


module.exports = router;