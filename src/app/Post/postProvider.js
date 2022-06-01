const { pool } = require("../../../config/database");
const postDao = require("./postDao");

const retrieveUserPosts = async (userIdx) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const userPostsResult = await postDao.selectUserPosts(connection, userIdx);

  connection.release();
  return userPostsResult;
};

// 게시물 리스트 조회
const retrieveUserPostList = async (userIdx) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const userPostList = await postDao.selectUserPostList(connection, userIdx);

  // 반복문을 통해 객체마다 게시물별 사진들 추가하기
  for (post of userPostList) {
    const postIdx = post.postIdx;
    const postImgList = await postDao.selectPostImgs(connection, postIdx);
    post.imgs = postImgList;
  }
  connection.release();
  return userPostList;
};

// 게시물 status 확인
const checkPostStatus = async (postIdx) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const poststatusResult = await postDao.selectPostStatus(connection, postIdx);

  connection.release();
  return poststatusResult[0].status; // status만 리턴해줌
};

// postIdx로 userIdx 조회
const retrieveUserIdx = async (postIdx) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdxResult = await postDao.selectUserIdx(connection, postIdx);

  connection.release();
  return userIdxResult[0].userIdx;
};

module.exports = {
  retrieveUserPosts,
  retrieveUserPostList,
  checkPostStatus,
  retrieveUserIdx,
};
