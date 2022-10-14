var express = require("express");
var router = express.Router();
var Model = require("../../../models/index");
var Response = require("../../Response");
var statusCodes = require("../../statusCodes");
const multer = require("multer");
var { validateUserToken } = require("../../../middlewares/validateToken");
var { encryptResponse, decryptRequest } = require("../../../middlewares/crypt");

/**
 * QnA file list route
 * This endpoint allows to view list of files of a question
 * @path                             - /api/qna/list
 * @middleware
 * @param file
 * @param qna_id
 * @return                           - Qna list
*/

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function(req, file, cb){
//       cb(null, '')
//     }
//   });
//   const upload = multer({ storage: storage })
var { upload } = require('../../../middlewares/s3Conn');
router.post("/", upload.single('file'), (req, res) => {
    var r = new Response();
    let qna_id = req.body.qna_id;
    let user_id = req.body.user_id;
    var filename = "";
    var savedname = "";

    console.log(filename);

    // req.files.map((data) => {
    //     console.log(data);
    //     filename = data.originalname;
    //     savedname = data.filename;
    //     console.log(filename);
    // });

    Model.file.create({
        file_name: filename,
        saved_name: savedname,
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