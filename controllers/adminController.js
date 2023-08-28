const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const loadLogin = (req, res) => {
    res.render('admin/login', { error: null, message: null })
}

const adminLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) return res.render('users/login', { message: null, error: "User not found." })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.render('users/login', { error: "Wrong password.", message: null })
        if (user.is_Admin === 1) {
            req.session.admin = user._id;
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/login?error=' + encodeURIComponent('You are not admin'))
        }
    } catch (error) {
        console.log(error.message);
    }
}

const dashboard = async (req, res) => {
    const { q } = req.query
    try {
        let users
        if (q && q.length > 0) {
            users = await User.find({ name: { $regex: ".*" + q + ".*" }, is_Admin: 0 })
        } else {
            users = await User.find({ is_Admin: 0 })
        }
        res.render('admin/dashboard', { users, q });
    } catch (error) {
        console.log(error.message);
    }
}

const loadEditUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id);
        res.render('admin/editUser', { user });
    } catch (error) {
        console.log(error);
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params
    const { name, email, mobile, is_varified } = req.body
    try {
        const user = await User.findByIdAndUpdate(id, {
            $set: {
                name,
                email,
                mobile,
                is_varified,
            }
        }, { new: true });
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error);
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOneAndDelete({ _id: id })
        if (req.session.user_session === user._id) {
            req.session.destroy();
        }
        return res.redirect("/admin/dashboard");
    } catch (error) {
        console.log(error.message);
    }
}

const AdminAddUser = async (req, res) => {
    try {
        res.render('admin/createUser', { error: null, message: null })
    } catch (error) {
        console.log(error.message);
    }
}

const logoutAdmin = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
}


// const newUser = async (req,res) => {
//   return res.render('/admin/createUser', {error: null})
// }


const createUser = async (req, res) => {
    const { name, email, password, mobile, is_varified } = req.body;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    try {
        if (!email)
            return res.render('admin/createUser', { error: "Email is required" });
        if (!emailRegex.test(email))
            return res.render("admin/user_new", {
                error: "Email must be a valid email!",
            });
        const isExists = await User.findOne({ email });
        if (isExists)
            return res.render('admin/createUser', { error: "User already exists", message: null });

        const user = new User({
            name,
            email,
            mobile,
            password,
            is_varified,
        });
        await user.save();
        return res.redirect("/admin/dashboard");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    adminLogin,
    dashboard,
    loadEditUser,
    updateUser,
    deleteUser,
    logoutAdmin,
    AdminAddUser,
    createUser,
}