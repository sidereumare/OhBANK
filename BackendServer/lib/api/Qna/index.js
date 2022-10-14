var express = require('express');
var router = express.Router();

var filedown = require('./filedown');
var fileup = require('./fileup');
var filedel = require('./filedel');
var list = require('./list');
var rewrite = require('./rewrite');
var view = require('./view');
var write = require('./write');
var qna_delete = require('./delete');


router.use('/filedown', filedown);
router.use('/fileup', fileup);
router.use('/filedel', filedel);
router.use('/list', list);
router.use('/rewrite', rewrite);
router.use('/view', view);
router.use('/write', write);
router.use('/delete', qna_delete);

module.exports = router;

module.exports = router;