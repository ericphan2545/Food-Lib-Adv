const User = require('../models/User');

exports.registerForm = (req, res) => {
  if (req.session.user) return res.redirect('/');
  return res.render('users/register', { title: 'Đăng ký tài khoản', error: null });
};

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    await User.create({ email, username, password });
    return res.redirect('/users/login?registered=1');
  } catch (err) {
    return res.status(400).render('users/register', {
      title: 'Đăng ký tài khoản',
      error: err.message
    });
  }
};

exports.loginForm = (req, res) => {
  if (req.session.user) return res.redirect('/');
  return res.render('users/login', { title: 'Đăng nhập', error: null, query: req.query });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ 
        $or: [
    { email: username },
    { username: username }
  ]
    });
    if (!user) {
      return res.status(400).render('users/login', {
        title: 'Đăng nhập',
        error: 'Sai tài khoản hoặc mật khẩu',
        query: {}
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).render('users/login', {
        title: 'Đăng nhập',
        error: 'Sai tài khoản hoặc mật khẩu',
        query: {}
      });
    }

    req.session.user = { id: user._id, username: user.username, email: user.email };
    return res.redirect('/');
  } catch (err) {
    return res.status(500).render('users/login', {
      title: 'Đăng nhập',
      error: err.message,
      query: {}
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/users/login'));
};

