module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 0. 테스트 API
  // app.get('/app/test', user.getTest)

  // 1. 유저 생성 (회원가입) API
  app.post("/api/users", user.postUsers);

  // 2. 유저 조회 API (+ 검색)
  app.get("/api/users", user.getUsers);

  // 3.1. 유저 피드 조회 api
  app.get("/api/users/:userIdx", user.getUserFeed);

  // 3.2. 특정 유저 조회 API by email
  app.get("/api/users/email/:email", user.getUserByEmail);

  // 3.3. 특정 유저 조회 API by nickname
  app.get("/api/users/nickname/:nickname", user.getUserByNickname);

  // // TODO: After 로그인 인증 방법 (JWT)
  // // 로그인 하기 API (JWT 생성)
  // app.post("/api/login", jwtMiddleware, user.login);

  // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
  app.patch("/api/users/:userIdx", jwtMiddleware, user.patchUsers);

  // 1.3 유저 상세 조회 api
  //   app.get("/users/:userIdx", user.getUser); //

  // TODO: 탈퇴하기 API
  app.patch("/api/users/:userIdx/status", jwtMiddleware, user.patchUserStatus);
};

// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);
