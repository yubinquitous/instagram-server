const baseResponse = require("../../../config/baseResponseStatus");
const {
  sendResponse,
  response,
  errResponse,
} = require("../../../config/response");
const userProvider = require("../User/userProvider");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");

const postSignIn = async (email, pwd) => {
  try {
    // email check
    const emailRows = await userProvider.emailCheck(email);
    if (emailRows.length < 1) {
      return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
    }

    // pwd check
    const hashedPassword = crypto
      .createHash("sha512")
      .update(pwd)
      .digest("hex");
    const passwordRows = await userProvider.passwordCheck(email);
    if (passwordRows[0].password != hashedPassword) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // account check
    const userAccountRows = await userProvider.accountCheck(email);

    if (userAccountRows[0].status === "INACTIVE") {
      return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
    } else if (userAccountRows[0].status === "DELETED") {
      return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    }

    let token = jwt.sign(
      // payload : token의 내용
      {
        userIdx: userAccountRows[0].userIdx,
      },
      // 비밀키
      secret_config.jwtsecret,
      // 유효기간 365일
      {
        expiresIn: "365d",
        subject: "user",
      }
    );

    return response(baseResponse.SUCCESS, { jwt: token });
  } catch (err) {
    console.log(`App - postSignIn Service error\n: ${err.message}`);

    return errResponse(baseResponse.DB_ERROR);
  }
};

module.exports = { postSignIn };
