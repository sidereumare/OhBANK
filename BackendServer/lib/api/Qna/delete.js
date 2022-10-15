var express = require("express");
var router = express.Router();
var Model = require("../../../models/index");
var Response = require("../../Response");
var statusCodes = require("../../statusCodes");
var { validateUserToken } = require("../../../middlewares/validateToken");
var { decryptAuthRequest,encryptResponse } = require("../../../middlewares/crypt");
var { s3 } = require('../../../middlewares/s3Conn');
/**
 * QnA file list route
 * This endpoint allows to view list of files of a question
 * @path                             - /api/qna/write
 * @middleware
 * @param id
 * @return                           - isSuccess
*/
router.post("/", decryptAuthRequest, (req, res) => {
    var r = new Response();
    let qna_id = req.body.qna_id;
    console.log(qna_id);

    Model.file.findAll({
        where: {
            qna_id: qna_id
        },
        attributes: ["saved_name"],
    })
    .then((data) => {
        // s3에서 파일 삭제
        data.forEach((file) => {
            var options = {
                Bucket: 'oh-s3-bucket',
                Key: file.saved_name
            };
            s3.deleteObject(options, function(err, data) {
                if(err){
                    r.statusCodes = statusCodes.SERVER_ERROR;
                    return res.json(encryptResponse(r));
                }
            });
        })
        // DB에서 파일 삭제
        Model.file.destroy({
            where: {
                qna_id: qna_id
                }})
        .then((data) => {
            // QnA 삭제
            Model.qna.destroy({
                where:{
                    id : qna_id
                }})
            .then((data) => {
                r.status = statusCodes.SUCCESS;
                return res.json(encryptResponse(r));
            })
            .catch((err) => {
                r.status = statusCodes.SERVER_ERROR;
                r.data = {
                    message: err.toString(),
                };
                return res.json(encryptResponse(r));
            });
        })
        .catch((err) => {
            r.status = statusCodes.SERVER_ERROR;
            r.data = {
                message: err.toString(),
            };
            return res.json(encryptResponse(r));
        });
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