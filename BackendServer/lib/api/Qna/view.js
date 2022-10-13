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
 * @param                            - qna_id
 * @return                           - Qna list
*/
router.post("/", decryptRequest, (req, res) => {
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