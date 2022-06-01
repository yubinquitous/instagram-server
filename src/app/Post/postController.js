const baseResponse = require("../../../config/baseResponseStatus");
const {
  response,
  errResponse,
  sendResponse,
} = require("../../../config/response");
const postService = require("./postService");
const postProvider = require("./postProvider");

/**
 * API No. 3.1.
 * API Name : 게시물 조회 API
 * [GET] /posts?userIdx=
 */
const getPosts = async (req, res) => {
  /*
  Path Variable : userIdx
  #swagger.tags = ['POST']
  #swagger.summary = "게시물 조회 API"
  #swagger.responses[200] = {
    description: "게시물 조회 성공",
    content: {
      "application/json": {
        schema: {
          "type": "object",
            "properties": {
              "postIdx": {
                "type": "string",
                "required": true
              },
              "userIdx": {
                "type": "string",
                "required": true
              },
              "nickname": {
                "type": "string",
                "required": true
              },
              "profileImgUrl": {
                "type": "string",
                "required": true
              },
              "content": {
                "type": "string",
                "required": true
              },
              "postLikeCount": {
                "type": "string",
                "required": true
              },
              "uploadTime": {
                "type": "string",
                "required": true
              },
              "likeOrNot": {
                "type": "string",
                "required": true
              },
              "imgs": {
                "type": "string",
                "required": true
              },
            }
        },
        example: {
          "data": {
            "isSuccess": true,
            "code": 1000,
            "message": "성공",
            "result": [
              {
                  "postIdx": 9,
                  "userIdx": 3,
                  "nickname": "rainy",
                  "profileImgUrl": "imgurl3",
                  "content": "content9 by 3",
                  "postLikeCount": 1,
                  "uploadTime": "2일 전",
                  "likeOrNot": "Y",
                  "imgs": []
              },
              {
                  "postIdx": 3,
                  "userIdx": 3,
                  "nickname": "rainy",
                  "profileImgUrl": "imgurl3",
                  "content": "content3 by 3",
                  "postLikeCount": 2,
                  "uploadTime": "20일 전",
                  "likeOrNot": "Y",
                  "imgs": [
                      {
                          "postImgIdx": 3,
                          "imageUrl": "imgurl3 by post3"
                      },
                      {
                          "postImgIdx": 4,
                          "imageUrl": "imgurl4 by post3"
                      }
                  ]
              },
              {
                  "postIdx": 4,
                  "userIdx": 4,
                  "nickname": "goak",
                  "profileImgUrl": "imgurl4",
                  "content": "content4 by 4",
                  "postLikeCount": 1,
                  "uploadTime": "20일 전",
                  "likeOrNot": "N",
                  "imgs": [
                      {
                          "postImgIdx": 5,
                          "imageUrl": "imgurl5 by post4"
                      },
                      {
                          "postImgIdx": 6,
                          "imageUrl": "imgurl6 by post4"
                      },
                      {
                          "postImgIdx": 7,
                          "imageUrl": "imgurl7 by post4"
                      }
                  ]
              },
              {
                  "postIdx": 5,
                  "userIdx": 5,
                  "nickname": "pat",
                  "profileImgUrl": "imgurl5",
                  "content": "content5 by 5",
                  "postLikeCount": 0,
                  "uploadTime": "20일 전",
                  "likeOrNot": "N",
                  "imgs": []
              }
            ]            
          }
        },
      }
    }
  }
  */
  const userIdx = req.query.userIdx;
  // validation
  if (!userIdx)
    return sendResponse(res, errResponse(baseResponse.USER_USERIDX_EMPTY));
  if (userIdx <= 0)
    return sendResponse(res, errResponse(baseResponse.USER_USERIDX_LENGTH));

  const postList = await postProvider.retrieveUserPostList(userIdx);
  return sendResponse(res, response(baseResponse.SUCCESS, postList));
};

/**
 * API No. 3.2.
 * API Name: 게시물 생성 API
 * [POST] /posts
 */
