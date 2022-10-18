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

// console.log(encrypt('{"id":"4","title":"22", "content":"2222", "file_id_list": [1,2]}'));
console.log(decrypt("Gk8SDggaEhJPWwFLDQgFCENAXF5XTU8MHxodBgYIQ0BLJwkVCBMUCAJHMggTDAwcRyQfExUbTBpNTwUbHQ9FWxZDFwwdFAAKBFhTTCITHw4IU04iLyIkND1URw8CQQkcDQ9BCwgWDE4IE00FExsLBBUCEwNFTggRCA9aTkBJTkNPVUdASE9DTg4MHRNPGRkOTjIJQU1BWggaRy4PCx8KGkkOHQQUOhcJAk1JFAYKAlsLEkBcV1NbXkgmB05HQU0ADkkhBQsIAg5HHAIACScTBQs0GAMCWkEACAUIWxwaVFNXX1tJXEc7D01BWkkPE0EuWyY1OxQEHxImNRsUBB89Ji0LFAoZDgo1MgEIAz0mJgYlICMqJjUsBgIGBBQNPQITGwQINTILCA89JggeDj0xMBQoMjsHBA0fDQEQD0MLCVNdUVtfVSYHTkdBTQAOSSIGGAgTVAEPCQUBBFoyDxRBBQAUDQICPh8ECxwLFBUwQVIqVDs9OBIfGx07PRgSHxsyOyUIEhEdARc9MQcTBzI7LgUjOyclOz0vABkCCwkFPgQIHwsVPTEPFQ0LOAwCBQ8FCxQ9MQQCGRwCEh49JgUHBT0xExUcGgITMT0WCBcCE0MLCVNXUltYSCYHTkdBTQAOSQACGRlBUipUOz04Eh8bHTs9GBIfGzI7JQgSER0BFz0xBxMHMjsuBSM7JyU7PS8AGQILCQU+BAgfCxU9MQ8VDQs4DAIFDwULFD0xBAIZHAISHj0mBQcFPTETFRwaAhMxPQgGGxMEQwsJU19UVldQSUAyCUFNQVoIGkczAhQODEADCB4RGx0ND0FFIkA1MjISCBMJNTISEggTJjUqAhIGFRUZMjsHBA8mNSEPIywvMTUyJQAOCh8HCjQEHxcfGzI7DwIFHzYDCAUYDR8aMjsEFREIDB0UPTENEwsyOxMCFA4MHDs9Hw4PHQtJCx5bS1hcXVJEPRRJTkdBDBVaJQ8eBB9PEggAAw0IQSEIHUcJDA8eBQs4EwgQDwwdEzxNSTlTMjs0HgQIGjI7FB4ECDUyIwQeCg4GHjs9CwgUNTIoCS8gNCIyOyMMAhEMAAMyCBMMDBw7PQMOHgwxCg4JFBYMHTs9CBkKGwsUEjE9FgAMOz0fDg8dCxU9MQ0bEAsVTwcSQFBbXVREPRRJTkdBDBVaKlQ7PTgSHxsdOz0YEh8bMjslCBIRHQEXPTEHEwcyOy4FIzsnJTs9LwAZAgsJBT4ECB8LFT0xDxUNCzgMAgUPBQsUPTEEAhkcAhIePSYFBwU9MRMVHBoCEzE9EwcKAhlDCwlTXF9QV1NINQBHQU1BGx1OIRQDAg4AAQlPHRMVCgsUEjIRGxsPChJNSTlTMjs0HgQIGjI7FB4ECDUyIwQeCg4GHjs9CwgUNTIoCS8gNCIyOyMMAhEMAAMyCBMMDBw7PQMOHgwxCg4JFBYMHTs9CBkKGwsUEjE9FgAMOz0fDg8dCxU9MQgUDQsfTwcSQFpdUltcU1M1AEdBTUEbHU4JBBUVWkEtXT0xNAkMHBQ9MRQJDBw7PSkECQIaCBExPRwAADs9Igk4KCAsPTEjGwoFAg8JMh8bGAITMT0UBgoCPgAOHhwCAhIxPR8RHhUEHhImNQIOAzE9CAYbEwQfPSYAAAMEFU8QGlRVVlhbS1lHRRwQ"));

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
