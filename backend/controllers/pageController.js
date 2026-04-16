exports.home = (req, res) => {
  return res.render('pages/index', {
    title: 'Thư Viện Món Ăn | Food Library',
    currentUser: req.session.user || null,
  });
};

exports.mealPlanner = (req, res) => {
  return res.render('pages/meal-planner', {
    title: 'NutriPlan | Kế Hoạch Dinh Dưỡng Thông Minh',
    currentUser: req.session.user || null,
  });
};

exports.favorites = (req, res) => {
  return res.render('pages/favorites', {
    title: 'Yêu Thích | Food Library',
    currentUser: req.session.user || null,
  });
};
