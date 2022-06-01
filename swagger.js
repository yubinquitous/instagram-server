const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./src/app/Post/postRoute.js",
  "./src/app/User/userRoute.js",
  "./src/app/Auth/authRoute.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc);
