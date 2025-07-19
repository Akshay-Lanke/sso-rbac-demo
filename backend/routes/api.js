const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { ensureAuthenticated, requireRole } = require('../middleware/auth');

// Get logged-in user profile
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.json(req.session.user);
});

// RBAC endpoints
router.get('/admin', ensureAuthenticated, requireRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!', groups: req.session.user.groups });
});

router.get('/editor', ensureAuthenticated, requireRole('editor'), (req, res) => {
  res.json({ message: 'Welcome, editor!', groups: req.session.user.groups });
});

// Email API (user must be logged in)
router.post('/contact', ensureAuthenticated, emailController.sendEmail);

module.exports = router;
