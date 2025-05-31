module.exports = function rbac(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return function (req, res, next) {
    if (!req.session.user) {
      return res.status(401).send('Autentificare necesară.');
    }
    if (roles.length && !roles.includes(req.session.user.role)) {
      return res.status(403).send('Acces interzis.');
    }
    next();
  };
};
