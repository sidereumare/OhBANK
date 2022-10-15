var express = require("express");
var router = express.Router();
var Model = require("../../../models/index");
var Response = require("../../Response");
var statusCodes = require("../../statusCodes");
var { validateUserToken } = require("../../../middlewares/validateToken");
var { encryptResponse, decryptRequest, decryptAuthRequest, decrypt } = require("../../../middlewares/crypt");
var FormData = require('form-data');
const Readable = require('stream').Readable;
var { s3 } = require('../../../middlewares/s3Conn');
/**
 * QnA file list route
 * This endpoint allows to view list of files of a question
 * @path                             - /api/qna/list
 * @middleware
 * @param file_id
 * @return                           - Qna 
 */
var fs = require('fs');
const { response } = require("express");

router.post("/", decryptAuthRequest, async (req, res) => {
    var r = new Response();
    console.log(req.body.file_id);

    Model.file.findOne({
        where: {
            id: req.body.file_id
        },
        attributes: ["file_name", "saved_name"]
    })
    .then(async (data) => {
        var options = {
            Bucket: 'oh-s3-bucket',
            Key: data.saved_name
        };
        s3.deleteObject(options, function(err, data) {
            if(err){
                r.statusCodes = statusCodes.SERVER_ERROR;
                return res.json(encryptResponse(r));
            }
            else{
                Model.file.destroy({
                    where: {
                        id: req.body.file_id
                    }
                })
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
            }
        });
    })
    .catch((err) => {
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            message: err.toString(),
        };
        return res.json(encryptResponse(r));
    })

});


// router.get("/", validateUserToken, async (req, res) => {
//     var r = new Response();
//     var file_id = decrypt(req.query.file_id);
//     console.log(file_id);
//     Model.file.findOne({
//         where: {
//             id: file_id
//         },
//         attributes: ["file_name"]
//     })
//     .then((data) => {
        
//     })
//     .catch((err) => {
//         r.status = statusCodes.SERVER_ERROR;
//         r.data = {
//             message: err.toString(),
//         };
//         console.log(r.data);
//         return res.json(encryptResponse(r));
//     });
// });

module.exports = router;