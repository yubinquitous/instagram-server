// 유저 피드 조회
const selectUserPosts = async (connection, userIdx) => {
  const selectUserPostsQuery = `
    SELECT p.postIdx as postIdx,
        pi.imageUrl as postImgUrl
    FROM post p
    JOIN postImage pi ON pi.postIdx = p.postIdx AND pi.status = 'ACTIVE'
    JOIN user u ON u.userIdx = p.userIdx
    WHERE p.status = 'ACTIVE' AND u.userIdx = ?
    group by p.postIdx
    HAVING min(pi.postImgIdx)
    order by p.postIdx;
    `;
  const [userPostsRows] = await connection.query(selectUserPostsQuery, userIdx);
  return userPostsRows;
};

const selectUserPostList = async (connection, userIdx) => {
  const selectUserPostListQuery = `
    SELECT p.postIdx as postIdx,
      u.userIdx as userIdx,
      u.nickname as nickname,
    	u.profileImgUrl as profileImgUrl,
      p.content as content,
    	IF(postLikeCount is null, 0, postLikeCount) as postLikeCount,
  	CASE
  	  when timestampdiff(second, p.updatedAt, current_timestamp) < 60
  			then concat(timestampdiff(second, p.updatedAt, current_timestamp), '초 전')
      when timestampdiff(minute , p.updatedAt, current_timestamp) < 60
        then concat(timestampdiff(minute, p.updatedAt, current_timestamp), '분 전')
      when timestampdiff(hour , p.updatedAt, current_timestamp) < 24
        then concat(timestampdiff(hour, p.updatedAt, current_timestamp), '시간 전')
      when timestampdiff(day , p.updatedAt, current_timestamp) < 365
        then concat(timestampdiff(day, p.updatedAt, current_timestamp), '일 전')
  		else timestampdiff(year , p.updatedAt, current_timestamp)
      end as uploadTime,
	  IF(pl.status = 'ACTIVE', 'Y', 'N') as likeOrNot
    FROM post p
    JOIN user u ON u.userIdx = p.userIdx
    LEFT JOIN 
      (SELECT postIdx, count(*) as postLikeCount FROM likes WHERE status = 'ACTIVE' group by postIdx) plc
      ON plc.postIdx = p.postIdx
    LEFT JOIN follow f
      ON f.followingIdx = p.userIdx and f.status = 'ACTIVE'
    LEFT JOIN likes pl
      ON pl.userIdx = f.followerIdx and pl.postIdx = p.postIdx
    WHERE f.followerIdx = ? and p.status = 'ACTIVE'
    group by p.postIdx;
    `;
  const [postRows] = await connection.query(selectUserPostListQuery, userIdx);
  return postRows;
};

const selectPostImgs = async (connection, postIdx) => {
  const selectPostImgsQuery = `
    SELECT pi.postImgIdx,
      pi.imageUrl
    FROM postImage pi
    JOIN post p ON p.postIdx = pi.postIdx
    WHERE pi.status = 'ACTIVE' and p.postIdx= ?;`;
  const [postImgRows] = await connection.query(selectPostImgsQuery, postIdx);
  return postImgRows;
};

const insertPost = async (connection, insertPostParams) => {
  const insertPostQuery = `
    INSERT INTO post(userIdx, content)
    VALUES (?, ?);
    `;

  const insertPostRow = await connection.query(
    insertPostQuery,
    insertPostParams
  );
  return insertPostRow;
};

const insertPostImg = async (connection, insertPostImgParams) => {
  const insertPostImgQuery = `
    INSERT INTO postImage(postIdx, imageUrl)
    VALUES (?, ?);
    `;

  const insertPostImgRow = await connection.query(
    insertPostImgQuery,
    insertPostImgParams
  );
  return insertPostImgRow;
};

const updatePost = async (connection, editPostParams) => {
  const updatePostQuery = `
    UPDATE post
    SET content = ?
    WHERE postIdx = ?;
    `;
  const updatePostRow = await connection.query(updatePostQuery, editPostParams);
  return updatePostRow;
};

const selectPostStatus = async (connection, postIdx) => {
  const selectPostStatusQuery = `
    SELECT status
    FROM post
    WHERE postIdx = ?;
    `;
  const [postStatusRow] = await connection.query(
    selectPostStatusQuery,
    postIdx
  );
  return postStatusRow;
};

const updatePostStatus = async (connection, postIdx) => {
  const updatePostStatusQuery = `
    UPDATE post
    SET status = 'INACTIVE'
    WHERE postIdx = ?;
    `;
  const updatePostStatusRow = await connection.query(
    updatePostStatusQuery,
    postIdx
  );
  return updatePostStatusRow;
};

// postIdx로 userIdx 조회
const selectUserIdx = async (connection, postIdx) => {
  const selectUserIdxQuery = `
    SELECT userIdx
    FROM post
    WHERE postIdx = ?;
    `;
  const [userIdxRow] = await connection.query(selectUserIdxQuery, postIdx);
  return userIdxRow;
};

module.exports = {
  selectUserPosts,
  selectUserPostList,
  selectPostImgs,
  insertPost,
  insertPostImg,
  updatePost,
  selectPostStatus,
  updatePostStatus,
  selectUserIdx,
};
