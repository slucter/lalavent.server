const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../helper/error');
require('dotenv').config();

exports.authorized = (req, res, next) => {
  const header = req.headers['baca-bismillah'];

  if(!header){
    throw new ErrorHandler(400, "Anda lupa baca bismillah.");
    res.status(200).send({
      message: 'You forget to enter headers!',
      headers: 0
    });
  } else {
    jwt.verify(header, process.env.SECRET_KEY, (err, decoded) => {
      if(err){
        res.status(200).send({
          message: 'Wrong token!',
          token: 0
        });
      } else {
        req.userId = decoded.id;
        next();
      }
    })
  }
}
