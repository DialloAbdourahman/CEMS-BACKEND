import express from 'express';
const router = express.Router();

const { authAdmin } = require('../middlewares/auth');

const {
  createUser,
  createHall,
  updateHall,
  deleteHall,
  createPost,
  updatePost,
  deletePost,
  searchUsers,
  deleteUser,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} = require('../controllers/adminController');

router.post('/create_user', authAdmin, createUser);
router.post('/create_hall', authAdmin, createHall);
router.post('/create_post', authAdmin, createPost);
router.post('/create_equipment', authAdmin, createEquipment);

router.get('/search_users', authAdmin, searchUsers);

router.put('/update_hall/:id', authAdmin, updateHall);
router.put('/update_post/:id', authAdmin, updatePost);
router.put('/update_equipment/:id', authAdmin, updateEquipment);

router.delete('/delete_hall/:id', authAdmin, deleteHall);
router.delete('/delete_post/:id', authAdmin, deletePost);
router.delete('/delete_user/:id', authAdmin, deleteUser);
router.delete('/delete_equipment/:id', authAdmin, deleteEquipment);

module.exports = router;
