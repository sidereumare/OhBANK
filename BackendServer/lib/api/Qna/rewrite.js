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
 * @param title
 * @param content
 * @param writer_id
 * @return                           - isSuccess
*/
router.post("/", validateUserToken, (req, res) => {
    var r = new Response();
    let qna_id = req.body.qna_id;

    Model.qna.findOne({
        where: {
            id: qna_id
        },
        attributes: ["title", "content", "write_at"],
    })
    .then((data) => {
        r.status = statusCodes.SUCCESS;
        r.data = data;
        return res.json(r);
    })
    .catch((err) => {
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            message: err.toString(),
        };
        return res.json(r);
    });
});

router.post("/re", validateUserToken, (req, res) => {
    var r = new Response();
    var today = new Date();
    let qna_id = req.body.qna_id;
    var now = today.getFullYear()+"-"+today.getMonth()+"-"+today.getDay()
    Model.qna.update({
        title: req.body.title,
        content: req.body.content,
        writer_id: req.user_id,
        write_at: now
    },{where:
        {
            id : qna_id
        }})
    .then((data) => {
        r.status = statusCodes.SUCCESS;
        r.data = data;
        return res.json(r);
    })
    .catch((err) => {
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            message: err.toString(),
        };
        return res.json(r);
    });
});

module.exports = router;