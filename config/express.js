const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
// cors가 const가 아닌 이유는?
const cors = require("cors");

module.exports = function () {
  const app = express();

  app.use(compression());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(methodOverride());

  app.use(cors());
  // app.use(express.static(process.cwd() + '/public'));

  /* App (Android, iOS) */
  // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
  require("../src/app/User/userRoute")(app);
  require("../src/app/Post/postRoute")(app);
  require("../src/app/Auth/authRoute")(app);

  return app;
};
