const response = ({ isSuccess, code, message }, result) => {
  return {
    isSuccess: isSuccess,
    status: 200,
    code: code,
    message: message,
    result: result,
  };
};

const errResponse = ({ isSuccess, code, message }) => {
  if (code >= 4000) {
    return {
      isSuccess: isSuccess,
      status: 500,
      code: code,
      message: message,
    };
  } else {
    return {
      isSuccess: isSuccess,
      status: 400,
      code: code,
      message: message,
    };
  }
};

const sendResponse = (res, result) => {
  res.status(result.status).json(result);
};

module.exports = { response, errResponse, sendResponse };
