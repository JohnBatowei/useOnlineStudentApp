var express = require('express');
var router = express.Router();
const fact = require('../model/faculty')
/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log('get the index')
  res.render('index',{title:'Home'});
});

router.get('/student-signup', async function(req, res, next) {
  // console.log('get the index')
  const data = await fact.find()
  // console.log(data)
  res.render('studentReg',{title:'Student Portal',data});
});

module.exports = router;
