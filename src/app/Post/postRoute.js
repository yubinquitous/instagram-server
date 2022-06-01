module.exports = (app) => {
  const post = require("./postController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 3.1. 게시물 리스트 조회
  app.get("/api/posts", post.getPosts);

  // 3.2. 게시물 생성 API
  app.post("/api/posts", jwtMiddleware, post.postPost);

  // 3.3. 게시물 수정 API
  app.patch("/api/posts/:postIdx", jwtMiddleware, post.patchPost);

  // 3.4. 게시물 삭제 API
  app.patch("/api/posts/:postIdx/status", jwtMiddleware, post.patchPostStatus);
};
