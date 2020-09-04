const errorHandle = (error, request, response, next) => {
  console.log(error);
  next(error);
};
module.exports = errorHandle;
