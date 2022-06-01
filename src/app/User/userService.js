const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const { sendResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 회원 가입
const createUser = async (email, password, nickname, name) => {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    // 이메일 중복 확인
    const emailRows = await userProvider.emailCheck(email);
    if (emailRows.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

    // 비밀번호 암호화
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const insertUserInfoParams = [email, hashedPassword, nickname, name];

    const userIdResult = await userDao.insertUserInfo(
      connection,
      insertUserInfoParams
    );
    return response(baseResponse.SUCCESS, userIdResult[0].insertId);
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

// 로그인
const postSignIn = async (email, password) => {
  try {
    // // 이메일 여부 확인
    const emailRows = await userProvider.emailCheck(email);

    if (emailRows.length < 1)
      return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

    const selectEmail = emailRows[0].email;

    // 비밀번호 확인
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const selectUserPasswordParams = [selectEmail, hashedPassword];

    const passwordRows = await userProvider.passwordCheck(
      selectUserPasswordParams
    );

    if (passwordRows[0].password !== hashedPassword) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // 계정 상태 확인
    const userInfoRows = await userProvider.accountCheck(email);

    if (userInfoRows[0].status === "INACTIVE") {
      return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
    } else if (userInfoRows[0].status === "DELETED") {
      return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    }

    //토큰 생성 Service
    let token = await jwt.sign(
      {
        userId: userInfoRows[0].id,
      }, // 토큰의 내용(payload)
      secret_config.jwtsecret, // 비밀키
      {
        expiresIn: "365d",
        subject: "userInfo",
      } // 유효 기간 365일
    );

    return response(baseResponse.SUCCESS, {
      userId: userInfoRows[0].id,
      jwt: token,
    });
  } catch (err) {
    console.log(err);
    logger.error(
      `App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(
        err
      )}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 회원 정보 수정
const editUser = async (userIdx, nickname) => {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const editUserParams = [nickname, userIdx];
    const editUserResult = await userDao.updateUserInfo(
      connection,
      editUserParams
    );

    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - editUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

// 회원 탈퇴
const modifyUserStatus = async (userIdx) => {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await userDao.updateUserStatus(connection, userIdx);
  } catch (err) {
    logger.error(`App - modifyUserStatus Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

module.exports = {
  createUser,
  postSignIn,
  editUser,
  modifyUserStatus,
};
