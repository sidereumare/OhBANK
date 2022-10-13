var express = require("express");
var router = express.Router();
var Model = require("../../../models/index");
var Response = require("../../Response");
var statusCodes = require("../../statusCodes");
var { validateUserToken } = require("../../../middlewares/validateToken");
var { encryptResponse, decryptRequest } = require("../../../middlewares/crypt");
var FormData = require('form-data');
const Readable = require('stream').Readable;
const s = new Readable();
/**
 * QnA file list route
 * This endpoint allows to view list of files of a question
 * @path                             - /api/qna/list
 * @middleware
 * @param file
 * @return                           - Qna 
 */
var fs = require('fs');
const { response } = require("express");
var file = fs.createReadStream('test1.png');
router.get('/', function(req, res){
    res.download(file); // Set disposition and send it.
});
router.post("/", decryptRequest, (req, res) => {
    var r = new Response();
    var file_id = req.body.file_id;
    console.log(file_id);
    Model.file.findOne({
        where: {
            id: file_id
        },
        attributes: ["file_name"]
    })
    .then((data) => {
        // r.status = statusCodes.SUCCESS;
        // r.data = data;
        res.attachment(data.file_name);
        s.push(encryptResponse(file.read()).enc_data);
        s.push(null);
        s.pipe(res);
    })
    .catch((err) => {
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            message: err.toString(),
        };
        return res.json(encryptResponse(r));
    });
    

});

module.exports = router;