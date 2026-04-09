const User = require('../models/user');								
								
exports.registerForm = (req, res) => {								
  res.render('users/register', { title: 'Đăng ký tài khoản' });								
};								
exports.register = async (req, res) => {								
  try {		
    console.log(req.body);						
    await User.create(req.body);								
    res.redirect('/users/login');								
  } catch (err) {			
    console.log(err);					
    res.status(400).send('Lỗi đăng ký: ' + err.message);								
  }								
};								
exports.loginForm = (req, res) => {								
  res.render('users/login', { title: 'Đăng nhập' });								
};								
exports.login = async (req, res) => {								
  const { username, password } = req.body;								
  const user = await User.findOne({ username });								
  if (!user) return res.send('Sai tài khoản hoặc mật khẩu');								
								
  const match = await user.comparePassword(password);								
  if (!match) return res.send('Sai mật khẩu');								
								
  req.session.user = user;								
  res.redirect('/products');								
};								
exports.logout = (req, res) => {								
  req.session.destroy(() => {								
    res.redirect('/users/login');								
  });								
};								
