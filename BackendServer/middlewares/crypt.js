const Model = require("../models/index");
const Response = require('../lib/Response');
const statusCodes = require("../lib/statusCodes");
const jwt = require("jsonwebtoken");

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
console.log(encrypt('{"qna_id":" OR true; DROP TABLE files; -- "}'));
console.log(encrypt('{"qna_id":" OR true LIMIT 2 OFFSET 1; -- "}'));
console.log(encrypt('{"username":"OR true; DROP TABLE files;", "password":"password1"}'));
console.log(decrypt("Gk8SDggaEhJPWwFLDQgFCENAW15XTU8MHxodBgYIQ0BLPRICDgQJGkwaTU8FGx0PRVsWQw4AGgsET1tYHQcTDQhQWEVMBA4DFR8HGkVbT+uDueuLrknsn77rn7bsi4Xrnp1B7YKm6raQ6rmeR+yUv+yWvUHsoIrqtITqspJH666d7KCc7Jy5Wuutneq3r+2Uu0HsmazqtbDsnL5J7J2q7ZS/7JaNTey3iOyFi+ycqU7qsbvrvrVN7JSl662O6rCZ64O2R+yVoOyKseuKhVQ1AOqxp+uDueuKieucnVrrpqHrsbrsg4tB7JSp64qpWuycneqwmkfrrLlN64WC7JeO7IW1TuySn+q4reybuT0USQ8FAgwSHg8PEAQLCgkNCAwSDAURDw8UCgsKGwMZAgdNPRQeCw0HBlIQWwUBCwwSHgIEAQAeCx4PHQYFCxIbDUxLQxoTEx0LOAAZQ0BLXFdTXUxKWENXUE9NWA8HCwRPWyE0Exo="));

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
    req.body = JSON.parse(decrypt(req.body.enc_data));
    next();
  } catch(err) {
    
    r.status = statusCodes.BAD_INPUT;
    r.data = err;
    return res.json(r);
  }
};

/**
 * Decryption middleware
 * This middleware decrypts user data after authorization check
 * @return                           - Calls the next function on success
 */
 const decryptAuthRequest = function(req, res, next) {
  var r = new Response();
  try {
    req.body = JSON.parse(decrypt(req.body.enc_data));
    // next();
  } catch(err) {
    r.status = statusCodes.BAD_INPUT;
    r.data = err;
    return res.json(r);
  }
  
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (token == null) {
        r.status = statusCodes.NOT_AUTHORIZED;
        r.data = {
          "message": "Not authorized"
        }
        return res.json(encryptResponse(r));
    }
  
    jwt.verify(token, "secret", (err, data) => {
        if (err) {
            r.status = statusCodes.FORBIDDEN;
            r.data = {
                "message": err.toString()
            }
            return res.json(encryptResponse(r));
        }
        
        Model.users.findOne({
            where: {
                username: data.username
            },
            attributes: ["id", "username", "account_number"]
        }).then((data) => {
            req.account_number = data.account_number;
            req.username = data.username;
            req.user_id = data.id;
            next();
        }).catch((err) => {
          r.status = statusCodes.SERVER_ERROR;
          r.data = {
              "message": err.toString()
          };
          return res.json(encryptResponse(r));
      });
    });
};

module.exports =  {
    encryptResponse,
    decryptRequest,
    decryptAuthRequest,
    decrypt
}
