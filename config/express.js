const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
const morgan = require("morgan");
const cors = require("cors");

module.exports = function () {
  const app = express();

  app.use(compression());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(methodOverride());

  app.use(cors());
  // app.use(express.static(process.cwd() + '/public'));

  app.use(morgan("dev"));

  require("../src/app/User/userRoute")(app);
  require("../src/app/Post/postRoute")(app);
  require("../src/app/Auth/authRoute")(app);

  return app;
};
