import express from 'express';
const router = express.Router();

const { authAdmin } = require('../middlewares/auth');

const {
  createUser,
  createHall,
  updateHall,
  deleteHall,
} = require('../controllers/adminController');

router.post('/create_user', authAdmin, createUser);
router.post('/create_hall', authAdmin, createHall);

router.put('/update_hall/:id', authAdmin, updateHall);

router.delete('/delete_hall/:id', authAdmin, deleteHall);

module.exports = router;
