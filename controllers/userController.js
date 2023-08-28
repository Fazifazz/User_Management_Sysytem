const User=require('../models/userModel')
const bcrypt=require('bcrypt')

const securePassword=async (password)=>{
    try{
        const passwordHash=await bcrypt.hash(password, 10)
        return passwordHash 
    }
    catch(error){
        console.log(error.message)
    }
 
}

const loadRegister=async(req,res)=>{
    try{
      res.render('users/registration', { error: null, message: null })
    }catch(error){
     console.log(error.message);        
    }
}
const insertUser=async(req,res)=>{
    try{
      const userExists = await User.findOne({ email: req.body.email })
      if (userExists) return res.render('users/registration', { message: null, error: "User already exists." })
      const secPassword=await securePassword(req.body.password)  
      const user=new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: secPassword,
      })

      const userData=await user.save()
      if(userData){
        res.redirect('/login')
      }else{
        res.render('users/registration',{ error:"Your registration has been failed", message: null })
      }
    }catch(error){
      console.log(error.message);
    }
}

const loadLogin = async (req, res) => {
  const { error } = req.query
  try {
    res.render('users/login', { message: null, error: error ? error : null })
  } catch (error) {
    console.log(error.message);
  }
}

const validLogin = async (req, res)=>{
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.render('users/login', { message: null, error: "User not found." })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.render('users/login', { error: "Wrong password.", message: null })
    if (user.is_varified === 1) {
      req.session.user = user._id;
      res.redirect('/');
    } else {
      res.render('users/login', { error: "Please wait for the verification by the admin", message: null })
    }
  } catch (error) {
    console.log(error.message);    
  }
}

const loadIndex = async (req, res) => {
  try {
    const user = await User.findById(req.user)
    res.render('users/index', { user })
  } catch (error) {
    console.log(error.message);
  }
}

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
}

module.exports={
    loadRegister,
    insertUser,
    loadLogin,
    validLogin,
    loadIndex,
    logout,
}