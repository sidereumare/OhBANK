var express = require('express');
var router = express.Router();

var filedown = require('./filedown');
var fileup = require('./fileup');
var list = require('./list');
var rewrite = require('./rewrite');
var view = require('./view');
var write = require('./write');

router.use('/filedown', filedown);
router.use('/fileup', fileup);
router.use('/list', list);
router.use('/rewrite', rewrite);
router.use('/view', view);
router.use('/write', write);
module.exports = router;
