const Roles = require('../models').role;
const { ErrorHandler } = require('../helper/error');

exports.addRole = (req, res, next) => {
  Roles
    .create({
      name: req.body.name
    })
    .then(data => {
      res.status(201).send({
        role: data,
        message: 'role has been created!'
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getAllRoles = (req, res, next) => {
  Roles.findAndCountAll({
    exclude: ["createdAt", "updatedAt"],
  })
    .then(data => {
      res.status(200).send({
        Roles: data
      });
    })
    .catch(() => {
      throw new ErrorHandler(500, 'Internal server error');
    });
};

exports.getRoleById = async (req, res, next) => {
  const roleId = req.params.roleId;

  try {
    const role = await Roles.findOne({
      where: {
        id: roleId
      }
    });
    if (!role) {
      res.status(200).send({
        message: 'role not found!',
        id: 0
      });
    }
    else {
      Roles
        .findOne({
          where: {
            id: roleId
          },
          exclude: ["createdAt", "updatedAt"],
        })
        .then(data => {
          res.status(200).send({
            role: data
          });
        });
    }
  } catch(error) {
    next(error);
  }
};

exports.updateRole = (req, res, next) => {
  const roleId = req.params.roleId;

  const role = Roles.findOne({
    id: roleId
  });
  if (!role) {
    res.status(200).send({
      message: 'role not found!',
      id: 0
    });
  } else {
    Roles
      .update({
        name: req.body.name
      },
      {
        where: {
          id: roleId
        }
      })
      .then(data => {
        res.status(200).send({
          message: 'role has been updated!',
          role: data
        });
      });
  }
};

exports.deleteRole = async (req, res, next) => {
  const roleId = req.params.roleId;

  try {
    const role = await Roles.findOne({
      where: {
        id: roleId
      }
    });
    if (!role) {
      res.status(200).send({
        message: 'role not found!',
        id: 0
      });
    } else {
      Roles
        .destroy({
          where: {
            id: roleId
          }
        })
        .then(data => {
          res.status(200).send({
            message: 'role has been deleted!',
            role: data
          });
        });
    }
  } catch(error) {
    next(error);
  }
};
