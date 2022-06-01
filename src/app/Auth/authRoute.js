module.exports = (app) => {
  const auth = require("./authController");

  // 2.1. 일반 로그인 API
  app.post("/api/auth/login", auth.login);
};
