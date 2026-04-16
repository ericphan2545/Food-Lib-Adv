exports.requireLogin = (req, res, next) => {
  if (!req.session.user) {
    // Nếu là request API / XHR (mong đợi JSON) thì trả 401 thay vì redirect
    const wantsJson =
      req.xhr ||
      (req.originalUrl || '').startsWith('/api/') ||
      (req.headers.accept || '').includes('application/json');
    if (wantsJson) return res.status(401).json({ error: 'Unauthorized' });
    return res.redirect('/users/login');
  }
  return next();
};

