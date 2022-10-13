const Model = require("../models/index");
const Response = require('../lib/Response');
const statusCodes = require("../lib/statusCodes");

const SECRET = 'amazing';
const SECRET_LENGTH = SECRET.length;

const operate = (input) => {
  let result = "";
  for (let i in input) {
    result += String.fromCharCode(input.charCodeAt(i)^SECRET.charCodeAt(i%SECRET_LENGTH));
  }
  return result;
}

const decrypt = (encodedInput) => {  
  let input = Buffer.from(encodedInput, 'base64').toString();
  let dec = operate(input);
  return dec;
}

const encrypt = (input) => {
  let enc = operate(input.toString());
  let b64 = Buffer.from(enc).toString('base64');
  return b64;
}

// console.log(encrypt('{"file_id":1}'));
console.log(decrypt('Gk8SDggaEhJPWwFLDQgFCENAW15XTU8MHxodBgYIQ0BLPRICDgQJGkwaTU8FGx0PRVsWQxsKDQISHjUVAgsJQ1dDHxAkDwMqAhMmBy0oOBszWCAOKB4oFDtbBCIkVzMCHj83LitDRwseK1wCSD8XBQwrFSA6J1EoAzcAMzYuGSQIDQAPPy8LOC07GgY2WQg1BDQPAyUvFiUtLRE0OSsAIQ0kXy8QPFwpJSBRNC0CXk8OJzQgGgQPLAMOWl8oESEAHSA8Kj4GIx42Vx0ZPS8JDQkSMjcwHg9XNg0kQwcU'));

/**
 * Encryption middleware
 * This middleware encrypts server response before forwarding to client
 * @return                           - Calls the next function on success
 */
const encryptResponse = (input) => {
  let b64 = encrypt(input);
  return {
    "enc_data": b64
  };
}

/**
 * Decryption middleware
 * This middleware decrypts user data after authorization check
 * @return                           - Calls the next function on success
 */
const decryptRequest = function(req, res, next) {
  var r = new Response();
  try {
    console.log(req.body);
    req.body = JSON.parse(decrypt(req.body.enc_data));
    next();
  } catch(err) {
    
    r.status = statusCodes.BAD_INPUT;
    r.data = err;
    return res.json(r);
  }
};

module.exports =  {
    encryptResponse,
    decryptRequest
}
