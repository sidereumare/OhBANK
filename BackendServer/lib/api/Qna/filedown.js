var express = require("express");
var router = express.Router();
var Model = require("../../../models/index");
var Response = require("../../Response");
var statusCodes = require("../../statusCodes");
var { validateUserToken } = require("../../../middlewares/validateToken");
var { encryptResponse, decryptRequest, decryptAuthRequest, decrypt } = require("../../../middlewares/crypt");
var FormData = require('form-data');
const Readable = require('stream').Readable;
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
var { s3 } = require('../../../middlewares/s3Conn');

router.get("/", validateUserToken, async (req, res) => {
    var r = new Response();
    var file_id = decrypt(req.query.file_id);
    console.log(file_id);
    Model.file.findOne({
        where: {
            id: file_id
        },
        attributes: ["file_name", "saved_name"]
    })
    .then(async (data) => {
        var options = {
            Bucket: 'oh-s3-bucket',
            Key: data.saved_name
        };

        var fileStream = s3.getObject(options).createReadStream();
        res.attachment(data.saved_name);
        // r.status = statusCodes.SUCCESS;
        // r.data = data;
        // res.attachment(data.file_name);
        // res.attachment(data.saved_name);
        // file_data = fs.readFileSync("./upload/"+data.saved_name);
        // s = new Readable();
        // // s.push(encryptResponse(file_data).enc_data);
        // s.push(file_data);
        // s.push(null);
        // s.pipe(res);
        fileStream.pipe(res);
    })
    .catch((err) => {
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            message: err.toString(),
        };
        console.log(r.data);
        return res.json(encryptResponse(r));
    });
});

module.exports = router;