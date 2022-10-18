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

router.get("/", async (req, res) => {
    // send to file localfile to client
    var r = new Response();
    var filename = req.query.filename;
    console.log(filename);
    try{
        var stat = fs.statSync(filename);
        var file = fs.createReadStream(filename);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/octet-stream');
        filename = filename.split('/');
        filename = filename[filename.length - 1];
        res.setHeader('Content-Disposition', 'attachment; filename='+filename);
        file.pipe(res);
    }
    catch (error){
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            message: "File not found",
        };
        return res.json(encryptResponse(r));
    }
});

module.exports = router;