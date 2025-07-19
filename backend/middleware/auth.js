// Authentication check
exports.ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) return next();
  res.status(401).send('Not logged in');
};

// RBAC (role/group) check
exports.requireRole = role => (req, res, next) => {
  const groups = req.session.user && req.session.user.groups;
  if (groups && groups.includes(role)) return next();
  res.status(403).send('Forbidden: Insufficient role');
};
