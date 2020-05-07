const Categories = require('../models').category;
const { ErrorHandler } = require('../helper/error');

exports.addCategory = (req, res, next) => {
  Categories
    .create({
      name: req.body.name
    })
    .then(data => {
      res.status(201).send({
        category: data,
        message: 'category has been created!'
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getAllCategories = (req, res, next) => {
  Categories.findAndCountAll({
    exclude: ["createdAt", "updatedAt"],
  })
    .then(data => {
      res.status(200).send({
        Categories: data
      });
    })
    .catch(() => {
      throw new ErrorHandler(500, 'Internal server error');
    });
};

exports.getCategoryById = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await Categories.findOne({
      where: {
        id: categoryId
      }
    });
    if (!category) {
      res.status(200).send({
        message: 'category not found!',
        id: 0
      });
    }
    else {
      Categories
        .findOne({
          where: {
            id: categoryId
          },
          exclude: ["createdAt", "updatedAt"],
        })
        .then(data => {
          res.status(200).send({
            category: data
          });
        });
    }
  } catch(error) {
    next(error);
  }
};

exports.updateCategory = (req, res, next) => {
  const categoryId = req.params.categoryId;

  const category = Categories.findOne({
    id: categoryId
  });
  if (!category) {
    res.status(200).send({
      message: 'category not found!',
      id: 0
    });
  } else {
    Categories
      .update({
        name: req.body.name
      },
      {
        where: {
          id: categoryId
        }
      })
      .then(data => {
        res.status(200).send({
          message: 'category has been updated!',
          category: data
        });
      });
  }
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await Categories.findOne({
      where: {
        id: categoryId
      }
    });
    if (!category) {
      res.status(200).send({
        message: 'category not found!',
        id: 0
      });
    } else {
      Categories
        .destroy({
          where: {
            id: categoryId
          }
        })
        .then(data => {
          res.status(200).send({
            message: 'category has been deleted!',
            category: data
          });
        });
    }
  } catch(error) {
    next(error);
  }
};
