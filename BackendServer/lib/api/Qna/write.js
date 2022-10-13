var express = require("express");
var router = express.Router();
var Model = require("../../../models/index");
var Response = require("../../Response");
var statusCodes = require("../../statusCodes");
var { validateUserToken } = require("../../../middlewares/validateToken");
var { encryptResponse, decryptRequest } = require("../../../middlewares/crypt");

/**
 * QnA file list route
 * This endpoint allows to view list of files of a question
 * @path                             - /api/qna/write
 * @middleware
 * @param file
 * @return                           - isSuccess
*/

router.post("/", validateUserToken, (req, res) => {
    var r = new Response();
    let uploadFile = req.files.file;
    let uploadPath = req.files.file.name;
    
    Model.qna.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.body.user_id,
        write_at: req.body.write_at,
        file_id: req.body.file_id
    })
    .then((data) => {
        r.status = statusCodes.SUCCESS;
        r.data = data;
        return res.json(encryptResponse(r));
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