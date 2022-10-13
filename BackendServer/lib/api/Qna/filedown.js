var express = require("express");
var router = express.Router();
var Model = require("../../../models/index");
var Response = require("../../Response");
var statusCodes = require("../../statusCodes");
var { validateUserToken } = require("../../../middlewares/validateToken");
var { encryptResponse, decryptRequest } = require("../../../middlewares/crypt");
var FormData = require('form-data');

/**
 * QnA file list route
 * This endpoint allows to view list of files of a question
 * @path                             - /api/qna/list
 * @middleware
 * @param file
 * @return                           - Qna 
 */
var fs = require('fs');
router.post("/", validateUserToken, (req, res) => {
    var r = new Response();
    var file_id = req.body.file_id;

    Model.file.findOne({
        where: {
            id: file_id
        },
        attributes: ["file_name"]
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






    // var form = new FormData();
    // form.append('part1', 'part 1 data');
    // form.append('part2', 'part 2 data');
    // res.setHeader('x-Content-Type', 'multipart/form-data; boundary='+form._boundary);
    // res.setHeader('Content-Type', 'text/plain');
    // form.pipe(res);

    // test1.png 파일 로드
    // var r = new Response();
    
    // var file_name = "test1.png";
    // 
    // var file_data = fs.readFile(file_name, function (err, data) {
    //     if (err) {
    //         r.status = statusCodes.SERVER_ERROR;
    //         r.data = {
    //             message: err.toString(),
    //         };
    //         return res.json(encryptResponse(r));
    //     }
    // });
    // console.log(file_data);
    // return r.download(file_data, file_name);
});

module.exports = router;