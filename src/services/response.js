 function responseService(req, res, next) {
  res.success = (data, message) => {
    console.log("data:"+data+" message:"+message)
    if (typeof data !== "object")
      return res.status(200).json({ success: true, message, data,status:200 });

    res.status(200).json({
      success: true,
      status:200,
      message,
      ...data,
      timestamp: new Date(),
    });
  };

  res.deleted = () => {
    res.status(200).json({
      success: true,
      message: "Record deleted",
      timestamp: new Date(),
    });
  };

  res.error = (message, code) => {
    res.status(400).json({
      success: false,
      message: message ? message : "woops something went wrong.",
      code: code || 1000, //common error
      timestamp: new Date(),
    });
  };

  res.validationFailed = (message) => {
    res.status(400).json({
      success: false,
      message: message ? message : "woops something went wrong.",
      code: 1400,
      timestamp: new Date(),
    });
  };

  res.unauth = (message) => {
    res.status(401).json({
      success: false,
      message: message ? message : "unauthorized.",
      code: 1401,
      timestamp: new Date(),
    });
  };

  res.notFound = () => {
    res.status(404).json({
      success: false,
      message: "not found.",
      code: 1404,
      timestamp: new Date(),
    });
  };

  res.noRecord = () => {
    res.status(400).json({
      success: false,
      message: "not record found.",
      code: 14005,
      timestamp: new Date(),
    });
  };

  next();
}
module.exports = responseService
