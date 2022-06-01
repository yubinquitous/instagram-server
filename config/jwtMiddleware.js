const jwt = require("jsonwebtoken");
const secret_config = require("./secret");
const { sendResponse, errResponse } = require("./response");
const baseResponse = require("./baseResponseStatus");

const jwtMiddleware = (req, res, next) => {
  // read the token from header or url
  const token = req.headers.authorization;
  // token does not exist
  if (!token) {
    return sendResponse(res, errResponse(baseResponse.TOKEN_EMPTY));
  }

  jwt.verify(token, secret_config.jwtsecret, (err, verifiedToken) => {
    if (err) {
      return sendResponse(
        res,
        errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE)
      );
    }
    req.verifiedToken = verifiedToken;
    next();
  });
};

module.exports = jwtMiddleware;
