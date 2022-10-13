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

router.get("/", validateUserToken, async (req, res) => {
    var r = new Response();
    var file_id = decrypt(req.query.file_id);
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
        file_data = fs.readFileSync("./upload/"+data.file_name);
        s = new Readable();
        // s.push(encryptResponse(file_data).enc_data);
        s.push(file_data);
        s.push(null);
        s.pipe(res);
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