// 모든 유저 조회
const selectUser = async (connection) => {
  const selectUserListQuery = `
    SELECT nickname, email, status
    FROM user;
    `;
  const [userRows] = await connection.query(selectUserListQuery);
  // userRow에 대괄호를 치면 배열의 첫 번쨰, 즉 결과값만 가져온다.
  return userRows;
};

// 이메일로 회원 조회
const selectUserEmail = async (connection, email) => {
  const selectUserEmailQuery = `
    SELECT nickname, email
    FROM user
    WHERE email = ?;
    `;
  const [userRow] = await connection.query(selectUserEmailQuery, email);
  return userRow;
};

// userId 회원 조회
const selectUserInfo = async (connection, userIdx) => {
  const selectUserInfoQuery = `
    SELECT u.nickname as nickname,
	      u.name as name,
        u.profileImgUrl as profileImgUrl,
        u.website as website,
        u.introduce as introduce,
        IF(followerCount is null, 0, followerCount) as followerCount,
        If(followingCount is null, 0, followingCount) as followingCount,
        If(postCount is null, 0, postCount) as postCount
    FROM user  u
    LEFT JOIN (SELECT userIdx, count(postIdx) as postCount from post WHERE status = 'ACTIVE' group by userIdx) p on p.userIdx = u.userIdx
    LEFT JOIN (SELECT followerIdx, count(followIdx) as followingCount FROM follow WHERE status = 'ACTIVE' group by followerIdx) following on following.followerIdx = u.userIdx
    LEFT JOIN (SELECT followingIdx, count(followIdx) as followerCount FROM follow WHERE status = 'ACTIVE' group by followingIdx) follower on follower.followingIdx = u.userIdx
    WHERE u.userIdx = ? and u.status = 'ACTIVE'
    group by u.userIdx;
  `;
  const [userRow] = await connection.query(selectUserInfoQuery, userIdx); // 배열 할당할 때 변수명에 대괄호를 씌운다.
  return userRow;
};

// nickname으로 회원 조회
const selectUserNickname = async (connection, nickname) => {
  const selectUserNicknameQuery = `
    SELECT nickname, email
    FROM user
    WHERE nickname = ?;
    `;
  const [userRow] = await connection.query(selectUserNicknameQuery, nickname);
  return userRow;
};

// 유저 생성
const insertUserInfo = async (connection, insertUserInfoParams) => {
  const insertUserInfoQuery = `
    INSERT INTO user (email, password, nickname, name)
    VALUES (?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
};

// 패스워드 체크
const selectUserPassword = async (connection, email) => {
  const selectUserPasswordQuery = `
    SELECT userIdx, password
    FROM user
    WHERE email = ?;
    `;

  const [selectUserPasswordRow] = await connection.query(
    selectUserPasswordQuery,
    email
  );
  return selectUserPasswordRow;
};

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
const selectUserAccount = async (connection, email) => {
  const selectUserAccountQuery = `
    SELECT status, userIdx
    FROM user 
    WHERE email = ?;
    `;
  const selectUserAccountRow = await connection.query(
    selectUserAccountQuery,
    email
  );
  return selectUserAccountRow[0];
};

const updateUserInfo = async (connection, editUserParams) => {
  const updateUserQuery = `
    UPDATE user 
    SET nickname = ?
    WHERE userIdx = ?;
    `;
  const updateUserRow = await connection.query(updateUserQuery, editUserParams);
  return updateUserRow[0];
};

const updateUserStatus = async (connection, userIdx) => {
  const query = `
    UPDATE user
    SET status = 'DELETED'
    WHERE userIdx = ?;`;
  const [updateUserRow] = await connection.query(query, userIdx);
  console.log(updateUserRow);
};

const selectUserIdx = async (connection, email) => {
  const query = `
    SELECT userIdx
    FROM user
    WHERE email = ?;
    `;
  const [userIdxRow] = await connection.query(query, email);
  return userIdxRow;
};

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserInfo,
  selectUserNickname,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  updateUserStatus,
  selectUserIdx,
};
