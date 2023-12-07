  var express = require('express');
const selectionController = require('../controllers/selectionController');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//POST
router.post('/submitTags' , selectionController.postAddSelection);


module.exports = router;
