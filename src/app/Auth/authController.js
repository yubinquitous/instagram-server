const baseResponse = require("../../../config/baseResponseStatus");
const { errResponse, sendResponse } = require("../../../config/response");
const authService = require("./authService");
const regexEmail = require("regex-email");
const regexPwd = /^(?=.*[A-Za-z])[A-Za-z]{8,}$/; // 최소 8글자 이상, 영문 포함

/*
    API No 2.1
    API NAME : 로그인 API
    [POST] /api/auth/login
*/
const login = async (req, res) => {
  /*
    body : email, pwd
    #swagger.tags = ['AUTH']
    #swagger.summary = "로그인 API"
    #swagger.responses[200] = {
      description: "로그인 성공",
      content: {
        "application/json": {
          example: {
            "isSuccess": true,
            "status": 200,
            "code": 1000,
            "message": "성공",
            "result": {
                "jwt": "jwt-token"
            }
          },
        }
      }
    }
  */
  const { email, pwd } = req.body;

  // email validation
  if (!email) {
    return sendResponse(res, errResponse(baseResponse.SIGNIN_EMAIL_EMPTY));
  } else if (email.length > 255) {
    return sendResponse(res, errResponse(baseResponse.SIGNIN_EMAIL_LENGTH));
  } else if (!regexEmail.test(email)) {
    return sendResponse(res, errResponse(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));
  }

  // pwd validation
  if (!pwd) {
    return sendResponse(res, errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY));
  } else if (pwd.length < 8) {
    return sendResponse(res, errResponse(baseResponse.SIGNIN_PASSWORD_LENGTH));
  } else if (!regexPwd.test(pwd)) {
    return sendResponse(res, errResponse(baseResponse.SIGNIN_PASSWORD_WRONG));
  }

  const signInResponse = await authService.postSignIn(email, pwd);

  return sendResponse(res, signInResponse);
};

module.exports = { login };
