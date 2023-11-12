import express from 'express';
const router = express.Router();

const { auth } = require('../middlewares/auth');

const {
  login,
  logout,
  token,
  seeHalls,
  seePosts,
  updateAccount,
  seeUserTypes,
  seeEquipmentStates,
  seeEquipmentTypes,
  searchEquipment,
} = require('../controllers/userController');

router.post('/login', login);
router.post('/logout', auth, logout);
router.post('/token', token);

router.get('/halls', auth, seeHalls);
router.get('/posts', auth, seePosts);
router.get('/user_types', auth, seeUserTypes);
router.get('/equipment_types', auth, seeEquipmentTypes);
router.get('/equipment_states', auth, seeEquipmentStates);
router.get('/search_equipment', auth, searchEquipment);

router.put('/update_account', auth, updateAccount);

module.exports = router;
