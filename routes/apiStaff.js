var express = require('express');

const { getStaffPage } = require('../controllers/staff.con');
var router = express.Router();
const auth = require('../auth/auth')
const upload = require('../multer');
const { createStaffSignup, loginStaff, panel } = require('../controllers/staff.con');




router.get('/staff',getStaffPage)
router.post('/signup',upload.single('file'),createStaffSignup)
router.post('/login',loginStaff)
router.get('/panel',auth.isStaff,panel)

module.exports = router;