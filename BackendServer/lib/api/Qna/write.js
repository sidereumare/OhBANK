var express = require("express");
var router = express.Router();
var Model = require("../../../models/index");
var Response = require("../../Response");
var statusCodes = require("../../statusCodes");
var { validateUserToken } = require("../../../middlewares/validateToken");
var { encryptResponse, decryptRequest, decryptAuthRequest } = require("../../../middlewares/crypt");

/**
 * QnA file list route
 * This endpoint allows to view list of files of a question
 * @path                             - /api/qna/write
 * @middleware
 * @param title
 * @param content
 * @param writer_id
 * @return                           - isSuccess
*/

router.post("/", decryptAuthRequest, (req, res) => {
    var r = new Response();
    var today = new Date();
    var now = today.getFullYear()+"-"+today.getMonth()+"-"+today.getDay()
    console.log("dfjsalk")
    Model.qna.create({
        title: req.body.title,
        content: req.body.content,
        writer_id: req.user_id,
        write_at: now
    })
    .then((data) => {
        r.status = statusCodes.SUCCESS;
        r.data = data.id;
        console.log(r.data);
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