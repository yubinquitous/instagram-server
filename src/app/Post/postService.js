const { pool } = require("../../../config/database");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const postDao = require("./postDao");
const postProvider = require("./postProvider");

const createPost = async (userIdx, content, postImgUrls) => {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();
    const insertPostParams = [userIdx, content];
    // 게시물 생성
    const postResult = await postDao.insertPost(connection, insertPostParams);
    // 생성된 post의 idx
    const postIdx = postResult[0].insertId;

    for (postImgUrl of postImgUrls) {
      const insertPostImgParams = [postIdx, postImgUrl];
      await postDao.insertPostImg(connection, insertPostImgParams);
    }

    await connection.commit();
    return response(baseResponse.SUCCESS, { addedPost: postIdx });
  } catch (err) {
    console.log(`APP - createPost Service Error\n: ${err.message}`);

    await connection.rollback();

    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

const editPost = async (postIdx, content) => {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const editPostParams = [content, postIdx];
    await postDao.updatePost(connection, editPostParams);
    return response(baseResponse.SUCCESS);
  } catch (err) {
    console.log(`APP - editPost Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

const editPostStatus = async (postIdx) => {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    // 게시물 status 확인
    const postStatusResult = await postProvider.checkPostStatus(postIdx);
    if (postStatusResult === "INACTIVE") {
      return errResponse(baseResponse.POST_STATUS_INACTIVE);
    }

    // 게시물 status INACTIVE로 변경
    await postDao.updatePostStatus(connection, postIdx);

    return response(baseResponse.SUCCESS);
  } catch (err) {
    console.log(`APP - editPostStatus Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

module.exports = {
  createPost,
  editPost,
  editPostStatus,
};
