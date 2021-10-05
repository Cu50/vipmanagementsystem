const moment = require('moment')

const logger1=(req , res , next) => {
    console.log(
        `${req.protocol}://${req.get('host')}
        ${res.originalUrl}:
        ${moment().format()}`
        );
    next();
  };

  module.exports =logger1;