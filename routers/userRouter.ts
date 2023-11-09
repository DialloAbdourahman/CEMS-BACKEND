import express from 'express';
const router = express.Router();

const { auth } = require('../middlewares/auth');

const {
  login,
  logout,
  token,
  seeHalls,
} = require('../controllers/userController');

router.post('/login', login);
router.post('/logout', auth, logout);
router.post('/token', token);

router.get('/halls', auth, seeHalls);

module.exports = router;
