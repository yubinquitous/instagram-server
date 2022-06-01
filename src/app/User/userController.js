const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {
  response,
  errResponse,
  sendResponse,
} = require("../../../config/response");
const postProvider = require("../../app/Post/postProvider");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
// exports.getTest = async function (req, res) {
//     return res.send(response(baseResponse.SUCCESS))
// }

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /api/users
 */
const postUsers = async (req, res) => {
  /*
  Body: email, password, nickname
  #swagger.tags = ['USER']
  #swagger.summary = "유저 생성 API"
  #swagger.responses[200] = {
    description: "회원가입 성공",
    content: {
      "application/json": {
        example: {
          "isSuccess": true,
          "status": 200,
          "code": 1000,
          "message": "성공",
          "result": 15
          }
        },
      }
    }
  }
  #swagger.responses[400] = {
    description: "회원가입 실패",
    content: {
      "application/json": {
        example: {
          "isSuccess": false,
          "status": 400,
          "code": 2004,
          "message": "비밀번호를 입력 해주세요."
          }
        },
      }
    }
  }
  */
  const { email, password, nickname, name } = req.body;
  // 빈 값 체크
  if (!email)
    return sendResponse(res, errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
  if (!password)
    return sendResponse(res, errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
  if (!nickname)
    return sendResponse(res, errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));
  if (!name)
    return sendResponse(res, errResponse(baseResponse.SIGNUP_NAME_EMPTY));

  // 길이 체크
  if (email.length > 30)
    return sendResponse(res, errResponse(baseResponse.SIGNUP_EMAIL_LENGTH));
  if (nickname.length > 20)
    return sendResponse(res, errResponse(baseResponse.SIGNUP_NICKNAME_LENGTH));

  // 형식 체크 (by 정규표현식)
  if (!regexEmail.test(email)) {
    console.log("EMAIL 형식 체크 실패");
    return sendResponse(res, errResponse(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
  }

  // 기타 등등 - 추가하기

  const signUpResponse = await userService.createUser(
    email,
    password,
    nickname,
    name
  );

  return sendResponse(res, signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API
 * [GET] /api/users
 */
const getUsers = async (_req, res) => {
  /*
  #swagger.tags = ['USER']
  #swagger.summary = "유저 조회 API"
  #swagger.responses[200] = {
    description: "유저 조회 성공",
    content: {
      "application/json": {
        example: {
          "isSuccess": true,
          "status": 200,
          "code": 1000,
          "message": "성공",
          "result": [
              {
                  "nickname": "yubinquitous",
                  "email": "yubinquitous@gmail.com",
                  "status": "DELETED"
              },
              {
                  "nickname": "ponyo",
                  "email": "ponyo@gmail.com",
                  "status": "ACTIVE"
              },
              {
                  "nickname": "rainy",
                  "email": "rainy@gmail.com",
                  "status": "ACTIVE"
              },
              {
                  "nickname": "goak",
                  "email": "goak@gmail.com",
                  "status": "ACTIVE"
              },
              {
                  "nickname": "pat",
                  "email": "pat@gmail.com",
                  "status": "ACTIVE"
              },
              {
                  "nickname": "postusertest",
                  "email": "postusertest@gmail.com",
                  "status": "ACTIVE"
              },
              {
                  "nickname": "test",
                  "email": "test@gmail.com",
                  "status": "ACTIVE"
              },
              {
                  "nickname": "test",
                  "email": "test1@gmail.com",
                  "status": "ACTIVE"
              },
              {
                  "nickname": "test",
                  "email": "test3@gmail.com",
                  "status": "ACTIVE"
              },
              {
                  "nickname": "test",
                  "email": "test4@gmail.com",
                  "status": "ACTIVE"
              },
              {
                  "nickname": "mat",
                  "email": "yubin@gmail.com",
                  "status": "ACTIVE"
              }
          ]
          }
        },
      }
    }
  }
  */
  const userListResult = await userProvider.retrieveUserList();
  return sendResponse(res, response(baseResponse.SUCCESS, userListResult));
};

/**
 * API No. 3.1.
 * API Name : 유저 피드 조회
 * [GET] /api/users/{userIdx}
 */
const getUserFeed = async (req, res) => {
  /*
  Path Variable: userIdx
  #swagger.tags = ['USER']
  #swagger.summary = "유저 피드 조회 API"
  #swagger.responses[200] = {
    description: "유저 피드 조회 성공",
    content: {
      "application/json": {
        example: {
          "isSuccess": true,
          "status": 200,
          "code": 1000,
          "message": "성공",
          "result": {
            "userInfo": {
              "nickname": "ponyo",
              "name": "sueun",
              "profileImgUrl": "imgurl2",
              "website": null,
              "introduce": null,
              "followerCount": 1,
              "followingCount": 3,
              "postCount": 2
            },
            "userPosts": [
              {
                  "postIdx": 2,
                  "postImgUrl": "imgurl1"
              },
              {
                  "postIdx": 8,
                  "postImgUrl": "imgurl8 by post 8"
              }
            ]
          }
        },
      }
    }
  }
  #swagger.responses[400] = {
    description: "유저 피드 조회 실패",
    content: {
      "application/json": {
        example: {
          "isSuccess": false,
          "status": 400,
          "code": 2016,
          "message": "유저 아이디 값을 확인해주세요"
        },
      }
    }
  }
  */
  const userIdx = req.params.userIdx;

  // validation
  if (!userIdx) {
    console.log("userIdx empty");
    return sendResponse(res, errResponse(baseResponse.USER_USERIDX_EMPTY));
  }
  if (userIdx <= 0)
    return sendResponse(res, errResponse(baseResponse.USER_USERIDX_LENGTH));

  // 유저 정보 조회
  const userInfo = await userProvider.retrieveUserInfo(userIdx);

  // 유저 피드 조회
  const userPosts = await postProvider.retrieveUserPosts(userIdx);
  if (!userInfo)
    return sendResponse(res, errResponse(baseResponse.USER_ID_NOT_MATCH));
  return sendResponse(
    res,
    response(baseResponse.SUCCESS, { userInfo: userInfo, userPosts: userPosts })
  );
};

/**
 * API No. 3.2.
 * API Name : 특정 유저 조회 API by email
 * [GET] /api/users/email/{email}
 */
const getUserByEmail = async (req, res) => {
  /*
  Path Variable: email
  #swagger.tags = ['USER']
  #swagger.summary = "특정 유저 이메일로 조회 API"
  #swagger.responses[200] = {
    description: "유저 조회 성공",
    content: {
      "application/json": {
        example: {
          "isSuccess": true,
          "status": 200,
          "code": 1000,
          "message": "성공",
          "result": {
              "nickname": "mat",
              "email": "yubin@gmail.com"
          }
        },
      }
    }
  }
  #swagger.responses[400] = {
    description: "유저 조회 실패 ",
    content: {
      "application/json": {
        example: {
          "isSuccess": false,
          "status": 400,
          "code": 2015,
          "message": "해당 이메일을 가진 회원이 존재하지 않습니다."
          }
        },
      }
    }
  }
  */
  const email = req.params.email;

  if (!email)
    return sendResponse(res, errResponse(baseResponse.USER_USEREMAIL_EMPTY));

  const userByEmail = await userProvider.retrieveUserByEmail(email);
  if (!userByEmail)
    return sendResponse(
      res,
      errResponse(baseResponse.USER_USEREMAIL_NOT_EXIST)
    );
  return sendResponse(res, response(baseResponse.SUCCESS, userByEmail));
};

/**
 * API No. 3.3.
 * API Name : 특정 유저 조회 API by nickname
 * [GET] /app/users/nickname/{nickname}
 */
const getUserByNickname = async (req, res) => {
  /*
  Path Variable: nickname
  #swagger.tags = ['USER']
  #swagger.summary = "특정 유저 닉네임으로 조회 API"
  #swagger.responses[200] = {
    description: "유저 조회 성공",
    content: {
      "application/json": {
        example: {
          "isSuccess": true,
          "status": 200,
          "code": 1000,
          "message": "성공",
          "result": {
              "nickname": "yubinquitous",
              "email": "yubinquitous@gmail.com"
          }
        },
      }
    }
  }
  #swagger.responses[400] = {
    description: "유저 조회 실패",
    content: {
      "application/json": {
        example: {
          "isSuccess": false,
          "status": 400,
          "code": 2027,
          "message": "해당 닉네임을 가진 회원이 존재하지 않습니다."
          }
        },
      }
    }
  }
   */
  const nickname = req.params.nickname;
  if (!nickname)
    return sendResponse(res, errResponse(baseResponse.USER_NICKNAME_EMPTY));

  const userByNickname = await userProvider.retrieveUserByNickname(nickname);
  if (!userByNickname)
    return sendResponse(res, errResponse(baseResponse.USER_NICKNAME_NOT_EXIST));
  return sendResponse(res, response(baseResponse.SUCCESS, userByNickname));
};

// // TODO: After 로그인 인증 방법 (JWT)
// /**
//  * API No. 4
//  * API Name : 로그인 API
//  * [POST] /app/login
//  * body : email, passsword
//  */
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email)
//     return sendResponse(res, errResponse(baseResponse.USER_USEREMAIL_EMPTY));
//   if (!password)
//     return sendResponse(res, errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));

//   // userIdx와 jwt의 userIdx 비교
//   const userIdx = userProvider.retrieveUserIdx(email);
//   const userIdxFromJWT = req.verifiedToken.userIdx;
//   if (userIdx !== userIdxFromJWT) {
//     return sendResponse(res, errResponse(baseResponse.USER_ID_NOT_MATCH));
//   }

//   const signInResponse = await userService.postSignIn(email, password);

//   return sendResponse(res, signInResponse);
// };

/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userIdx
 * path variable : userIdx
 * body : nickname
 */
const patchUsers = async (req, res) => {
  /*
   jwt - userId, path variable :userId
  #swagger.tags = ['USER']
  #swagger.summary = "회원 정보 수정 API"
  #swagger.responses[200] = {
    description: "로그인 성공",
    content: {
      "application/json": {
        example: {
          "isSuccess": true,
          "status": 200,
          "code": 1000,
          "message": "성공"
        },
      }
    }
  }
  */

  const userIdxFromJWT = req.verifiedToken.userIdx;

  const userIdx = req.params.userIdx;
  const nickname = req.body.nickname;

  if (userIdxFromJWT != userIdx) {
    return sendResponse(res, errResponse(baseResponse.USER_ID_NOT_MATCH));
  } else {
    if (!nickname)
      return sendResponse(res, errResponse(baseResponse.USER_NICKNAME_EMPTY));

    const editUserInfo = await userService.editUser(userIdx, nickname);
    return sendResponse(res, editUserInfo);
  }
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
const check = async (req, res) => {
  const userIdResult = req.verifiedToken.userId;
  console.log(userIdResult);
  return sendResponse(res, response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

/**
 * API No. 6
 * API Name : 회원 탈퇴 API
 * [PATCH] /app/users/:userIdx/status
 * path variable : userIdx
 */
const patchUserStatus = async (req, res) => {
  /*
  #swagger.tags = ['USER']
  #swagger.summary = "회원 탈퇴 API"
  #swagger.responses[200] = {
    description: "회원 탈퇴 성공",
    content: {
      "application/json": {
        example: {
          "isSuccess": true,
          "status": 200,
          "code": 1000,
          "message": "성공"
        },
      }
    }
  }
  */

  const userIdx = req.params.userIdx;

  // userIdx와 jwt의 userIdx 비교
  const userIdxFromJWT = req.verifiedToken.userIdx;
  if (userIdx != userIdxFromJWT) {
    return sendResponse(res, errResponse(baseResponse.USER_ID_NOT_MATCH));
  }

  if (!userIdx)
    return sendResponse(res, errResponse(baseResponse.USER_USERIDX_EMPTY));

  await userService.modifyUserStatus(userIdx);
  return sendResponse(res, response(baseResponse.SUCCESS));
};

module.exports = {
  postUsers,
  getUsers,
  getUserFeed,
  getUserByEmail,
  getUserByNickname,
  patchUsers,
  check,
  patchUserStatus,
};
