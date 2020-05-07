const Users = require('../models').user;
const Roles = require('../models').role;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../helper/error');
const sendEmail = require('../helper/sendEmail');

exports.signUp = (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  Users
    .create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
      image: 'http://192.168.1.97:5000/uploads/default-user.jpg',
      role_id: req.body.role_id || 1,
      address: req.body.address,
      description: req.body.description,
      status: 0,
    })
    .then(data => {
      const token = jwt.sign( {id: data.id}, process.env.SECRET_KEY );
      sendEmail.sendEmail(token, req.body.email);
      res.status(201).send({
        user: data,
        message: 'User has been created!'
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.signIn = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) {
      res.status(200).json({
        message: 'You are not registered! Please Signup',
        id: 0
      });
    } else {
      Users
        .findOne({
          where: {
            email: req.body.email
          }
        })
        .then(data => {
          if (data) {
            const authorized = bcrypt.compareSync(
              req.body.password,
              data.password
            );
            if (authorized) {
              const status = data.status;
              if (status == 1) {
                const token = jwt.sign( {
                  id: data.id
                }, process.env.SECRET_KEY );
                res.status(200).send({
                  id: data.id,
                  role: data.role_id,
                  token: token,
                  message: 'Login Successfuly!'
                });
              } else {
                res.status(200).json({
                  message: 'Please Activate Your Email',
                  status: 0
                });
              }
            } else {
              res.status(200).json({
                message: 'Wrong Password',
                password: 0
              });
            }
          }
        });
    }
  } catch(error) {
    next(error);
  }
};

exports.getAllUsers = (req, res, next) => {
  Users.findAndCountAll({
    exclude: ["createdAt", "updatedAt"],
    include: [
      { model: Roles, as: "role", attributes: ["name"] },
    ]
  })
    .then(data => {
      res.status(200).send({
        users: data
      });
    })
    .catch(() => {
      throw new ErrorHandler(500, 'Internal server error');
    });
};

exports.checkUsers = async (req, res, next) => {
  // try {
    const user = await Users.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) {
      res.status(200).json({
        message: 'Alhamdulillah',
        status: 1
      });
    } else {
      res.status(200).json({
        message: 'Astagfirullah',
        status: 0
      });
    }
  // } catch(error) {
  //   next(error);
  // }
};

exports.getUserById = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await Users.findOne({
      where: {
        id: userId
      }
    });
    if (!user) {
      res.status(200).send({
        message: 'User not found!',
        id: 0
      });
    }
    else {
      Users
        .findOne({
          where: {
            id: userId
          },
          exclude: ["createdAt", "updatedAt"],
          include: [
            { model: Roles, as: "role", attributes: ["name"] },
          ]
        })
        .then(data => {
          const token = jwt.sign({
            id: data.id
          }, process.env.SECRET_KEY);
          res.status(200).send({
            user: data
          });
        });
    }
  } catch(error) {
    next(error);
  }
};

exports.getUserByRoleId = async (req, res, next) => {
  const roleId = req.params.roleId;

  try {
    const user = await Users.findOne({
      where: {
        role_id: roleId
      }
    });
    if (!user) {
      res.status(200).send({
        message: 'User not found!',
        id: 0
      });
    }
    else {
      Users
        .findAndCountAll({
          where: {
            role_id: roleId
          },
          exclude: ["createdAt", "updatedAt"],
          include: [
            { model: Roles, as: "role", attributes: ["name"] },
          ]
        })
        .then(data => {
          const token = jwt.sign({
            id: data.id
          }, process.env.SECRET_KEY);
          res.status(200).send({
            user: data
          });
        });
    }
  } catch(error) {
    next(error);
  }
};

exports.userActivation = (req, res, next) => {
  const header = req.query.token;
  const userId = req.params.userId;

  if(!header) {
    res.status(200).send({
      message: 'You forget to enter token!',
      token: 0
    });
  } else {
    jwt.verify(header, process.env.SECRET_KEY, (err, decoded) => {
      if(err) {
        res.status(200).send({
          token: 0,
          message: 'Wrong Token!'
        });
      } else {
        req.userId = decoded.id;
        console.log(req.userId);
      }
    })
  }
  Users
    .update({
      status: 1
    }, {
      where: {
        id: req.userId
      }
    })
    .then(data => {
      res.status(200).send({
        user: data
      });
    })
    .catch(() => {
      throw new ErrorHandler(500, 'Internal server error');
    });
};

exports.updateUser = (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const userId = req.params.userId;

  const user = Users.findOne({
    id: userId
  });
  if (!user) {
    res.status(200).send({
      message: 'User not found!',
      id: 0
    });
  } else {
    Users
      .update({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        image: 'http://192.168.1.97:5000/uploads/default-user.jpg',
        role_id: req.body.role_id,
        address: req.body.address,
        description: req.body.description,
        status: req.body.status,
      },
      {
        where: {
          id: userId
        }
      })
      .then(data => {
        res.status(200).send({
          message: 'User has been updated!',
          user: data
        });
      });
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await Users.findOne({
      where: {
        id: userId
      }
    });
    if (!user) {
      res.status(200).send({
        message: 'User not found!',
        id: 0
      });
    } else {
      Users
        .destroy({
          where: {
            id: userId
          }
        })
        .then(data => {
          res.status(200).send({
            message: 'User has been deleted!',
            user: data
          });
        });
    }
  } catch(error) {
    next(error);
  }
};
