const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

const retrieveUserList = async () => {
  const connection = await pool.getConnection(async (conn) => conn);
  const userListResult = await userDao.selectUser(connection);
  connection.release();
  return userListResult;
};

const retrieveUserInfo = async (userIdx) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const userInfoResult = await userDao.selectUserInfo(connection, userIdx);

  connection.release(); // DB와의 연결 해제

  return userInfoResult[0];
};

const retrieveUserByEmail = async (email) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const [userResult] = await userDao.selectUserEmail(connection, email);
  connection.release();
  return userResult;
};

const retrieveUserByNickname = async (nickname) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const [userResult] = await userDao.selectUserNickname(connection, nickname);
  connection.release();
  return userResult;
};

const emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

const passwordCheck = async (email) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
    connection,
    email
  );
  connection.release();
  return passwordCheckResult;
};

const accountCheck = async (email) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};

// email로 userIdx 조회
const retrieveUserIdx = async (email) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdxResult = await userDao.selectUserIdx(connection, email);
  connection.release();

  return userIdxResult[0].userIdx;
};

module.exports = {
  retrieveUserList,
  retrieveUserInfo,
  retrieveUserByEmail,
  retrieveUserByNickname,
  emailCheck,
  passwordCheck,
  accountCheck,
  retrieveUserIdx,
};