const postPost = async (req, res) => {
  /*
    Body : userIdx, content, postImgUrls
    #swagger.tags = ['POST']
    #swagger.summary = "게시물 생성 API"
    #swagger.responses[200] = {
      description: "게시물 생성 성공",
      content: {
        "application/json": {
          example: {
            "isSuccess": true,
            "status" : 200,
            "code": 1000,
            "message": "성공",
            "result": {
              "addedPost": 12
            }
          },
        }
      }
    }
  */
  const { userIdx, content, postImgUrls } = req.body;

  // userIdx와 jwt의 userIdx 비교
  const userIdxFromJWT = req.verifiedToken.userIdx;
  if (userIdx != userIdxFromJWT) {
    return sendResponse(res, errResponse(baseResponse.USER_ID_NOT_MATCH));
  }

  // validation
  if (!userIdx) {
    return sendResponse(res, errResponse(baseResponse.USER_USERIDX_EMPTY));
  } else if (postImgUrls.length <= 0) {
    return sendResponse(res, errResponse(baseResponse.POST_POSTIMGURLS_EMPTY));
  }

  if (userIdx <= 0) {
    return sendResponse(res, errResponse(baseResponse.USER_USERIDX_LENGTH));
  } else if (content.length > 450) {
    return sendResponse(res, errResponse(baseResponse.POST_CONTENT_LENGTH));
  }

  const createPostResponse = await postService.createPost(
    userIdx,
    content,
    postImgUrls
  );

  return sendResponse(res, createPostResponse);
};

/*
    API No 3.3.
    API Name : 게시물 수정 API
    [PATCH] /posts/:postIdx
*/
const patchPost = async (req, res) => {
  /*
      Path Variable: postIdx
      Body : content
      #swagger.tags = ['POST']
      #swagger.summary = "게시물 수정 API"
      #swagger.responses[200] = {
        description: "게시물 수정 성공",
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
      #swagger.responses[400] = {
        description: "게시물 수정 실패",
        content: {
          "application/json": {
            example: {
              "isSuccess": false,
              "status": 400,
              "code": 2024,
              "message": "postIdx는 0보다 큰 값으로 입력해주세요."
            },
          }
        }
      }
  */
  const postIdx = req.params.postIdx;
  const { content } = req.body;

  // userIdx와 jwt의 userIdx 비교
  const userIdx = postProvider.retrieveUserIdx(postIdx);
  const userIdxFromJWT = req.verifiedToken.userIdx;
  if (userIdx != userIdxFromJWT) {
    return sendResponse(res, errResponse(baseResponse.USER_ID_NOT_MATCH));
  }

  // validation
  if (!postIdx) {
    return sendResponse(res, errResponse(baseResponse.POST_POSTIDX_EMPTY));
  } else if (!content) {
    return sendResponse(res, errResponse(baseResponse.POST_CONTENT_EMPTY));
  }

  if (postIdx <= 0) {
    return sendResponse(res, errResponse(baseResponse.POST_POSTIDX_LENGTH));
  } else if (content.length > 450) {
    return sendResponse(res, errResponse(baseResponse.POST_CONTENT_LENGTH));
  }

  const editPostResponse = await postService.editPost(postIdx, content);

  return sendResponse(res, editPostResponse);
};

/*
    API No.3.4
    API NAme: 게시물 삭제 API
    [PATCH] /posts/:postIdx/status
*/
const patchPostStatus = async (req, res) => {
  /*
      Path Variable: postIdx
      #swagger.tags = ['POST']
      #swagger.summary = "게시물 삭제 API"
      #swagger.responses[200] = {
        description: "게시물 삭제 성공",
        content: {
          "application/json": {
            example: {
              "isSuccess": true,
              "code": 1000,
              "message": "성공",
              "status": 200
            },
          }
        },
      }
      #swagger.responses[400] = {
        description: "게시물 삭제 실패",
        content: {
          "application/json": {
            example: {
              "isSuccess": false,
              "code": 3007,
              "message": "이미 삭제된 게시물입니다.",
              "status": 400
            },
          }
        },
      }
  */
  const postIdx = req.params.postIdx;

  // userIdx와 jwt의 userIdx 비교
  const userIdx = postProvider.retrieveUserIdx(postIdx);
  const userIdxFromJWT = req.verifiedToken.userIdx;
  if (userIdx != userIdxFromJWT) {
    return sendResponse(res, errResponse(baseResponse.USER_ID_NOT_MATCH));
  }

  // validation
  if (!postIdx) {
    return sendResponse(res, errResponse(baseResponse.POST_POSTIDX_EMPTY));
  } else if (postIdx <= 0) {
    return sendResponse(res, errResponse(baseResponse.POST_POSTIDX_LENGTH));
  }

  const editPostStatusResponse = await postService.editPostStatus(postIdx);

  return sendResponse(res, editPostStatusResponse);
};

module.exports = {
  getPosts,
  postPost,
  patchPost,
  patchPostStatus,
};
