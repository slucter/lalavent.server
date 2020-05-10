const Events = require('../models').event;
const Users = require('../models').user;
const Categories = require('../models').category;
const { Op } = require('sequelize');
const { ErrorHandler } = require('../helper/error');

exports.addEvent = (req, res, next) => {
  if (req.file.filename) {
    Events
      .create({
        title: req.body.title,
        user_id: req.body.user_id,
        image: `http://192.168.1.97:5000/uploads/${req.file.filename}`,
        date: req.body.date,
        location: req.body.location,
        time_start: req.body.time_start,
        time_end: req.body.time_end,
        quota: req.body.quota,
        description: req.body.description,
        attend: req.body.attend,
        category_id: req.body.category_id,
        type: req.body.type,
        status: req.body.status,
        price: req.body.price
      })
      .then(data => {
        res.status(201).send({
          event: data,
          message: 'event has been created!'
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    Events
      .create({
        title: req.body.title,
        user_id: req.body.user_id,
        image: 'http://192.168.1.97:5000/uploads/default-image.jpg',
        date: req.body.date,
        location: req.body.location,
        time_start: req.body.time_start,
        time_end: req.body.time_end,
        quota: req.body.quota,
        description: req.body.description,
        attend: req.body.attend,
        category_id: req.body.category_id,
        type: req.body.type,
        status: req.body.status,
        price: req.body.price
      })
      .then(data => {
        res.status(201).send({
          event: data,
          message: 'event has been created!'
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.getAllEvents = (req, res, next) => {
  const orderByTime = req.query.time;
  const search = req.query.search;
  const limit = 10;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;

  if (search) {
    Events.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.substring]: search } }
        ]
      },
      exclude: ["createdAt", "updatedAt"],
      include: [
        { model: Users, as: "user", attributes: ["name", "email", "address"] },
        { model: Categories, as: "category", attributes: ["name"] }
      ],
    })
      .then(data => {
        res.status(200).send({
          search: search,
          message: "Search Events",
          events: data
        });
      })
      .catch(() => {
        throw new ErrorHandler(500, 'Internal server error');
      });
  } else if (orderByTime) {
    Events.findAndCountAll({
      order: [["date", orderByTime]],
      exclude: ["createdAt", "updatedAt"],
      include: [
        { model: Users, as: "user", attributes: ["name", "email", "address"] },
        { model: Categories, as: "category", attributes: ["name"] }
      ],
      limit: limit,
      offset: offset
    })
      .then(data => {
        const pages = Math.ceil(data.count / limit);
        if (page > pages) {
          next();
        } else {
          res.status(200).send({
            page: `${page} of ${pages}`,
            message: "Order Event By Date",
            events: data
          });
        }
      })
      .catch(() => {
        throw new ErrorHandler(500, 'Internal server error');
      });
  } else {
    Events.findAndCountAll({
        exclude: ["createdAt", "updatedAt"],
      include: [
        { model: Users, as: "user", attributes: ["name", "email", "address"] },
        { model: Categories, as: "category", attributes: ["name"] },
      ],
      limit: limit,
      offset: offset
    })
      .then(data => {
        const pages = Math.ceil(data.count / limit);
        if (page > pages) {
          next();
        } else {
          res.status(200).send({
            page: `${page} of ${pages}`,
            message: "Get All Events",
            events: data
          });
        }
      })
      .catch(() => {
        throw new ErrorHandler(500, 'Internal server error');
      });
  }
};

exports.getEventById = async (req, res, next) => {
  const eventId = req.params.eventId;

  try {
    const event = await Events.findOne({
      where: {
        id: eventId
      }
    });
    if (!event) {
      res.status(200).send({
        message: 'event not found!',
        id: 0
      });
    }
    else {
      Events
        .findOne({
          where: {
            id: eventId
          },
          exclude: ["createdAt", "updatedAt"],
          include: [
            { model: Users, as: "user", attributes: ["name", "email", "address"] },
            { model: Categories, as: "category", attributes: ["name"] }
          ]
        })
        .then(data => {
          res.status(200).send({
            event: data
          });
        });
    }
  } catch(error) {
    next(error);
  }
};

exports.getEventByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  const orderByTime = req.query.time;
  const search = req.query.search;
  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;

  try {
    const event = await Events.findOne({
      where: {
        user_id: userId
      }
    });
    if (!event) {
      res.status(200).send({
        message: 'event not found!',
        id: 0
      });
    }
    else {
      if (search) {
        Events.findAndCountAll({
          where: {
            user_id: userId,
            [Op.or]: [
              { title: { [Op.substring]: search } }
            ]
          },
          exclude: ["createdAt", "updatedAt"],
          include: [
            { model: Users, as: "user", attributes: ["name", "email", "address"] },
            { model: Categories, as: "category", attributes: ["name"] }
          ],
        })
          .then(data => {
            res.status(200).send({
              search: search,
              message: "Search Events",
              events: data
            });
          })
          .catch(() => {
            throw new ErrorHandler(500, 'Internal server error');
          });
      } else if (orderByTime) {
        Events.findAndCountAll({
          where: {
            user_id: userId
          },
          order: [["date", orderByTime]],
          exclude: ["createdAt", "updatedAt"],
          include: [
            { model: Users, as: "user", attributes: ["name", "email", "address"] },
            { model: Categories, as: "category", attributes: ["name"] }
          ],
          limit: limit,
          offset: offset
        })
          .then(data => {
            const pages = Math.ceil(data.count / limit);
            if (page > pages) {
              next();
            } else {
              res.status(200).send({
                page: `${page} of ${pages}`,
                message: "Order Event By Date",
                events: data
              });
            }
          })
          .catch(() => {
            throw new ErrorHandler(500, 'Internal server error');
          });
      } else {
      Events
        .findAndCountAll({
          where: {
            user_id: userId
          },
          exclude: ["createdAt", "updatedAt"],
          include: [
            { model: Users, as: "user", attributes: ["name", "email", "address"] },
            { model: Categories, as: "category", attributes: ["name"] }
          ],
          limit: limit,
          offset: offset
        })
        .then(data => {
          const pages = Math.ceil(data.count / limit);
          if (page > pages) {
            next();
          } else {
            res.status(200).send({
              page: `${page} of ${pages}`,
              message: "Order Event By Date",
              events: data
            });
          }
        });
      }
    }
  } catch(error) {
    next(error);
  }
};

exports.approveEvent = (req, res, next) => {
  const eventId = req.params.eventId;

  const event = Events.findOne({
    id: eventId
  });
  if (!event) {
    res.status(200).send({
      message: 'event not found!',
      id: 0
    });
  } else {
    Events
      .update({
        status: req.body.status
      },
      {
        where: {
          id: eventId
        }
      })
      .then(data => {
        res.status(200).send({
          message: 'event has been updated!',
          event: data
        });
      });
  }
};


exports.updateEvent = (req, res, next) => {
  const eventId = req.params.eventId;

  const event = Events.findOne({
    id: eventId
  });
  if (!event) {
    res.status(200).send({
      message: 'event not found!',
      id: 0
    });
  } else {
    Events
      .update({
        title: req.body.title,
        user_id: req.body.user_id,
        image: `http://192.168.1.97:5000/uploads/${req.file.filename}` || 'http://192.168.1.97:5000/uploads/default-user.jpg',
        date: req.body.date,
        location: req.body.location,
        time_start: req.body.time_start,
        time_end: req.body.time_end,
        quota: req.body.quota,
        description: req.body.description,
        attend: req.body.attend,
        category_id: req.body.category_id,
        type: req.body.type,
        status: req.body.status,
        price: req.body.price
      },
      {
        where: {
          id: eventId
        }
      })
      .then(data => {
        res.status(200).send({
          message: 'event has been updated!',
          event: data
        });
      });
  }
};

exports.deleteEvent = async (req, res, next) => {
  const eventId = req.params.eventId;

  try {
    const event = await Events.findOne({
      where: {
        id: eventId
      }
    });
    if (!event) {
      res.status(200).send({
        message: 'event not found!',
        id: 0
      });
    } else {
      Events
        .destroy({
          where: {
            id: eventId
          }
        })
        .then(data => {
          res.status(200).send({
            message: 'event has been deleted!',
            event: data
          });
        });
    }
  } catch(error) {
    next(error);
  }
};
