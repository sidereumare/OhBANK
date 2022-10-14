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
 * @path                             - /api/qna/list
 * @middleware
 * @param file
 * @return                           - Qna list
*/

router.post("/", validateUserToken, (req, res) => {
    var r = new Response();

    uploadFile.mv(uploadPath, function (err) {
        if (err) {
            r.status = statusCodes.SERVER_ERROR;
            r.data = {
                message: err.toString(),
            };
            return res.json(encryptResponse(r));
        }
    });

    var filename = "1.txt";
    var qna_id = "1";
    Model.file.create({
        filename: filename,
        qna_id: qna_id,
        user_id: user_id
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